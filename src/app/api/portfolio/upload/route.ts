import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createServerClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/auth";

const BUCKET = "portfolio";
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

function slugify(str: string): string {
  return str
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9-_.]/g, "")
    .toLowerCase();
}

export async function POST(request: Request) {
  const ok = await isAdmin();
  if (!ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch (parseErr) {
    const msg =
      parseErr instanceof Error ? parseErr.message : "Failed to parse form data";
    console.error("portfolio upload formData parse error:", parseErr);
    return NextResponse.json(
      { error: `Invalid request: ${msg}. If uploading large files, ensure bodySizeLimit allows it.` },
      { status: 400 }
    );
  }

  try {
    const file = formData.get("file") as File | null;
    const categoryId = formData.get("category_id") as string | null;
    const alt = (formData.get("alt") as string) || "";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    if (file.size === 0) {
      return NextResponse.json(
        { error: "File is empty. If the file is large, the request may have been truncated. Try a smaller file or increase bodySizeLimit." },
        { status: 400 }
      );
    }
    if (!categoryId || categoryId === "All") {
      return NextResponse.json({ error: "Valid category is required" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Use JPEG, PNG, WebP or GIF." }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File too large. Max 10MB." }, { status: 400 });
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
      console.error("upload error:", uploadError);
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(uploadData.path);
    const src = urlData.publicUrl;

    const imageId = `uploaded-${categoryId}-${baseName}-${timestamp}`;

    const { data: insertData, error: insertError } = await supabase
      .from("portfolio_images")
      .insert({
        id: imageId,
        category_id: categoryId,
        src,
        alt: alt.trim() || `${categoryId} photography`,
      })
      .select()
      .single();

    if (insertError) {
      await supabase.storage.from(BUCKET).remove([uploadData.path]);
      throw insertError;
    }

    revalidatePath("/admin/portfolio");
    revalidatePath("/");

    return NextResponse.json({
      id: insertData.id,
      category: insertData.category_id,
      src: insertData.src,
      alt: insertData.alt ?? "",
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to upload image";
    console.error("portfolio upload error:", err);
    return NextResponse.json(
      { error: message.includes("Missing") || message.includes("relation") ? message : `Failed to upload image: ${message}` },
      { status: 500 }
    );
  }
}
