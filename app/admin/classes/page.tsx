import { redirect } from "next/navigation";

import { CoursesPanel } from "../CoursesPanel";
import { AdminSidebar } from "../AdminSidebar";
import { getCurrentAdminAccess } from "../../../lib/admin/authorization";
import { listAdminCourses, type AdminCourse } from "../../../lib/db/repositories/admin";

export const dynamic = "force-dynamic";

type ClassesPageProps = {
  searchParams: Promise<{ preview?: string }>;
};

const previewAccess = { id: "d756f94e-63bd-4d07-8e4d-848e8d75edfe", email: "staff-preview@example.test", role: "admin" as const };
const previewCourses = [{ id: "0a1d3f5b-97d8-44cb-8f4e-2e8f91cf5d91", name: "Knowing God", description: "Practical faith conversations.", publicStatus: "active", isArchived: false, classes: [{ id: "0a1d3f5b-97d8-44cb-8f4e-2e8f91cf5d91", courseId: "0a1d3f5b-97d8-44cb-8f4e-2e8f91cf5d91", courseName: "Knowing God", name: "Who is God?", description: "A focused study session with peer support.", audience: "Years 10–13", isArchived: false }] }] satisfies AdminCourse[];

export default async function ClassesPage({ searchParams }: ClassesPageProps) {
  const params = await searchParams;
  const preview = process.env.NODE_ENV === "development" && params.preview === "1";
  const access = preview ? previewAccess : await getCurrentAdminAccess();
  if (!access) redirect("/dashboard");

  const courses = preview ? previewCourses : await listAdminCourses();

  return (
    <main className="min-h-screen bg-[#f6f6f4] text-[#25242b]">
      <div className="mx-auto grid max-w-[1600px] lg:grid-cols-[15.5rem_minmax(0,1fr)]">
        <AdminSidebar currentPath="/admin/classes" email={access.email} role={access.role} />
        <div className="min-w-0">
          <header className="border-b border-black/10 bg-white px-5 py-6 md:px-8 lg:px-10">
            <h1 className="text-2xl font-semibold tracking-[-0.03em] text-[#25242b] md:text-3xl">Programme Setup</h1>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-black/60">Manage the Courses and Classes members can see. Create dated Sessions from Today & Upcoming when the programme is ready to run.</p>
          </header>
          {preview ? <div className="border-b border-[#d5c7e5] bg-[#f4eef9] px-5 py-3 text-sm font-medium text-[#68416f] md:px-8 lg:px-10">Local preview · Sample data only · Admin actions stay protected</div> : null}
          <section className="max-w-5xl px-5 py-8 md:px-8 lg:px-10">
            <CoursesPanel courses={courses} />
          </section>
        </div>
      </div>
    </main>
  );
}
