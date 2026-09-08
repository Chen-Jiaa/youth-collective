"use client";

import type { PublicSession } from "../../lib/db/repositories/sessions";
import { SESSION_TIME_ZONE } from "../../lib/session-time";
import BookingControl from "./BookingControl";

type ScheduleListProps = {
  bookingIdsBySessionId: Record<string, string>;
  selectedGroup: string | null;
  sessions: PublicSession[];
};

export const groups = [
  { label: "College/Uni - Sundays", value: "College/Uni — Sundays" },
  { label: "College/Uni - Fridays", value: "College/Uni — Fridays" },
  { label: "Teens - Sundays", value: "Teens — Sundays" },
] as const;

const journeyOrder = [
  "Knowing God: Who He is",
  "Knowing God: Through Scripture",
  "Knowing God: Through Prayer",
] as const;

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
  timeZone: SESSION_TIME_ZONE,
});

const timeFormatter = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: SESSION_TIME_ZONE,
});

function formatSessionTime(session: PublicSession) {
  return `${dateFormatter.format(session.startsAt)} · ${timeFormatter.format(session.startsAt)}–${timeFormatter.format(session.endsAt)}`;
}

function sessionPosition(session: PublicSession) {
  const position = journeyOrder.indexOf(session.className as (typeof journeyOrder)[number]);
  return position === -1 ? journeyOrder.length + 1 : position + 1;
}

function sessionTitle(className: string) {
  return className.replace(/^Knowing God:\s*/, "");
}

function SessionRow({ bookingId, session }: { bookingId?: string; session: PublicSession }) {
  const isFull = session.availableSpaces === 0;
  const availabilityLabel = isFull
    ? "Full — join the waitlist"
    : `${session.availableSpaces} ${session.availableSpaces === 1 ? "space" : "spaces"} left`;
  const position = sessionPosition(session);

  return (
    <li className="relative grid grid-cols-[3rem_minmax(0,1fr)] items-start gap-5 border-b border-black/10 py-6 last:border-b-0 md:grid-cols-[3.5rem_minmax(0,1fr)_12rem] md:items-center md:gap-7 md:py-7">
      <span aria-label={`Session ${position}`} className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#e8f0dc] font-heading text-2xl leading-none text-[#292823]">{position}</span>
      <div>
        <h3 className="text-xl font-bold leading-[0.95] tracking-[-0.03em] text-[#292823]">{sessionTitle(session.className)}</h3>
        <p className="mt-2 text-sm font-semibold leading-6 text-[#292823]">{formatSessionTime(session)}{session.location ? ` · ${session.location}` : ""}</p>
      </div>
      <div className="col-span-2 flex min-w-0 flex-col gap-3 md:col-span-1">
        <BookingControl bookingId={bookingId} isFull={isFull} sessionId={session.id} />
        <p className={isFull ? "text-center text-sm font-semibold text-[#802d5b]" : "text-center text-sm font-medium text-black/65"}>{availabilityLabel}</p>
      </div>
    </li>
  );
}

export default function ScheduleList({ bookingIdsBySessionId, selectedGroup, sessions }: ScheduleListProps) {
  const knowingGodSessions = sessions.filter((session) => session.courseName.toLowerCase().includes("knowing god"));
  const selectedSessions = knowingGodSessions
    .filter((session) => session.audience === selectedGroup)
    .toSorted((first, second) => sessionPosition(first) - sessionPosition(second) || first.startsAt.getTime() - second.startsAt.getTime());

  if (knowingGodSessions.length === 0) {
    return <div className="rounded-2xl border border-black/10 bg-[#fdfcf9] px-6 py-8 text-base leading-7 text-black/65"><p>Knowing God is our current Learning Labs journey. There are no future sessions to join right now; please check back soon.</p></div>;
  }

  return (
    <div>
      {selectedGroup ? <section aria-labelledby="journey-heading" className="rounded-2xl border border-black/10 bg-white px-5 py-2 md:px-8">
        <div className="border-b border-black/10 py-6 md:py-7">
          <h2 className="font-heading text-2xl leading-[0.95] tracking-[-0.03em] text-[#292823]" id="journey-heading">Knowing God</h2>
        </div>
        {selectedSessions.length > 0 ? <ol>{selectedSessions.map((session) => <SessionRow bookingId={bookingIdsBySessionId[session.id]} key={session.id} session={session} />)}</ol> : <p className="py-8 text-base leading-7 text-black/65">There are no future sessions for this group right now. Please check back soon.</p>}
      </section> : null}
    </div>
  );
}
