"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "perqora_admin";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 12; // 12 hours

/**
 * Compares the submitted token against the single shared ADMIN_ACCESS_TOKEN
 * (there is no per-admin identity in v1). On success, sets the httpOnly
 * cookie that src/proxy.ts checks on every /admin/** request.
 */
export async function loginAction(formData: FormData) {
  const token = formData.get("token");

  if (typeof token !== "string" || token.length === 0 || token !== process.env.ADMIN_ACCESS_TOKEN) {
    redirect("/admin/login?error=1");
  }

  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: COOKIE_MAX_AGE_SECONDS,
    path: "/",
  });

  redirect("/admin");
}
