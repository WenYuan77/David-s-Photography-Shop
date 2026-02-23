import { NextResponse } from "next/server";
import { createServerClient, isSupabaseConfigured } from "@/lib/supabase/server";

export async function GET() {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json([]);
    }
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("portfolio_images")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) {
      console.error("portfolio get error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const images = (data ?? []).map((row) => ({
      id: row.id,
      category: row.category_id,
      src: row.src,
      alt: row.alt ?? "",
    }));

    return NextResponse.json(images, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch (err) {
    console.error("portfolio get error:", err);
    return NextResponse.json({ error: "Failed to fetch portfolio" }, { status: 500 });
  }
}
