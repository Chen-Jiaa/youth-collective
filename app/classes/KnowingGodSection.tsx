"use client";

import { useState } from "react";

import type { PublicSession } from "../../lib/db/repositories/sessions";
import Select from "../components/Select";
import ScheduleList, { groups } from "./ScheduleList";

type KnowingGodSectionProps = {
  bookingIdsBySessionId: Record<string, string>;
  sessions: PublicSession[];
};

export default function KnowingGodSection({ bookingIdsBySessionId, sessions }: KnowingGodSectionProps) {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  return (
    <>
      <section aria-labelledby="knowing-god-summary" className="border-t border-black/10 py-9 md:pt-12 md:pb-6">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,0.7fr)] lg:grid-rows-[auto_auto] lg:items-start lg:gap-x-8 lg:gap-y-0">
          <div className="lg:col-start-1 lg:row-start-1">
            <h3 className="font-heading text-2xl leading-[0.95] tracking-[-0.025em] text-[#292823]" id="knowing-god-summary">Knowing God</h3>
            <p className="mt-4 max-w-2xl text-sm leading-5 md:text-lg md:leading-7">A three-part journey into who God is, through Scripture, and through prayer.</p>
          </div>
          <div className="pt-2 lg:col-start-2 lg:row-span-2 lg:self-stretch lg:border-l lg:border-black/10 lg:pl-8 lg:pt-0">
            <p className="text-sm font-bold leading-5 text-[#292823] md:text-lg md:leading-7">3 sessions</p>
            <ul className="mt-1 grid list-disc pl-5 text-xs font-medium leading-4 text-[#292823] md:text-sm md:leading-5"><li>Who He is</li><li>Through Scripture</li><li>Through Prayer</li></ul>
          </div>
          <div className="mt-1 lg:col-start-1 lg:row-start-2 lg:mt-5">
            <label className="block text-sm font-semibold text-[#292823]" htmlFor="group-filter">Choose your group</label>
            <div className="mt-3 max-w-sm">
              <Select className="rounded-xl border border-black/15 bg-white py-3 text-sm font-bold text-[#292823] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#292823]" id="group-filter" onChange={(event) => setSelectedGroup(event.target.value || null)} value={selectedGroup ?? ""}>
                <option disabled value="">Select a group</option>
                {groups.map((group) => <option key={group.value} value={group.value}>{group.label}</option>)}
              </Select>
            </div>
          </div>
        </div>
      </section>

      <section aria-label="Knowing God booking">
        <ScheduleList bookingIdsBySessionId={bookingIdsBySessionId} selectedGroup={selectedGroup} sessions={sessions} />
      </section>
    </>
  );
}
