import type { NextConfig } from "next";

const blobPublicHost = process.env.BLOB_PUBLIC_HOST;

// Q'Terra + Cyra Estero moved to their own sites (apartqn-projects).
// statusCode 301 (Next's `permanent: true` would send 308).
const MOVED_PROJECTS = [
  { source: "/projects/qterra", destination: "https://qterra.apartqn.com" },
  { source: "/en/projects/qterra", destination: "https://qterra.apartqn.com/en" },
  { source: "/projects/cyra-estero", destination: "https://cyraestero.apartqn.com" },
  { source: "/en/projects/cyra-estero", destination: "https://cyraestero.apartqn.com/en" },
];

// Every other page stays as it is. Set REDIRECT_ALL_TO_APARTQN=1 on Vercel
// to also 301 all remaining public pages to https://apartqn.com (admin,
// API, build assets and media keep working).
const redirectAll = process.env.REDIRECT_ALL_TO_APARTQN === "1";

const nextConfig: NextConfig = {
  images: {
    // Vercel Blob (Media Library uploads, Phase 3) — hostname includes a
    // per-store id, so this must be a wildcard rather than one fixed host.
    remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
  },
  // Watermark assets read via fs at runtime (src/lib/server/watermark.ts) —
  // public/ and assets/ aren't traced into the function automatically.
  outputFileTracingIncludes: {
    "/api/media/upload-image": ["./public/images/brand/logo-baseland.png", "./assets/fonts/Geist-Regular.ttf"],
  },
  async redirects() {
    return [
      ...MOVED_PROJECTS.map((r) => ({ ...r, statusCode: 301 as const })),
      ...(redirectAll
        ? [{ source: "/:path((?!admin|api|_next|images|vendor|media|favicon|icon|apple-icon).*)", destination: "https://apartqn.com", statusCode: 301 as const }]
        : []),
    ];
  },
  // Own-domain path for uploaded media (see publicMediaUrl in
  // src/lib/server/media.ts); hotlink-checked in src/proxy.ts first.
  async rewrites() {
    return blobPublicHost ? [{ source: "/media/:path*", destination: `https://${blobPublicHost}/:path*` }] : [];
  },
};

export default nextConfig;
