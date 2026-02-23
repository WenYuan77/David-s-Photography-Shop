import { NextRequest, NextResponse } from "next/server";

const ADMIN_COOKIE = "admin_session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function getBaseUrl(request: NextRequest): string {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const host = request.headers.get("host") ?? forwardedHost ?? new URL(request.url).host;
  const proto = request.headers.get("x-forwarded-proto") ?? "https";
  return `${proto}://${forwardedHost ?? host}`;
}

export async function POST(request: NextRequest) {
  const baseUrl = getBaseUrl(request);
  const formData = await request.formData();
  const password = formData.get("password");
  if (!password || typeof password !== "string") {
    return NextResponse.redirect(new URL("/admin/login?error=required", baseUrl));
  }

  const adminPassword = process.env.ADMIN_PASSWORD?.trim();
  if (!adminPassword) {
    return NextResponse.redirect(new URL("/admin/login?error=config", baseUrl));
  }
  if (password.trim() !== adminPassword) {
    return NextResponse.redirect(new URL("/admin/login?error=invalid", baseUrl));
  }

  const res = NextResponse.redirect(new URL("/admin", baseUrl));
  res.cookies.set(ADMIN_COOKIE, "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
  return res;
}
