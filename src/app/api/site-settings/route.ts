import { NextResponse } from "next/server";
import { createServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/auth";

const DEFAULTS = {
  phone: "(206) 206-9868",
  email: "pictureyour2day@gmail.com",
  seo_title: "Final Stage | Professional Photography",
  seo_description:
    "Where moments become masterpieces. Professional photography studio specializing in weddings, portraits, and commercial work.",
  seo_keywords: ["photography", "Final Stage", "wedding photography", "portrait", "Seattle"],
};

export async function GET() {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(DEFAULTS);
    }
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .limit(1)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("site-settings get error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data ?? DEFAULTS);
  } catch (err) {
    console.error("site-settings get error:", err);
    return NextResponse.json({ error: "Failed to fetch site settings" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const ok = await isAdmin();
  if (!ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  try {
    const body = await request.json();
    const { phone, email, seo_title, seo_description, seo_keywords, intro_video_url, proposal_video_url, intro_video_autoplay, proposal_video_autoplay, autoplay_customized } = body;

    const supabase = createServerClient();

    const { data: existing } = await supabase.from("site_settings").select("id").limit(1).single();

    const payload: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };
    if (phone !== undefined) payload.phone = phone;
    if (email !== undefined) payload.email = email;
    if (seo_title !== undefined) payload.seo_title = seo_title;
    if (seo_description !== undefined) payload.seo_description = seo_description;
    if (seo_keywords !== undefined) payload.seo_keywords = seo_keywords;
    if (intro_video_url !== undefined) payload.intro_video_url = intro_video_url;
    if (proposal_video_url !== undefined) payload.proposal_video_url = proposal_video_url;
    if (intro_video_autoplay !== undefined) payload.intro_video_autoplay = intro_video_autoplay;
    if (proposal_video_autoplay !== undefined) payload.proposal_video_autoplay = proposal_video_autoplay;
    if (autoplay_customized !== undefined) payload.autoplay_customized = autoplay_customized;

    let result;
    if (existing) {
      const { data, error } = await supabase
        .from("site_settings")
        .update(payload)
        .eq("id", existing.id)
        .select()
        .single();
      if (error) throw error;
      result = data;
    } else {
      const { data, error } = await supabase.from("site_settings").insert(payload).select().single();
      if (error) throw error;
      result = data;
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error("site-settings put error:", err);
    return NextResponse.json({ error: "Failed to update site settings" }, { status: 500 });
  }
}
