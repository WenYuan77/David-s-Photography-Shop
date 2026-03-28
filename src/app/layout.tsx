import { getLocale } from "next-intl/server";
import { Playfair_Display, Cormorant_Garamond, Noto_Sans_SC, Noto_Sans_Thai } from "next/font/google";
import "./globals.css";
import { themeInitScript } from "@/lib/theme-script";

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

const notoSansSC = Noto_Sans_SC({
  variable: "--font-cjk",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const notoSansThai = Noto_Sans_Thai({
  variable: "--font-thai",
  subsets: ["latin", "thai"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const fontExtra =
    locale === "zh" ? notoSansSC.variable : locale === "th" ? notoSansThai.variable : "";
  return (
    <html lang={locale} className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body
        className={`${playfair.variable} ${cormorant.variable} ${fontExtra} antialiased bg-[var(--background)] text-[var(--foreground)]`}
      >
        {children}
      </body>
    </html>
  );
}
