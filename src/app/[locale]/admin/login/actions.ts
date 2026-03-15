"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";

const ADMIN_COOKIE = "admin_session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function loginAction(formData: FormData) {
  const password = formData.get("password");
  if (!password || typeof password !== "string") {
    return { error: "Password required" };
  }

  const adminPassword = process.env.ADMIN_PASSWORD?.trim();
  if (!adminPassword) {
    return { error: "Server not configured" };
  }
  if (password.trim() !== adminPassword) {
    return { error: "Invalid password" };
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });

  redirect("/admin");
}
