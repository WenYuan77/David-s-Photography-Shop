"use server";

import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { revalidatePath } from "next/cache";
import { createServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/auth";

const BUCKET = "portfolio";
const HERO_PATH = "site/hero";
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export type SaveSiteSettingsResult =
  | { success: true; intro_video_autoplay: boolean; proposal_video_autoplay: boolean }
  | { success: false; error: string };

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
    const intro_video_url = String(formData.get("intro_video_url") ?? "").trim();
    const proposal_video_url = String(formData.get("proposal_video_url") ?? "").trim();
    // Radio value: "intro" | "proposal" | "none" – single source of truth
    const autoplayChoice = String(formData.get("autoplay_choice") ?? "none").trim();
    const intro_video_autoplay = autoplayChoice === "intro";
    const proposal_video_autoplay = autoplayChoice === "proposal";

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
      intro_video_url,
      proposal_video_url,
      intro_video_autoplay,
      proposal_video_autoplay,
      autoplay_customized: true,
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
    revalidatePath("/");

    return {
      success: true,
      intro_video_autoplay,
      proposal_video_autoplay,
    };
  } catch (err) {
    console.error("site-settings save error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Save failed",
    };
  }
}

export async function uploadHeroImageAction(formData: FormData) {
  if (!(await isAdmin())) {
    redirect("/admin/login");
  }
  if (!isSupabaseConfigured()) {
    redirect("/admin/settings?error=config");
  }

  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) {
    redirect("/admin/settings?error=no-file");
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    redirect("/admin/settings?error=invalid-type");
  }
  if (file.size > MAX_SIZE) {
    redirect("/admin/settings?error=file-too-large");
  }

  try {
    const supabase = createServerClient();
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${HERO_PATH}.${ext}`;

    const buffer = await file.arrayBuffer();
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error("hero upload error:", uploadError);
      redirect("/admin/settings?error=upload-failed");
    }

    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);
    const hero_image_url = urlData.publicUrl;

    const { data: existing } = await supabase
      .from("site_settings")
      .select("id")
      .limit(1)
      .single();

    if (existing?.id) {
      await supabase
        .from("site_settings")
        .update({ hero_image_url, updated_at: new Date().toISOString() })
        .eq("id", existing.id);
    } else {
      await supabase.from("site_settings").insert({ hero_image_url });
    }

    revalidatePath("/admin/settings");
    revalidatePath("/");
    redirect("/admin/settings");
  } catch (err) {
    if (isRedirectError(err)) throw err;
    console.error("hero upload error:", err);
    redirect("/admin/settings?error=failed");
  }
}
