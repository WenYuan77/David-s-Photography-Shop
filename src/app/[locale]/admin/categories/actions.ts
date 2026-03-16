"use server";

import { revalidatePath } from "next/cache";
import { createServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/auth";

function slugFrom(s: string): string {
  return s.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "");
}

export async function addCategoryAction(
  _prev: { error?: string } | null,
  formData: FormData
): Promise<{ error?: string }> {
  if (!(await isAdmin())) return { error: "Unauthorized" };
  if (!isSupabaseConfigured()) return { error: "Supabase not configured" };

  const singleLabel = String(formData.get("label") ?? "").trim();
  const localeRaw = String(formData.get("locale") ?? "en").trim();
  const locale = ["en", "zh", "th", "es"].includes(localeRaw) ? localeRaw : "en";

  if (!singleLabel) return { error: "Category name is required" };

  const { fillCategoryLabelsFromOne } = await import("@/lib/translate");
  const labels = await fillCategoryLabelsFromOne(singleLabel, locale as "en" | "zh" | "th" | "es");
  const finalLabel = labels.label_en ?? labels.label_zh ?? labels.label_th ?? labels.label_es ?? singleLabel;
  let slug = slugFrom(labels.label_en ?? labels.label_zh ?? labels.label_th ?? labels.label_es ?? singleLabel);
  if (!slug) slug = "cat-" + Date.now();

  try {
    const supabase = createServerClient();
    const { data: maxOrder } = await supabase
      .from("categories")
      .select("sort_order")
      .order("sort_order", { ascending: false })
      .limit(1)
      .single();

    const sort_order = (maxOrder?.sort_order ?? 0) + 1;
    const { error } = await supabase
      .from("categories")
      .insert({
        id: slug,
        label: finalLabel,
        label_en: labels.label_en,
        label_zh: labels.label_zh,
        label_th: labels.label_th,
        label_es: labels.label_es,
        sort_order,
      });

    if (error) {
      if (error.code === "23505") return { error: "Category already exists" };
      return { error: error.message };
    }
    revalidatePath(`/${locale}/admin`);
    revalidatePath(`/${locale}/admin/categories`);
    revalidatePath("/");
    return {};
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed" };
  }
}
