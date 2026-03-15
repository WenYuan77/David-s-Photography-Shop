import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { routing } from "./i18n/routing";
import { getBaseUrl } from "@/lib/request-base-url";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    const baseUrl = getBaseUrl(request);
    const rest = pathname === "/admin" ? "" : pathname.slice("/admin".length);
    return NextResponse.redirect(new URL(`/en/admin${rest}`, baseUrl));
  }

  const localePrefix = pathname.split("/")[1];
  const isLocalePath = routing.locales.includes(localePrefix as "en" | "zh" | "th" | "es");

  if (isLocalePath && pathname.startsWith(`/${localePrefix}/admin`) && !pathname.includes("/admin/login")) {
    const session = request.cookies.get("admin_session");
    if (!session?.value || session.value !== "1") {
      const baseUrl = getBaseUrl(request);
      return NextResponse.redirect(new URL(`/${localePrefix}/admin/login`, baseUrl));
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)", "/admin", "/admin/:path*"],
};
