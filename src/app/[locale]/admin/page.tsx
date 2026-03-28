import { getPortfolioData } from "@/lib/portfolio-data";
import { getSiteSettings } from "@/lib/site-settings";
import { getTranslations } from "next-intl/server";

export default async function AdminDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("admin.dashboard");
  const [{ categories, images }, siteSettings] = await Promise.all([
    getPortfolioData(locale),
    getSiteSettings(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="font-[family-name:var(--font-playfair)] text-3xl text-[var(--gold)] tracking-[0.2em] uppercase mb-12">
        {t("title")}
      </h1>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <section className="surface-card p-6 border">
          <h2 className="font-[family-name:var(--font-playfair)] text-lg text-[var(--heading)] mb-4 tracking-wide">
            {t("siteSettings")}
          </h2>
          <p className="text-[var(--muted)] text-sm mb-4">
            {t("siteSettingsDesc")}
          </p>
          <p className="text-[var(--muted)] text-xs mb-4">
            {siteSettings.phone || "—"} / {siteSettings.email || "—"}
          </p>
          <a
            href={`/${locale}/admin/settings`}
            className="inline-block py-2 px-4 border border-[var(--gold)] text-[var(--gold)] text-sm tracking-[0.15em] uppercase hover:bg-[var(--gold)] hover:text-[var(--background)] transition-colors cursor-pointer"
          >
            {t("edit")}
          </a>
        </section>

        <section className="surface-card p-6 border">
          <h2 className="font-[family-name:var(--font-playfair)] text-lg text-[var(--heading)] mb-4 tracking-wide">
            {t("categories")}
          </h2>
          <p className="text-[var(--muted)] text-sm mb-4">
            {t("categoriesCount", { count: categories.length })}
          </p>
          <a
            href={`/${locale}/admin/categories`}
            className="inline-block py-2 px-4 border border-[var(--gold)] text-[var(--gold)] text-sm tracking-[0.15em] uppercase hover:bg-[var(--gold)] hover:text-[var(--background)] transition-colors cursor-pointer"
          >
            {t("manage")}
          </a>
        </section>

        <section className="surface-card p-6 border">
          <h2 className="font-[family-name:var(--font-playfair)] text-lg text-[var(--heading)] mb-4 tracking-wide">
            {t("portfolio")}
          </h2>
          <p className="text-[var(--muted)] text-sm mb-4">
            {t("portfolioCount", { count: images.length })}
          </p>
          <a
            href={`/${locale}/admin/portfolio`}
            className="inline-block py-2 px-4 border border-[var(--gold)] text-[var(--gold)] text-sm tracking-[0.15em] uppercase hover:bg-[var(--gold)] hover:text-[var(--background)] transition-colors cursor-pointer"
          >
            {t("manage")}
          </a>
        </section>
      </div>
    </div>
  );
}
