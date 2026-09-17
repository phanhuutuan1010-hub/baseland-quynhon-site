import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/server/authConstants";

// Cheap, cookie-presence-only gate — redirects obviously-anonymous visitors
// away from /admin before a page even renders. This is NOT the real
// authorization check: every admin page/layout and server action calls
// requireUser()/requireRole() (src/lib/server/auth.ts) themselves, which
// validates the session against the database. Do not rely on this file for
// security — its only job is a fast redirect for the common case.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublicAdminRoute = pathname === "/admin/login";
  if (pathname.startsWith("/admin") && !isPublicAdminRoute) {
    const hasCookie = request.cookies.has(SESSION_COOKIE_NAME);
    if (!hasCookie) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
