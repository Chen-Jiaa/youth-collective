import assert from "node:assert/strict";
import test from "node:test";

import type { TransactionSql } from "postgres";

import { reserveSessionInTransaction } from "./booking-commands.ts";

function createTransaction(responses: unknown[][]) {
  return (async () => responses.shift() ?? []) as unknown as TransactionSql;
}

test("a cancelled booking can be restored after a promoted waitlist entry", async () => {
  const result = await reserveSessionInTransaction(
    createTransaction([
      [{ id: "session-1", capacity: 30, starts_at: new Date("2030-01-01T12:00:00Z"), status: "scheduled" }],
      [{ id: "booking-1", status: "cancelled" }],
      [{ id: "waitlist-1", status: "promoted" }],
      [{ confirmed_count: 0 }],
      [],
      [],
      [],
    ]),
    "person-1",
    "session-1",
    { now: new Date("2029-01-01T12:00:00Z") },
  );

  assert.deepEqual(result, {
    kind: "confirmed",
    bookingId: "booking-1",
    notificationDeliveryId: null,
  });
});

test("a cancelled booking returns to the waitlist when a promoted session is full", async () => {
  const result = await reserveSessionInTransaction(
    createTransaction([
      [{ id: "session-1", capacity: 30, starts_at: new Date("2030-01-01T12:00:00Z"), status: "scheduled" }],
      [{ id: "booking-1", status: "cancelled" }],
      [{ id: "waitlist-1", status: "promoted" }],
      [{ confirmed_count: 30 }],
      [{ id: "waitlist-1" }],
      [],
    ]),
    "person-1",
    "session-1",
    { now: new Date("2029-01-01T12:00:00Z") },
  );

  assert.deepEqual(result, {
    kind: "waitlisted",
    waitlistEntryId: "waitlist-1",
    notificationDeliveryId: null,
  });
});
