import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const formData = await request.formData();
  const id = String(formData.get("id") ?? "").trim();
  const filter = String(formData.get("filter") ?? "").trim();
  const base = new URL("/admin/portfolio", request.url);
  if (filter && filter !== "All") {
    base.searchParams.set("filter", filter);
  }

  const redirectWithFilter = (error?: string) => {
    if (error) base.searchParams.set("error", error);
    return NextResponse.redirect(base);
  };

  if (!id) {
    return redirectWithFilter("invalid-id");
  }

  try {
    const supabase = createServerClient();

    const { data: img, error: fetchError } = await supabase
      .from("portfolio_images")
      .select("src")
      .eq("id", id)
      .single();

    if (fetchError || !img) {
      return redirectWithFilter("not-found");
    }

    const { error: deleteDbError } = await supabase
      .from("portfolio_images")
      .delete()
      .eq("id", id);

    if (deleteDbError) {
      return redirectWithFilter(encodeURIComponent(deleteDbError.message));
    }

    try {
      const url = new URL(img.src);
      const pathMatch = url.pathname.match(
        /\/storage\/v1\/object\/public\/[^/]+\/(.+)/
      );
      if (pathMatch) {
        const path = decodeURIComponent(pathMatch[1]);
        await supabase.storage.from("portfolio").remove([path]);
      }
    } catch {
      // Ignore storage deletion errors
    }

    revalidatePath("/admin/portfolio");
    revalidatePath("/");
    return redirectWithFilter();
  } catch {
    return redirectWithFilter("delete-failed");
  }
}
