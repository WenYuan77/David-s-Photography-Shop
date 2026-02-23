"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminNav() {
  const pathname = usePathname();

  if (pathname === "/admin/login") return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--background)]/95 backdrop-blur-md border-b border-[var(--border)]">
      <nav className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        <a
          href="/admin"
          className="font-[family-name:var(--font-playfair)] text-xl font-semibold tracking-[0.2em] uppercase text-[var(--foreground)] hover:text-[var(--gold)]"
        >
          Admin
        </a>
        <div className="flex items-center gap-6">
          <a
            href="/admin"
            className={`text-sm tracking-[0.15em] uppercase ${pathname === "/admin" ? "text-[var(--gold)]" : "text-[var(--muted)] hover:text-[var(--gold)]"}`}
          >
            Dashboard
          </a>
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm tracking-[0.15em] uppercase text-[var(--muted)] hover:text-[var(--gold)]"
          >
            View Site
          </Link>
          <a
            href="/admin/logout"
            className="text-sm tracking-[0.15em] uppercase text-[var(--muted)] hover:text-[var(--accent-red)]"
          >
            Logout
          </a>
        </div>
      </nav>
    </header>
  );
}
