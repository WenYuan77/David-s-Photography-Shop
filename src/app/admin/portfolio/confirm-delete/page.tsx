import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ConfirmDeletePage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; filter?: string }>;
}) {
  const { id, filter } = await searchParams;
  const portfolioUrl =
    filter && filter !== "All"
      ? `/admin/portfolio?filter=${encodeURIComponent(filter)}`
      : "/admin/portfolio";

  if (!id) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-12">
        <p className="text-[var(--accent-red)] mb-4">Missing image ID.</p>
        <Link href={portfolioUrl} className="text-[var(--gold)] hover:underline">
          Back to Portfolio
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="font-[family-name:var(--font-playfair)] text-2xl text-[var(--gold)] tracking-[0.2em] uppercase mb-8">
        Confirm Delete
      </h1>
      <p className="text-[var(--foreground)] mb-6">Are you sure you want to delete this image?</p>
      <div className="flex gap-4">
        <form action="/api/portfolio/delete-form" method="POST" className="inline">
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="filter" value={filter ?? ""} />
          <button
            type="submit"
            className="px-6 py-2 border border-[var(--accent-red)] text-[var(--accent-red)] text-sm font-medium tracking-wider uppercase cursor-pointer hover:bg-[var(--accent-red)] hover:text-white transition-colors"
          >
            Confirm Delete
          </button>
        </form>
        <Link
          href={portfolioUrl}
          className="px-6 py-2 border border-[var(--border)] text-[var(--foreground)] text-sm font-medium tracking-wider uppercase hover:bg-[var(--border)] transition-colors inline-block"
        >
          Cancel
        </Link>
      </div>
    </div>
  );
}
