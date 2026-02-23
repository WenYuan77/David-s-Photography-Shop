import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/auth";

export async function PUT(
  request: Request,
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
    const body = await request.json();
    const { category_id, alt } = body;

    const supabase = createServerClient();
    const payload: Record<string, unknown> = {};
    if (category_id !== undefined) payload.category_id = category_id;
    if (alt !== undefined) payload.alt = alt;

    if (Object.keys(payload).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("portfolio_images")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({
      id: data.id,
      category: data.category_id,
      src: data.src,
      alt: data.alt ?? "",
    });
  } catch (err) {
    console.error("portfolio put error:", err);
    return NextResponse.json({ error: "Failed to update image" }, { status: 500 });
  }
}

export async function DELETE(
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

    const { data: img, error: fetchError } = await supabase
      .from("portfolio_images")
      .select("src")
      .eq("id", id)
      .single();

    if (fetchError || !img) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    const { error: deleteDbError } = await supabase.from("portfolio_images").delete().eq("id", id);
    if (deleteDbError) throw deleteDbError;

    // Try to delete from storage if it's a Supabase URL
    try {
      const url = new URL(img.src);
      const pathMatch = url.pathname.match(/\/storage\/v1\/object\/public\/[^/]+\/(.+)/);
      if (pathMatch) {
        const path = decodeURIComponent(pathMatch[1]);
        await supabase.storage.from("portfolio").remove([path]);
      }
    } catch {
      // Ignore storage deletion errors (e.g. for migrated images with different URLs)
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("portfolio delete error:", err);
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 });
  }
}
