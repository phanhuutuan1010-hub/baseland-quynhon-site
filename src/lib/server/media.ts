import "server-only";

import type { MediaKind } from "@prisma/client";

// SVG is deliberately excluded — an uploaded SVG can carry an inline
// <script>/event handler and would be a stored-XSS vector if ever rendered
// inline or opened directly from the Blob origin.
export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "application/pdf",
] as const;

export const MAX_SIZE_BY_KIND: Record<MediaKind, number> = {
  IMAGE: 10 * 1024 * 1024,
  VIDEO: 200 * 1024 * 1024,
  DOCUMENT: 20 * 1024 * 1024,
};

// Raw (pre-compression) size cap for image uploads specifically — these go
// through the server for resize/WebP conversion (see
// src/app/api/media/upload-image/route.ts), unlike video/PDF which upload
// browser-direct-to-Blob. Vercel Serverless Functions cap request body at
// 4.5MB platform-wide; 4MB leaves headroom for multipart framing.
export const MAX_RAW_IMAGE_UPLOAD_BYTES = 4 * 1024 * 1024;

// Long edge cap after resize — large enough for any hero/banner use on this
// site, small enough that a full-res camera photo doesn't ship untouched.
export const IMAGE_MAX_DIMENSION = 2560;
export const IMAGE_WEBP_QUALITY = 80;

export function kindForMimeType(mimeType: string): MediaKind | null {
  if (mimeType.startsWith("image/")) return "IMAGE";
  if (mimeType.startsWith("video/")) return "VIDEO";
  if (mimeType === "application/pdf") return "DOCUMENT";
  return null;
}

export function isAllowedMimeType(mimeType: string): mimeType is (typeof ALLOWED_MIME_TYPES)[number] {
  return (ALLOWED_MIME_TYPES as readonly string[]).includes(mimeType);
}
