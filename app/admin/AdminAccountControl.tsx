"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

type AdminAccountControlProps = {
  email: string;
  role: string;
};

export function AdminAccountControl({ email, role }: AdminAccountControlProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function signOut() {
    startTransition(async () => {
      const response = await fetch("/api/auth/logout", { method: "POST" });

      if (response.ok) {
        router.replace("/classes");
        router.refresh();
      }
    });
  }

  return (
    <>
      <p className="text-xs font-medium uppercase tracking-[0.12em] text-white/45">Admin account</p>
      <button
        aria-label={`Sign out as ${email}`}
        className="mt-2 block max-w-full truncate text-left text-sm text-white/80 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white disabled:cursor-wait disabled:text-white/45"
        disabled={isPending}
        onClick={signOut}
        title="Sign out"
        type="button"
      >
        {isPending ? "Signing out…" : email}
      </button>
      <p className="mt-1 text-xs capitalize text-white/55">{role}</p>
    </>
  );
}
