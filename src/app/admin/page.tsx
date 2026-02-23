import { getPortfolioData } from "@/lib/portfolio-data";
import { getSiteSettings } from "@/lib/site-settings";

export default async function AdminDashboardPage() {
  const [{ categories, images }, siteSettings] = await Promise.all([
    getPortfolioData(),
    getSiteSettings(),
  ]);

  const categoriesWithoutAll = categories.filter((c) => c.id !== "All");

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="font-[family-name:var(--font-playfair)] text-3xl text-[var(--gold)] tracking-[0.2em] uppercase mb-12">
        Dashboard
      </h1>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <section className="p-6 border border-[var(--border)] bg-[#0d0d0d]">
          <h2 className="font-[family-name:var(--font-playfair)] text-lg text-white mb-4 tracking-wide">
            Site Settings
          </h2>
          <p className="text-[var(--muted)] text-sm mb-4">
            Phone, email, and SEO metadata.
          </p>
          <p className="text-[var(--muted)] text-xs mb-4">
            {siteSettings.phone || "—"} / {siteSettings.email || "—"}
          </p>
          <a
            href="/admin/settings"
            className="inline-block py-2 px-4 border border-[var(--gold)] text-[var(--gold)] text-sm tracking-[0.15em] uppercase hover:bg-[var(--gold)] hover:text-[var(--background)] transition-colors cursor-pointer"
          >
            Edit
          </a>
        </section>

        <section className="p-6 border border-[var(--border)] bg-[#0d0d0d]">
          <h2 className="font-[family-name:var(--font-playfair)] text-lg text-white mb-4 tracking-wide">
            Categories
          </h2>
          <p className="text-[var(--muted)] text-sm mb-4">
            {categoriesWithoutAll.length} portfolio categories
          </p>
          <a
            href="/admin/categories"
            className="inline-block py-2 px-4 border border-[var(--gold)] text-[var(--gold)] text-sm tracking-[0.15em] uppercase hover:bg-[var(--gold)] hover:text-[var(--background)] transition-colors cursor-pointer"
          >
            Manage
          </a>
        </section>

        <section className="p-6 border border-[var(--border)] bg-[#0d0d0d]">
          <h2 className="font-[family-name:var(--font-playfair)] text-lg text-white mb-4 tracking-wide">
            Portfolio
          </h2>
          <p className="text-[var(--muted)] text-sm mb-4">
            {images.length} images
          </p>
          <a
            href="/admin/portfolio"
            className="inline-block py-2 px-4 border border-[var(--gold)] text-[var(--gold)] text-sm tracking-[0.15em] uppercase hover:bg-[var(--gold)] hover:text-[var(--background)] transition-colors cursor-pointer"
          >
            Manage
          </a>
        </section>
      </div>
    </div>
  );
}
