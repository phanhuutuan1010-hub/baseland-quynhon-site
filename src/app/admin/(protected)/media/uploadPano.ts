"use client";

import { upload } from "@vercel/blob/client";
import type { MediaItem } from "./types";

export const PANO_MAX_MB = 25;
const PANO_TYPES = ["image/jpeg", "image/png", "image/webp"];

/** 360° image upload: raw file browser → Blob ("pano-raw/…", up to 25MB,
 * past the 4.5MB function body limit), then /api/media/process-pano makes
 * the ≤6000px WebP q80 Media item and deletes the raw copy. */
export async function uploadPanoFile(file: File): Promise<{ item: MediaItem } | { error: string }> {
  if (!PANO_TYPES.includes(file.type)) return { error: "Ảnh 360° phải là JPG, PNG hoặc WebP." };
  if (file.size > PANO_MAX_MB * 1024 * 1024) return { error: `Ảnh 360° tối đa ${PANO_MAX_MB}MB.` };

  const safe = file.name.normalize("NFC").replace(/[^\p{L}\p{N}._-]+/gu, "-");
  let rawUrl: string;
  try {
    const blob = await upload(`pano-raw/${safe}`, file, { access: "public", handleUploadUrl: "/api/media/upload", clientPayload: "pano" });
    rawUrl = blob.url;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload thất bại";
    return {
      error: message.includes("retrieve the client token")
        ? "Không thể upload — có thể chưa cấu hình BLOB_READ_WRITE_TOKEN trên server. Xem ADMIN_GUIDE.md mục 9."
        : message,
    };
  }

  try {
    const res = await fetch("/api/media/process-pano", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: rawUrl, filename: file.name }),
    });
    const body = await res.json().catch(() => null);
    if (!res.ok || !body?.item) return { error: body?.error ?? "Xử lý ảnh 360° thất bại." };
    return { item: body.item as MediaItem };
  } catch {
    return { error: "Không thể kết nối máy chủ để xử lý ảnh 360°." };
  }
}
