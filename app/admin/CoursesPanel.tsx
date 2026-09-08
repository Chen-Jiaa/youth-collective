"use client";

import { createCourseAction, setCourseArchiveAction, updateCourseAction } from "../../lib/admin/actions";
import type { AdminCourse } from "../../lib/db/repositories/admin";
import Select from "../components/Select";
import { ClassesPanel } from "./ClassesPanel";

const publicStatusLabel = {
  active: "Now running",
  coming_next: "Coming next",
  hidden: "Hidden from members",
} as const;

function CourseCard({ course }: { course: AdminCourse }) {
  const archiveAction = setCourseArchiveAction.bind(null, course.id, !course.isArchived);
  const updateAction = updateCourseAction.bind(null, course.id);

  return (
    <article className="rounded-xl border border-black/10 bg-white p-5 md:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-xl font-semibold tracking-[-0.025em] text-[#25242b]">{course.name}</h2>
            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${course.isArchived ? "bg-[#f4e8e8] text-[#943b3b]" : "bg-[#e7eee0] text-[#385132]"}`}>
              {course.isArchived ? "Archived" : publicStatusLabel[course.publicStatus]}
            </span>
          </div>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-black/60">{course.description || "No Course summary yet."}</p>
        </div>
        <form action={archiveAction}>
          <button className={`min-h-10 rounded-lg px-3.5 text-sm font-medium ${course.isArchived ? "bg-[#292833] text-white hover:bg-[#4f46a5]" : "border border-[#d8aaaa] text-[#943b3b] hover:bg-[#fff7f7]"}`} type="submit">
            {course.isArchived ? "Restore Course" : "Archive Course"}
          </button>
        </form>
      </div>

      <details className="mt-4">
        <summary className="w-fit cursor-pointer text-sm font-medium underline decoration-1 underline-offset-4">Edit Course</summary>
        <form action={updateAction} className="mt-4 grid max-w-xl gap-4 rounded-lg border border-black/10 bg-[#faf9fd] p-4">
          <label className="text-sm font-medium">Course name<input className="mt-1.5 min-h-10 w-full rounded-lg border border-black/15 bg-white px-3 text-sm" defaultValue={course.name} name="name" required /></label>
          <label className="text-sm font-medium">Course summary<textarea className="mt-1.5 min-h-24 w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm" defaultValue={course.description ?? ""} name="description" /></label>
          <label className="text-sm font-medium">Member visibility<Select className="mt-1.5 min-h-10 rounded-lg border border-black/15 bg-white text-sm" defaultValue={course.publicStatus} name="publicStatus"><option value="active">Now running — sessions can be booked</option><option value="coming_next">Coming next — informational only</option><option value="hidden">Hidden</option></Select></label>
          <button className="w-fit rounded-lg bg-[#292833] px-4 py-2 text-sm font-medium text-white" type="submit">Save Course</button>
        </form>
      </details>

      <section className="mt-7 border-t border-black/10 pt-5" aria-label={`${course.name} Classes`}>
        <div className="mb-4 flex items-baseline justify-between gap-3"><h3 className="text-sm font-semibold uppercase tracking-[0.1em] text-black/55">Classes</h3><span className="text-sm text-black/50">{course.classes.length}</span></div>
        <ClassesPanel classes={course.classes} />
      </section>
    </article>
  );
}

export function CoursesPanel({ courses }: { courses: AdminCourse[] }) {
  return <div className="grid gap-6"><form action={createCourseAction} className="grid gap-4 rounded-xl border border-dashed border-black/15 bg-white p-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)_14rem_auto] md:items-end"><label className="text-sm font-medium">New Course name<input className="mt-1.5 min-h-10 w-full rounded-lg border border-black/15 bg-white px-3 text-sm" name="name" placeholder="For example, Knowing God" required /></label><label className="text-sm font-medium">Short summary<textarea className="mt-1.5 min-h-10 w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm" name="description" placeholder="What will members explore?" required /></label><label className="text-sm font-medium">Member visibility<Select className="mt-1.5 min-h-10 rounded-lg border border-black/15 bg-white text-sm" defaultValue="hidden" name="publicStatus"><option value="hidden">Hidden</option><option value="coming_next">Coming next</option><option value="active">Now running</option></Select></label><button className="min-h-10 rounded-lg bg-[#292833] px-4 text-sm font-medium text-white" type="submit">Create Course</button></form>{courses.length > 0 ? courses.map((course) => <CourseCard course={course} key={course.id} />) : <p className="rounded-xl border border-dashed border-black/15 bg-white px-6 py-10 text-center text-sm text-black/60">No Courses yet. Create a Course, then add its first Class from the Sessions workspace.</p>}</div>;
}
