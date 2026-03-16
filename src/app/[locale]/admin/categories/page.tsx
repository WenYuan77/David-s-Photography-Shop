import AdminCategoriesList from "./AdminCategoriesList";
import { getCategoriesForAdmin } from "@/lib/portfolio-data";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ edit?: string; delete?: string; error?: string }>;
}) {
  const { locale } = await params;
  const categories = await getCategoriesForAdmin(locale);
  const search = await searchParams;
  const { edit: editId, delete: deleteId, error: formError } = search;

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <AdminCategoriesList
        initialCategories={categories}
        editId={editId ?? null}
        deleteId={deleteId ?? null}
        formError={formError ?? null}
      />
    </div>
  );
}
