import Link from "next/link";
import { getTranslations } from "next-intl/server";

export const dynamic = "force-dynamic";

export default async function ConfirmDeletePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ id?: string; filter?: string }>;
}) {
  const { locale } = await params;
  const { id, filter } = await searchParams;
  const t = await getTranslations("admin.confirmDelete");
  const portfolioUrl =
    filter && filter !== "All"
      ? `/${locale}/admin/portfolio?filter=${encodeURIComponent(filter)}`
      : `/${locale}/admin/portfolio`;

  if (!id) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-12">
        <p className="text-[var(--accent-red)] mb-4">{t("missingId")}</p>
        <Link href={portfolioUrl} className="text-[var(--gold)] hover:underline">
          {t("backToPortfolio")}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="font-[family-name:var(--font-playfair)] text-2xl text-[var(--gold)] tracking-[0.2em] uppercase mb-8">
        {t("title")}
      </h1>
      <p className="text-[var(--foreground)] mb-6">{t("message")}</p>
      <div className="flex gap-4">
        <form action="/api/portfolio/delete-form" method="POST" className="inline">
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="filter" value={filter ?? ""} />
          <input type="hidden" name="locale" value={locale} />
          <button
            type="submit"
            className="px-6 py-2 border border-[var(--accent-red)] text-[var(--accent-red)] text-sm font-medium tracking-wider uppercase cursor-pointer hover:bg-[var(--accent-red)] hover:text-[var(--accent-contrast)] transition-colors"
          >
            {t("confirm")}
          </button>
        </form>
        <Link
          href={portfolioUrl}
          className="px-6 py-2 border border-[var(--border)] text-[var(--foreground)] text-sm font-medium tracking-wider uppercase hover:bg-[var(--border)] transition-colors inline-block"
        >
          {t("cancel")}
        </Link>
      </div>
    </div>
  );
}
