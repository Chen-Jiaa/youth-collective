"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { cancelBookingAction } from "../../lib/bookings/actions";

export default function CancelBookingButton({ bookingId, inverted = false }: { bookingId: string; inverted?: boolean }) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function cancel() {
    startTransition(async () => {
      const result = await cancelBookingAction(bookingId);
      if (result.kind === "cancelled") {
        router.push("/dashboard?cancelled=1");
        return;
      }

      setMessage("This Booking can no longer be cancelled.");
      router.refresh();
    });
  }

  return <div><button className={`mt-3 text-sm font-semibold underline decoration-1 underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/60 disabled:opacity-40 ${inverted ? "text-white hover:text-white/65" : "hover:text-black/60"}`} disabled={isPending} onClick={cancel} type="button">{isPending ? "Cancelling…" : "Cancel Booking"}</button>{message ? <p className={`mt-2 text-sm font-semibold ${inverted ? "text-white" : "text-black"}`} role="alert">{message}</p> : null}</div>;
}
