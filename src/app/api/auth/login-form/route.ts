import { NextRequest, NextResponse } from "next/server";

const ADMIN_COOKIE = "admin_session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const password = formData.get("password");
  if (!password || typeof password !== "string") {
    return NextResponse.redirect(new URL("/admin/login?error=required", request.url));
  }

  const adminPassword = process.env.ADMIN_PASSWORD?.trim();
  if (!adminPassword) {
    return NextResponse.redirect(new URL("/admin/login?error=config", request.url));
  }
  if (password.trim() !== adminPassword) {
    return NextResponse.redirect(new URL("/admin/login?error=invalid", request.url));
  }

  const res = NextResponse.redirect(new URL("/admin", request.url));
  res.cookies.set(ADMIN_COOKIE, "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
  return res;
}
