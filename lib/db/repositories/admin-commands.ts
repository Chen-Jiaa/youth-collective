import "server-only";

import { and, eq, gte, sql } from "drizzle-orm";

import { getDatabase } from "../client";
import { bookingStatusHistory, bookings, classes, courses, notificationDeliveries, sessions } from "../schema";

export async function createCourseRecord(input: { name: string; description?: string; publicStatus?: "active" | "coming_next" | "hidden" }) {
  const [course] = await getDatabase().insert(courses).values({
    name: input.name,
    description: input.description || null,
    publicStatus: input.publicStatus ?? "hidden",
  }).returning({ id: courses.id });
  return course;
}

export async function updateCourseRecord(courseId: string, input: { name: string; description?: string; publicStatus: "active" | "coming_next" | "hidden" }) {
  await getDatabase().update(courses).set({
    name: input.name,
    description: input.description || null,
    publicStatus: input.publicStatus,
    updatedAt: new Date(),
  }).where(eq(courses.id, courseId));
}

export async function setCourseArchiveStatus(courseId: string, isArchived: boolean) {
  await getDatabase().update(courses).set({ isArchived, updatedAt: new Date() }).where(eq(courses.id, courseId));
}

export async function updateClassRecord(
  classId: string,
  input: { name: string; description?: string; audience?: string; isArchived?: boolean },
) {
  await getDatabase()
    .update(classes)
    .set({
      name: input.name,
      description: input.description || null,
      audience: input.audience || null,
      ...(input.isArchived === undefined ? {} : { isArchived: input.isArchived }),
      updatedAt: new Date(),
    })
    .where(eq(classes.id, classId));
}

export async function setClassArchiveStatus(classId: string, isArchived: boolean) {
  await getDatabase()
    .update(classes)
    .set({ isArchived, updatedAt: new Date() })
    .where(eq(classes.id, classId));
}

/** Applies one location to every upcoming scheduled Session for a Class. */
export async function setUpcomingSessionLocationsForClass(classId: string, location: string) {
  await getDatabase()
    .update(sessions)
    .set({ location: location || null, updatedAt: new Date() })
    .where(and(eq(sessions.classId, classId), eq(sessions.status, "scheduled"), gte(sessions.startsAt, new Date())));
}

export async function createSessionRecords(input: {
  classId?: string;
  newClass: { courseId?: string; name: string; description: string; audience: string } | null;
  newCourse?: { name: string; description: string } | null;
  occurrences: Array<{ startsAt: Date; endsAt: Date }>;
  capacity: number;
  location: string;
  autoLabel: boolean;
}) {
  return getDatabase().transaction(async (transaction) => {
    const courseId = input.newCourse
      ? (await transaction.insert(courses).values(input.newCourse).returning({ id: courses.id }))[0]?.id
      : input.newClass?.courseId;
    if (input.newClass && !courseId) throw new Error("Course not found.");
    const classId = input.newClass
      ? (await transaction
        .insert(classes)
        .values({ ...input.newClass, courseId: courseId! })
        .returning({ id: classes.id }))[0]?.id
      : input.classId;
    if (!classId) throw new Error("Class not found.");

    if (!input.newClass) {
      const [classRecord] = await transaction
        .select({ id: classes.id })
        .from(classes)
        .where(eq(classes.id, classId))
        .limit(1);
      if (!classRecord) throw new Error("Class not found.");
    }

    const recurrenceGroupId = input.autoLabel ? crypto.randomUUID() : null;
    const created = await transaction
      .insert(sessions)
      .values(input.occurrences.map((occurrence) => ({
        classId,
        startsAt: occurrence.startsAt,
        endsAt: occurrence.endsAt,
        capacity: input.capacity,
        location: input.location || null,
        recurrenceGroupId,
        checkInOpensAt: new Date(occurrence.startsAt.getTime() - 30 * 60 * 1000),
        checkInClosesAt: new Date(occurrence.startsAt.getTime() + 30 * 60 * 1000),
      })))
      .returning({ id: sessions.id });
    return { recurrenceGroupId, count: created.length };
  });
}

export async function updateSessionRecord(
  sessionId: string,
  input: {
    startsAt: Date;
    endsAt: Date;
    capacity: number;
    location: string;
    displayName: string;
    status: "scheduled" | "cancelled";
    cancellationReason?: string;
    checkInOpensAt?: Date;
    checkInClosesAt?: Date;
  },
) {
  return getDatabase().transaction(async (transaction) => {
    const [existing] = await transaction
      .select({ status: sessions.status })
      .from(sessions)
      .where(eq(sessions.id, sessionId))
      .for("update")
      .limit(1);

    const confirmedBookings = await transaction
      .select({ id: bookings.id })
      .from(bookings)
      .where(and(eq(bookings.sessionId, sessionId), sql`${bookings.status} in ('confirmed', 'attended')`));
    if (input.capacity < confirmedBookings.length) {
      throw new Error("Capacity cannot be lower than the number of confirmed Bookings.");
    }

    await transaction
      .update(sessions)
      .set({
        startsAt: input.startsAt,
        endsAt: input.endsAt,
        capacity: input.capacity,
        location: input.location || null,
        displayName: input.displayName || null,
        status: input.status,
        cancellationReason: input.status === "cancelled" ? input.cancellationReason || "Cancelled by staff" : null,
        checkInOpensAt: input.checkInOpensAt ?? null,
        checkInClosesAt: input.checkInClosesAt ?? null,
        updatedAt: new Date(),
      })
      .where(eq(sessions.id, sessionId));

    if (!existing || existing.status === "cancelled" || input.status !== "cancelled") return [];

    const recipients = await transaction
      .select({ personId: bookings.personId, bookingId: bookings.id })
      .from(bookings)
      .where(and(eq(bookings.sessionId, sessionId), eq(bookings.status, "confirmed")));
    if (recipients.length === 0) return [];

    const deliveries = await transaction
      .insert(notificationDeliveries)
      .values(recipients.map((recipient) => ({
        personId: recipient.personId,
        sessionId,
        bookingId: recipient.bookingId,
        type: "session_cancellation" as const,
      })))
      .onConflictDoNothing()
      .returning({ id: notificationDeliveries.id });
    return deliveries.map((delivery) => delivery.id);
  });
}

export async function finalizeAttendanceRecord(sessionId: string, changedByUserAccountId: string | null) {
  return getDatabase().transaction(async (transaction) => {
    const changed = await transaction
      .update(bookings)
      .set({ status: "no_show", statusChangedAt: new Date(), updatedAt: new Date() })
      .where(and(eq(bookings.sessionId, sessionId), eq(bookings.status, "confirmed")))
      .returning({ id: bookings.id });

    if (changed.length > 0) {
      await transaction.insert(bookingStatusHistory).values(
        changed.map((booking) => ({
          bookingId: booking.id,
          previousStatus: "confirmed" as const,
          nextStatus: "no_show" as const,
          changedByUserAccountId,
          reason: "staff_finalisation",
        })),
      );
    }

    return changed.length;
  });
}


export async function setBookingStatusByStaff(
  bookingId: string,
  nextStatus: "cancelled" | "attended" | "no_show",
  changedByUserAccountId: string | null,
) {
  return getDatabase().transaction(async (transaction) => {
    const [booking] = await transaction
      .select({ id: bookings.id, status: bookings.status })
      .from(bookings)
      .where(eq(bookings.id, bookingId))
      .limit(1);

    if (!booking || booking.status === nextStatus) {
      return false;
    }

    await transaction
      .update(bookings)
      .set({ status: nextStatus, statusChangedAt: new Date(), updatedAt: new Date() })
      .where(eq(bookings.id, bookingId));
    await transaction.insert(bookingStatusHistory).values({
      bookingId,
      previousStatus: booking.status,
      nextStatus,
      changedByUserAccountId,
      reason: "staff_adjustment",
    });
    return true;
  });
}
