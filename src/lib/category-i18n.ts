/**
 * Normalize category id from DB (e.g. "Family & Children", "WEDDING") to the
 * message key used in messages/*.json "categories" (e.g. "Family-Children", "Wedding").
 */
export function toCategoryKey(id: string): string {
  const normalized = id.replace(/\s*&\s*/g, "-").replace(/\s+/g, "-").trim();
  return normalized
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join("-");
}
