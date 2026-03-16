"use server";

import { revalidatePath } from "next/cache";
import { createServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/auth";
import { fillMissingCategoryLabels } from "@/lib/translate";

function slugFrom(s: string): string {
  return s.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "");
}

export async function addCategoryAction(
  _prev: { error?: string } | null,
  formData: FormData
): Promise<{ error?: string }> {
  if (!(await isAdmin())) return { error: "Unauthorized" };
  if (!isSupabaseConfigured()) return { error: "Supabase not configured" };

  const labels = {
    label_en: String(formData.get("label_en") ?? "").trim() || null,
    label_zh: String(formData.get("label_zh") ?? "").trim() || null,
    label_th: String(formData.get("label_th") ?? "").trim() || null,
    label_es: String(formData.get("label_es") ?? "").trim() || null,
  };

  const label = labels.label_en ?? labels.label_zh ?? labels.label_th ?? labels.label_es;
  if (!label) return { error: "At least one language is required" };

  await fillMissingCategoryLabels(labels);

  const localeRaw = String(formData.get("locale") ?? "en").trim();
  const locale = ["en", "zh", "th", "es"].includes(localeRaw) ? localeRaw : "en";

  const slug = slugFrom(labels.label_en ?? labels.label_zh ?? labels.label_th ?? labels.label_es ?? "");
  if (!slug) return { error: "Invalid category name" };

  const finalLabel = labels.label_en ?? labels.label_zh ?? labels.label_th ?? labels.label_es ?? "";

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
