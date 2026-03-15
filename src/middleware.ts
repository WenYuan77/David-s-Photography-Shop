import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { routing } from "./i18n/routing";

function getBaseUrl(request: NextRequest): string {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const host = request.headers.get("host") ?? forwardedHost ?? new URL(request.url).host;
  const proto = request.headers.get("x-forwarded-proto") ?? "https";
  return `${proto}://${forwardedHost ?? host}`;
}

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
