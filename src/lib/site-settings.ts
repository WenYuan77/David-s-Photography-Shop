import { createServerClient, isSupabaseConfigured } from "./supabase/server";

const DEFAULTS = {
  phone: "(206) 206-9868",
  email: "pictureyour2day@gmail.com",
  seo_title: "Final Stage | Professional Photography",
  seo_description:
    "Where moments become masterpieces. Professional photography studio specializing in weddings, portraits, and commercial work.",
  seo_keywords: ["photography", "Final Stage", "wedding photography", "portrait", "Seattle"],
};

export type SiteSettings = {
  phone: string;
  email: string;
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
      .select("phone, email, seo_title, seo_description, seo_keywords")
      .limit(1)
      .single();

    return {
      phone: data?.phone ?? DEFAULTS.phone,
      email: data?.email ?? DEFAULTS.email,
      seo_title: data?.seo_title ?? DEFAULTS.seo_title,
      seo_description: data?.seo_description ?? DEFAULTS.seo_description,
      seo_keywords: Array.isArray(data?.seo_keywords) ? data.seo_keywords : DEFAULTS.seo_keywords,
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
      .select("phone, email")
      .limit(1)
      .single();

    return {
      phone: data?.phone ?? DEFAULTS.phone,
      email: data?.email ?? DEFAULTS.email,
    };
  } catch {
    return DEFAULTS;
  }
}
