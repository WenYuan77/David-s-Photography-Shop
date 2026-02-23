import { NextResponse } from "next/server";
import { createServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/auth";

const DEFAULT_CATEGORIES = [
  { id: "All", label: "All", sort_order: 0 },
  { id: "Wedding", label: "Wedding", sort_order: 1 },
  { id: "Engagement", label: "Engagement", sort_order: 2 },
  { id: "Family-Children", label: "Family & Children", sort_order: 3 },
  { id: "Portrait", label: "Portrait", sort_order: 4 },
  { id: "Pets", label: "Pets", sort_order: 5 },
  { id: "Automotive", label: "Automotive", sort_order: 6 },
  { id: "Events", label: "Events", sort_order: 7 },
];

export async function GET() {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(DEFAULT_CATEGORIES);
    }
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("categories get error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Prepend "All" for frontend
    const withAll = [{ id: "All", label: "All", sort_order: 0 }, ...(data ?? [])];
    return NextResponse.json(withAll);
  } catch (err) {
    console.error("categories get error:", err);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const ok = await isAdmin();
  if (!ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, label } = body;

    if (!label?.trim()) {
      return NextResponse.json({ error: "Label is required" }, { status: 400 });
    }

    const slug = id?.trim() || label.trim().replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "");
    if (!slug) {
      return NextResponse.json({ error: "Invalid category name" }, { status: 400 });
    }

    const supabase = createServerClient();

    const { data: maxOrder } = await supabase
      .from("categories")
      .select("sort_order")
      .order("sort_order", { ascending: false })
      .limit(1)
      .single();

    const sort_order = (maxOrder?.sort_order ?? 0) + 1;

    const { data, error } = await supabase
      .from("categories")
      .insert({ id: slug, label: label.trim(), sort_order })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ error: "Category already exists" }, { status: 409 });
      }
      throw error;
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("categories post error:", err);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}
