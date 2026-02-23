"use client";

import { useRef, useEffect } from "react";

const navItems = [
  { label: "About", href: "#about" },
  { label: "Portfolio", href: "#portfolio-section" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
];

export default function Header() {
  const checkboxRef = useRef<HTMLInputElement>(null);

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
        <a
          href="#"
          className="font-[family-name:var(--font-playfair)] text-xl font-semibold tracking-[0.2em] uppercase text-[var(--foreground)] hover:text-[var(--gold)] transition-colors duration-300"
        >
          Final Stage
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-10">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm font-medium tracking-[0.15em] uppercase text-[var(--muted)] hover:text-[var(--gold)] transition-colors duration-300"
            >
              {item.label}
            </a>
          ))}
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
              key={item.label}
              href={item.href}
              className="text-sm font-medium tracking-[0.15em] uppercase text-[var(--muted)] hover:text-[var(--gold)] transition-colors"
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}
