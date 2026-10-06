import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/server/authConstants";

const OWN_DOMAIN = "baselandquynhon.com";
const ALLOWED_REFERER_HOST = /(^|\.)(google\.[a-z.]+|facebook\.com|fb\.com)$/i;
const ALLOWED_CRAWLER_UA = /Googlebot|Google-InspectionTool|AdsBot-Google|facebookexternalhit|Facebot|meta-externalagent/i;

// Hotlink protection for optimized images (/_next/image) and uploaded media
// served via the site's own /media/* rewrite (see next.config.ts). Allows:
// no Referer (direct visits, privacy-stripped browsers, the image
// optimizer's own internal fetch), this site and its subdomains, the
// current request host (localhost / Vercel previews), Google and Facebook.
function isHotlink(request: NextRequest): boolean {
  if (ALLOWED_CRAWLER_UA.test(request.headers.get("user-agent") ?? "")) return false;
  const referer = request.headers.get("referer");
  if (!referer) return false;
  let host: string;
  try {
    host = new URL(referer).hostname.toLowerCase();
  } catch {
    return true;
  }
  if (host === OWN_DOMAIN || host.endsWith(`.${OWN_DOMAIN}`)) return false;
  if (host === request.nextUrl.hostname.toLowerCase()) return false;
  return !ALLOWED_REFERER_HOST.test(host);
}

// Admin branch: cheap, cookie-presence-only gate — redirects obviously-anonymous visitors
// away from /admin before a page even renders. This is NOT the real
// authorization check: every admin page/layout and server action calls
// requireUser()/requireRole() (src/lib/server/auth.ts) themselves, which
// validates the session against the database. Do not rely on this file for
// security — its only job is a fast redirect for the common case.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/_next/image" || pathname.startsWith("/media/")) {
    return isHotlink(request) ? new NextResponse("Hotlinking not allowed", { status: 403 }) : NextResponse.next();
  }
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
  matcher: ["/admin/:path*", "/_next/image", "/media/:path*"],
};
