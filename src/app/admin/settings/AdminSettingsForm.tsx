"use client";

import { useActionState, useState, useEffect } from "react";
import Image from "next/image";
import { saveSiteSettings, uploadHeroImageAction } from "./actions";
import type { SiteSettingsFull } from "@/lib/site-settings";

export default function AdminSettingsForm({
  initialData,
  heroError = null,
}: {
  initialData: SiteSettingsFull;
  heroError?: string | null;
}) {
  const [state, formAction, isPending] = useActionState(saveSiteSettings, null);
  const heroUrl = initialData.hero_image_url?.trim() || null;

  // Single source of truth: only one can be selected; impossible to have both checked
  type AutoplayChoice = "intro" | "proposal" | "none";
  const [autoplayChoice, setAutoplayChoice] = useState<AutoplayChoice>(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("adminAutoplayJustSaved");
      if (saved === "intro" || saved === "proposal" || saved === "none") {
        sessionStorage.removeItem("adminAutoplayJustSaved");
        return saved;
      }
    }
    if (initialData.intro_video_autoplay) return "intro";
    if (initialData.proposal_video_autoplay) return "proposal";
    return "none";
  });

  // Preserve scroll position after save
  useEffect(() => {
    if (state !== null) {
      const y = sessionStorage.getItem("adminSettingsScrollY");
      if (y != null) {
        window.scrollTo(0, Number(y));
        sessionStorage.removeItem("adminSettingsScrollY");
      }
    }
  }, [state]);

  return (
    <div className="space-y-8">
      {/* Hero Image */}
      <section className="p-6 border border-[var(--border)] bg-[#0d0d0d]">
        <h2 className="text-lg text-white mb-4">Hero Image</h2>
        <p className="text-sm text-[var(--muted)] mb-4">
          The main background image on the homepage. Max 10MB. JPEG, PNG, WebP, GIF.
        </p>
        {heroUrl && (
          <div className="mb-4">
            <div className="relative aspect-[3/2] max-w-md overflow-hidden bg-[var(--border)]">
              <Image
                src={heroUrl}
                alt="Current hero"
                fill
                className="object-cover"
                sizes="400px"
              />
            </div>
            <a
              href="/api/site/hero/download"
              className="inline-block mt-2 text-xs text-[var(--gold)] hover:underline cursor-pointer"
            >
              Download
            </a>
          </div>
        )}
        {heroError && (
          <p className="text-[var(--accent-red)] text-sm mb-4">{heroError}</p>
        )}
        <form action={uploadHeroImageAction} className="flex flex-wrap gap-4 items-end">
          <input
            type="file"
            name="file"
            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
            required
            className="block text-sm text-[var(--foreground)] file:mr-3 file:py-2 file:px-4 file:rounded-none file:border file:border-[var(--gold)] file:bg-transparent file:text-[var(--gold)] file:text-sm file:cursor-pointer"
          />
          <button
            type="submit"
            className="py-2 px-6 border border-[var(--gold)] text-[var(--gold)] text-sm font-medium tracking-wider uppercase cursor-pointer hover:bg-[var(--gold)] hover:text-[var(--background)] transition-colors"
          >
            Upload
          </button>
        </form>
      </section>

      {/* Site Settings Form */}
    <form
      action={formAction}
      className="space-y-6"
      onSubmit={() => {
        sessionStorage.setItem("adminSettingsScrollY", String(window.scrollY));
        sessionStorage.setItem("adminAutoplayJustSaved", autoplayChoice);
      }}
    >
      <div>
        <label className="block text-sm text-[var(--muted)] mb-2 uppercase tracking-wider">
          Phone
        </label>
        <input
          type="tel"
          name="phone"
          defaultValue={initialData.phone ?? ""}
          className="w-full px-4 py-3 bg-[#0d0d0d] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:border-[var(--gold)]"
        />
      </div>
      <div>
        <label className="block text-sm text-[var(--muted)] mb-2 uppercase tracking-wider">
          Email
        </label>
        <input
          type="email"
          name="email"
          defaultValue={initialData.email ?? ""}
          className="w-full px-4 py-3 bg-[#0d0d0d] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:border-[var(--gold)]"
        />
      </div>
      <div>
        <label className="block text-sm text-[var(--muted)] mb-2 uppercase tracking-wider">
          SEO Title
        </label>
        <input
          type="text"
          name="seo_title"
          defaultValue={initialData.seo_title ?? ""}
          className="w-full px-4 py-3 bg-[#0d0d0d] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:border-[var(--gold)]"
        />
      </div>
      <div>
        <label className="block text-sm text-[var(--muted)] mb-2 uppercase tracking-wider">
          SEO Description
        </label>
        <textarea
          name="seo_description"
          defaultValue={initialData.seo_description ?? ""}
          rows={3}
          className="w-full px-4 py-3 bg-[#0d0d0d] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:border-[var(--gold)] resize-none"
        />
      </div>
      <div>
        <label className="block text-sm text-[var(--muted)] mb-2 uppercase tracking-wider">
          SEO Keywords (comma-separated)
        </label>
        <input
          type="text"
          name="seo_keywords"
          defaultValue={
            Array.isArray(initialData.seo_keywords)
              ? initialData.seo_keywords.join(", ")
              : ""
          }
          placeholder="photography, wedding, portrait"
          className="w-full px-4 py-3 bg-[#0d0d0d] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:border-[var(--gold)] placeholder:text-[var(--muted)]"
        />
      </div>
      <div>
        <label className="block text-sm text-[var(--muted)] mb-2 uppercase tracking-wider">
          Intro Video URL (Vimeo)
        </label>
        <input
          type="url"
          name="intro_video_url"
          defaultValue={initialData.intro_video_url ?? ""}
          placeholder="https://vimeo.com/123456789"
          className="w-full px-4 py-3 bg-[#0d0d0d] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:border-[var(--gold)] placeholder:text-[var(--muted)]"
        />
        <p className="text-xs text-[var(--muted)] mt-1">
          Paste the Vimeo share link. Leave empty to hide the section.
        </p>
      </div>
      <div>
        <label className="block text-sm text-[var(--muted)] mb-2 uppercase tracking-wider">
          Proposal / Featured Video URL (Vimeo)
        </label>
        <input
          type="url"
          name="proposal_video_url"
          defaultValue={initialData.proposal_video_url ?? ""}
          placeholder="https://vimeo.com/123456789"
          className="w-full px-4 py-3 bg-[#0d0d0d] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:border-[var(--gold)] placeholder:text-[var(--muted)]"
        />
        <p className="text-xs text-[var(--muted)] mt-1">
          Paste the Vimeo share link. Leave empty to hide the section.
        </p>
      </div>
      <div>
        <p className="block text-sm text-[var(--muted)] mb-3 uppercase tracking-wider">
          Auto-play video
        </p>
        <fieldset className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="autoplay_choice"
              value="none"
              checked={autoplayChoice === "none"}
              onChange={() => setAutoplayChoice("none")}
              className="w-4 h-4 accent-[var(--gold)] bg-[#0d0d0d] border border-[var(--border)]"
            />
            <span className="text-sm text-[var(--foreground)]">No autoplay</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="autoplay_choice"
              value="intro"
              checked={autoplayChoice === "intro"}
              onChange={() => setAutoplayChoice("intro")}
              className="w-4 h-4 accent-[var(--gold)] bg-[#0d0d0d] border border-[var(--border)]"
            />
            <span className="text-sm text-[var(--foreground)]">Auto-play intro video</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="autoplay_choice"
              value="proposal"
              checked={autoplayChoice === "proposal"}
              onChange={() => setAutoplayChoice("proposal")}
              className="w-4 h-4 accent-[var(--gold)] bg-[#0d0d0d] border border-[var(--border)]"
            />
            <span className="text-sm text-[var(--foreground)]">Auto-play proposal video</span>
          </label>
        </fieldset>
      </div>
      {state?.success === false && (
        <p className="text-[var(--accent-red)] text-sm">
          Save failed: {state.error}
        </p>
      )}
      {state?.success === true && (
        <p className="text-[var(--gold)] text-sm">
          Settings saved successfully.
        </p>
      )}
      <button
        type="submit"
        disabled={isPending}
        className="w-full py-3 border border-[var(--gold)] text-[var(--gold)] font-medium tracking-[0.2em] uppercase text-sm hover:bg-[var(--gold)] hover:text-[var(--background)] transition-all disabled:opacity-50 cursor-pointer"
      >
        {isPending ? "Saving..." : "Save"}
      </button>
    </form>
    </div>
  );
}
