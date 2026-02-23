import { unstable_noStore } from "next/cache";
import { createServerClient, isSupabaseConfigured } from "./supabase/server";

const DEFAULT_CATEGORIES = [
  { id: "All", label: "All" },
  { id: "Wedding", label: "Wedding" },
  { id: "Engagement", label: "Engagement" },
  { id: "Family-Children", label: "Family & Children" },
  { id: "Portrait", label: "Portrait" },
  { id: "Pets", label: "Pets" },
  { id: "Automotive", label: "Automotive" },
  { id: "Events", label: "Events" },
];

export type PortfolioCategory = { id: string; label: string };
export type PortfolioImage = { id: string; category: string; src: string; alt: string };

export async function getPortfolioData(): Promise<{
  categories: PortfolioCategory[];
  images: PortfolioImage[];
}> {
  unstable_noStore();
  if (!isSupabaseConfigured()) {
    return { categories: DEFAULT_CATEGORIES, images: [] };
  }
  try {
    const supabase = createServerClient();
    const [catRes, imgRes] = await Promise.all([
      supabase.from("categories").select("id, label").order("sort_order", { ascending: true }),
      supabase.from("portfolio_images").select("*").order("sort_order").order("created_at"),
    ]);
    const categories: PortfolioCategory[] = [
      { id: "All", label: "All" },
      ...(catRes.data ?? []).map((c) => ({ id: c.id, label: c.label })),
    ];
    const images: PortfolioImage[] = (imgRes.data ?? []).map((row: { id: string; category_id?: string; category?: string; src: string; alt?: string }) => ({
      id: row.id,
      category: String(row.category_id ?? row.category ?? "").trim(),
      src: row.src,
      alt: row.alt ?? "",
    }));
    return { categories, images };
  } catch {
    return { categories: DEFAULT_CATEGORIES, images: [] };
  }
}
