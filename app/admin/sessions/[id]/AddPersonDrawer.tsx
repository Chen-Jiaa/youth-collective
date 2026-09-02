"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Plus, Search, X } from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { addPersonToSessionAction } from "../../../../lib/admin/actions";

type MemberOption = {
  id: string;
  name: string | null;
  email: string | null;
  mobile: string | null;
};

export default function AddPersonDrawer({
  members,
  preview,
  sessionId,
}: {
  members: MemberOption[];
  preview: boolean;
  sessionId: string;
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const matchingMembers = useMemo(
    () => members.filter((member) => [member.name, member.email, member.mobile].some((value) => value?.toLocaleLowerCase().includes(normalizedQuery))).slice(0, 12),
    [members, normalizedQuery],
  );

  function resetDrawer() {
    setQuery("");
    setSelectedPersonId(null);
    setMessage(null);
  }

  function addPerson() {
    if (!selectedPersonId) return;
    if (preview) {
      setMessage("Preview only — people can’t be added here.");
      return;
    }

    setMessage(null);
    startTransition(async () => {
      try {
        const result = await addPersonToSessionAction(sessionId, selectedPersonId);
        if (result.kind === "confirmed" || result.kind === "waitlisted") {
          setIsOpen(false);
          resetDrawer();
          router.refresh();
          return;
        }
        setMessage(
          result.kind === "already_booked" ? "This person has already joined this session."
            : result.kind === "already_waitlisted" ? "This person is already on the waitlist."
              : "This session is no longer available.",
        );
      } catch {
        setMessage("Couldn’t add this person. Try again.");
      }
    });
  }

  return (
    <Dialog.Root onOpenChange={(open) => { setIsOpen(open); if (!open) resetDrawer(); }} open={isOpen}>
      <Dialog.Trigger asChild>
        <button
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#292833] px-4 text-sm font-medium text-white transition-colors hover:bg-[#4f46a5] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#4f46a5]"
          type="button"
        >
          <Plus aria-hidden="true" className="size-4" />
          Add people
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-[#25242b]/35 backdrop-blur-[1px] data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:animate-in data-[state=open]:fade-in" />
        <Dialog.Content className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xl flex-col bg-[#f6f6f4] shadow-[-16px_0_40px_rgba(37,36,43,0.18)] outline-none data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:animate-in data-[state=open]:slide-in-from-right motion-reduce:animate-none">
          <div className="flex items-start justify-between border-b border-black/10 bg-white px-6 py-6 sm:px-8">
            <div>
              <Dialog.Title className="text-xl font-semibold tracking-[-0.02em] text-[#25242b]">Add a person</Dialog.Title>
              <Dialog.Description className="mt-1 text-sm text-black/60">Choose an existing person to join this session.</Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button aria-label="Close add person" className="inline-flex size-10 items-center justify-center rounded-lg text-[#343242] transition-colors hover:bg-[#f4f3fa] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#4f46a5]" type="button"><X aria-hidden="true" className="size-5" /></button>
            </Dialog.Close>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-7 sm:px-8">
            <label className="relative block">
              <span className="sr-only">Find a person</span>
              <Search aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#5a5688]" />
              <input className="min-h-11 w-full rounded-lg border border-black/15 bg-white py-2 pl-10 pr-3 text-sm outline-none transition focus:border-[#4f46a5] focus:ring-2 focus:ring-[#4f46a5]/15" onChange={(event) => setQuery(event.target.value)} placeholder="Search name, email, or mobile" type="search" value={query} />
            </label>
            <div aria-label="People" className="mt-5 grid gap-2" role="listbox">
              {matchingMembers.map((member) => {
                const selected = selectedPersonId === member.id;
                return <button aria-selected={selected} className={`rounded-lg border px-4 py-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#4f46a5] ${selected ? "border-[#4f46a5] bg-[#eeedfa]" : "border-black/10 bg-white hover:bg-[#f4f3fa]"}`} key={member.id} onClick={() => setSelectedPersonId(member.id)} role="option" type="button"><span className="block text-sm font-medium text-[#25242b]">{member.name ?? "Unnamed member"}</span><span className="mt-1 block text-sm text-black/60">{member.email ?? "No login email"} · {member.mobile ?? "No mobile number"}</span></button>;
              })}
              {matchingMembers.length === 0 ? <p className="py-8 text-center text-sm text-black/60">No people match that search.</p> : null}
            </div>
            {message ? <p className="mt-5 text-sm leading-6 text-[#943b3b]" role="status">{message}</p> : null}
          </div>
          <div className="border-t border-black/10 bg-white px-6 py-5 sm:px-8">
            <button className="inline-flex min-h-10 w-full items-center justify-center rounded-lg bg-[#292833] px-4 text-sm font-medium text-white transition-colors hover:bg-[#4f46a5] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#4f46a5] disabled:cursor-not-allowed disabled:bg-black/35" disabled={!selectedPersonId || isPending} onClick={addPerson} type="button">{isPending ? "Adding…" : "Add to session"}</button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
