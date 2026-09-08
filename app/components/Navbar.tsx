"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { Menu, X, ChevronDown } from "lucide-react";
import Container from "./Container";

const navLinks = {
  learningLabs: [
    { href: "/classes", label: "Classes" },
    { href: "/learninglabs", label: "Experience" },
  ],
};

const focusRingClasses =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--alpha-purple)]";

const isMatchingRoute = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(`${href}/`);

const mobileLinkClasses =
  "flex min-h-11 items-center px-3 py-2 text-base font-medium text-black no-underline transition-colors hover:bg-black/5 focus-visible:bg-black/5 " +
  focusRingClasses;

const NavLink = ({
  href,
  children,
  external,
  className = "",
  isCurrent = false,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
  className?: string;
  isCurrent?: boolean;
}) => {
  const baseClasses =
    "inline-flex min-h-10 items-center rounded-md px-3 py-2 text-sm font-medium tracking-[0.01em] text-black no-underline transition-colors hover:bg-black/5 hover:text-black focus-visible:bg-black/5 " +
    focusRingClasses;
  const currentClasses = isCurrent
    ? " rounded-md bg-black text-white hover:bg-black focus-visible:bg-black"
    : "";

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseClasses}${currentClasses} ${className}`}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={href}
      aria-current={isCurrent ? "page" : undefined}
      className={`${baseClasses}${currentClasses} ${className}`}
    >
      {children}
    </Link>
  );
};

function DropdownSection({
  title,
  links,
  pathname,
}: {
  title: string;
  links: { href: string; label: string; external?: boolean }[];
  pathname: string;
}) {
  const activeLink = links.find(
    (link) => !link.external && isMatchingRoute(pathname, link.href),
  );

  return (
    <NavigationMenu.Item className="relative">
      <NavigationMenu.Trigger
        className={`group inline-flex min-h-10 items-center justify-center gap-1 rounded-md border-0 px-3 py-2 text-sm font-medium tracking-[0.01em] transition-colors focus-visible:bg-black/5 ${focusRingClasses} ${activeLink ? "bg-black text-white hover:bg-black focus-visible:bg-black" : "bg-transparent text-black hover:bg-black/5 hover:text-black"}`}
      >
        {activeLink?.label ?? title}
        <ChevronDown
          aria-hidden="true"
          className="size-4 transition-transform duration-200 group-data-[state=open]:rotate-180"
        />
      </NavigationMenu.Trigger>
      <NavigationMenu.Content className="absolute left-1/2 top-full z-50 w-max -translate-x-1/2 pt-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0">
        <div className="min-w-44 bg-white p-2 shadow-[0_14px_32px_rgba(0,0,0,0.16)]">
          {links.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              external={link.external}
              isCurrent={
                !link.external && isMatchingRoute(pathname, link.href)
              }
              className="flex w-full justify-start text-left"
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </NavigationMenu.Content>
    </NavigationMenu.Item>
  );
}

const MobileNavLink = ({
  href,
  children,
  external,
  onNavigate,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
  onNavigate: () => void;
}) => {
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={mobileLinkClasses}
        onClick={onNavigate}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={mobileLinkClasses} onClick={onNavigate}>
      {children}
    </Link>
  );
};

function LogoutButton({
  className,
  email,
  onSignedOut,
}: {
  className: string;
  email: string;
  onSignedOut?: () => void;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function signOut() {
    startTransition(async () => {
      try {
        const response = await fetch("/api/auth/logout", { method: "POST" });

        if (response.ok) {
          onSignedOut?.();
          router.replace("/classes");
          router.refresh();
        }
      } catch {
        // Leave the user signed in if the request cannot be completed.
      }
    });
  }

  return (
    <button
      aria-label={`Sign out as ${email}`}
      className={`${className} border-0 bg-transparent text-left disabled:cursor-wait disabled:opacity-50`}
      disabled={isPending}
      onClick={signOut}
      type="button"
    >
      {isPending ? "Signing out…" : "Sign out"}
    </button>
  );
}

export default function Navbar({ userEmail }: { userEmail?: string }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <Container className="relative z-50 my-2 flex min-h-14 items-center justify-between md:my-3 md:min-h-16">
      {/* Logo */}
      <div className="shrink-0">
        <Link
          href="/"
          className={`whitespace-nowrap text-2xl font-heading tracking-[-0.03em] text-black no-underline transition-opacity hover:opacity-70 ${focusRingClasses} md:text-3xl`}
        >
          Strictly Students
        </Link>
      </div>

      {/* Desktop Navigation Menu (hidden on mobile) */}
      <NavigationMenu.Root className="relative hidden lg:block" aria-label="Primary navigation">
        <NavigationMenu.List className="m-0 flex list-none items-center gap-1 p-0">
          <DropdownSection
            title="Learning Labs"
            links={navLinks.learningLabs}
            pathname={pathname}
          />
          <NavLink href="/pray" isCurrent={isMatchingRoute(pathname, "/pray")}>
            Pray
          </NavLink>
          <NavLink href="/serve" isCurrent={isMatchingRoute(pathname, "/serve")}>
            Serve
          </NavLink>
          <NavLink href="/about" isCurrent={isMatchingRoute(pathname, "/about")}>
            About
          </NavLink>
          <NavLink href="/dashboard" isCurrent={pathname === "/dashboard"}>
            {userEmail ? "Dashboard" : "Login"}
          </NavLink>
          {userEmail ? (
            <LogoutButton
              className={`inline-flex min-h-10 items-center px-3 py-2 text-sm font-medium tracking-[0.01em] text-black no-underline transition-colors hover:bg-black/5 focus-visible:bg-black/5 ${focusRingClasses}`}
              email={userEmail}
            />
          ) : null}
        </NavigationMenu.List>
      </NavigationMenu.Root>

      {/* Mobile Menu Trigger */}
      <Dialog.Root open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <Dialog.Trigger asChild>
          <button
            aria-label="Open navigation menu"
            className={`inline-flex size-11 items-center justify-center border-0 bg-transparent text-black transition-colors hover:bg-black/5 focus-visible:bg-black/5 lg:hidden ${focusRingClasses}`}
          >
            <Menu aria-hidden="true" className="size-6" />
          </button>
        </Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-40 bg-black/50 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
          <Dialog.Content
            aria-describedby={undefined}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col overflow-y-auto bg-white p-5 shadow-[-16px_0_36px_rgba(0,0,0,0.18)] data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:animate-in data-[state=open]:slide-in-from-right sm:p-7"
          >
            <VisuallyHidden.Root>
              <Dialog.Title>Navigation Menu</Dialog.Title>
            </VisuallyHidden.Root>
            {/* Mobile Menu Header */}
            <div className="mb-9 flex items-center justify-between border-b border-black/10 pb-5">
              <Link
                href="/"
                className={`text-2xl font-heading tracking-[-0.03em] text-black no-underline ${focusRingClasses}`}
                onClick={closeMobileMenu}
              >
                Strictly Students
              </Link>
              <Dialog.Close asChild>
                <button
                  aria-label="Close navigation menu"
                  className={`inline-flex size-11 items-center justify-center text-black transition-colors hover:bg-black/5 focus-visible:bg-black/5 ${focusRingClasses}`}
                >
                  <X aria-hidden="true" className="size-6" />
                </button>
              </Dialog.Close>
            </div>

            {/* Mobile Menu Links */}
            <nav aria-label="Mobile navigation" className="flex flex-col gap-8">
              <div>
                <p className="mb-2 px-3 text-sm font-heading uppercase tracking-[0.08em] text-black">
                  Learning Labs
                </p>
                {navLinks.learningLabs.map((link) => (
                  <MobileNavLink
                    key={link.href}
                    href={link.href}
                    onNavigate={closeMobileMenu}
                  >
                    {link.label}
                  </MobileNavLink>
                ))}
              </div>
              <div>
                <p className="mb-2 px-3 text-sm font-heading uppercase tracking-[0.08em] text-black">
                  More ways in
                </p>
                <MobileNavLink href="/pray" onNavigate={closeMobileMenu}>
                  Pray
                </MobileNavLink>
                <MobileNavLink href="/serve" onNavigate={closeMobileMenu}>
                  Serve
                </MobileNavLink>
                <MobileNavLink href="/about" onNavigate={closeMobileMenu}>
                  About
                </MobileNavLink>
              </div>
              <div className="border-t border-black/10 pt-6">
                <MobileNavLink href="/dashboard" onNavigate={closeMobileMenu}>
                  {userEmail ? "Dashboard" : "Login"}
                </MobileNavLink>
                {userEmail ? (
                  <LogoutButton
                    className={mobileLinkClasses}
                    email={userEmail}
                    onSignedOut={closeMobileMenu}
                  />
                ) : null}
              </div>
            </nav>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </Container>
  );
}
