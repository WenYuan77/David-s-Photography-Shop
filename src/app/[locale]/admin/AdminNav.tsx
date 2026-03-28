"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import ThemeToggle from "@/components/ThemeToggle";

export default function AdminNav() {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("admin.nav");

  const adminRoot = `/${locale}/admin`;
  if (pathname === `${adminRoot}/login`) return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--background)]/95 backdrop-blur-md border-b border-[var(--border)]">
      <nav className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        <a
          href={adminRoot}
          className="font-[family-name:var(--font-playfair)] text-xl font-semibold tracking-[0.2em] uppercase text-[var(--foreground)] hover:text-[var(--gold)]"
        >
          {t("admin")}
        </a>
        <div className="flex items-center gap-4 md:gap-6">
          <ThemeToggle />
          <a
            href={adminRoot}
            className={`text-sm tracking-[0.15em] uppercase ${pathname === adminRoot ? "text-[var(--gold)]" : "text-[var(--muted)] hover:text-[var(--gold)]"}`}
          >
            {t("dashboard")}
          </a>
          <Link
            href={`/${locale}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm tracking-[0.15em] uppercase text-[var(--muted)] hover:text-[var(--gold)]"
          >
            {t("viewSite")}
          </Link>
          <a
            href={`${adminRoot}/logout`}
            className="text-sm tracking-[0.15em] uppercase text-[var(--muted)] hover:text-[var(--accent-red)]"
          >
            {t("logout")}
          </a>
        </div>
      </nav>
    </header>
  );
}
