import { uploadPortfolioAction } from "./actions";

type Category = { id: string; label: string };

export default function UploadForm({
  categories,
  activeFilter,
  defaultCategoryId,
}: {
  categories: Category[];
  activeFilter: string;
  defaultCategoryId: string;
}) {
  return (
    <form
      action={uploadPortfolioAction}
      encType="multipart/form-data"
      className="flex flex-col sm:flex-row gap-4 items-start flex-wrap"
    >
      <input type="hidden" name="filter" value={activeFilter} />
      <input
        type="file"
        name="file"
        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
        required
        className="block text-sm text-[var(--foreground)] file:mr-3 file:py-2 file:px-4 file:rounded-none file:border file:border-[var(--gold)] file:bg-transparent file:text-[var(--gold)] file:text-sm file:font-medium file:tracking-wider file:uppercase file:cursor-pointer file:hover:bg-[var(--gold)] file:hover:text-[var(--background)] file:transition-colors cursor-pointer"
      />
      <select
        name="category_id"
        required
        defaultValue={defaultCategoryId}
        className="px-4 py-2 bg-transparent border border-[var(--border)] text-[var(--foreground)] cursor-pointer"
      >
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.label}
          </option>
        ))}
      </select>
      <input
        type="text"
        name="alt"
        placeholder="Alt text (optional)"
        className="flex-1 min-w-0 px-4 py-2 bg-transparent border border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--muted)]"
      />
      <button
        type="submit"
        className="shrink-0 py-2 px-6 border border-[var(--gold)] text-[var(--gold)] text-sm font-medium tracking-wider uppercase cursor-pointer hover:bg-[var(--gold)] hover:text-[var(--background)] transition-colors"
      >
        Upload
      </button>
    </form>
  );
}
