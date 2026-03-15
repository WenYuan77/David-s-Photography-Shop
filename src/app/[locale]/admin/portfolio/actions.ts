"use server";

import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { revalidatePath } from "next/cache";
import { createServerClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/auth";

const BUCKET = "portfolio";
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

function slugify(str: string): string {
  return str
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9-_.]/g, "")
    .toLowerCase();
}

const LOCALES = ["en", "zh", "th", "es"];

function getRedirectUrl(locale: string, filter: string, error?: string): string {
  const loc = locale && LOCALES.includes(locale) ? locale : "en";
  const base = `/${loc}/admin/portfolio`;
  const qs = new URLSearchParams();
  if (filter && filter !== "All") qs.set("filter", filter);
  if (error) qs.set("error", error);
  const query = qs.toString();
  return query ? `${base}?${query}` : base;
}

export async function uploadPortfolioAction(formData: FormData) {
  const locale = String(formData.get("locale") ?? "en");
  if (!(await isAdmin())) {
    redirect(`/${locale}/admin/login`);
  }

  const file = formData.get("file") as File | null;
  const categoryId = String(formData.get("category_id") ?? "").trim();
  const alt = String(formData.get("alt") ?? "").trim();
  const filter = String(formData.get("filter") ?? "").trim();

  if (!file || file.size === 0) {
    redirect(getRedirectUrl(locale, filter, "no-file"));
  }
  if (!categoryId || categoryId === "All") {
    redirect(getRedirectUrl(locale, filter, "no-category"));
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    redirect(getRedirectUrl(locale, filter, "invalid-type"));
  }
  if (file.size > MAX_SIZE) {
    redirect(getRedirectUrl(locale, filter, "file-too-large"));
  }

  try {
    const supabase = createServerClient();

    const ext = file.name.split(".").pop() || "jpg";
    const baseName = slugify(file.name.replace(/\.[^/.]+$/, "")) || "image";
    const timestamp = Date.now();
    const fileName = `${categoryId}/${baseName}-${timestamp}.${ext}`;

    const buffer = await file.arrayBuffer();
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("portfolio upload action error:", uploadError);
      redirect(getRedirectUrl(locale, filter, encodeURIComponent(uploadError.message)));
    }

    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(uploadData.path);
    const src = urlData.publicUrl;
    const imageId = `uploaded-${categoryId}-${baseName}-${timestamp}`;

    const { error: insertError } = await supabase
      .from("portfolio_images")
      .insert({
        id: imageId,
        category_id: categoryId,
        src,
        alt: alt || `${categoryId} photography`,
      });

    if (insertError) {
      await supabase.storage.from(BUCKET).remove([uploadData.path]);
      redirect(getRedirectUrl(locale, filter, encodeURIComponent(insertError.message)));
    }

    revalidatePath(`/${locale}/admin/portfolio`);
    revalidatePath("/");
    redirect(getRedirectUrl(locale, filter));
  } catch (err) {
    if (isRedirectError(err)) throw err;
    console.error("portfolio upload action error:", err);
    redirect(getRedirectUrl(locale, filter, "failed"));
  }
}
