import type { NextConfig } from "next";

const blobPublicHost = process.env.BLOB_PUBLIC_HOST;

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
  // Own-domain path for uploaded media (see publicMediaUrl in
  // src/lib/server/media.ts); hotlink-checked in src/proxy.ts first.
  async rewrites() {
    return blobPublicHost ? [{ source: "/media/:path*", destination: `https://${blobPublicHost}/:path*` }] : [];
  },
};

export default nextConfig;
