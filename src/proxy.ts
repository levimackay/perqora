import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "perqora_admin";

/**
 * Gates everything under /admin behind a single shared bearer token stored
 * in an httpOnly cookie (there are no user accounts in this app, see
 * DeviceProfile for the anonymous personalization model instead).
 *
 * This is the one enforcement point for admin access. There is no separate
 * /api/admin/** surface in this app; admin mutations are Server Actions
 * defined inside /admin/** pages, and those actions are POSTed to that
 * same gated route, so they inherit this check rather than needing their
 * own header check.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;
  const expected = process.env.ADMIN_ACCESS_TOKEN;

  if (!expected || token !== expected) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
