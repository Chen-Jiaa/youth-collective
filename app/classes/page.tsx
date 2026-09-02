import Link from "next/link";
import type { Metadata } from "next";

import Container from "../components/Container";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import KnowingGodSection from "./KnowingGodSection";
import { getCurrentUser } from "../../lib/auth/user";
import { listBookingsForAuthSubject } from "../../lib/db/repositories/bookings";
import { listUpcomingPublicSessions } from "../../lib/db/repositories/sessions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Learning Labs: Classes | Strictly Students",
  description: "A few hours where we dive into the deeper questions of God, relationship, and life.",
};

type ClassesPageProps = {
  searchParams: Promise<{ booking?: string }>;
};

/**
 * THESIS: A learning journey comes before the individual dates a member can book.
 * OWN-WORLD: Strictly Students’ warm neutral base, ink route markers, soft availability states, and bold display type.
 * STORY: A member sees exactly when a Session happens, whether a place remains, and where booking begins.
 * FIRST VIEWPORT: A quiet neutral field establishes the invitation; the upcoming route starts directly below with the first action visible.
 * FORM: Fourth-ranked grounded structure — a chronological station ledger; seed 7c8d2db2.
 */
export default async function ClassesPage({ searchParams }: ClassesPageProps) {
  const user = await getCurrentUser();
  const [sessions, params, bookings] = await Promise.all([
    listUpcomingPublicSessions(),
    searchParams,
    user ? listBookingsForAuthSubject(user.id) : Promise.resolve([]),
  ]);
  const hasBookingConfirmation = params.booking === "confirmed";
  const bookingIdsBySessionId = Object.fromEntries(
    bookings
      .filter((booking) => booking.status === "confirmed")
      .map((booking) => [booking.sessionId, booking.id]),
  );

  return (
    <>
      <Navbar userEmail={user?.email} />
      <main className="overflow-hidden bg-white pb-20">
        <section className="bg-white">
          <Container className="pt-14 md:pt-20">
            <div className="flex flex-col items-center justify-center gap-9 border-b border-black/10 pb-14 text-center md:pb-20">
              <div className="max-w-3xl">
                <h1 className="font-heading text-5xl leading-[0.9] tracking-[-0.04em] text-[#292823] md:text-6xl">
                  Learning Labs: Classes
                </h1>
                <p className="mx-auto mt-5 max-w-2xl text-sm leading-5 md:text-lg md:leading-7">
                  Learning Labs is our rhythm of eating together, learning together, and making space for the deeper questions of God, relationship, and life.
                </p>
              </div>
            </div>
          </Container>
        </section>

        <section aria-labelledby="what-we-do-heading" className="bg-white">
          <Container className="border-b border-black/10 pt-14 pb-7 md:pt-20 md:pb-8">
            <div className="grid gap-10 lg:grid-cols-[minmax(15rem,0.8fr)_minmax(0,2fr)] lg:gap-16">
              <h2 className="font-heading text-4xl leading-[0.92] tracking-[-0.035em] text-[#292823] md:text-5xl" id="what-we-do-heading">
                What we do?
              </h2>

              <div className="divide-y divide-black/10">
                <article className="grid gap-4 pb-7 md:grid-cols-[12rem_1fr] md:gap-8 md:pb-8">
                  <h3 className="font-heading text-2xl leading-[0.95] tracking-[-0.025em] text-[#292823]">Eat Together</h3>
                  <p className="max-w-2xl text-sm leading-5 md:text-lg md:leading-7">
                    We gather around the table to eat together and talk to each other. Sometimes a few of us whip up something for the rest, but most of the time we grab food together.
                  </p>
                </article>

                <article className="grid gap-4 py-7 md:grid-cols-[12rem_1fr] md:gap-8 md:py-8">
                  <h3 className="font-heading text-2xl leading-[0.95] tracking-[-0.025em] text-[#292823]">Learn Together</h3>
                  <p className="max-w-2xl text-sm leading-5 md:text-lg md:leading-7">
                    We learn about a practice from the way of Jesus and discuss how it&apos;s like for us with our small group after trying it out. Sometimes we pair up with people who are different from us because it helps us to discover a part of us that we never knew before. But we stick with the same group for the classes. Less awkward.
                  </p>
                </article>
              </div>
            </div>
          </Container>
        </section>

        <Container className="pt-14 md:pt-20">
          {hasBookingConfirmation ? (
            <div className="mb-10 rounded-2xl border border-black/10 bg-[#fdfcf9] px-5 py-4 text-sm font-medium text-[#292823]" role="status">
              Your place is confirmed. We’ve saved it in your dashboard.
            </div>
          ) : null}

          <div className="mb-9 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              {user ? <p className="mb-3 text-sm font-semibold text-[#292823]">Welcome back, {user.email}</p> : null}
              <h2 className="font-heading text-4xl leading-none tracking-[-0.03em] text-[#292823] md:text-5xl">
                Classes
              </h2>
            </div>
            <Link className="text-sm font-semibold text-[#292823] underline decoration-1 underline-offset-4 hover:text-black/65 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#292823]" href="/dashboard">
              My Classes
            </Link>
          </div>

          <KnowingGodSection bookingIdsBySessionId={bookingIdsBySessionId} sessions={sessions} />

          <section aria-labelledby="community-basics-heading" className="border-y border-black/10 py-9 md:mt-6 md:py-12">
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,0.7fr)] lg:items-start lg:gap-8">
              <div>
                <p className="mb-3 text-sm font-bold text-[#292823]">Previous Class</p>
                <h3 className="font-heading text-2xl leading-[0.95] tracking-[-0.025em] text-[#292823]" id="community-basics-heading">Community Basics</h3>
                <p className="mt-4 max-w-2xl text-sm leading-5 md:text-lg md:leading-7">A four-part journey into healthy community.</p>
              </div>
              <div className="pt-2 lg:border-l lg:border-black/10 lg:pl-8 lg:pt-0">
                <p className="text-sm font-bold leading-5 text-[#292823] md:text-lg md:leading-7">4 sessions</p>
                <ul className="mt-1 grid list-disc pl-5 text-xs font-medium leading-4 text-[#292823] md:text-sm md:leading-5"><li>Belonging</li><li>Friendship</li><li>Trust</li><li>Ownership</li></ul>
              </div>
            </div>
          </section>

        </Container>
      </main>
      <div className="bg-white">
        <Footer />
      </div>
    </>
  );
}
