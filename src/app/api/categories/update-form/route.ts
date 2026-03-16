import { NextRequest, NextResponse } from "next/server";
import { createServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { getAdminLocale } from "@/lib/admin-locale";
import { getBaseUrl } from "@/lib/request-base-url";

export async function POST(request: NextRequest) {
  const baseUrl = getBaseUrl(request);
  const loc = getAdminLocale(request, null);
  if (!(await isAdmin())) {
    return NextResponse.redirect(new URL(`/${loc}/admin/login`, baseUrl));
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.redirect(new URL(`/${loc}/admin/categories?error=config`, baseUrl));
  }

  const formData = await request.formData();
  const id = String(formData.get("id") ?? "").trim();
  const singleLabel = String(formData.get("label") ?? "").trim();
  const formLocale = String(formData.get("locale") ?? loc).trim();
  const sourceLocale = ["en", "zh", "th", "es"].includes(formLocale) ? formLocale : "en";

  if (!id) {
    return NextResponse.redirect(new URL(`/${loc}/admin/categories?error=invalid`, baseUrl));
  }
  if (!singleLabel) {
    return NextResponse.redirect(new URL(`/${loc}/admin/categories?edit=${encodeURIComponent(id)}&error=invalid`, baseUrl));
  }

  const { fillCategoryLabelsFromOne } = await import("@/lib/translate");
  const labels = await fillCategoryLabelsFromOne(singleLabel, sourceLocale as "en" | "zh" | "th" | "es");
  const label = labels.label_en ?? labels.label_zh ?? labels.label_th ?? labels.label_es ?? singleLabel;

  // Only update label_* columns that have values, so we don't overwrite existing translations with null on API failure
  const updatePayload: Record<string, string> = { label };
  for (const key of ["label_en", "label_zh", "label_th", "label_es"] as const) {
    const v = labels[key];
    if (v != null && v !== "") updatePayload[key] = v;
  }

  try {
    const supabase = createServerClient();
    const { error } = await supabase
      .from("categories")
      .update(updatePayload)
      .eq("id", id);

    if (error) {
      return NextResponse.redirect(
        new URL(`/${loc}/admin/categories?edit=${encodeURIComponent(id)}&error=${encodeURIComponent(error.message)}`, baseUrl)
      );
    }

    revalidatePath(`/${loc}/admin`);
    revalidatePath(`/${loc}/admin/categories`);
    revalidatePath("/");
    return NextResponse.redirect(new URL(`/${loc}/admin/categories`, baseUrl));
  } catch {
    return NextResponse.redirect(
      new URL(`/${loc}/admin/categories?edit=${encodeURIComponent(id)}&error=failed`, baseUrl)
    );
  }
}
