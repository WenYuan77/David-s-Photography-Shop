import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/auth";

export async function PUT(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const ok = await isAdmin();
  if (!ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!id || id === "All") {
    return NextResponse.json({ error: "Invalid category" }, { status: 400 });
  }

  try {
    const body = await _request.json();
    const { label, sort_order } = body;

    const supabase = createServerClient();
    const payload: Record<string, unknown> = {};
    if (label !== undefined) payload.label = label;
    if (sort_order !== undefined) payload.sort_order = sort_order;

    if (Object.keys(payload).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("categories")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    console.error("categories put error:", err);
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
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
  if (!id || id === "All") {
    return NextResponse.json({ error: "Invalid category" }, { status: 400 });
  }

  try {
    const supabase = createServerClient();

    const { count } = await supabase
      .from("portfolio_images")
      .select("*", { count: "exact", head: true })
      .eq("category_id", id);

    if ((count ?? 0) > 0) {
      return NextResponse.json(
        { error: "Cannot delete category with existing images. Remove or reassign images first." },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("categories delete error:", err);
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
