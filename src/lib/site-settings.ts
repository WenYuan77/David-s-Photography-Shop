import { createServerClient, isSupabaseConfigured } from "./supabase/server";

const DEFAULTS = {
  phone: "(206) 206-9868",
  email: "pictureyour2day@gmail.com",
  seo_title: "Final Stage | Professional Photography",
  seo_description:
    "Where moments become masterpieces. Professional photography studio specializing in weddings, portraits, and commercial work.",
  seo_keywords: ["photography", "Final Stage", "wedding photography", "portrait", "Seattle"],
  intro_video_url: "",
  proposal_video_url: "",
  hero_image_url: "",
};

export type SiteSettings = {
  phone: string;
  email: string;
  intro_video_url: string;
  proposal_video_url: string;
  hero_image_url: string;
};

export type SiteSettingsFull = SiteSettings & {
  seo_title: string;
  seo_description: string;
  seo_keywords: string[];
};

export async function getSiteSettingsFull(): Promise<SiteSettingsFull> {
  if (!isSupabaseConfigured()) {
    return DEFAULTS;
  }
  try {
    const supabase = createServerClient();
    const { data } = await supabase
      .from("site_settings")
      .select("phone, email, seo_title, seo_description, seo_keywords, intro_video_url, proposal_video_url, hero_image_url")
      .limit(1)
      .single();

    return {
      phone: data?.phone ?? DEFAULTS.phone,
      email: data?.email ?? DEFAULTS.email,
      seo_title: data?.seo_title ?? DEFAULTS.seo_title,
      seo_description: data?.seo_description ?? DEFAULTS.seo_description,
      seo_keywords: Array.isArray(data?.seo_keywords) ? data.seo_keywords : DEFAULTS.seo_keywords,
      intro_video_url: data?.intro_video_url ?? DEFAULTS.intro_video_url,
      proposal_video_url: data?.proposal_video_url ?? DEFAULTS.proposal_video_url,
      hero_image_url: data?.hero_image_url ?? DEFAULTS.hero_image_url,
    };
  } catch {
    return DEFAULTS;
  }
}

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!isSupabaseConfigured()) {
    return DEFAULTS;
  }
  try {
    const supabase = createServerClient();
    const { data } = await supabase
      .from("site_settings")
      .select("phone, email, intro_video_url, proposal_video_url, hero_image_url")
      .limit(1)
      .single();

    return {
      phone: data?.phone ?? DEFAULTS.phone,
      email: data?.email ?? DEFAULTS.email,
      intro_video_url: data?.intro_video_url ?? DEFAULTS.intro_video_url,
      proposal_video_url: data?.proposal_video_url ?? DEFAULTS.proposal_video_url,
      hero_image_url: data?.hero_image_url ?? DEFAULTS.hero_image_url,
    };
  } catch {
    return DEFAULTS;
  }
}
