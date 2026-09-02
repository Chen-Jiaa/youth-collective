"use client";

import { Ellipsis } from "lucide-react";
import { DropdownMenu } from "radix-ui";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { adjustBookingStatusAction } from "../../../../lib/admin/actions";

export default function ManualCheckInButton({ bookingId, status }: { bookingId: string; status: "confirmed" | "attended" }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [hasError, setHasError] = useState(false);

  function updateAttendance(nextStatus: "attended" | "no_show") {
    setHasError(false);
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.set("status", nextStatus);
        await adjustBookingStatusAction(bookingId, formData);
        router.refresh();
      } catch {
        setHasError(true);
      }
    });
  }

  return (
    <div>
      {status === "confirmed" ? (
        <button
          className="inline-flex min-h-9 items-center justify-center rounded-md bg-[#292833] px-3 text-sm font-medium text-white transition-colors hover:bg-[#4f46a5] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#4f46a5] disabled:cursor-not-allowed disabled:bg-black/35"
          disabled={isPending}
          onClick={() => updateAttendance("attended")}
          type="button"
        >
          {isPending ? "Checking in…" : "Check in"}
        </button>
      ) : (
        <div className="flex items-center justify-end gap-1">
          <span className="text-sm font-medium text-[#385132]">Checked in</span>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button
                aria-label="Attendance options"
                className="inline-flex size-9 items-center justify-center rounded-md text-[#343242] transition-colors hover:bg-[#f4f3fa] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#4f46a5]"
                disabled={isPending}
                type="button"
              >
                <Ellipsis aria-hidden="true" className="size-5" />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content align="end" className="z-50 min-w-44 rounded-lg bg-white p-1 shadow-[0_10px_24px_rgba(37,36,43,0.18)] outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:animate-in data-[state=open]:fade-in">
                <DropdownMenu.Item
                  className="cursor-pointer rounded-md px-3 py-2 text-sm font-medium text-[#943b3b] outline-none transition-colors hover:bg-[#fff1f1] focus:bg-[#fff1f1] data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50"
                  disabled={isPending}
                  onSelect={() => updateAttendance("no_show")}
                >
                  Mark as no show
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      )}
      {hasError ? <p className="mt-1 text-xs text-[#943b3b]" role="status">Couldn’t update attendance. Try again.</p> : null}
    </div>
  );
}
