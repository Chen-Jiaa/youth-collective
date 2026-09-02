import "server-only";

import type { TransactionSql } from "postgres";

import { withDatabaseTransaction } from "../repository";

type LockedSession = {
  id: string;
  capacity: number;
  starts_at: Date;
  status: "scheduled" | "cancelled";
};

type ExistingBooking = {
  id: string;
  status: "confirmed" | "cancelled" | "attended" | "no_show";
};

type ExistingWaitlistEntry = {
  id: string;
  status: "waiting" | "promoted" | "cancelled";
};

type IdRow = { id: string };

type NotificationType =
  | "booking_confirmation"
  | "waitlist_confirmation"
  | "waitlist_promotion"
  | "booking_cancellation";

async function queueNotification(
  transaction: TransactionSql,
  input: { personId: string; sessionId: string; bookingId?: string; type: NotificationType },
) {
  const [delivery] = await transaction<IdRow[]>`
    insert into notification_deliveries (person_id, session_id, booking_id, type)
    values (${input.personId}, ${input.sessionId}, ${input.bookingId ?? null}, ${input.type})
    on conflict (person_id, session_id, type) do nothing
    returning id
  `;
  return delivery?.id ?? null;
}

export type ReserveSessionResult =
  | { kind: "confirmed"; bookingId: string; notificationDeliveryId: string | null }
  | { kind: "waitlisted"; waitlistEntryId: string; notificationDeliveryId: string | null }
  | { kind: "already_booked"; bookingId: string }
  | { kind: "already_waitlisted"; waitlistEntryId: string }
  | { kind: "session_unavailable" };

export type CancelBookingResult =
  | {
      kind: "cancelled";
      notificationDeliveryId: string | null;
      promotedPersonId: string | null;
      promotionNotificationDeliveryId: string | null;
    }
  | { kind: "booking_unavailable" };

type CommandOptions = {
  now?: Date;
  changedByUserAccountId?: string;
};

/**
 * Atomically reserves a confirmed place or creates a Waitlist entry. Locking
 * the Session row serializes capacity decisions for that Session.
 */
export async function reserveSession(
  personId: string,
  sessionId: string,
  options: CommandOptions = {},
): Promise<ReserveSessionResult> {
  return withDatabaseTransaction((transaction) => reserveSessionInTransaction(transaction, personId, sessionId, options));
}

/** The transaction-aware seam keeps the booking decision testable without a live database. */
export async function reserveSessionInTransaction(
  transaction: TransactionSql,
  personId: string,
  sessionId: string,
  options: CommandOptions = {},
): Promise<ReserveSessionResult> {
  const now = options.now ?? new Date();

  const [session] = await transaction<LockedSession[]>`
      select id, capacity, starts_at, status
      from sessions
      where id = ${sessionId}
      for update
    `;

  if (!session || session.status !== "scheduled" || session.starts_at <= now) {
    return { kind: "session_unavailable" };
  }

  const [existingBooking] = await transaction<ExistingBooking[]>`
      select id, status
      from bookings
      where person_id = ${personId} and session_id = ${sessionId}
      limit 1
    `;

  if (existingBooking && existingBooking.status !== "cancelled") {
    return { kind: "already_booked", bookingId: existingBooking.id };
  }

  const [existingWaitlistEntry] = await transaction<ExistingWaitlistEntry[]>`
      select id, status
      from waitlist_entries
      where person_id = ${personId} and session_id = ${sessionId}
      limit 1
    `;

  if (existingWaitlistEntry?.status === "waiting") {
    return { kind: "already_waitlisted", waitlistEntryId: existingWaitlistEntry.id };
  }

  const [{ confirmed_count: confirmedCount }] = await transaction<{ confirmed_count: number }[]>`
      select count(*)::integer as confirmed_count
      from bookings
      where session_id = ${sessionId} and status in ('confirmed', 'attended')
    `;

  if (confirmedCount >= session.capacity) {
    const waitlistEntry = existingWaitlistEntry
      ? await transaction<IdRow[]>`
          update waitlist_entries
          set status = 'waiting', promoted_at = null, updated_at = now()
          where id = ${existingWaitlistEntry.id}
          returning id
        `
      : await transaction<IdRow[]>`
          insert into waitlist_entries (person_id, session_id, status)
          values (${personId}, ${sessionId}, 'waiting')
          returning id
        `;

    const notificationDeliveryId = await queueNotification(transaction, {
      personId,
      sessionId,
      type: "waitlist_confirmation",
    });

    return { kind: "waitlisted", waitlistEntryId: waitlistEntry[0].id, notificationDeliveryId };
  }

  if (existingBooking?.status === "cancelled") {
    await transaction`
        update bookings
        set status = 'confirmed', status_changed_at = now(), updated_at = now()
        where id = ${existingBooking.id}
      `;
    await transaction`
        insert into booking_status_history (booking_id, previous_status, next_status, changed_by_user_account_id, reason)
        values (${existingBooking.id}, 'cancelled', 'confirmed', ${options.changedByUserAccountId ?? null}, 'member_rebooking')
      `;

    const notificationDeliveryId = await queueNotification(transaction, {
      personId,
      sessionId,
      bookingId: existingBooking.id,
      type: "booking_confirmation",
    });

    return { kind: "confirmed", bookingId: existingBooking.id, notificationDeliveryId };
  }

  const [booking] = await transaction<IdRow[]>`
      insert into bookings (person_id, session_id, status)
      values (${personId}, ${sessionId}, 'confirmed')
      returning id
    `;

  await transaction`
      insert into booking_status_history (booking_id, previous_status, next_status, changed_by_user_account_id, reason)
      values (${booking.id}, null, 'confirmed', ${options.changedByUserAccountId ?? null}, 'member_booking')
    `;

  const notificationDeliveryId = await queueNotification(transaction, {
    personId,
    sessionId,
    bookingId: booking.id,
    type: "booking_confirmation",
  });

  return { kind: "confirmed", bookingId: booking.id, notificationDeliveryId };
}

/**
 * Cancels a future confirmed Booking and promotes the earliest waiting Person
 * in the same transaction. The promoted Person is returned for notification.
 */
export async function cancelBooking(
  personId: string,
  bookingId: string,
  options: CommandOptions = {},
): Promise<CancelBookingResult> {
  const now = options.now ?? new Date();

  return withDatabaseTransaction(async (transaction) => {
    const [booking] = await transaction<
      Array<ExistingBooking & { session_id: string; starts_at: Date; session_status: "scheduled" | "cancelled" }>
    >`
      select bookings.id, bookings.status, bookings.session_id, sessions.starts_at, sessions.status as session_status
      from bookings
      inner join sessions on sessions.id = bookings.session_id
      where bookings.id = ${bookingId} and bookings.person_id = ${personId}
      for update
    `;

    if (
      !booking ||
      booking.status !== "confirmed" ||
      booking.session_status !== "scheduled" ||
      booking.starts_at <= now
    ) {
      return { kind: "booking_unavailable" };
    }

    await transaction`
      update bookings
      set status = 'cancelled', status_changed_at = now(), updated_at = now()
      where id = ${booking.id}
    `;
    await transaction`
      insert into booking_status_history (booking_id, previous_status, next_status, changed_by_user_account_id, reason)
      values (${booking.id}, 'confirmed', 'cancelled', ${options.changedByUserAccountId ?? null}, 'member_cancellation')
    `;
    const notificationDeliveryId = await queueNotification(transaction, {
      personId,
      sessionId: booking.session_id,
      bookingId: booking.id,
      type: "booking_cancellation",
    });

    const [waitlistEntry] = await transaction<Array<IdRow & { person_id: string }>>`
      select id, person_id
      from waitlist_entries
      where session_id = ${booking.session_id} and status = 'waiting'
      order by created_at asc, id asc
      limit 1
      for update
    `;

    if (!waitlistEntry) {
      return {
        kind: "cancelled",
        notificationDeliveryId,
        promotedPersonId: null,
        promotionNotificationDeliveryId: null,
      };
    }

    await transaction`
      update waitlist_entries
      set status = 'promoted', promoted_at = now(), updated_at = now()
      where id = ${waitlistEntry.id}
    `;

    const [promotedBooking] = await transaction<IdRow[]>`
      insert into bookings (person_id, session_id, status)
      values (${waitlistEntry.person_id}, ${booking.session_id}, 'confirmed')
      returning id
    `;
    await transaction`
      insert into booking_status_history (booking_id, previous_status, next_status, reason)
      values (${promotedBooking.id}, null, 'confirmed', 'waitlist_promotion')
    `;

    const promotionNotificationDeliveryId = await queueNotification(transaction, {
      personId: waitlistEntry.person_id,
      sessionId: booking.session_id,
      bookingId: promotedBooking.id,
      type: "waitlist_promotion",
    });

    return {
      kind: "cancelled",
      notificationDeliveryId,
      promotedPersonId: waitlistEntry.person_id,
      promotionNotificationDeliveryId,
    };
  });
}
