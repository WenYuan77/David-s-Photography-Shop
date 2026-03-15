import type { NextRequest } from "next/server";

const LOCALES = ["en", "zh", "th", "es"];

/** Get locale from Referer (e.g. /en/admin/...) or form body. Defaults to "en". */
export function getAdminLocale(request: NextRequest, formLocale?: string | null): string {
  if (formLocale && LOCALES.includes(formLocale)) return formLocale;
  const referer = request.headers.get("referer");
  if (!referer) return "en";
  try {
    const segment = new URL(referer).pathname.split("/")[1];
    return segment && LOCALES.includes(segment) ? segment : "en";
  } catch {
    return "en";
  }
}
