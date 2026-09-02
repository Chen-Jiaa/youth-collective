import Link from "next/link";
import { CalendarDays, UserRound } from "lucide-react";
import { notFound, redirect } from "next/navigation";

import { AdminSidebar } from "../../AdminSidebar";
import { getCurrentAdminAccess } from "../../../../lib/admin/authorization";
import { getAdminMember, getMemberBookingHistory, type AdminMemberDetail, type MemberHistoryEntry } from "../../../../lib/db/repositories/admin";
import { SESSION_TIME_ZONE } from "../../../../lib/session-time";

export const dynamic = "force-dynamic";

type MemberDetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ preview?: string; tab?: string }>;
};

const previewAccess = { id: "d756f94e-63bd-4d07-8e4d-848e8d75edfe", email: "staff-preview@example.test", role: "admin" as const };
const previewMembers = [
  { id: "b8db9ed0-8ac3-4861-901f-810436236819", name: "Amira Khan", email: "amira@example.test", mobile: "+32 470 12 34 56", birthDate: "2010-05-14", createdAt: new Date("2026-07-02T10:00:00+08:00") },
  { id: "3137b83d-2edf-48bc-8871-ac6c36ffb46e", name: "Noah Martin", email: "noah@example.test", mobile: "+32 471 98 76 54", birthDate: "2011-11-03", createdAt: new Date("2026-07-12T10:00:00+08:00") },
  { id: "e5ca0e42-8058-4463-b0cb-742f631c6bb6", name: "Lina De Smet", email: "lina@example.test", mobile: "+32 474 33 22 11", birthDate: "2014-02-22", createdAt: new Date("2026-07-29T10:00:00+08:00") },
  { id: "6b5515f2-9022-4966-87a1-e0a40151903f", name: "Ilias Vermeulen", email: "ilias@example.test", mobile: "+32 475 55 44 33", birthDate: null, createdAt: new Date("2026-08-18T09:15:00+08:00") },
] satisfies AdminMemberDetail[];
const previewHistory = [
  { id: "f2818475-a351-41d9-a9d4-af787b767f0b", className: "Creative lab", startsAt: new Date("2026-08-10T16:30:00+08:00"), status: "attended" as const },
  { id: "9d642c8e-9b52-4e08-8cc0-87d45c4a6319", className: "After-school study club", startsAt: new Date("2026-07-27T16:00:00+08:00"), status: "attended" as const },
  { id: "2e3b0fb2-d266-4a64-b7f2-1ca482ef714e", className: "After-school study club", startsAt: new Date("2026-08-03T16:00:00+08:00"), status: "confirmed" as const },
] satisfies MemberHistoryEntry[];

const joinedFormatter = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" });
const sessionDateFormatter = new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: SESSION_TIME_ZONE });
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function formatBirthDate(value: string) {
  const [year, month, day] = value.split("-");
  return `${Number(day)} ${monthNames[Number(month) - 1]} ${year}`;
}

function detailHref(memberId: string, tab: "personal" | "participation", preview: boolean) {
  const params = new URLSearchParams({ tab });
  if (preview) params.set("preview", "1");
  return `/admin/members/${memberId}?${params}`;
}

/**
 * THESIS: A person record keeps contact details and their operational participation history close at hand.
 * STORY: Staff identify the person, then scan all booking states rather than an attended-only subset.
 */
export default async function MemberDetailPage({ params, searchParams }: MemberDetailPageProps) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const preview = process.env.NODE_ENV === "development" && query.preview === "1";
  const access = preview ? previewAccess : await getCurrentAdminAccess();
  if (!access) redirect("/dashboard");

  const tab = query.tab === "participation" || query.tab === "classes" ? "participation" : "personal";
  const [member, history] = preview
    ? [previewMembers.find((previewMember) => previewMember.id === id) ?? null, id === previewMembers[0].id ? previewHistory : []]
    : await Promise.all([getAdminMember(id), getMemberBookingHistory(id)]);
  if (!member) notFound();

  const participationCounts = {
    attended: history.filter((entry) => entry.status === "attended").length,
    confirmed: history.filter((entry) => entry.status === "confirmed").length,
    cancelled: history.filter((entry) => entry.status === "cancelled").length,
    noShow: history.filter((entry) => entry.status === "no_show").length,
  };
  const backHref = preview ? "/admin/members?preview=1" : "/admin/members";

  return (
    <main className="min-h-screen bg-[#f6f6f4] text-[#25242b]">
      <div className="mx-auto grid max-w-[1600px] lg:grid-cols-[15.5rem_minmax(0,1fr)]">
        <AdminSidebar currentPath="/admin/members" email={access.email} role={access.role} />
        <div className="min-w-0">
          <header className="border-b border-black/10 bg-white px-5 py-6 md:px-8 lg:px-10">
            <Link className="text-sm font-medium text-[#4f46a5] underline decoration-[#aaa6d0] underline-offset-4 hover:text-[#292833]" href={backHref}>All members</Link>
            <h1 className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-[#25242b] md:text-3xl">{member.name ?? "Unnamed member"}</h1>
          </header>

          {preview ? <div className="border-b border-[#d5c7e5] bg-[#f4eef9] px-5 py-3 text-sm font-medium text-[#68416f] md:px-8 lg:px-10">Local preview · Sample data only · Member data remains protected</div> : null}

          <section className="px-5 py-8 md:px-8 lg:px-10">
            <div className="max-w-4xl">
              <nav aria-label="Member record sections" className="flex gap-1 border-b border-black/10" role="tablist">
                <Link aria-selected={tab === "personal"} className={`border-b-2 px-4 py-3 text-sm font-medium no-underline transition-colors ${tab === "personal" ? "border-[#4f46a5] text-[#292833]" : "border-transparent text-black/60 hover:border-black/25 hover:text-[#292833]"}`} href={detailHref(member.id, "personal", preview)} role="tab">Personal information</Link>
                <Link aria-selected={tab === "participation"} className={`border-b-2 px-4 py-3 text-sm font-medium no-underline transition-colors ${tab === "participation" ? "border-[#4f46a5] text-[#292833]" : "border-transparent text-black/60 hover:border-black/25 hover:text-[#292833]"}`} href={detailHref(member.id, "participation", preview)} role="tab">Participation</Link>
              </nav>

              {tab === "personal" ? (
                <section aria-labelledby="personal-information-heading" className="mt-8 rounded-xl border border-black/10 bg-white p-6 md:p-8" role="tabpanel">
                  <h2 className="text-xl font-semibold tracking-[-0.02em]" id="personal-information-heading">Personal information</h2>
                  <dl className="mt-6 grid divide-y divide-black/10 border-y border-black/10 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
                    <div className="py-4 sm:pr-6"><dt className="text-xs font-medium uppercase tracking-[0.1em] text-black/50">Email</dt><dd className="mt-2 break-all text-sm text-[#25242b]">{member.email ? <a className="underline decoration-[#aaa6d0] underline-offset-3 hover:text-[#4f46a5]" href={`mailto:${member.email}`}>{member.email}</a> : "No login email"}</dd></div>
                    <div className="py-4 sm:pl-6"><dt className="text-xs font-medium uppercase tracking-[0.1em] text-black/50">Mobile</dt><dd className="mt-2 text-sm text-[#25242b]">{member.mobile ? <a className="underline decoration-[#aaa6d0] underline-offset-3 hover:text-[#4f46a5]" href={`tel:${member.mobile}`}>{member.mobile}</a> : "No mobile number"}</dd></div>
                    <div className="py-4 sm:pr-6"><dt className="text-xs font-medium uppercase tracking-[0.1em] text-black/50">Birthday</dt><dd className="mt-2 text-sm text-[#25242b]">{member.birthDate ? formatBirthDate(member.birthDate) : "Not provided"}</dd></div>
                    <div className="py-4 sm:pl-6"><dt className="text-xs font-medium uppercase tracking-[0.1em] text-black/50">Joined</dt><dd className="mt-2 text-sm text-[#25242b]">{joinedFormatter.format(member.createdAt)}</dd></div>
                  </dl>
                </section>
              ) : (
                <section aria-labelledby="participation-heading" className="mt-8 rounded-xl border border-black/10 bg-white p-6 md:p-8" role="tabpanel">
                  <h2 className="text-xl font-semibold tracking-[-0.02em]" id="participation-heading">Participation</h2>
                  <div className="mt-5 grid grid-cols-2 divide-x divide-y divide-black/10 rounded-lg border border-black/10 sm:grid-cols-4 sm:divide-y-0"><div className="p-4"><p className="text-xs font-semibold uppercase tracking-[0.1em] text-black/50">Attended</p><p className="mt-2 text-2xl font-semibold tabular-nums">{participationCounts.attended}</p></div><div className="p-4"><p className="text-xs font-semibold uppercase tracking-[0.1em] text-black/50">Expected</p><p className="mt-2 text-2xl font-semibold tabular-nums">{participationCounts.confirmed}</p></div><div className="p-4"><p className="text-xs font-semibold uppercase tracking-[0.1em] text-black/50">Cancelled</p><p className="mt-2 text-2xl font-semibold tabular-nums">{participationCounts.cancelled}</p></div><div className="p-4"><p className="text-xs font-semibold uppercase tracking-[0.1em] text-black/50">No show</p><p className="mt-2 text-2xl font-semibold tabular-nums">{participationCounts.noShow}</p></div></div>
                  {history.length > 0 ? <ul className="mt-6 grid gap-3">{history.map((entry) => <li className="flex items-center justify-between gap-4 border-b border-black/10 pb-4 last:border-0 last:pb-0" key={entry.id}><div className="flex items-center gap-4"><CalendarDays aria-hidden="true" className="size-5 shrink-0 text-[#5a5688]" /><div><p className="font-medium text-[#25242b]">{entry.className}</p><p className="mt-1 text-sm text-black/60">{sessionDateFormatter.format(entry.startsAt)}</p></div></div><span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${entry.status === "attended" ? "bg-[#efedf6] text-[#4f4a75]" : entry.status === "confirmed" ? "bg-[#dce8c6] text-[#273022]" : entry.status === "cancelled" ? "bg-black/6 text-black/65" : "bg-[#f8e8ed] text-[#9e4059]"}`}>{entry.status === "attended" ? "Attended" : entry.status === "confirmed" ? "Expected" : entry.status === "cancelled" ? "Cancelled" : "No show"}</span></li>)}</ul> : <div className="mt-5 border border-dashed border-black/15 px-6 py-10 text-center"><UserRound aria-hidden="true" className="mx-auto size-6 text-[#5a5688]" /><p className="mt-4 text-sm leading-6 text-black/60">No participation has been recorded yet.</p></div>}
                </section>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
