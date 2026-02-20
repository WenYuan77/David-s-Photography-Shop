"use client";

import Image from "next/image";
import { categories, portfolioImages } from "@/data/portfolio";

type CategoryId = (typeof categories)[number]["id"];

const INITIAL_LIMIT = 20;

const buttonClass =
  "cursor-pointer inline-flex justify-center items-center w-full mt-12 py-4 border border-[var(--gold)] text-[var(--gold)] font-medium tracking-[0.2em] uppercase text-sm bg-transparent hover:bg-[var(--gold)] hover:text-[var(--background)] transition-all duration-500";

export default function Portfolio() {
  const categoryLabel = (id: CategoryId) =>
    categories.find((c) => c.id === id)?.label ?? id;

  const imagesByCategory = categories.filter((c) => c.id !== "All");

  return (
    <section id="portfolio-section" className="scroll-mt-24 py-24 md:py-32 bg-[#0d0d0d]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-[var(--gold)] tracking-[0.3em] uppercase text-sm mb-4">
            Portfolio
          </p>
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
                className="portfolio-filter cursor-pointer px-4 py-2 text-xs md:text-sm font-medium tracking-[0.12em] md:tracking-[0.15em] uppercase transition-all duration-300 whitespace-nowrap border-0 bg-transparent block text-[var(--muted)] hover:text-[var(--gold)]"
                data-category={cat.id}
              >
                {cat.label}
              </a>
            ))}
          </nav>
          {/* Scroll anchors - positioned right below category bar for correct scroll target */}
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
          {/* All - pure HTML checkbox + label, checkbox fixed at viewport center to prevent scroll on focus */}
          <div id="portfolio-all" className="portfolio-panel portfolio-expand-wrapper">
            <input
              type="checkbox"
              id="portfolio-show-more-all"
              className="portfolio-show-more-cb"
              aria-hidden
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              {portfolioImages.slice(0, INITIAL_LIMIT).map((item) => (
                <ImageCard
                  key={item.id}
                  item={item}
                  categoryLabel={categoryLabel}
                />
              ))}
            </div>
            {portfolioImages.length > INITIAL_LIMIT && (
              <>
                <div className="portfolio-rest grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mt-4">
                  {portfolioImages.slice(INITIAL_LIMIT).map((item) => (
                    <ImageCard
                      key={item.id}
                      item={item}
                      categoryLabel={categoryLabel}
                    />
                  ))}
                </div>
                <label htmlFor="portfolio-show-more-all" className={`portfolio-more-label ${buttonClass}`}>
                  <span className="portfolio-text-more">Show More</span>
                  <span className="portfolio-text-less">Show Less</span>
                </label>
              </>
            )}
          </div>

          {/* Per-category panels - visible when :target, pure HTML checkbox + label */}
          {imagesByCategory.map((cat) => {
            const imgs = portfolioImages.filter((i) => i.category === cat.id);
            const initial = imgs.slice(0, INITIAL_LIMIT);
            const rest = imgs.slice(INITIAL_LIMIT);
            const hasMore = rest.length > 0;
            const checkboxId = `portfolio-show-more-${cat.id}`;
            return (
              <div
                key={cat.id}
                data-category={cat.id}
                className="portfolio-panel portfolio-panel-category portfolio-expand-wrapper"
              >
                <input
                  type="checkbox"
                  id={checkboxId}
                  className="portfolio-show-more-cb"
                  aria-hidden
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                  {initial.map((item) => (
                    <ImageCard key={item.id} item={item} categoryLabel={categoryLabel} />
                  ))}
                </div>
                {hasMore && (
                  <>
                    <div className="portfolio-rest grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mt-4">
                      {rest.map((item) => (
                        <ImageCard key={item.id} item={item} categoryLabel={categoryLabel} />
                      ))}
                    </div>
                    <label htmlFor={checkboxId} className={`portfolio-more-label ${buttonClass}`}>
                      <span className="portfolio-text-more">Show More</span>
                      <span className="portfolio-text-less">Show Less</span>
                    </label>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ImageCard({
  item,
  categoryLabel,
}: {
  item: (typeof portfolioImages)[0];
  categoryLabel: (id: CategoryId) => string;
}) {
  return (
    <div className="group relative aspect-[3/4] overflow-hidden block">
      <Image
        src={item.src}
        alt={item.alt}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        className="object-cover transition-transform duration-700 group-hover:scale-105"
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
