import Image from "next/image";
import { getTranslations } from "next-intl/server";

export default async function About() {
  const t = await getTranslations("about");
  return (
    <section id="about" className="scroll-mt-24 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div>
            <p className="text-[var(--gold)] tracking-[0.3em] uppercase text-sm mb-6">
              {t("heading")}
            </p>
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-medium text-[var(--heading)] mb-8 leading-tight">
              {t("title")}
              <br />
              <span className="text-[var(--muted)]">{t("titleMuted")}</span>
            </h2>
            <div className="space-y-6 text-[var(--muted)] font-[family-name:var(--font-cormorant)] text-lg leading-relaxed">
              <p>{t("p1")}</p>
              <p>{t("p2")}</p>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/5] relative overflow-hidden">
              <Image
                src="/portfolio_pictures/Engagement/Couple3.jpeg"
                alt=""
                fill
                className="object-cover object-center"
                loading="lazy"
                quality={88}
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 border border-[var(--gold)]/30 m-6 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
