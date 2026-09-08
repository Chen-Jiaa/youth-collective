import Link from "next/link";
import { ArrowLeft, FolderKanban, LayoutDashboard, UsersRound } from "lucide-react";

import { AdminAccountControl } from "./AdminAccountControl";

type AdminSidebarProps = {
  email: string;
  role: string;
  currentPath: "/admin" | "/admin/classes" | "/admin/members";
};

export function AdminSidebar({ email, role, currentPath }: AdminSidebarProps) {
  const links = [
    { href: "/admin", label: "Today & Upcoming", icon: LayoutDashboard },
    { href: "/admin/members", label: "People", icon: UsersRound },
    { href: "/admin/classes", label: "Programme Setup", icon: FolderKanban },
  ];

  return (
    <aside className="flex border-b border-black/10 bg-[#292833] px-5 py-5 text-white lg:sticky lg:top-0 lg:h-screen lg:flex-col lg:border-r lg:border-b-0 lg:px-4 lg:py-6">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 lg:flex-1 lg:flex-col lg:items-stretch">
        <div>
          <Link className="text-xl font-heading tracking-[-0.03em] text-white no-underline" href="/admin">Strictly Students</Link>
          <nav aria-label="Admin sections" className="flex items-center gap-1 overflow-x-auto lg:mt-10 lg:grid lg:gap-1">
            {links.map(({ href, label, icon: Icon }) => {
              const isActive = href === currentPath;
              return (
                <Link className={`inline-flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium no-underline transition-colors ${isActive ? "bg-white/14 text-white" : "text-white/70 hover:bg-white/10 hover:text-white"}`} href={href} key={label}>
                  <Icon aria-hidden="true" className="size-4" />
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="hidden lg:block">
          <Link className="inline-flex items-center gap-2 text-sm font-medium text-white/70 no-underline transition-colors hover:text-white" href="/classes">
            <ArrowLeft aria-hidden="true" className="size-4" />
            Return to classes
          </Link>
          <div className="mt-6 border-t border-white/12 pt-5">
            <AdminAccountControl email={email} role={role} />
          </div>
        </div>
      </div>
    </aside>
  );
}
