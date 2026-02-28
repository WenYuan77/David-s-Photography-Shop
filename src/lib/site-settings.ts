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
  intro_video_autoplay: false,
  proposal_video_autoplay: false,
  hero_image_url: "",
};

export type SiteSettings = {
  phone: string;
  email: string;
  intro_video_url: string;
  proposal_video_url: string;
  intro_video_autoplay: boolean;
  proposal_video_autoplay: boolean;
  hero_image_url: string;
};

export type SiteSettingsFull = SiteSettings & {
  seo_title: string;
  seo_description: string;
  seo_keywords: string[];
};

type GetSiteSettingsFullOpts = { forAdmin?: boolean };

export async function getSiteSettingsFull(
  opts?: GetSiteSettingsFullOpts
): Promise<SiteSettingsFull> {
  const forAdmin = opts?.forAdmin ?? false;
  if (!isSupabaseConfigured()) {
    return DEFAULTS;
  }
  try {
    const supabase = createServerClient();
    const { data } = await supabase
      .from("site_settings")
      .select("phone, email, seo_title, seo_description, seo_keywords, intro_video_url, proposal_video_url, intro_video_autoplay, proposal_video_autoplay, autoplay_customized, hero_image_url")
      .limit(1)
      .single();

    const introAutoplay = forAdmin
      ? (data?.intro_video_autoplay ?? DEFAULTS.intro_video_autoplay)
      : (() => {
          const customized = data?.autoplay_customized ?? false;
          if (!customized) return true;
          return data?.intro_video_autoplay ?? DEFAULTS.intro_video_autoplay;
        })();
    const proposalAutoplay = forAdmin
      ? (data?.proposal_video_autoplay ?? DEFAULTS.proposal_video_autoplay)
      : (() => {
          const customized = data?.autoplay_customized ?? false;
          if (!customized) return false;
          return data?.proposal_video_autoplay ?? DEFAULTS.proposal_video_autoplay;
        })();

    return {
      phone: data?.phone ?? DEFAULTS.phone,
      email: data?.email ?? DEFAULTS.email,
      seo_title: data?.seo_title ?? DEFAULTS.seo_title,
      seo_description: data?.seo_description ?? DEFAULTS.seo_description,
      seo_keywords: Array.isArray(data?.seo_keywords) ? data.seo_keywords : DEFAULTS.seo_keywords,
      intro_video_url: data?.intro_video_url ?? DEFAULTS.intro_video_url,
      proposal_video_url: data?.proposal_video_url ?? DEFAULTS.proposal_video_url,
      intro_video_autoplay: introAutoplay,
      proposal_video_autoplay: proposalAutoplay,
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
      .select("phone, email, intro_video_url, proposal_video_url, intro_video_autoplay, proposal_video_autoplay, autoplay_customized, hero_image_url")
      .limit(1)
      .single();

    return {
      phone: data?.phone ?? DEFAULTS.phone,
      email: data?.email ?? DEFAULTS.email,
      intro_video_url: data?.intro_video_url ?? DEFAULTS.intro_video_url,
      proposal_video_url: data?.proposal_video_url ?? DEFAULTS.proposal_video_url,
      intro_video_autoplay: (() => {
        const customized = data?.autoplay_customized ?? false;
        if (!customized) return true;
        return data?.intro_video_autoplay ?? DEFAULTS.intro_video_autoplay;
      })(),
      proposal_video_autoplay: (() => {
        const customized = data?.autoplay_customized ?? false;
        if (!customized) return false;
        return data?.proposal_video_autoplay ?? DEFAULTS.proposal_video_autoplay;
      })(),
      hero_image_url: data?.hero_image_url ?? DEFAULTS.hero_image_url,
    };
  } catch {
    return DEFAULTS;
  }
}
