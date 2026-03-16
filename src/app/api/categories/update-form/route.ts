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
  const label_en = String(formData.get("label_en") ?? "").trim() || null;
  const label_zh = String(formData.get("label_zh") ?? "").trim() || null;
  const label_th = String(formData.get("label_th") ?? "").trim() || null;
  const label_es = String(formData.get("label_es") ?? "").trim() || null;

  if (!id) {
    return NextResponse.redirect(new URL(`/${loc}/admin/categories?error=invalid`, baseUrl));
  }
  if (!label_en && !label_zh && !label_th && !label_es) {
    return NextResponse.redirect(new URL(`/${loc}/admin/categories?edit=${encodeURIComponent(id)}&error=invalid`, baseUrl));
  }

  const label = label_en ?? label_zh ?? label_th ?? label_es ?? "";

  try {
    const supabase = createServerClient();
    const { error } = await supabase
      .from("categories")
      .update({ label_en, label_zh, label_th, label_es, label })
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
