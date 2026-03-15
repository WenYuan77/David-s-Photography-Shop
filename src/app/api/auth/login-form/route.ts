import { NextRequest, NextResponse } from "next/server";
import { getBaseUrl } from "@/lib/request-base-url";

const ADMIN_COOKIE = "admin_session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

const LOCALES = ["en", "zh", "th", "es"];

export async function POST(request: NextRequest) {
  const baseUrl = getBaseUrl(request);
  const formData = await request.formData();
  const password = formData.get("password");
  const localeRaw = formData.get("locale");
  const locale =
    typeof localeRaw === "string" && LOCALES.includes(localeRaw) ? localeRaw : "en";

  if (!password || typeof password !== "string") {
    return NextResponse.redirect(new URL(`/${locale}/admin/login?error=required`, baseUrl));
  }

  const adminPassword = process.env.ADMIN_PASSWORD?.trim();
  if (!adminPassword) {
    return NextResponse.redirect(new URL(`/${locale}/admin/login?error=config`, baseUrl));
  }
  if (password.trim() !== adminPassword) {
    return NextResponse.redirect(new URL(`/${locale}/admin/login?error=invalid`, baseUrl));
  }

  const res = NextResponse.redirect(new URL(`/${locale}/admin`, baseUrl));
  res.cookies.set(ADMIN_COOKIE, "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
  return res;
}
