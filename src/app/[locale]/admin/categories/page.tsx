import AdminCategoriesList from "./AdminCategoriesList";
import { getPortfolioData } from "@/lib/portfolio-data";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string; delete?: string; error?: string }>;
}) {
  const { categories } = await getPortfolioData();
  const categoriesWithoutAll = categories.filter((c) => c.id !== "All");
  const params = await searchParams;
  const { edit: editId, delete: deleteId, error: formError } = params;

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <AdminCategoriesList
        initialCategories={categoriesWithoutAll}
        editId={editId ?? null}
        deleteId={deleteId ?? null}
        formError={formError ?? null}
      />
    </div>
  );
}
