import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const ok = await isAdmin();
  if (!ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "Invalid image id" }, { status: 400 });
  }

  try {
    const supabase = createServerClient();
    const { data: img, error } = await supabase
      .from("portfolio_images")
      .select("src, alt")
      .eq("id", id)
      .single();

    if (error || !img) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    const res = await fetch(img.src, { cache: "no-store" });
    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch image" }, { status: 500 });
    }

    const contentType = res.headers.get("content-type") || "image/jpeg";
    const buffer = await res.arrayBuffer();

    const ext = img.src.split(".").pop()?.split("?")[0] || "jpg";
    const base = (img.alt || id).replace(/[^a-zA-Z0-9-_]/g, "-");
    const filename = `${base}.${ext}`;

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    console.error("portfolio download error:", err);
    return NextResponse.json({ error: "Download failed" }, { status: 500 });
  }
}
