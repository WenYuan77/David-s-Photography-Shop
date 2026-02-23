"use client";

import { useState } from "react";
import Image from "next/image";
import DeletePortfolioLink from "./DeletePortfolioLink";

type ImageItem = { id: string; category: string; src: string; alt: string };
type Category = { id: string; label: string };

const ERROR_MESSAGES: Record<string, string> = {
  Unauthorized: "Please log in again.",
  "no-file": "Please select a file to upload.",
  "no-category": "Please select a category.",
  "invalid-type": "Invalid file type. Use JPEG, PNG, WebP or GIF.",
  "file-too-large": "File too large. Max 10MB.",
  failed: "Upload failed. Please try again.",
  "invalid-id": "Invalid image ID.",
  "not-found": "Image not found.",
  "delete-failed": "Failed to delete image.",
};

export default function AdminPortfolioManager({
  initialImages,
  initialCategories,
  activeFilter = "All",
  formError = null,
  totalImagesByCategory,
  uploadForm,
}: {
  initialImages: ImageItem[];
  initialCategories: Category[];
  activeFilter?: string;
  formError?: string | null;
  totalImagesByCategory: { id: string; count: number }[];
  uploadForm: React.ReactNode;
}) {
  const [images] = useState(initialImages);
  const [categories] = useState(initialCategories);
  const [counts] = useState(totalImagesByCategory);

  const totalCount = counts.reduce((s, x) => s + x.count, 0);

  return (
    <>
      <h1 className="font-[family-name:var(--font-playfair)] text-2xl text-[var(--gold)] tracking-[0.2em] uppercase mb-8">
        Portfolio
      </h1>

      <section className="mb-12 p-6 border border-[var(--border)] bg-[#0d0d0d]">
        <h2 className="text-lg text-white mb-4">Upload Image</h2>
        {uploadForm}
        <p className="text-[var(--muted)] text-xs mt-2">
          Max 10MB. JPEG, PNG, WebP, GIF.
        </p>
      </section>

      {formError && (
        <p className="text-[var(--accent-red)] text-sm mb-4">
          {ERROR_MESSAGES[formError] ?? formError}
        </p>
      )}

      <div className="mb-4 flex flex-wrap gap-2 items-center">
        <span className="text-[var(--muted)] text-sm mr-2">Filter:</span>
        <a
          href="/admin/portfolio"
          className={`px-4 py-2 text-sm border transition-colors cursor-pointer ${
            activeFilter === "All"
              ? "border-[var(--gold)] text-[var(--gold)] bg-[var(--gold)]/10"
              : "border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--gold)]"
          }`}
        >
          All ({totalCount})
        </a>
        {categories.map((c) => {
          const count = counts.find((x) => x.id === c.id)?.count ?? 0;
          const isActive = activeFilter === c.id;
          return (
            <a
              key={c.id}
              href={`/admin/portfolio?filter=${encodeURIComponent(c.id)}`}
              className={`px-4 py-2 text-sm border transition-colors cursor-pointer ${
                isActive
                  ? "border-[var(--gold)] text-[var(--gold)] bg-[var(--gold)]/10"
                  : "border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--gold)]"
              }`}
            >
              {c.label} ({count})
            </a>
          );
        })}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {images.map((img) => (
          <div key={img.id} className="relative group">
            <div className="aspect-[3/4] relative bg-[var(--border)] overflow-hidden">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="200px"
                className="object-cover"
                loading="lazy"
                quality={88}
              />
            </div>
            <div className="mt-2 text-[var(--muted)] text-xs truncate">
              {img.alt || "(no alt)"}
            </div>
            <div className="mt-1 text-[var(--muted)] text-xs">{img.category}</div>

            <div className="relative z-10 mt-2 flex gap-3 items-center">
              <a
                href={`/api/portfolio/${encodeURIComponent(img.id)}/download`}
                className="text-xs text-[var(--gold)] hover:underline cursor-pointer"
              >
                Download
              </a>
              <DeletePortfolioLink imageId={img.id} activeFilter={activeFilter} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
