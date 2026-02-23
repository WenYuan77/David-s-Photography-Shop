import AdminPortfolioManager from "./AdminPortfolioManager";
import UploadForm from "./UploadForm";
import { getPortfolioData } from "@/lib/portfolio-data";

export const dynamic = "force-dynamic";

const normalizedCat = (s: string) => (s || "").trim().toLowerCase();

export default async function AdminPortfolioPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; error?: string }>;
}) {
  const { categories, images } = await getPortfolioData();
  const categoriesWithoutAll = categories.filter((c) => c.id !== "All");
  const params = await searchParams;
  const { filter: filterParam, error: formError } = params;
  const validIds = new Set(["All", ...categoriesWithoutAll.map((c) => c.id)]);
  const activeFilter =
    filterParam && validIds.has(filterParam) ? filterParam : "All";

  const imagesForAdmin = images.map((i) => ({
    id: i.id,
    category: i.category,
    src: i.src,
    alt: i.alt,
  }));

  const filteredImages =
    activeFilter === "All"
      ? imagesForAdmin
      : imagesForAdmin.filter(
          (i) => normalizedCat(i.category) === normalizedCat(activeFilter)
        );

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <AdminPortfolioManager
        initialImages={filteredImages}
        initialCategories={categoriesWithoutAll}
        activeFilter={activeFilter}
        formError={formError ?? null}
        totalImagesByCategory={categoriesWithoutAll.map((c) => ({
          id: c.id,
          count: imagesForAdmin.filter(
            (i) => normalizedCat(i.category) === normalizedCat(c.id)
          ).length,
        }))}
        uploadForm={
          <UploadForm
            categories={categoriesWithoutAll}
            activeFilter={activeFilter}
            defaultCategoryId={categoriesWithoutAll[0]?.id ?? ""}
          />
        }
      />
    </div>
  );
}
