"use client";

import { useLocale } from "next-intl";
import { usePathname, Link } from "@/i18n/navigation";

const LOCALES = [
  { code: "en", label: "EN" },
  { code: "zh", label: "中文" },
  { code: "th", label: "ไทย" },
  { code: "es", label: "ES" },
] as const;

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const path = pathname && pathname !== "/" ? pathname : "";

  return (
    <div className="flex items-center gap-1 sm:gap-2" role="group" aria-label="Language">
      {LOCALES.map(({ code, label }) => (
        <Link
          key={code}
          href={path || "/"}
          locale={code}
          className={`text-xs sm:text-sm font-medium tracking-wider uppercase px-2 py-1 rounded transition-colors ${
            locale === code
              ? "text-[var(--gold)] border border-[var(--gold)]/50"
              : "text-[var(--muted)] hover:text-[var(--gold)] border border-transparent"
          }`}
          aria-current={locale === code ? "true" : undefined}
        >
          {label}
        </Link>
      ))}
    </div>
  );
}
