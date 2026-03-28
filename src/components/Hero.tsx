"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

const DEFAULT_HERO = "/portfolio_pictures/Wedding/W7.jpeg";

type Props = {
  heroImageUrl?: string | null;
};

export default function Hero({ heroImageUrl }: Props) {
  const t = useTranslations();
  const src = heroImageUrl?.trim() || DEFAULT_HERO;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Dark overlay for contrast */}
      <div
        className="absolute inset-0 z-10"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, var(--hero-overlay-from), var(--hero-overlay-via), var(--hero-overlay-to))",
        }}
      />

      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src={src}
          alt=""
          fill
          className="object-cover object-center"
          priority
          quality={88}
          sizes="100vw"
        />
      </div>

      <div className="relative z-20 mx-auto max-w-7xl px-6 text-center">
        <p
          className="font-[family-name:var(--font-playfair)] text-[var(--hero-badge)] tracking-[0.4em] uppercase text-sm mb-4 animate-fade-in"
          style={{ textShadow: "var(--hero-text-shadow)" }}
        >
          {t("hero.badge")}
        </p>
        <h1
          className="font-[family-name:var(--font-playfair)] text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-medium tracking-tight text-[var(--hero-heading)] mb-6 animate-fade-in-up"
          style={{ textShadow: "var(--hero-text-shadow)" }}
        >
          {t("brand")}
        </h1>
        <div className="divider-gold w-32 mx-auto mb-8" />
        <p
          className="font-[family-name:var(--font-cormorant)] text-xl sm:text-2xl text-[var(--hero-copy)] max-w-2xl mx-auto mb-12 font-light animate-fade-in-up animation-delay-200"
          style={{ textShadow: "var(--hero-text-shadow)" }}
        >
          {t("hero.tagline")}
        </p>
        <a
          href="#contact"
          className="inline-block px-10 py-4 border text-[var(--hero-button-text)] font-medium tracking-[0.2em] uppercase text-sm transition-all duration-500 animate-fade-in-up animation-delay-300 hover:bg-[var(--gold)] hover:text-[var(--background)]"
          style={{
            borderColor: "var(--hero-button-border)",
            backgroundColor: "var(--hero-button-bg)",
            textShadow: "var(--hero-text-shadow)",
            boxShadow: "var(--hero-text-shadow)",
          }}
        >
          {t("hero.cta")}
        </a>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce-slow">
        <div className="w-px h-12 bg-gradient-to-b from-[var(--gold)] to-transparent opacity-60" />
      </div>
    </section>
  );
}
