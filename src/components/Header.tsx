"use client";

import { useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import Link from "next/link";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const t = useTranslations();
  const locale = useLocale();
  const checkboxRef = useRef<HTMLInputElement>(null);

  const navItems = [
    { key: "about", href: "#about" },
    { key: "portfolio", href: "#portfolio-section" },
    { key: "services", href: "#services" },
    { key: "contact", href: "#contact" },
  ];

  useEffect(() => {
    const uncheckOnDesktop = () => {
      if (window.innerWidth >= 768 && checkboxRef.current?.checked) {
        checkboxRef.current.checked = false;
      }
    };
    uncheckOnDesktop();
    window.addEventListener("resize", uncheckOnDesktop);
    return () => window.removeEventListener("resize", uncheckOnDesktop);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--background)]/90 backdrop-blur-md border-b border-[var(--border)]/50">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link
          href={`/${locale}`}
          className="font-[family-name:var(--font-playfair)] text-xl font-semibold tracking-[0.2em] uppercase text-[var(--foreground)] hover:text-[var(--gold)] transition-colors duration-300"
        >
          {t("brand")}
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6 lg:gap-10">
          {navItems.map((item) => (
            <a
              key={item.key}
              href={item.href}
              className="text-sm font-medium tracking-[0.15em] uppercase text-[var(--muted)] hover:text-[var(--gold)] transition-colors duration-300"
            >
              {t(`nav.${item.key}`)}
            </a>
          ))}
          <ThemeToggle />
          <LanguageSwitcher />
        </div>

        {/* Mobile menu button - burger only. Checkbox inside label for reliable tap. Shown on small screens only (md:hidden). */}
        <label className="mobile-menu-btn relative z-[60] md:hidden cursor-pointer flex items-center justify-center min-w-[44px] min-h-[44px] p-2 text-[var(--foreground)] border border-[var(--gold)]">
          <input ref={checkboxRef} type="checkbox" className="mobile-menu-cb" aria-hidden />
          <svg className="h-6 w-6 flex-shrink-0 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </label>
      </nav>

      {/* Mobile menu - shown when checkbox checked. md:!hidden forces hide on large screens */}
      <div className="mobile-menu md:!hidden border-t border-[var(--border)]/50 px-6 py-4">
        <div className="flex flex-col gap-4">
          {navItems.map((item) => (
            <a
              key={item.key}
              href={item.href}
              className="text-sm font-medium tracking-[0.15em] uppercase text-[var(--muted)] hover:text-[var(--gold)] transition-colors"
            >
              {t(`nav.${item.key}`)}
            </a>
          ))}
          <div className="pt-2 border-t border-[var(--border)]/50">
            <div className="mb-3">
              <ThemeToggle showLabel />
            </div>
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}
