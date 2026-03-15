import type { Metadata } from "next";
import { setRequestLocale, getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";

const defaultMetadata = {
  title: "Final Stage | Professional Photography",
  description:
    "Where moments become masterpieces. Professional photography studio specializing in weddings, portraits, and commercial work.",
  keywords: ["photography", "Final Stage", "wedding photography", "portrait", "Seattle"],
};

export async function generateMetadata(): Promise<Metadata> {
  try {
    const { createServerClient } = await import("@/lib/supabase/server");
    const supabase = createServerClient();
    const { data } = await supabase.from("site_settings").select("*").limit(1).single();
    if (data) {
      return {
        title: data.seo_title || defaultMetadata.title,
        description: data.seo_description || defaultMetadata.description,
        keywords: Array.isArray(data.seo_keywords) ? data.seo_keywords : defaultMetadata.keywords,
        openGraph: {
          title: data.seo_title || defaultMetadata.title,
          description: data.seo_description || defaultMetadata.description,
        },
      };
    }
  } catch {
    // Fall through to defaults
  }
  return {
    title: defaultMetadata.title,
    description: defaultMetadata.description,
    keywords: defaultMetadata.keywords,
    openGraph: {
      title: defaultMetadata.title,
      description: defaultMetadata.description,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages();
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div className="min-h-full">{children}</div>
    </NextIntlClientProvider>
  );
}
