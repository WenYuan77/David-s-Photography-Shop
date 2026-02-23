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

  if (!id) {
    return NextResponse.redirect(new URL("/admin/categories?error=invalid", request.url));
  }

  try {
    const supabase = createServerClient();
    const { count } = await supabase
      .from("portfolio_images")
      .select("*", { count: "exact", head: true })
      .eq("category_id", id);

    if ((count ?? 0) > 0) {
      return NextResponse.redirect(
        new URL("/admin/categories?error=cannot-delete-with-images", request.url)
      );
    }

    const { error } = await supabase.from("categories").delete().eq("id", id);

    if (error) {
      return NextResponse.redirect(
        new URL(`/admin/categories?error=${encodeURIComponent(error.message)}`, request.url)
      );
    }

    revalidatePath("/admin");
    revalidatePath("/admin/categories");
    revalidatePath("/");
    return NextResponse.redirect(new URL("/admin/categories", request.url));
  } catch {
    return NextResponse.redirect(new URL("/admin/categories?error=failed", request.url));
  }
}
