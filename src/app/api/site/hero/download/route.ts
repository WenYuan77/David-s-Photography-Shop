import { NextResponse } from "next/server";
import { createServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/auth";

export async function GET() {
  const ok = await isAdmin();
  if (!ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("hero_image_url")
      .limit(1)
      .single();

    if (error || !data?.hero_image_url?.trim()) {
      return NextResponse.json({ error: "No hero image" }, { status: 404 });
    }

    const res = await fetch(data.hero_image_url, { cache: "no-store" });
    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch image" }, { status: 500 });
    }

    const contentType = res.headers.get("content-type") || "image/jpeg";
    const buffer = await res.arrayBuffer();

    const urlPath = new URL(data.hero_image_url).pathname;
    const ext = urlPath.split(".").pop()?.split("?")[0] || "jpg";
    const filename = `hero.${ext}`;

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    console.error("hero download error:", err);
    return NextResponse.json({ error: "Download failed" }, { status: 500 });
  }
}
