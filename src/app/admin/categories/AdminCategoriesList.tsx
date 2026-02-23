"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { addCategoryAction } from "./actions";

type Category = { id: string; label: string; sort_order?: number };

export default function AdminCategoriesList({
  initialCategories,
  editId,
  deleteId,
  formError,
}: {
  initialCategories: Category[];
  editId: string | null;
  deleteId: string | null;
  formError: string | null;
}) {
  const router = useRouter();
  const [addState, addFormAction, addPending] = useActionState(addCategoryAction, null);

  useEffect(() => {
    if (addState && !addState.error) router.refresh();
  }, [addState, router]);

  const error = addState?.error ?? formError;

  const editingCat = editId ? initialCategories.find((c) => c.id === editId) : null;
  const deletingCat = deleteId ? initialCategories.find((c) => c.id === deleteId) : null;

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-[family-name:var(--font-playfair)] text-2xl text-[var(--gold)] tracking-[0.2em] uppercase">
          Categories
        </h1>
      </div>

      <form action={addFormAction} className="flex gap-2 mb-6">
        <input
          type="text"
          name="label"
          placeholder="Category name"
          required
          className="flex-1 px-4 py-2 bg-[#0d0d0d] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:border-[var(--gold)]"
        />
        <button
          type="submit"
          disabled={addPending}
          className="px-4 py-2 bg-[var(--gold)] text-[var(--background)] text-sm font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {addPending ? "Adding..." : "Add"}
        </button>
      </form>

      {editingCat && (
        <div className="mb-6 p-4 border border-[var(--gold)] bg-[#0d0d0d]">
          <h2 className="text-lg text-white mb-3">Edit: {editingCat.label}</h2>
          <form action="/api/categories/update-form" method="POST" className="flex gap-2">
            <input type="hidden" name="id" value={editingCat.id} />
            <input
              type="text"
              name="label"
              defaultValue={editingCat.label}
              required
              className="flex-1 px-3 py-2 bg-transparent border border-[var(--border)] text-[var(--foreground)]"
            />
            <button
              type="submit"
              className="px-4 py-2 border border-[var(--gold)] text-[var(--gold)] text-sm cursor-pointer"
            >
              Save
            </button>
          </form>
          <Link
            href="/admin/categories"
            className="inline-block mt-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)]"
          >
            Cancel
          </Link>
        </div>
      )}

      {deletingCat && (
        <div className="mb-6 p-4 border border-[var(--accent-red)]/60 bg-[#0d0d0d]">
          <h2 className="text-lg text-white mb-3">
            Delete &quot;{deletingCat.label}&quot;?
          </h2>
          <p className="text-[var(--muted)] text-sm mb-3">
            Images in this category must be removed first.
          </p>
          <form action="/api/categories/delete-form" method="POST" className="flex gap-2">
            <input type="hidden" name="id" value={deletingCat.id} />
            <button
              type="submit"
              className="px-4 py-2 bg-[var(--accent-red)] text-white text-sm cursor-pointer"
            >
              Confirm Delete
            </button>
          </form>
          <Link
            href="/admin/categories"
            className="inline-block mt-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)]"
          >
            Cancel
          </Link>
        </div>
      )}

      {error && (
        <p className="text-[var(--accent-red)] text-sm mb-4">{error}</p>
      )}

      <ul className="space-y-2">
        {initialCategories.map((cat) => (
          <li
            key={cat.id}
            className="flex items-center justify-between py-3 border-b border-[var(--border)]"
          >
            <div>
              <span className="text-[var(--foreground)]">{cat.label}</span>
              <span className="ml-2 text-[var(--muted)] text-xs">({cat.id})</span>
            </div>
            <div className="flex gap-2 items-center">
              <Link
                href={`/admin/categories?edit=${encodeURIComponent(cat.id)}`}
                className="px-3 py-1.5 border border-[var(--gold)] text-[var(--gold)] text-sm hover:bg-[var(--gold)] hover:text-[var(--background)] transition-colors"
              >
                Edit
              </Link>
              <Link
                href={`/admin/categories?delete=${encodeURIComponent(cat.id)}`}
                className="px-3 py-1.5 border border-[var(--accent-red)]/60 text-[var(--accent-red)] text-sm hover:bg-[var(--accent-red)]/20 transition-colors"
              >
                Delete
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
