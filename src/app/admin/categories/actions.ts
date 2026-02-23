"use server";

import { revalidatePath } from "next/cache";
import { createServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/auth";

export async function addCategoryAction(
  _prev: { error?: string } | null,
  formData: FormData
): Promise<{ error?: string }> {
  if (!(await isAdmin())) return { error: "Unauthorized" };
  if (!isSupabaseConfigured()) return { error: "Supabase not configured" };

  const label = String(formData.get("label") ?? "").trim();
  if (!label) return { error: "Label is required" };

  const slug = label.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "");
  if (!slug) return { error: "Invalid category name" };

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
      .insert({ id: slug, label, sort_order });

    if (error) {
      if (error.code === "23505") return { error: "Category already exists" };
      return { error: error.message };
    }
    revalidatePath("/admin");
    revalidatePath("/admin/categories");
    revalidatePath("/");
    return {};
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed" };
  }
}
