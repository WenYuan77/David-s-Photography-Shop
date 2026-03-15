import { NextRequest, NextResponse } from "next/server";
import { clearAdminSession } from "@/lib/auth";
import { getBaseUrl } from "@/lib/request-base-url";

/** GET /[locale]/admin/logout - clears session and redirects to homepage */
export async function GET(request: NextRequest) {
  await clearAdminSession();
  const baseUrl = getBaseUrl(request);
  return NextResponse.redirect(new URL("/", baseUrl));
}
