import type { Metadata } from "next";
import { Playfair_Display, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

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
    // Fall through to defaults (e.g. Supabase not configured yet)
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${playfair.variable} ${cormorant.variable} antialiased bg-[var(--background)] text-[var(--foreground)]`}
      >
        {children}
      </body>
    </html>
  );
}
