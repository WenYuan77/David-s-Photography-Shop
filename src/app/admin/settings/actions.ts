"use server";

import { revalidatePath } from "next/cache";
import { createServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/auth";

export type SaveSiteSettingsResult = { success: true } | { success: false; error: string };

export async function saveSiteSettings(
  _prev: SaveSiteSettingsResult | null,
  formData: FormData
): Promise<SaveSiteSettingsResult> {
  const ok = await isAdmin();
  if (!ok) {
    return { success: false, error: "Unauthorized" };
  }
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Supabase not configured" };
  }

  try {
    const phone = String(formData.get("phone") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const seo_title = String(formData.get("seo_title") ?? "").trim();
    const seo_description = String(formData.get("seo_description") ?? "").trim();
    const keywordsStr = String(formData.get("seo_keywords") ?? "").trim();
    const seo_keywords = keywordsStr
      ? keywordsStr.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    const supabase = createServerClient();
    const { data: existing } = await supabase
      .from("site_settings")
      .select("id")
      .limit(1)
      .single();

    const payload: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
      phone,
      email,
      seo_title,
      seo_description,
      seo_keywords,
    };

    if (existing?.id) {
      const { error } = await supabase
        .from("site_settings")
        .update(payload)
        .eq("id", existing.id);
      if (error) {
        console.error("site-settings update error:", error);
        return { success: false, error: error.message };
      }
    } else {
      const { error } = await supabase.from("site_settings").insert(payload);
      if (error) {
        console.error("site-settings insert error:", error);
        return { success: false, error: error.message };
      }
    }

    revalidatePath("/admin");
    revalidatePath("/admin/settings");
    revalidatePath("/");

    return { success: true };
  } catch (err) {
    console.error("site-settings save error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Save failed",
    };
  }
}
