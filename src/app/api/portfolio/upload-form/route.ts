import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";

const BUCKET = "portfolio";
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

function slugify(str: string): string {
  return str
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9-_.]/g, "")
    .toLowerCase();
}

export async function POST(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const categoryId = String(formData.get("category_id") ?? "").trim();
    const alt = String(formData.get("alt") ?? "").trim();
    const filter = String(formData.get("filter") ?? "").trim();
    const keepFilter = filter && filter !== "All" ? `filter=${encodeURIComponent(filter)}` : "";

    const baseRedirect = "/admin/portfolio" + (keepFilter ? `?${keepFilter}` : "");

    if (!file || file.size === 0) {
      return NextResponse.redirect(
        new URL(`${baseRedirect}${keepFilter ? "&" : "?"}error=no-file`, request.url)
      );
    }
    if (!categoryId || categoryId === "All") {
      return NextResponse.redirect(
        new URL(`${baseRedirect}${keepFilter ? "&" : "?"}error=no-category`, request.url)
      );
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.redirect(
        new URL(`${baseRedirect}${keepFilter ? "&" : "?"}error=invalid-type`, request.url)
      );
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.redirect(
        new URL(`${baseRedirect}${keepFilter ? "&" : "?"}error=file-too-large`, request.url)
      );
    }

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
      console.error("portfolio upload-form error:", uploadError);
      return NextResponse.redirect(
        new URL(`${baseRedirect}${keepFilter ? "&" : "?"}error=${encodeURIComponent(uploadError.message)}`, request.url)
      );
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
      return NextResponse.redirect(
        new URL(`${baseRedirect}${keepFilter ? "&" : "?"}error=${encodeURIComponent(insertError.message)}`, request.url)
      );
    }

    revalidatePath("/admin/portfolio");
    revalidatePath("/");
    return NextResponse.redirect(new URL(baseRedirect, request.url));
  } catch (err) {
    console.error("portfolio upload-form error:", err);
    return NextResponse.redirect(new URL("/admin/portfolio?error=failed", request.url));
  }
}
