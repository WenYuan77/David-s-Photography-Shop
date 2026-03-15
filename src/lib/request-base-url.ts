import type { NextRequest } from "next/server";

/**
 * Get the public base URL for redirects. Use this instead of request.url when
 * the app runs behind a reverse proxy (e.g. Zeabur), where request.url may be
 * the internal address (e.g. http://localhost:8080) and would cause redirects to
 * break on mobile or other clients.
 */
export function getBaseUrl(request: NextRequest): string {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const host = request.headers.get("host") ?? forwardedHost ?? new URL(request.url).host;
  const proto = request.headers.get("x-forwarded-proto") ?? (request.url.startsWith("https") ? "https" : "http");
  return `${proto}://${forwardedHost ?? host}`;
}
