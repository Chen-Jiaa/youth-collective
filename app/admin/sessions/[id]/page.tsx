import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { toDataURL } from "qrcode";
import { Download, QrCode } from "lucide-react";

import { finalizeAttendanceAction, updateSessionAction } from "../../../../lib/admin/actions";
import { getCurrentAdminAccess } from "../../../../lib/admin/authorization";
import { getSessionRoster, listAdminMembers, listAdminOverview, type AdminSession } from "../../../../lib/db/repositories/admin";
import { formatSessionDateTimeInput, SESSION_TIME_ZONE } from "../../../../lib/session-time";
import Select from "../../../components/Select";
import { AdminSidebar } from "../../AdminSidebar";
import AddPersonDrawer from "./AddPersonDrawer";
import FinalizeAttendanceButton from "./FinalizeAttendanceButton";
import ManualCheckInButton from "./ManualCheckInButton";
import SessionSettingsDrawer from "./SessionSettingsDrawer";

export const dynamic = "force-dynamic";

type SessionPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ preview?: string; tab?: string }>;
};

type RosterTab = "expected" | "checked-in" | "waitlist" | "cancelled" | "no-show";

const previewSessionId = "52c08e84-4abd-45a5-a4f7-0d70700fd7b4";
const previewPersonId = "b8db9ed0-8ac3-4861-901f-810436236819";
const previewAccess = { id: "d756f94e-63bd-4d07-8e4d-848e8d75edfe", email: "staff-preview@example.test", role: "admin" as const };

const previewSession: AdminSession = {
  id: previewSessionId,
  classId: "0a1d3f5b-97d8-44cb-8f4e-2e8f91cf5d91",
  courseId: "0a1d3f5b-97d8-44cb-8f4e-2e8f91cf5d91",
  courseName: "Knowing God",
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
};

const previewSessions: AdminSession[] = [
  previewSession,
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
];

const previewRoster = {
  bookings: [
    { bookingId: "4b3559b4-8ebc-4bb2-a661-bfd2-3171afe", personId: previewPersonId, name: "Amira Khan", email: "amira@example.test", mobile: "+32 470 12 34 56", status: "confirmed" as const },
    { bookingId: "27f1e32e-1fa0-464b-8816-823855254a6f", personId: "3137b83d-2edf-48bc-8871-ac6c36ffb46e", name: "Noah Martin", email: "noah@example.test", mobile: "+32 471 98 76 54", status: "confirmed" as const },
    { bookingId: "4b0b31f3-fefe-44b6-a357-f3da6911ee1b", personId: "e5ca0e42-8058-4463-b0cb-742f631c6bb6", name: "Lina De Smet", email: "lina@example.test", mobile: "+32 474 33 22 11", status: "attended" as const },
  ],
  waitlist: [
    { id: "12ff6ba5-0c32-4c7d-a2e4-344e4d02a879", personId: "6b5515f2-9022-4966-87a1-e0a40151903f", name: "Ilias Vermeulen", email: "ilias@example.test", mobile: "+32 475 55 44 33", createdAt: new Date("2026-08-18T09:15:00+08:00") },
  ],
};

const previewMemberOptions = [
  { id: previewPersonId, name: "Amira Khan", email: "amira@example.test", mobile: "+32 470 12 34 56" },
  { id: "3137b83d-2edf-48bc-8871-ac6c36ffb46e", name: "Noah Martin", email: "noah@example.test", mobile: "+32 471 98 76 54" },
  { id: "e5ca0e42-8058-4463-b0cb-742f631c6bb6", name: "Lina De Smet", email: "lina@example.test", mobile: "+32 474 33 22 11" },
  { id: "6b5515f2-9022-4966-87a1-e0a40151903f", name: "Ilias Vermeulen", email: "ilias@example.test", mobile: "+32 475 55 44 33" },
  { id: "bb6de01c-1b12-49ed-9b95-c0ceeb6f40aa", name: "Zara Ahmed", email: "zara@example.test", mobile: "+32 476 22 14 73" },
];

const dateFormatter = new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: SESSION_TIME_ZONE });
const timeFormatter = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: SESSION_TIME_ZONE });
const controlClass = "min-h-10 w-full rounded-lg border border-black/15 bg-white px-3 text-sm text-[#25242b] outline-none transition focus:border-[#4f46a5] focus:ring-2 focus:ring-[#4f46a5]/15";
const primaryButtonClass = "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#292833] px-4 text-sm font-medium text-white transition-colors hover:bg-[#4f46a5] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#4f46a5]";

function memberHref(memberId: string, preview: boolean) {
  return preview ? `/admin/members/${memberId}?preview=1` : `/admin/members/${memberId}`;
}

function rosterHref(sessionId: string, tab: RosterTab, preview: boolean) {
  const search = new URLSearchParams({ tab });
  if (preview) search.set("preview", "1");
  return `/admin/sessions/${sessionId}?${search}`;
}

export default async function SessionPage({ params, searchParams }: SessionPageProps) {
  const [{ id: sessionId }, query] = await Promise.all([params, searchParams]);
  const preview = process.env.NODE_ENV === "development" && query.preview === "1";
  const access = preview ? previewAccess : await getCurrentAdminAccess();
  if (!access) redirect("/dashboard");

  const [overview, roster, members] = preview
    ? [
        { sessions: previewSessions },
        previewSessions.some((session) => session.id === sessionId) ? previewRoster : null,
        previewMemberOptions,
      ]
    : await Promise.all([
        listAdminOverview(),
        getSessionRoster(sessionId),
        listAdminMembers(),
      ]);
  const session = overview.sessions.find((candidate) => candidate.id === sessionId);
  if (!session || !roster) notFound();

  const activeTab: RosterTab = query.tab === "checked-in" || query.tab === "waitlist" || query.tab === "cancelled" || query.tab === "no-show" ? query.tab : "expected";
  const expectedBookings = roster.bookings.filter((booking) => booking.status === "confirmed");
  const checkedInBookings = roster.bookings.filter((booking) => booking.status === "attended");
  const cancelledBookings = roster.bookings.filter((booking) => booking.status === "cancelled");
  const noShowBookings = roster.bookings.filter((booking) => booking.status === "no_show");
  const displayedBookings = activeTab === "expected" ? expectedBookings : activeTab === "checked-in" ? checkedInBookings : activeTab === "cancelled" ? cancelledBookings : noShowBookings;

  const requestHeaders = await headers();
  const siteUrl = process.env.SITE_URL ?? `${requestHeaders.get("x-forwarded-proto") ?? "https"}://${requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host")}`;
  const checkInUrl = new URL(`/check-in/${session.checkInToken}`, siteUrl).toString();
  const checkInQrCode = await toDataURL(checkInUrl, { width: 300, margin: 1, color: { dark: "#000000", light: "#ffffff" } });

  return (
    <main className="min-h-screen bg-[#f6f6f4] text-[#25242b]">
      <div className="mx-auto grid max-w-[1600px] lg:grid-cols-[15.5rem_minmax(0,1fr)]">
        <AdminSidebar currentPath="/admin" email={access.email} role={access.role} />
        <div className="min-w-0">
          <header className="border-b border-black/10 bg-white px-5 py-6 md:px-8 lg:px-10">
            <Link className="text-sm font-medium text-[#4f46a5] underline decoration-[#aaa6d0] underline-offset-4 hover:text-[#292833]" href={preview ? "/admin?preview=1" : "/admin"}>All Sessions</Link>
            <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm font-semibold text-black/55">{session.courseName}</p>
                <h1 className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-[#25242b] md:text-3xl">{session.className}</h1>
                <p className="mt-2 text-sm text-black/60">{dateFormatter.format(session.startsAt)} · {timeFormatter.format(session.startsAt)}–{timeFormatter.format(session.endsAt)}{session.location ? ` · ${session.location}` : ""}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <SessionSettingsDrawer action={updateSessionAction.bind(null, session.id)}>
                  <div className="grid gap-4">
                    <p className="text-sm font-semibold text-[#25242b]">Session details</p>
                    <label className="text-sm font-medium">Starts <input className={`mt-1.5 block ${controlClass}`} defaultValue={formatSessionDateTimeInput(session.startsAt)} name="startsAt" required type="datetime-local" /></label>
                    <label className="text-sm font-medium">Ends <input className={`mt-1.5 block ${controlClass}`} defaultValue={formatSessionDateTimeInput(session.endsAt)} name="endsAt" required type="datetime-local" /></label>
                    <label className="text-sm font-medium">Status <Select className={`mt-1.5 ${controlClass}`} defaultValue={session.status} name="status"><option value="scheduled">Scheduled</option><option value="cancelled">Cancelled</option></Select></label>
                    <label className="text-sm font-medium">Capacity <input className={`mt-1.5 block ${controlClass}`} defaultValue={session.capacity} max="500" min="1" name="capacity" required type="number" /></label>
                    <label className="text-sm font-medium">Location <input className={`mt-1.5 block ${controlClass}`} defaultValue={session.location ?? ""} maxLength={200} name="location" placeholder="For example, Main Hall" /></label>
                    <label className="text-sm font-medium">Display name <input className={`mt-1.5 block ${controlClass}`} defaultValue={session.displayName ?? ""} maxLength={180} name="displayName" placeholder="Leave blank to use the Class name" /></label>
                    <label className="text-sm font-medium">Cancellation note <input className={`mt-1.5 block ${controlClass}`} name="cancellationReason" placeholder="Optional note" /></label>
                    <label className="text-sm font-medium">Check-in opens <input className={`mt-1.5 block ${controlClass}`} defaultValue={session.checkInOpensAt ? formatSessionDateTimeInput(session.checkInOpensAt) : ""} name="checkInOpensAt" required type="datetime-local" /></label>
                    <label className="text-sm font-medium">Check-in closes <input className={`mt-1.5 block ${controlClass}`} defaultValue={session.checkInClosesAt ? formatSessionDateTimeInput(session.checkInClosesAt) : ""} name="checkInClosesAt" required type="datetime-local" /></label>
                    <button className={`${primaryButtonClass} w-fit`} type="submit">Save session</button>
                  </div>
                </SessionSettingsDrawer>
              </div>
            </div>
          </header>

          {preview ? <div className="border-b border-[#d5c7e5] bg-[#f4eef9] px-5 py-3 text-sm font-medium text-[#68416f] md:px-8 lg:px-10">Local preview · Sample data only · Admin actions stay protected</div> : null}

          <div className="px-5 py-8 md:px-8 lg:px-10">
            <section aria-label="Run controls" className="rounded-xl border border-black/10 bg-white p-5 md:p-6">
              <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                <div><h2 className="text-xl font-semibold tracking-[-0.02em]">Run controls</h2><p className="mt-1 text-sm text-black/60">Use these during arrival, then complete attendance after the Session.</p></div>
                <div className="flex flex-wrap items-start gap-3"><AddPersonDrawer members={members} preview={preview} sessionId={session.id} /><a className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-black/15 bg-white px-4 text-sm font-medium text-[#343242] transition-colors hover:bg-[#f4f3fa]" href={`/admin/export?session=${session.id}`}><Download aria-hidden="true" className="size-4" />Export roster</a><FinalizeAttendanceButton action={finalizeAttendanceAction.bind(null, session.id)} remainingCount={expectedBookings.length} /></div>
              </div>
              {session.status === "scheduled" ? <div className="mt-6 grid gap-5 border-t border-black/10 pt-6 md:grid-cols-[auto_minmax(0,1fr)]"><Image alt={`QR code for ${session.className} check-in`} className="size-36 rounded-lg border border-black/10 bg-white p-2" height={144} src={checkInQrCode} unoptimized width={144} /><div><div className="flex items-center gap-2"><QrCode aria-hidden="true" className="size-4 text-[#4f4a75]" /><h3 className="font-semibold">QR check-in</h3></div><p className="mt-2 text-sm leading-6 text-black/60">Open {session.checkInOpensAt ? timeFormatter.format(session.checkInOpensAt) : "at the scheduled time"}–{session.checkInClosesAt ? timeFormatter.format(session.checkInClosesAt) : "until the Session ends"}. Show or project this code for self check-in.</p><a className="mt-3 inline-block break-all text-sm font-medium text-[#4f46a5] underline decoration-[#aaa6d0] underline-offset-4" href={checkInUrl} target="_blank">Open check-in link</a></div></div> : <p className="mt-5 rounded-lg bg-[#f8e8ed] px-4 py-3 text-sm font-medium text-[#9e4059]">This Session is cancelled. Roster and export remain available; live check-in is unavailable.</p>}
            </section>

            <section className="mt-10">
              <div className="flex items-center justify-between gap-4">
                <div><h2 className="text-xl font-semibold tracking-[-0.02em]">Roster board</h2><p className="mt-1 text-sm text-black/60">People are separated by their current operational state.</p></div>
              </div>
              <nav aria-label="Session bookings" className="mt-6 border-b border-black/10" role="tablist">
                <div className="flex min-w-max justify-start gap-1">
                  {[
                    { id: "expected" as const, label: "Expected", count: expectedBookings.length },
                    { id: "checked-in" as const, label: "Checked in", count: checkedInBookings.length },
                    { id: "waitlist" as const, label: "Waitlist", count: roster.waitlist.length },
                    { id: "cancelled" as const, label: "Cancelled", count: cancelledBookings.length },
                    { id: "no-show" as const, label: "No shows", count: noShowBookings.length },
                  ].map((tab) => (
                    <Link
                      aria-selected={activeTab === tab.id}
                      className={`border-b-2 px-4 py-3 text-left text-sm font-medium no-underline transition-colors ${activeTab === tab.id ? "border-[#4f46a5] text-[#292833]" : "border-transparent text-black/60 hover:border-black/25 hover:text-[#292833]"}`}
                      href={rosterHref(session.id, tab.id, preview)}
                      key={tab.id}
                      role="tab"
                    >
                      {tab.label} <span className="tabular-nums">{tab.count}</span>
                    </Link>
                  ))}
                </div>
              </nav>
              <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-150 border-collapse text-left">
                  <thead className="border-b border-black/10 text-xs font-medium uppercase tracking-[0.1em] text-black/55">
                    <tr><th className="pb-3">Person</th><th className="pb-3">Contact</th><th className="pb-3">Status</th>{activeTab === "expected" || activeTab === "checked-in" ? <th className="pb-3 text-right">Action</th> : null}</tr>
                  </thead>
                  <tbody>
                    {activeTab === "waitlist" ? roster.waitlist.map((person) => (
                      <tr className="border-b border-black/8 last:border-0" key={person.id}><td className="py-4 font-medium"><Link className="text-[#3f3a70] underline decoration-[#b5b1d8] underline-offset-4 hover:text-[#4f46a5]" href={memberHref(person.personId, preview)}>{person.name}</Link></td><td className="py-4 text-sm text-black/60">{person.mobile} · {person.email ?? "No login email"}</td><td className="py-4"><span className="rounded-full bg-[#efedf2] px-2.5 py-1 text-xs font-semibold text-[#4f4a75]">Waiting</span></td></tr>
                    )) : displayedBookings.map((booking) => (
                      <tr className="border-b border-black/8 last:border-0" key={booking.bookingId}>
                        <td className="py-4 font-medium"><Link className="text-[#3f3a70] underline decoration-[#b5b1d8] underline-offset-4 hover:text-[#4f46a5]" href={memberHref(booking.personId, preview)}>{booking.name}</Link></td>
                        <td className="py-4 text-sm text-black/60">{booking.mobile} · {booking.email ?? "No login email"}</td>
                        <td className="py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${booking.status === "confirmed" ? "bg-[#dce8c6] text-[#273022]" : booking.status === "attended" ? "bg-[#efedf6] text-[#4f4a75]" : booking.status === "cancelled" ? "bg-black/6 text-black/65" : "bg-[#f8e8ed] text-[#9e4059]"}`}>{booking.status === "confirmed" ? "Expected" : booking.status === "attended" ? "Checked in" : booking.status === "cancelled" ? "Cancelled" : "No show"}</span></td>
                        {activeTab === "expected" || activeTab === "checked-in" ? <td className="py-4 text-right">{booking.status === "confirmed" || booking.status === "attended" ? <ManualCheckInButton bookingId={booking.bookingId} status={booking.status} /> : null}</td> : null}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {(activeTab === "waitlist" ? roster.waitlist : displayedBookings).length === 0 ? <p className="py-10 text-center text-sm text-black/60">No {activeTab === "expected" ? "people are expected" : activeTab === "checked-in" ? "one has checked in" : activeTab === "waitlist" ? "one is waiting" : activeTab === "cancelled" ? "cancelled bookings" : "no shows"} for this Session.</p> : null}
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
