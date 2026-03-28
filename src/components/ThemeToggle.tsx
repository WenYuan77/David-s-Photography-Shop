"use client";

import { useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";

const STORAGE_KEY = "final-stage-theme";
const THEME_EVENT = "final-stage-theme-change";

type Theme = "light" | "dark";

function getTheme(): Theme {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

function setDocumentTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const mediaQuery = window.matchMedia("(prefers-color-scheme: light)");

  const handleThemeEvent = () => {
    callback();
  };

  const handleMediaChange = (event: MediaQueryListEvent) => {
    if (window.localStorage.getItem(STORAGE_KEY)) return;
    const nextTheme: Theme = event.matches ? "light" : "dark";
    setDocumentTheme(nextTheme);
    callback();
  };

  window.addEventListener(THEME_EVENT, handleThemeEvent);
  mediaQuery.addEventListener("change", handleMediaChange);

  return () => {
    window.removeEventListener(THEME_EVENT, handleThemeEvent);
    mediaQuery.removeEventListener("change", handleMediaChange);
  };
}

export default function ThemeToggle({ showLabel = false }: { showLabel?: boolean }) {
  const t = useTranslations("theme");
  const theme = useSyncExternalStore(subscribe, getTheme, () => "dark");

  const nextTheme: Theme = theme === "dark" ? "light" : "dark";

  const handleToggle = () => {
    setDocumentTheme(nextTheme);
    window.localStorage.setItem(STORAGE_KEY, nextTheme);
    window.dispatchEvent(new Event(THEME_EVENT));
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={t(theme === "dark" ? "switchToLight" : "switchToDark")}
      title={t(theme === "dark" ? "switchToLight" : "switchToDark")}
      className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-[var(--control-border)] bg-[var(--surface-elevated)] px-3 py-2 text-[var(--foreground)] shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-px hover:border-[var(--gold)] hover:text-[var(--gold)] ${
        showLabel ? "min-w-[7.5rem]" : "h-9 w-9 px-0 py-0"
      }`}
    >
      <span className="sr-only">{t("toggle")}</span>
      {theme === "dark" ? (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M12 3v2.25M12 18.75V21M5.636 5.636l1.591 1.591M16.773 16.773l1.591 1.591M3 12h2.25M18.75 12H21M5.636 18.364l1.591-1.591M16.773 7.227l1.591-1.591M15.75 12A3.75 3.75 0 1 1 8.25 12a3.75 3.75 0 0 1 7.5 0Z"
          />
        </svg>
      ) : (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"
          />
        </svg>
      )}
      {showLabel && (
        <span className="text-xs font-medium uppercase tracking-[0.18em]">
          {t(theme)}
        </span>
      )}
    </button>
  );
}
