import { unstable_noStore } from "next/cache";
import { createServerClient, isSupabaseConfigured } from "./supabase/server";

const LOCALES = ["en", "zh", "th", "es"] as const;
type Locale = (typeof LOCALES)[number];

function isLocale(s: string): s is Locale {
  return LOCALES.includes(s as Locale);
}

const DEFAULT_CATEGORIES = [
  { id: "Wedding", label: "Wedding" },
  { id: "Engagement", label: "Engagement" },
  { id: "Family-Children", label: "Family & Children" },
  { id: "Portrait", label: "Portrait" },
  { id: "Pets", label: "Pets" },
  { id: "Automotive", label: "Automotive" },
  { id: "Events", label: "Events" },
];

export type PortfolioCategory = { id: string; label: string };

/** Category row with all locale labels for admin edit form */
export type CategoryWithLabels = PortfolioCategory & {
  label_en?: string | null;
  label_zh?: string | null;
  label_th?: string | null;
  label_es?: string | null;
  sort_order?: number;
};

export type PortfolioImage = { id: string; category: string; src: string; alt: string };

function pickLabel(
  row: { id?: string; label?: string | null; label_en?: string | null; label_zh?: string | null; label_th?: string | null; label_es?: string | null },
  locale: string
): string {
  if (isLocale(locale)) {
    const v = row[`label_${locale}`];
    if (v != null && v !== "") return v;
  }
  if (row.label_en != null && row.label_en !== "") return row.label_en;
  if (row.label != null && row.label !== "") return row.label;
  return row.id ?? "";
}

/**
 * Returns categories and images. Categories have `label` for the given locale.
 * Does NOT include "All"; caller should prepend it with a translated "All" if needed.
 */
export async function getPortfolioData(locale: string = "en"): Promise<{
  categories: PortfolioCategory[];
  images: PortfolioImage[];
}> {
  unstable_noStore();
  if (!isSupabaseConfigured()) {
    return {
      categories: DEFAULT_CATEGORIES.map((c) => ({ id: c.id, label: c.label })),
      images: [],
    };
  }
  try {
    const supabase = createServerClient();
    const [catRes, imgRes] = await Promise.all([
      supabase
        .from("categories")
        .select("id, label, label_en, label_zh, label_th, label_es")
        .order("sort_order", { ascending: true }),
      supabase.from("portfolio_images").select("*").order("sort_order").order("created_at"),
    ]);
    const categories: PortfolioCategory[] = (catRes.data ?? []).map((c: Record<string, unknown>) => ({
      id: String(c.id),
      label: pickLabel(c as Record<string, string | null>, locale),
    }));
    const images: PortfolioImage[] = (imgRes.data ?? []).map(
      (row: { id: string; category_id?: string; category?: string; src: string; alt?: string }) => ({
        id: row.id,
        category: String(row.category_id ?? row.category ?? "").trim(),
        src: row.src,
        alt: row.alt ?? "",
      })
    );
    return { categories, images };
  } catch {
    return {
      categories: DEFAULT_CATEGORIES.map((c) => ({ id: c.id, label: c.label })),
      images: [],
    };
  }
}

/**
 * Returns categories with all locale label fields for admin (list + edit form).
 * Each category has `label` = display name for the given locale.
 */
export async function getCategoriesForAdmin(locale: string = "en"): Promise<CategoryWithLabels[]> {
  unstable_noStore();
  if (!isSupabaseConfigured()) {
    return DEFAULT_CATEGORIES.map((c) => ({
      id: c.id,
      label: c.label,
      label_en: c.label,
      label_zh: null,
      label_th: null,
      label_es: null,
      sort_order: 0,
    }));
  }
  try {
    const supabase = createServerClient();
    const { data } = await supabase
      .from("categories")
      .select("id, label, label_en, label_zh, label_th, label_es, sort_order")
      .order("sort_order", { ascending: true });
    return (data ?? []).map((c: Record<string, unknown>) => {
      const row = c as Record<string, string | number | null | undefined>;
      const label = pickLabel(row, locale);
      const str = (v: string | number | null | undefined): string | null =>
        v == null ? null : String(v).trim() || null;
      return {
        id: String(row.id),
        label,
        label_en: str(row.label_en),
        label_zh: str(row.label_zh),
        label_th: str(row.label_th),
        label_es: str(row.label_es),
        sort_order: typeof row.sort_order === "number" ? row.sort_order : 0,
      };
    });
  } catch {
    return DEFAULT_CATEGORIES.map((c) => ({
      id: c.id,
      label: c.label,
      label_en: c.label,
      label_zh: null,
      label_th: null,
      label_es: null,
      sort_order: 0,
    }));
  }
}
