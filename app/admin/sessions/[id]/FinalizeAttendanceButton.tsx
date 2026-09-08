"use client";

import { ClipboardCheck } from "lucide-react";
import { useState } from "react";

export default function FinalizeAttendanceButton({ action, remainingCount }: { action: () => Promise<void>; remainingCount: number }) {
  const [isPending, setIsPending] = useState(false);

  async function finalize() {
    const people = remainingCount === 1 ? "1 remaining expected person" : `${remainingCount} remaining expected people`;
    if (!window.confirm(`Finalize attendance? ${people} will be marked as no-show. This is a bulk correction.`)) return;
    setIsPending(true);
    try {
      await action();
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="border-t border-black/10 pt-4 sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0">
      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-black/50">After the session</p>
      <button
        className="mt-2 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-[#a8475f]/35 bg-[#fff8f9] px-4 text-sm font-semibold text-[#8a344a] transition-colors hover:bg-[#fbecef] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#4f46a5] disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isPending || remainingCount === 0}
        onClick={finalize}
        type="button"
      >
        <ClipboardCheck aria-hidden="true" className="size-4" />
        {isPending ? "Finalizing…" : "Finalize attendance"}
      </button>
      <p className="mt-1.5 max-w-70 text-xs leading-5 text-black/55">{remainingCount === 0 ? "Everyone has been accounted for." : `${remainingCount} still expected will become no-show.`}</p>
    </div>
  );
}
