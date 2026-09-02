import Link from "next/link";
import { redirect } from "next/navigation";

import { createSessionsAction } from "../../lib/admin/actions";
import { getCurrentAdminAccess } from "../../lib/admin/authorization";
import { listAdminOverview, type AdminClass, type AdminSession } from "../../lib/db/repositories/admin";
import { SESSION_TIME_ZONE } from "../../lib/session-time";
import { AdminCreateControls } from "./AdminCreateControls";
import { AdminSidebar } from "./AdminSidebar";

export const dynamic = "force-dynamic";

type AdminPageProps = {
  searchParams: Promise<{ preview?: string }>;
};

const previewClassId = "0a1d3f5b-97d8-44cb-8f4e-2e8f91cf5d91";
const previewSessionId = "52c08e84-4abd-45a5-a4f7-0d70700fd7b4";

const previewOverview = {
  classes: [
    { id: previewClassId, courseId: previewClassId, courseName: "After-school study club", name: "After-school study club", description: "A focused study session with peer support.", audience: "Years 10–13", isArchived: false },
    { id: "8ceddd42-c1e4-4d45-af80-17e711cc8c2e", courseId: "8ceddd42-c1e4-4d45-af80-17e711cc8c2e", courseName: "Creative lab", name: "Creative lab", description: "Make, learn and share new skills.", audience: "All members", isArchived: false },
  ] satisfies AdminClass[],
  sessions: [
    {
      id: previewSessionId,
      classId: previewClassId,
      courseId: previewClassId,
      courseName: "After-school study club",
      className: "After-school study club",
      displayName: null,
      location: "Main Hall",
      startsAt: new Date("2026-08-21T16:00:00+08:00"),
      endsAt: new Date("2026-08-21T18:00:00+08:00"),
      capacity: 30,
      status: "scheduled",
      checkInToken: "70e0955d-ff4a-42bd-bd9d-ee5d9929d250",
      checkInOpensAt: new Date("2026-08-21T15:30:00+08:00"),
      checkInClosesAt: new Date("2026-08-21T16:30:00+08:00"),
      confirmedCount: 18,
      waitingCount: 3,
    },
    {
      id: "c9c743fe-051e-4f6f-8d39-69e5603a6650",
      classId: "8ceddd42-c1e4-4d45-af80-17e711cc8c2e",
      courseId: "8ceddd42-c1e4-4d45-af80-17e711cc8c2e",
      courseName: "Creative lab",
      className: "Creative lab",
      displayName: null,
      location: "Studio 2",
      startsAt: new Date("2026-08-24T16:30:00+08:00"),
      endsAt: new Date("2026-08-24T18:30:00+08:00"),
      capacity: 30,
      status: "scheduled",
      checkInToken: "c588284f-76f9-4685-909c-71a5bf0d7beb",
      checkInOpensAt: new Date("2026-08-24T16:00:00+08:00"),
      checkInClosesAt: new Date("2026-08-24T17:00:00+08:00"),
      confirmedCount: 11,
      waitingCount: 0,
    },
  ] satisfies AdminSession[],
};

const previewAccess = { id: "d756f94e-63bd-4d07-8e4d-848e8d75edfe", email: "staff-preview@example.test", role: "admin" as const };

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

function SessionLink({ session, preview }: { session: AdminSession; preview: boolean }) {
  const isCancelled = session.status === "cancelled";
  return (
    <Link
      className="grid gap-3 rounded-xl border border-black/10 bg-white px-5 py-5 transition-colors duration-200 hover:border-[#b7b3db] hover:bg-[#faf9fd] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#4f46a5] md:grid-cols-[1fr_auto] md:items-center"
      href={preview ? `/admin/sessions/${session.id}?preview=1` : `/admin/sessions/${session.id}`}
    >
      <div>
          <p className="text-sm font-semibold text-black/55">{session.courseName}</p>
          <div className="mt-1 flex flex-wrap items-center gap-2"><p className="text-lg font-semibold leading-tight text-[#25242b]">{session.className}</p>{isCancelled ? <span className="rounded-full bg-[#f8e8ed] px-2.5 py-1 text-xs font-semibold text-[#9e4059]">Cancelled</span> : null}</div>
        <p className="mt-2 text-sm text-black/65">
          {dateFormatter.format(session.startsAt)} · {timeFormatter.format(session.startsAt)}–{timeFormatter.format(session.endsAt)}{session.location ? ` · ${session.location}` : ""}
        </p>
      </div>
      <div className="flex flex-wrap gap-2 text-sm font-medium"><p className="w-fit rounded-full bg-[#292833] px-3 py-1.5 text-white">{session.confirmedCount}/{session.capacity} expected</p>{session.waitingCount > 0 ? <p className="w-fit rounded-full bg-[#efedf2] px-3 py-1.5 text-[#4f4a75]">{session.waitingCount} waiting</p> : null}</div>
    </Link>
  );
}

function dateBucket(session: AdminSession, now: Date) {
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const endOfToday = new Date(today);
  endOfToday.setDate(endOfToday.getDate() + 1);
  const endOfWeek = new Date(today);
  endOfWeek.setDate(endOfWeek.getDate() + 7);
  if (session.startsAt >= today && session.startsAt < endOfToday) return "Today";
  if (session.startsAt < endOfWeek) return "This week";
  return "Later";
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const params = await searchParams;
  // This fixture mode exists only for local UI review. Production always enforces staff access.
  const preview = process.env.NODE_ENV === "development" && params.preview === "1";
  const access = preview ? previewAccess : await getCurrentAdminAccess();
  if (!access) redirect("/dashboard");

  const { classes, sessions } = preview ? previewOverview : await listAdminOverview();
  const now = new Date();
  const todaySessions = sessions.filter((session) => dateBucket(session, now) === "Today");
  const thisWeekSessions = sessions.filter((session) => dateBucket(session, now) === "This week");
  const laterSessions = sessions.filter((session) => dateBucket(session, now) === "Later");
  const expectedSoon = [...todaySessions, ...thisWeekSessions].reduce((total, session) => total + session.confirmedCount, 0);
  const waitingSoon = [...todaySessions, ...thisWeekSessions].reduce((total, session) => total + session.waitingCount, 0);

  return (
    <main className="min-h-screen bg-[#f6f6f4] text-[#25242b]">
      <div className="mx-auto grid max-w-[1600px] lg:grid-cols-[15.5rem_minmax(0,1fr)]">
        <AdminSidebar currentPath="/admin" email={access.email} role={access.role} />
        <div className="min-w-0">
          <header className="border-b border-black/10 bg-white px-5 py-6 md:px-8 lg:px-10">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-2xl font-semibold tracking-[-0.03em] text-[#25242b] md:text-3xl">Today & Upcoming</h1>
                <p className="mt-1 text-sm text-black/60">See the Sessions staff need to run, then open the roster workspace.</p>
              </div>
              <p className="text-sm text-black/55 lg:hidden">{access.email} · {access.role}</p>
            </div>
          </header>

          {preview ? <div className="border-b border-[#d5c7e5] bg-[#f4eef9] px-5 py-3 text-sm font-medium text-[#68416f] md:px-8 lg:px-10">Local preview · Sample data only · Admin actions stay protected</div> : null}

          <div className="px-5 py-8 md:px-8 lg:px-10">
            <section aria-label="Operational summary" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-xl bg-[#292833] p-5 text-white"><p className="text-sm font-medium text-white/70">Next Session</p><p className="mt-3 text-lg font-semibold leading-tight">{sessions[0] ? sessions[0].className : "Nothing scheduled"}</p><p className="mt-2 text-sm text-white/70">{sessions[0] ? `${dateFormatter.format(sessions[0].startsAt)} · ${timeFormatter.format(sessions[0].startsAt)}` : "Create a Session to begin."}</p></div>
              <div className="rounded-xl border border-black/10 bg-white p-5"><p className="text-sm font-medium text-black/55">Upcoming Sessions</p><p className="mt-3 text-3xl font-semibold tracking-[-0.04em] tabular-nums">{sessions.length}</p><p className="mt-2 text-sm text-black/60">Across the next schedule</p></div>
              <div className="rounded-xl border border-black/10 bg-white p-5"><p className="text-sm font-medium text-black/55">Expected today / soon</p><p className="mt-3 text-3xl font-semibold tracking-[-0.04em] tabular-nums">{expectedSoon}</p><p className="mt-2 text-sm text-black/60">Confirmed places this week</p></div>
              <div className="rounded-xl border border-black/10 bg-white p-5"><p className="text-sm font-medium text-black/55">Waiting for a place</p><p className="mt-3 text-3xl font-semibold tracking-[-0.04em] tabular-nums">{waitingSoon}</p><p className="mt-2 text-sm text-black/60">{waitingSoon ? "Needs staff awareness" : "No waitlist pressure"}</p></div>
            </section>

            <section className="mt-10" id="sessions">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <h2 className="text-xl font-semibold tracking-[-0.02em]">Sessions to run</h2>
                  <p className="mt-1 text-sm text-black/60">Scan time, capacity, and waitlist status before opening a Session workspace.</p>
                </div>
                <AdminCreateControls classes={classes.map(({ id, courseId, courseName, name }) => ({ id, courseId, courseName, name }))} createSessionsAction={createSessionsAction} />
              </div>

              <div className="mt-6 grid gap-8">
                {sessions.length > 0 ? ([
                  ["Today", todaySessions],
                  ["This week", thisWeekSessions],
                  ["Later", laterSessions],
                ] as const).map(([heading, bucket]) => bucket.length > 0 ? <section key={heading}><h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.1em] text-black/50">{heading}</h3><div className="grid gap-3">{bucket.map((session) => <SessionLink key={session.id} preview={preview} session={session} />)}</div></section> : null) : (
                  <p className="rounded-xl border border-dashed border-black/15 bg-white px-6 py-8 text-sm leading-6 text-black/65">No Sessions yet. Create the first one to get started.</p>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
