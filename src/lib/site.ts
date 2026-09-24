// Canonical origin for canonical URLs, Open Graph, sitemap and JSON-LD.
// Defaults to the production domain: NEXT_PUBLIC_SITE_URL was never set on
// Vercel, and the old "http://localhost:3000" fallback shipped to production
// as every page's canonical/og:image/sitemap URL.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.baselandquynhon.com").replace(/\/$/, "");

export const SITE_NAME = "Base Land Quy Nhơn";
