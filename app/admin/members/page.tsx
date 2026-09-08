import Link from "next/link";
import { Search, UsersRound } from "lucide-react";
import { redirect } from "next/navigation";

import { AdminSidebar } from "../AdminSidebar";
import { getCurrentAdminAccess } from "../../../lib/admin/authorization";
import { listAdminMembers, type AdminMember } from "../../../lib/db/repositories/admin";

export const dynamic = "force-dynamic";

type MembersPageProps = {
  searchParams: Promise<{ preview?: string; q?: string }>;
};

const previewAccess = { id: "d756f94e-63bd-4d07-8e4d-848e8d75edfe", email: "staff-preview@example.test", role: "admin" as const };
const previewMembers = [
  { id: "b8db9ed0-8ac3-4861-901f-810436236819", name: "Amira Khan", email: "amira@example.test", mobile: "+32 470 12 34 56", birthDate: "2010-05-14", createdAt: new Date("2026-07-02T10:00:00+08:00"), bookingCount: 4 },
  { id: "3137b83d-2edf-48bc-8871-ac6c36ffb46e", name: "Noah Martin", email: "noah@example.test", mobile: "+32 471 98 76 54", birthDate: "2011-11-03", createdAt: new Date("2026-07-12T10:00:00+08:00"), bookingCount: 2 },
  { id: "e5ca0e42-8058-4463-b0cb-742f631c6bb6", name: "Lina De Smet", email: "lina@example.test", mobile: "+32 474 33 22 11", birthDate: "2014-02-22", createdAt: new Date("2026-07-29T10:00:00+08:00"), bookingCount: 6 },
  { id: "6b5515f2-9022-4966-87a1-e0a40151903f", name: "Ilias Vermeulen", email: "ilias@example.test", mobile: "+32 475 55 44 33", birthDate: null, createdAt: new Date("2026-08-18T09:15:00+08:00"), bookingCount: 1 },
] satisfies AdminMember[];

const joinedFormatter = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" });
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function formatBirthDate(value: string) {
  const [year, month, day] = value.split("-");
  return `${Number(day)} ${monthNames[Number(month) - 1]} ${year}`;
}

function includesQuery(member: AdminMember, query: string) {
  const normalizedQuery = query.toLocaleLowerCase();
  return [member.name, member.email, member.mobile].some((value) => value?.toLocaleLowerCase().includes(normalizedQuery));
}

/**
 * THESIS: The member directory makes the People staff need reachable in one focused scan.
 * STORY: Staff search a name, email, or mobile number, then confirm the correct member from their core details.
 * FIRST VIEWPORT: Search and the filtered member count lead directly into a clear, responsive directory.
 */
export default async function MembersPage({ searchParams }: MembersPageProps) {
  const params = await searchParams;
  const preview = process.env.NODE_ENV === "development" && params.preview === "1";
  const access = preview ? previewAccess : await getCurrentAdminAccess();
  if (!access) redirect("/dashboard");

  const query = params.q?.trim() ?? "";
  const members = preview ? previewMembers.filter((member) => includesQuery(member, query)) : await listAdminMembers(query);

  return (
    <main className="min-h-screen bg-[#f6f6f4] text-[#25242b]">
      <div className="mx-auto grid max-w-[1600px] lg:grid-cols-[15.5rem_minmax(0,1fr)]">
        <AdminSidebar currentPath="/admin/members" email={access.email} role={access.role} />
        <div className="min-w-0">
          <header className="border-b border-black/10 bg-white px-5 py-6 md:px-8 lg:px-10">
            <div>
              <h1 className="text-2xl font-semibold tracking-[-0.03em] text-[#25242b] md:text-3xl">People</h1>
              <p className="mt-1 text-sm text-black/60">Find a person and check their contact and participation record.</p>
            </div>
          </header>

          {preview ? <div className="border-b border-[#d5c7e5] bg-[#f4eef9] px-5 py-3 text-sm font-medium text-[#68416f] md:px-8 lg:px-10">Local preview · Sample data only · Member data remains protected</div> : null}

          <section className="px-5 py-8 md:px-8 lg:px-10">
            <div className="max-w-5xl">
              <form action="/admin/members" className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]" method="get" role="search">
                {preview ? <input name="preview" type="hidden" value="1" /> : null}
                <label className="relative block">
                  <span className="sr-only">Search members</span>
                  <Search aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#5a5688]" />
                  <input className="min-h-11 w-full rounded-lg border border-black/15 bg-white py-2 pl-10 pr-3 text-sm outline-none transition focus:border-[#4f46a5] focus:ring-2 focus:ring-[#4f46a5]/15" defaultValue={query} name="q" placeholder="Search by name, email, or mobile" type="search" />
                </label>
                <button className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#292833] px-5 text-sm font-medium text-white transition-colors hover:bg-[#4f46a5] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#4f46a5]" type="submit">Search</button>
              </form>

              <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
                <p className="text-base font-semibold">{members.length} {members.length === 1 ? "member" : "members"}{query ? ` matching “${query}”` : ""}</p>
                {query ? <Link className="text-sm font-medium text-[#4f46a5] underline decoration-[#aaa6d0] underline-offset-4 hover:text-[#292833]" href={preview ? "/admin/members?preview=1" : "/admin/members"}>Clear search</Link> : null}
              </div>

              {members.length > 0 ? (
                <div className="mt-4 overflow-x-auto rounded-xl border border-black/10 bg-white">
                  <table className="w-full min-w-180 border-collapse text-left">
                    <thead className="border-b border-black/10 bg-[#faf9fd] text-xs font-medium uppercase tracking-[0.1em] text-black/55">
                      <tr><th className="px-5 py-3">Member</th><th className="px-5 py-3">Contact</th><th className="px-5 py-3">Birthday</th><th className="px-5 py-3 text-right">Bookings</th><th className="px-5 py-3">Joined</th></tr>
                    </thead>
                    <tbody>
                      {members.map((member) => (
                        <tr className="border-b border-black/8 last:border-0" key={member.id}>
                          <td className="px-5 py-4 font-medium text-[#25242b]"><Link className="text-[#3f3a70] underline decoration-[#b5b1d8] underline-offset-4 hover:text-[#4f46a5]" href={preview ? `/admin/members/${member.id}?preview=1` : `/admin/members/${member.id}`}>{member.name ?? "Unnamed member"}</Link></td>
                          <td className="px-5 py-4 text-sm leading-6 text-black/60">{member.email ? <a className="underline decoration-[#aaa6d0] underline-offset-3 hover:text-[#292833]" href={`mailto:${member.email}`}>{member.email}</a> : "No login email"}<br />{member.mobile ?? "No mobile number"}</td>
                          <td className="px-5 py-4 text-sm text-black/60">{member.birthDate ? formatBirthDate(member.birthDate) : "Not provided"}</td>
                          <td className="px-5 py-4 text-right text-sm font-medium tabular-nums">{member.bookingCount}</td>
                          <td className="px-5 py-4 text-sm text-black/60">{joinedFormatter.format(member.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="mt-4 rounded-xl border border-dashed border-black/15 bg-white px-6 py-10 text-center">
                  <UsersRound aria-hidden="true" className="mx-auto size-6 text-[#5a5688]" />
                  <h2 className="mt-4 text-lg font-semibold">No members found</h2>
                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-black/60">Try a different name, email address, or mobile number.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
