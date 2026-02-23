import { NextRequest, NextResponse } from "next/server";
import { clearAdminSession } from "@/lib/auth";

/** GET /admin/logout - clears session and redirects to homepage */
export async function GET(request: NextRequest) {
  await clearAdminSession();
  return NextResponse.redirect(new URL("/", request.url));
}
