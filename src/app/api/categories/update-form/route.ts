import { NextRequest, NextResponse } from "next/server";
import { createServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.redirect(new URL("/admin/categories?error=config", request.url));
  }

  const formData = await request.formData();
  const id = String(formData.get("id") ?? "").trim();
  const label = String(formData.get("label") ?? "").trim();

  if (!id || !label) {
    return NextResponse.redirect(new URL("/admin/categories?error=invalid", request.url));
  }

  try {
    const supabase = createServerClient();
    const { error } = await supabase.from("categories").update({ label }).eq("id", id);

    if (error) {
      return NextResponse.redirect(
        new URL(`/admin/categories?edit=${encodeURIComponent(id)}&error=${encodeURIComponent(error.message)}`, request.url)
      );
    }

    revalidatePath("/admin");
    revalidatePath("/admin/categories");
    revalidatePath("/");
    return NextResponse.redirect(new URL("/admin/categories", request.url));
  } catch {
    return NextResponse.redirect(
      new URL(`/admin/categories?edit=${encodeURIComponent(id)}&error=failed`, request.url)
    );
  }
}
