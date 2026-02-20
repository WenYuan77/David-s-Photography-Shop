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

export const metadata: Metadata = {
  title: "Final Stage | Professional Photography",
  description:
    "Where moments become masterpieces. Professional photography studio specializing in weddings, portraits, and commercial work.",
  keywords: ["photography", "Final Stage", "wedding photography", "portrait", "Seattle"],
  openGraph: {
    title: "Final Stage | Professional Photography",
    description: "Where moments become masterpieces.",
  },
};

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
