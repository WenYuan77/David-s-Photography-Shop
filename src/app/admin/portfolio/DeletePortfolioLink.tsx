import Link from "next/link";

/** Plain link, navigates to confirm-delete page. No JavaScript required. */
export default function DeletePortfolioLink({
  imageId,
  activeFilter,
}: {
  imageId: string;
  activeFilter: string;
}) {
  const href =
    activeFilter && activeFilter !== "All"
      ? `/admin/portfolio/confirm-delete?id=${encodeURIComponent(imageId)}&filter=${encodeURIComponent(activeFilter)}`
      : `/admin/portfolio/confirm-delete?id=${encodeURIComponent(imageId)}`;

  return (
    <Link
      href={href}
      className="text-xs text-[var(--accent-red)] hover:underline cursor-pointer"
    >
      Delete
    </Link>
  );
}
