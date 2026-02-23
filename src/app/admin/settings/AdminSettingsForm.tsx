"use client";

import { useActionState } from "react";
import { saveSiteSettings } from "./actions";
import type { SiteSettingsFull } from "@/lib/site-settings";

export default function AdminSettingsForm({
  initialData,
}: {
  initialData: SiteSettingsFull;
}) {
  const [state, formAction, isPending] = useActionState(saveSiteSettings, null);

  return (
    <form action={formAction} className="space-y-6">
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
  );
}
