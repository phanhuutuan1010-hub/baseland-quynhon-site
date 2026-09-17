import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Vercel Blob (Media Library uploads, Phase 3) — hostname includes a
    // per-store id, so this must be a wildcard rather than one fixed host.
    remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
  },
};

export default nextConfig;
