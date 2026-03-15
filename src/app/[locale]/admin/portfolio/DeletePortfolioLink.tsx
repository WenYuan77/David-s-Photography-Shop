import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

/** Plain link, navigates to confirm-delete page. No JavaScript required. */
export default function DeletePortfolioLink({
  imageId,
  activeFilter,
}: {
  imageId: string;
  activeFilter: string;
}) {
  const locale = useLocale();
  const t = useTranslations("admin.portfolio");
  const base = `/${locale}/admin/portfolio/confirm-delete`;
  const href =
    activeFilter && activeFilter !== "All"
      ? `${base}?id=${encodeURIComponent(imageId)}&filter=${encodeURIComponent(activeFilter)}`
      : `${base}?id=${encodeURIComponent(imageId)}`;

  return (
    <Link
      href={href}
      className="text-xs text-[var(--accent-red)] hover:underline cursor-pointer"
    >
      {t("delete")}
    </Link>
  );
}
