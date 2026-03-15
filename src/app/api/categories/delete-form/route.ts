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

  if (!id) {
    return NextResponse.redirect(new URL(`/${loc}/admin/categories?error=invalid`, baseUrl));
  }

  try {
    const supabase = createServerClient();
    const { count } = await supabase
      .from("portfolio_images")
      .select("*", { count: "exact", head: true })
      .eq("category_id", id);

    if ((count ?? 0) > 0) {
      return NextResponse.redirect(
        new URL(`/${loc}/admin/categories?error=cannot-delete-with-images`, baseUrl)
      );
    }

    const { error } = await supabase.from("categories").delete().eq("id", id);

    if (error) {
      return NextResponse.redirect(
        new URL(`/${loc}/admin/categories?error=${encodeURIComponent(error.message)}`, baseUrl)
      );
    }

    revalidatePath(`/${loc}/admin`);
    revalidatePath(`/${loc}/admin/categories`);
    revalidatePath("/");
    return NextResponse.redirect(new URL(`/${loc}/admin/categories`, baseUrl));
  } catch {
    return NextResponse.redirect(new URL(`/${loc}/admin/categories?error=failed`, baseUrl));
  }
}
