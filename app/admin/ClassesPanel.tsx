"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Pencil, X } from "lucide-react";
import { useState } from "react";

import { setClassArchiveAction, setUpcomingSessionLocationsAction, updateClassAction } from "../../lib/admin/actions";
import type { AdminClass } from "../../lib/db/repositories/admin";

function ClassSettingsDrawer({ classRecord }: { classRecord: AdminClass }) {
  const [open, setOpen] = useState(false);
  const archiveAction = setClassArchiveAction.bind(null, classRecord.id, !classRecord.isArchived);
  const updateUpcomingSessionLocationsAction = setUpcomingSessionLocationsAction.bind(null, classRecord.id);

  async function closeAfter(action: () => Promise<void>) {
    await action();
    setOpen(false);
  }

  async function saveClass(formData: FormData) {
    await updateClassAction(classRecord.id, formData);
    setOpen(false);
  }

  async function updateLocations(formData: FormData) {
    await updateUpcomingSessionLocationsAction(formData);
    setOpen(false);
  }

  return (
    <Dialog.Root onOpenChange={setOpen} open={open}>
      <Dialog.Trigger asChild>
        <button
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-black/15 bg-white px-3.5 text-sm font-medium text-[#343242] transition-colors hover:bg-[#f4f3fa] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#4f46a5]"
          type="button"
        >
          <Pencil aria-hidden="true" className="size-4" />
          Edit
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-[#25242b]/35 backdrop-blur-[1px] data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:animate-in data-[state=open]:fade-in" />
        <Dialog.Content className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xl flex-col bg-[#f6f6f4] shadow-[-16px_0_40px_rgba(37,36,43,0.18)] outline-none data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:animate-in data-[state=open]:slide-in-from-right motion-reduce:animate-none">
          <div className="flex items-start justify-between border-b border-black/10 bg-white px-6 py-6 sm:px-8">
            <div>
              <Dialog.Title className="text-xl font-semibold tracking-[-0.02em] text-[#25242b]">Edit class</Dialog.Title>
              <Dialog.Description className="mt-1 text-sm text-black/60">Update the details members see for this Class.</Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button
                aria-label="Close class editor"
                className="inline-flex size-10 items-center justify-center rounded-lg text-[#343242] transition-colors hover:bg-[#f4f3fa] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#4f46a5]"
                type="button"
              >
                <X aria-hidden="true" className="size-5" />
              </button>
            </Dialog.Close>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-7 sm:px-8">
            <form action={saveClass} className="grid gap-4">
              <label className="text-sm font-medium text-[#343242]">Class name<input autoFocus className="mt-1.5 min-h-10 w-full rounded-lg border border-black/15 bg-white px-3 text-sm font-medium outline-none transition focus:border-[#4f46a5] focus:ring-2 focus:ring-[#4f46a5]/15" defaultValue={classRecord.name} name="name" required /></label>
              <label className="text-sm font-medium text-[#343242]">Audience<input className="mt-1.5 min-h-10 w-full rounded-lg border border-black/15 bg-white px-3 text-sm outline-none transition focus:border-[#4f46a5] focus:ring-2 focus:ring-[#4f46a5]/15" defaultValue={classRecord.audience ?? ""} name="audience" placeholder="For example, Years 10–13" /></label>
              <label className="text-sm font-medium text-[#343242]">Description<textarea className="mt-1.5 min-h-28 w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm outline-none transition focus:border-[#4f46a5] focus:ring-2 focus:ring-[#4f46a5]/15" defaultValue={classRecord.description ?? ""} name="description" placeholder="What is this Class about?" /></label>
              <button className="w-fit rounded-lg bg-[#292833] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#4f46a5] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#4f46a5]" type="submit">Save changes</button>
            </form>

            <section className="mt-9 border-t border-black/10 pt-6" aria-labelledby={`class-session-location-${classRecord.id}`}>
              <h3 className="text-base font-semibold text-[#25242b]" id={`class-session-location-${classRecord.id}`}>Upcoming Session location</h3>
              <p className="mt-2 text-sm leading-6 text-black/60">Apply one location to every upcoming scheduled Session for this Class. Individual Sessions can still be changed separately.</p>
              <form action={updateLocations} className="mt-4 flex flex-col gap-3 sm:flex-row">
                <label className="sr-only" htmlFor={`class-session-location-input-${classRecord.id}`}>Location</label>
                <input className="min-h-10 flex-1 rounded-lg border border-black/15 bg-white px-3 text-sm outline-none transition focus:border-[#4f46a5] focus:ring-2 focus:ring-[#4f46a5]/15" id={`class-session-location-input-${classRecord.id}`} maxLength={200} name="location" placeholder="For example, Main Hall" />
                <button className="min-h-10 rounded-lg border border-black/15 bg-white px-4 text-sm font-medium text-[#343242] transition-colors hover:bg-[#f4f3fa] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#4f46a5]" type="submit">Apply to all</button>
              </form>
            </section>

            <section className="mt-9 border-t border-black/10 pt-6" aria-labelledby={`class-visibility-${classRecord.id}`}>
              <h3 className="text-base font-semibold text-[#25242b]" id={`class-visibility-${classRecord.id}`}>Class visibility</h3>
              <p className="mt-2 text-sm leading-6 text-black/60">{classRecord.isArchived ? "This Class is hidden from members along with its future Sessions." : "Archive this Class to hide its future Sessions from members while keeping its records."}</p>
              <form action={closeAfter.bind(null, archiveAction)} className="mt-4">
                <button className={`inline-flex min-h-10 items-center justify-center rounded-lg px-4 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-3 ${classRecord.isArchived ? "bg-[#292833] text-white hover:bg-[#4f46a5] focus-visible:outline-[#4f46a5]" : "border border-[#d8aaaa] text-[#943b3b] hover:bg-[#fff7f7] focus-visible:outline-[#943b3b]"}`} type="submit">{classRecord.isArchived ? "Restore class" : "Archive class"}</button>
              </form>
            </section>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function ClassRow({ classRecord }: { classRecord: AdminClass }) {
  return (
    <article className="flex flex-col gap-4 border-b border-black/10 py-5 first:pt-0 last:border-b-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2.5">
          <h2 className="text-lg font-semibold tracking-[-0.02em] text-[#25242b]">{classRecord.name}</h2>
          <p className={`w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${classRecord.isArchived ? "bg-[#f4e8e8] text-[#943b3b]" : "bg-[#e7eee0] text-[#385132]"}`}>{classRecord.isArchived ? "Archived" : "Active"}</p>
        </div>
        <p className="mt-2 text-sm leading-6 text-black/60">{[classRecord.audience, classRecord.description].filter(Boolean).join(" · ") || "No Class details yet."}</p>
      </div>
      <ClassSettingsDrawer classRecord={classRecord} />
    </article>
  );
}

export function ClassesPanel({ classes }: { classes: AdminClass[] }) {
  if (classes.length === 0) {
    return <div className="rounded-xl border border-dashed border-black/15 bg-white px-6 py-10 text-center text-sm leading-6 text-black/60">No Classes yet. Create a Session from the Overview to create the first Class.</div>;
  }

  return <div>{classes.map((classRecord) => <ClassRow classRecord={classRecord} key={classRecord.id} />)}</div>;
}
