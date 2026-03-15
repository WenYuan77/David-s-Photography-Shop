import { NextRequest, NextResponse } from "next/server";
import { createServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { getAdminLocale } from "@/lib/admin-locale";

export async function POST(request: NextRequest) {
  const loc = getAdminLocale(request, null);
  if (!(await isAdmin())) {
    return NextResponse.redirect(new URL(`/${loc}/admin/login`, request.url));
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.redirect(new URL(`/${loc}/admin/categories?error=config`, request.url));
  }

  const formData = await request.formData();
  const id = String(formData.get("id") ?? "").trim();
  const label = String(formData.get("label") ?? "").trim();

  if (!id || !label) {
    return NextResponse.redirect(new URL(`/${loc}/admin/categories?error=invalid`, request.url));
  }

  try {
    const supabase = createServerClient();
    const { error } = await supabase.from("categories").update({ label }).eq("id", id);

    if (error) {
      return NextResponse.redirect(
        new URL(`/${loc}/admin/categories?edit=${encodeURIComponent(id)}&error=${encodeURIComponent(error.message)}`, request.url)
      );
    }

    revalidatePath(`/${loc}/admin`);
    revalidatePath(`/${loc}/admin/categories`);
    revalidatePath("/");
    return NextResponse.redirect(new URL(`/${loc}/admin/categories`, request.url));
  } catch {
    return NextResponse.redirect(
      new URL(`/${loc}/admin/categories?edit=${encodeURIComponent(id)}&error=failed`, request.url)
    );
  }
}
