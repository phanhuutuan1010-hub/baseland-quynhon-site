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

export function kindForMimeType(mimeType: string): MediaKind | null {
  if (mimeType.startsWith("image/")) return "IMAGE";
  if (mimeType.startsWith("video/")) return "VIDEO";
  if (mimeType === "application/pdf") return "DOCUMENT";
  return null;
}

export function isAllowedMimeType(mimeType: string): mimeType is (typeof ALLOWED_MIME_TYPES)[number] {
  return (ALLOWED_MIME_TYPES as readonly string[]).includes(mimeType);
}
