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
  const label = String(formData.get("label") ?? "").trim();

  if (!id || !label) {
    return NextResponse.redirect(new URL(`/${loc}/admin/categories?error=invalid`, baseUrl));
  }

  try {
    const supabase = createServerClient();
    const { error } = await supabase.from("categories").update({ label }).eq("id", id);

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
