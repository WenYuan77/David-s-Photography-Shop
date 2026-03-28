"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { addCategoryAction } from "./actions";
import type { CategoryWithLabels } from "@/lib/portfolio-data";

export default function AdminCategoriesList({
  initialCategories,
  editId,
  deleteId,
  formError,
}: {
  initialCategories: CategoryWithLabels[];
  editId: string | null;
  deleteId: string | null;
  formError: string | null;
}) {
  const locale = useLocale();
  const t = useTranslations("admin.categories");
  const router = useRouter();
  const [addState, addFormAction, addPending] = useActionState(addCategoryAction, null);
  const adminCategories = `/${locale}/admin/categories`;

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
          {t("title")}
        </h1>
      </div>

      <form action={addFormAction} className="space-y-4 mb-8">
        <input type="hidden" name="locale" value={locale} />
        <input
          type="text"
          name="label"
          placeholder={t("singleLabelPlaceholder")}
          required
          className="w-full max-w-md px-4 py-2 bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--gold)]"
        />
        <p className="text-[var(--muted)] text-xs">{t("addHint")}</p>
        <button
          type="submit"
          disabled={addPending}
          className="px-4 py-2 bg-[var(--gold)] text-[var(--background)] text-sm font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {addPending ? t("adding") : t("add")}
        </button>
      </form>

      {editingCat && (
        <div className="surface-card mb-6 p-4 border border-[var(--gold)]">
          <h2 className="text-lg text-[var(--heading)] mb-3">{t("edit")}: {editingCat.label}</h2>
          <form action="/api/categories/update-form" method="POST" className="space-y-3">
            <input type="hidden" name="id" value={editingCat.id} />
            <input type="hidden" name="locale" value={locale} />
            <input
              type="text"
              name="label"
              defaultValue={editingCat.label}
              required
              className="w-full max-w-md px-3 py-2 bg-transparent border border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--muted)]"
              placeholder={t("singleLabelPlaceholder")}
            />
            <p className="text-[var(--muted)] text-xs">{t("addHint")}</p>
            <div className="flex gap-2 items-center">
              <button
                type="submit"
                className="px-4 py-2 border border-[var(--gold)] text-[var(--gold)] text-sm cursor-pointer"
              >
                {t("save")}
              </button>
              <Link
                href={adminCategories}
                className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]"
              >
                {t("cancel")}
              </Link>
            </div>
          </form>
        </div>
      )}

      {deletingCat && (
        <div className="surface-card mb-6 p-4 border border-[var(--accent-red)]/60">
          <h2 className="text-lg text-[var(--heading)] mb-3">
            {t("deleteConfirm", { label: deletingCat.label })}
          </h2>
          <p className="text-[var(--muted)] text-sm mb-3">
            {t("deleteWarning")}
          </p>
          <form action="/api/categories/delete-form" method="POST" className="flex gap-2">
            <input type="hidden" name="id" value={deletingCat.id} />
            <button
              type="submit"
              className="px-4 py-2 bg-[var(--accent-red)] text-[var(--accent-contrast)] text-sm cursor-pointer"
            >
              {t("confirmDelete")}
            </button>
          </form>
          <Link
            href={adminCategories}
            className="inline-block mt-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)]"
          >
            {t("cancel")}
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
                href={`${adminCategories}?edit=${encodeURIComponent(cat.id)}`}
                className="px-3 py-1.5 border border-[var(--gold)] text-[var(--gold)] text-sm hover:bg-[var(--gold)] hover:text-[var(--background)] transition-colors"
              >
                {t("edit")}
              </Link>
              <Link
                href={`${adminCategories}?delete=${encodeURIComponent(cat.id)}`}
                className="px-3 py-1.5 border border-[var(--accent-red)]/60 text-[var(--accent-red)] text-sm hover:bg-[var(--accent-red)]/20 transition-colors"
              >
                {t("delete")}
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
