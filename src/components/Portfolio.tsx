import Image from "next/image";
import type { PortfolioCategory, PortfolioImage } from "@/lib/portfolio-data";

const INITIAL_LIMIT = 20;

const buttonClass =
  "cursor-pointer inline-flex justify-center items-center w-full mt-12 py-4 border border-[var(--gold)] text-[var(--gold)] font-medium tracking-[0.2em] uppercase text-sm bg-transparent hover:bg-[var(--gold)] hover:text-[var(--background)] transition-all duration-500";

type Props = {
  categories: PortfolioCategory[];
  images: PortfolioImage[];
};

export default function Portfolio({ categories, images: portfolioImages }: Props) {
  const imagesByCategory = categories.filter((c) => c.id !== "All");

  const categoryLabel = (id: string) => categories.find((c) => c.id === id)?.label ?? id;

  const getImagesForCategory = (catId: string) =>
    catId === "All"
      ? portfolioImages
      : portfolioImages.filter(
          (i) => (i.category || "").trim().toLowerCase() === catId.trim().toLowerCase()
        );

  const categoryIds = imagesByCategory.map((c) => c.id);

  const cssId = (s: string) => s.replace(/[^a-zA-Z0-9_-]/g, "\\$&");
  const dynamicCss = [
    `.portfolio-filter-link[data-category="All"] { color: var(--gold); }`,
    ...categoryIds.flatMap((id) => {
      const escaped = cssId(id);
      const attrEscaped = id.replace(/"/g, '\\"');
      return [
        `#portfolio-section:has(#portfolio-${escaped}:target) .portfolio-filter-link[data-category="All"] { color: var(--muted); }`,
        `#portfolio-section:has(#portfolio-${escaped}:target) .portfolio-filter-link[data-category="${attrEscaped}"] { color: var(--gold); }`,
        `#portfolio-section:has(#portfolio-${escaped}:target) .portfolio-panel-category[data-category="${attrEscaped}"] { display: block; position: relative; width: 100%; min-width: 0; }`,
        `#portfolio-section:has(#portfolio-${escaped}:target) #portfolio-all { display: none !important; }`,
      ];
    }),
  ].join("\n");

  return (
    <section id="portfolio-section" className="scroll-mt-24 py-24 md:py-32 bg-[#0d0d0d]">
      <style dangerouslySetInnerHTML={{ __html: dynamicCss }} />
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-[var(--gold)] tracking-[0.3em] uppercase text-sm mb-4">Portfolio</p>
          <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-medium text-white">
            Our Work
          </h2>
          <div className="divider-gold w-24 mx-auto mt-6 mb-12" />
          <nav
            className="flex flex-wrap justify-center gap-3 md:gap-4"
            aria-label="Filter portfolio"
          >
            {categories.map((cat) => (
              <a
                key={cat.id}
                href={cat.id === "All" ? "#portfolio-section" : `#portfolio-${cat.id}`}
                className="portfolio-filter-link px-4 py-2 text-xs md:text-sm font-medium tracking-[0.12em] md:tracking-[0.15em] uppercase transition-all duration-300 whitespace-nowrap border-0 bg-transparent block no-underline text-[var(--muted)] hover:text-[var(--gold)] data-[active]:text-[var(--gold)]"
                data-category={cat.id}
              >
                {cat.label}
              </a>
            ))}
          </nav>
          {imagesByCategory.map((cat) => (
            <div
              key={cat.id}
              id={`portfolio-${cat.id}`}
              className="portfolio-scroll-anchor"
              aria-hidden
            />
          ))}
        </div>

        <div className="portfolio-panels">
          {/* All panel - visible by default */}
          <div id="portfolio-all" className="portfolio-panel portfolio-panel-all portfolio-expand-wrapper">
            <PortfolioPanel
              panelId="all"
              images={getImagesForCategory("All")}
              categoryLabel={categoryLabel}
              emptyMessage="No images yet. Configure Supabase and run the migration, or add images via the admin panel."
            />
          </div>

          {/* Category panels - shown via :target */}
          {imagesByCategory.map((cat) => (
            <div
              key={cat.id}
              data-category={cat.id}
              className="portfolio-panel portfolio-panel-category portfolio-expand-wrapper"
            >
              <PortfolioPanel
                panelId={cat.id}
                images={getImagesForCategory(cat.id)}
                categoryLabel={categoryLabel}
                emptyMessage={`No images in ${cat.label}.`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PortfolioPanel({
  panelId,
  images,
  categoryLabel,
  emptyMessage,
}: {
  panelId: string;
  images: PortfolioImage[];
  categoryLabel: (id: string) => string;
  emptyMessage: string;
}) {
  return (
    <>
      {images.length === 0 && (
        <p className="text-center text-white text-lg py-16">{emptyMessage}</p>
      )}
      <input
        type="checkbox"
        id={`portfolio-show-more-${panelId}`}
        className="portfolio-show-more-cb"
        aria-hidden
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {images.slice(0, INITIAL_LIMIT).map((item) => (
          <ImageCard key={item.id} item={item} categoryLabel={categoryLabel} />
        ))}
      </div>
      {images.length > INITIAL_LIMIT && (
        <>
          <div className="portfolio-rest grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mt-4">
            {images.slice(INITIAL_LIMIT).map((item) => (
              <ImageCard key={item.id} item={item} categoryLabel={categoryLabel} />
            ))}
          </div>
          <label htmlFor={`portfolio-show-more-${panelId}`} className={`portfolio-more-label ${buttonClass}`}>
            <span className="portfolio-text-more">Show More</span>
            <span className="portfolio-text-less">Show Less</span>
          </label>
        </>
      )}
    </>
  );
}

function ImageCard({
  item,
  categoryLabel,
}: {
  item: PortfolioImage;
  categoryLabel: (id: string) => string;
}) {
  return (
    <div className="group relative aspect-[3/4] overflow-hidden block">
      <Image
        src={item.src}
        alt={item.alt}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        className="object-cover transition-transform duration-700 group-hover:scale-105"
        loading="lazy"
        quality={88}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 pointer-events-none">
        <span className="text-[var(--gold)] text-sm tracking-[0.2em] uppercase">
          {categoryLabel(item.category)}
        </span>
      </div>
    </div>
  );
}
