"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import { useState } from "react";
import { useFormStatus } from "react-dom";

import Select from "../components/Select";

type AdminAction = (formData: FormData) => Promise<void>;

type ClassOption = {
  id: string;
  courseId: string;
  courseName: string;
  name: string;
};

type AdminCreateControlsProps = {
  classes: ClassOption[];
  createSessionsAction: AdminAction;
};

const controlClass = "min-h-10 w-full rounded-lg border border-black/15 bg-white px-3 text-sm text-[#25242b] outline-none transition focus:border-[#4f46a5] focus:ring-2 focus:ring-[#4f46a5]/15";
const primaryButtonClass = "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#292833] px-4 text-sm font-medium text-white transition-colors hover:bg-[#4f46a5] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#4f46a5] disabled:cursor-not-allowed disabled:bg-black/35";
const createNewClassValue = "__create_new_class__";
const createNewCourseValue = "__create_new_course__";

function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return <button className={primaryButtonClass} disabled={pending} type="submit">{pending ? "Saving…" : children}</button>;
}

const monthFormatter = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" });
const selectedDateFormatter = new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short" });
const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function dateKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function CalendarDatePicker({ selectedDates, onChange }: { selectedDates: string[]; onChange: (dates: string[]) => void }) {
  const now = new Date();
  const [visibleMonth, setVisibleMonth] = useState({ year: now.getFullYear(), month: now.getMonth() });
  const daysInMonth = new Date(visibleMonth.year, visibleMonth.month + 1, 0).getDate();
  const firstWeekday = new Date(visibleMonth.year, visibleMonth.month, 1).getDay();
  const visibleDate = new Date(visibleMonth.year, visibleMonth.month, 1);

  function moveMonth(offset: number) {
    const next = new Date(visibleMonth.year, visibleMonth.month + offset, 1);
    setVisibleMonth({ year: next.getFullYear(), month: next.getMonth() });
  }

  function toggleDate(value: string) {
    onChange(selectedDates.includes(value) ? selectedDates.filter((date) => date !== value) : [...selectedDates, value].sort());
  }

  return (
    <div className="rounded-lg border border-black/10 bg-[#faf9fd] p-3">
      <div className="flex items-center justify-between gap-3">
        <button aria-label="Previous month" className="grid size-9 place-items-center rounded-md text-[#5a5688] transition-colors hover:bg-white hover:text-[#292833] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4f46a5]" onClick={() => moveMonth(-1)} type="button"><ChevronLeft aria-hidden="true" className="size-4" /></button>
        <p className="text-sm font-semibold text-[#25242b]">{monthFormatter.format(visibleDate)}</p>
        <button aria-label="Next month" className="grid size-9 place-items-center rounded-md text-[#5a5688] transition-colors hover:bg-white hover:text-[#292833] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4f46a5]" onClick={() => moveMonth(1)} type="button"><ChevronRight aria-hidden="true" className="size-4" /></button>
      </div>
      <div className="mt-3 grid grid-cols-7 gap-1 text-center" role="group" aria-label="Choose Session dates">
        {weekdayLabels.map((day) => <span className="py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-black/45" key={day}>{day}</span>)}
        {Array.from({ length: firstWeekday }, (_, index) => <span aria-hidden="true" key={`blank-${index}`} />)}
        {Array.from({ length: daysInMonth }, (_, index) => {
          const day = index + 1;
          const value = dateKey(visibleMonth.year, visibleMonth.month, day);
          const selected = selectedDates.includes(value);
          return <button aria-label={`${selected ? "Unselect" : "Select"} ${selectedDateFormatter.format(new Date(visibleMonth.year, visibleMonth.month, day))}`} aria-pressed={selected} className={`min-h-9 rounded-md text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4f46a5] ${selected ? "bg-[#4f46a5] text-white" : "text-[#343242] hover:bg-white"}`} key={value} onClick={() => toggleDate(value)} type="button">{day}</button>;
        })}
      </div>
    </div>
  );
}

function NewSessionDialog({ action, classes }: { action: AdminAction; classes: ClassOption[] }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [classId, setClassId] = useState(classes[0]?.id ?? createNewClassValue);
  const [courseId, setCourseId] = useState(classes[0]?.courseId ?? createNewCourseValue);
  const isCreatingClass = classId === createNewClassValue;
  const isCreatingCourse = courseId === createNewCourseValue;
  const selectedClass = classes.find((classRecord) => classRecord.id === classId);

  async function submit(formData: FormData) {
    setError(null);
    if (selectedDates.length === 0) {
      setError("Select at least one date for this Session.");
      return;
    }
    try {
      await action(formData);
      setOpen(false);
      setSelectedDates([]);
    } catch {
      setError("We couldn't create the Sessions. Check the details and try again.");
    }
  }

  return (
    <Dialog.Root onOpenChange={setOpen} open={open}>
      <Dialog.Trigger asChild><button className={primaryButtonClass} type="button"><Plus aria-hidden="true" className="size-4" />New Session</button></Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-[#25242b]/55 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl bg-white p-6 text-[#25242b] shadow-xl outline-none sm:p-8 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95">
          <div className="flex items-start justify-between gap-5">
            <div><Dialog.Title className="text-xl font-semibold tracking-[-0.02em]">New Session</Dialog.Title><Dialog.Description className="mt-2 text-sm leading-6 text-black/60">Choose every date this Class will run. The selected dates share one time and capacity.</Dialog.Description></div>
            <Dialog.Close asChild><button aria-label="Close new Session form" className="grid size-10 shrink-0 place-items-center rounded-lg text-[#5a5688] transition-colors hover:bg-[#f4f3fa] hover:text-[#292833] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#4f46a5]" type="button"><X aria-hidden="true" className="size-5" /></button></Dialog.Close>
          </div>
          <form action={submit} className="mt-7 grid gap-4">
            <label className="text-sm font-medium">Class<Select autoFocus className={`mt-1.5 ${controlClass}`} name="classId" onChange={(event) => { const nextClassId = event.target.value; setClassId(nextClassId); if (nextClassId !== createNewClassValue) setCourseId(classes.find((record) => record.id === nextClassId)?.courseId ?? createNewCourseValue); }} value={classId}>{classes.map((classRecord) => <option key={classRecord.id} value={classRecord.id}>{classRecord.courseName} · {classRecord.name}</option>)}<option value={createNewClassValue}>Create a new Class</option></Select></label>
            <input name="courseId" type="hidden" value={courseId} />
            {isCreatingClass ? <div className="grid gap-4 rounded-lg border border-[#c9c5e5] bg-[#f8f7fe] p-4">
              <p className="text-sm font-medium text-[#343242]">New Class details</p>
              <label className="text-sm font-medium">Course<Select className={`mt-1.5 ${controlClass}`} onChange={(event) => setCourseId(event.target.value)} value={courseId}>{[...new Map(classes.map((classRecord) => [classRecord.courseId, classRecord])).values()].map((classRecord) => <option key={classRecord.courseId} value={classRecord.courseId}>{classRecord.courseName}</option>)}<option value={createNewCourseValue}>Create a new Course</option></Select></label>
              {isCreatingCourse ? <div className="grid gap-4 border-t border-black/10 pt-4"><label className="text-sm font-medium">Course name<input className={`mt-1.5 ${controlClass}`} name="newCourseName" required /></label><label className="text-sm font-medium">Course summary<textarea className="mt-1.5 min-h-20 w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm outline-none transition focus:border-[#4f46a5] focus:ring-2 focus:ring-[#4f46a5]/15" name="newCourseDescription" placeholder="What will members explore?" required /></label></div> : null}
              <label className="text-sm font-medium">Class name<input className={`mt-1.5 ${controlClass}`} name="newClassName" required /></label>
              <label className="text-sm font-medium">Audience<input className={`mt-1.5 ${controlClass}`} name="newClassAudience" placeholder="For example, Years 10–13" required /></label>
              <label className="text-sm font-medium">Description<textarea className="mt-1.5 min-h-28 w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm outline-none transition focus:border-[#4f46a5] focus:ring-2 focus:ring-[#4f46a5]/15" name="newClassDescription" placeholder="What is this Class about?" required /></label>
            </div> : null}
            <div><div className="flex items-baseline justify-between gap-3"><p className="text-sm font-medium">Session dates</p><p className="text-sm text-black/60">{selectedDates.length} selected</p></div><input name="dates" type="hidden" value={selectedDates.join(",")} /><div className="mt-1.5"><CalendarDatePicker onChange={setSelectedDates} selectedDates={selectedDates} /></div></div>
            <div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-medium">Starts at<input className={`mt-1.5 ${controlClass}`} name="startsAtTime" required type="time" /></label><label className="text-sm font-medium">Ends at<input className={`mt-1.5 ${controlClass}`} name="endsAtTime" required type="time" /></label></div>
            <label className="text-sm font-medium">Capacity<input className={`mt-1.5 ${controlClass}`} defaultValue="30" max="500" min="1" name="capacity" required type="number" /></label>
            <label className="text-sm font-medium">Location for all selected sessions<input className={`mt-1.5 ${controlClass}`} maxLength={200} name="location" placeholder="For example, Main Hall" /></label>
            <label className="flex items-start gap-3 rounded-lg bg-[#f4f3fa] px-4 py-3 text-sm leading-6"><input className="mt-1 size-4 accent-[#4f46a5]" name="autoLabel" type="checkbox" /><span><span className="font-medium text-[#25242b]">Auto-label each Session</span><span className="block text-black/60">Creates labels in date order, for example {selectedClass?.name ?? "this Class"} - 1, {selectedClass?.name ?? "this Class"} - 2.</span></span></label>
            {error ? <p className="text-sm font-medium text-[#a33333]" role="alert">{error}</p> : null}
            <SubmitButton>Create {selectedDates.length === 1 ? "Session" : "Sessions"}</SubmitButton>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function AdminCreateControls({ classes, createSessionsAction }: AdminCreateControlsProps) {
  return (
    <section aria-label="Create admin records">
      <NewSessionDialog action={createSessionsAction} classes={classes} />
    </section>
  );
}
