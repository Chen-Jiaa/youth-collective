"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { bookSessionAction, cancelBookingAction } from "../../lib/bookings/actions";

export default function BookingControl({
  bookingId: initialBookingId,
  isFull,
  sessionId,
}: {
  bookingId?: string;
  isFull: boolean;
  sessionId: string;
}) {
  const router = useRouter();
  const [bookingId, setBookingId] = useState(initialBookingId);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const isBooked = Boolean(bookingId);

  useEffect(() => {
    setBookingId(initialBookingId);
  }, [initialBookingId]);

  function reservePlace() {
    setMessage(null);
    startTransition(async () => {
      const result = await bookSessionAction(sessionId);
      if (result.kind === "authentication_required" || result.kind === "profile_required") {
        router.push(`/dashboard?next=${encodeURIComponent("/classes")}`);
        return;
      }
      if (result.kind === "confirmed" || result.kind === "already_booked") {
        setBookingId(result.bookingId);
        setMessage("You’ve joined this class — see you there.");
      }
      else if (result.kind === "waitlisted") setMessage("You’re on the Waitlist. We’ll let you know if a place opens.");
      else if (result.kind === "already_waitlisted") setMessage("You’re already on the Waitlist for this Session.");
      else setMessage("This Session is no longer available.");
      router.refresh();
    });
  }

  function cancelBooking() {
    if (!bookingId) return;

    setMessage(null);
    startTransition(async () => {
      const result = await cancelBookingAction(bookingId);
      if (result.kind === "cancelled") {
        setBookingId(undefined);
        setMessage("Your Booking has been cancelled.");
      } else {
        setMessage("This Booking can no longer be cancelled.");
      }
      router.refresh();
    });
  }

  return (
    <div>
      <button
        className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[#292823] px-5 py-3 text-center text-sm font-semibold text-white transition-colors duration-200 hover:bg-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#292823] disabled:cursor-not-allowed disabled:bg-black/45"
        disabled={isPending || isBooked}
        onClick={reservePlace}
        type="button"
      >
        {isPending ? "Saving…" : isBooked ? "You’re In" : isFull ? "Join waitlist" : "Join this class"}
      </button>
      {message ? <p className="mt-3 text-center text-sm leading-5 text-black/65" role="status">{message}</p> : null}
      {isBooked ? (
        <button
          className="mx-auto mt-3 block text-sm font-semibold text-[#292823] underline decoration-1 underline-offset-4 hover:text-black/65 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#292823] disabled:cursor-not-allowed disabled:text-black/45"
          disabled={isPending}
          onClick={cancelBooking}
          type="button"
        >
          {isPending ? "Cancelling…" : "Cancel booking"}
        </button>
      ) : null}
    </div>
  );
}
