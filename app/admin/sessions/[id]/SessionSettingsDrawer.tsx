"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Settings, X } from "lucide-react";
import { useState, type ReactNode } from "react";

type SessionSettingsDrawerProps = {
  action: (formData: FormData) => Promise<void>;
  children: ReactNode;
};

export default function SessionSettingsDrawer({ action, children }: SessionSettingsDrawerProps) {
  const [open, setOpen] = useState(false);

  async function saveSession(formData: FormData) {
    await action(formData);
    setOpen(false);
  }

  return (
    <Dialog.Root onOpenChange={setOpen} open={open}>
      <Dialog.Trigger asChild>
        <button
          aria-label="Open session settings"
          className="inline-flex size-10 items-center justify-center rounded-lg border border-black/15 bg-white text-[#343242] transition-colors hover:bg-[#f4f3fa] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#4f46a5]"
          type="button"
        >
          <Settings aria-hidden="true" className="size-4" />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-[#25242b]/35 backdrop-blur-[1px] data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:animate-in data-[state=open]:fade-in" />
        <Dialog.Content className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xl flex-col bg-[#f6f6f4] shadow-[-16px_0_40px_rgba(37,36,43,0.18)] outline-none data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:animate-in data-[state=open]:slide-in-from-right motion-reduce:animate-none">
          <div className="flex items-start justify-between border-b border-black/10 bg-white px-6 py-6 sm:px-8">
            <div>
              <Dialog.Title className="text-xl font-semibold tracking-[-0.02em] text-[#25242b]">Session settings</Dialog.Title>
              <Dialog.Description className="mt-1 text-sm text-black/60">Update the session details and check-in link.</Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button
                aria-label="Close session settings"
                className="inline-flex size-10 items-center justify-center rounded-lg text-[#343242] transition-colors hover:bg-[#f4f3fa] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#4f46a5]"
                type="button"
              >
                <X aria-hidden="true" className="size-5" />
              </button>
            </Dialog.Close>
          </div>
          <form action={saveSession} className="min-h-0 flex-1 overflow-y-auto px-6 py-7 sm:px-8">{children}</form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
