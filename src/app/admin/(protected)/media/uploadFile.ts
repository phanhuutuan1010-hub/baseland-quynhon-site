"use client";

import { upload } from "@vercel/blob/client";
import { createMedia } from "./actions";
import type { MediaItem } from "./types";

// Shared by MediaUploader.tsx (dedicated Media Library upload) and
// MediaPickerField.tsx ("upload mới ngay tại chỗ" from inside a content
// form) — same two-step flow either way: get the file into Blob storage,
// then persist a Media row via the createMedia Server Action.
//
// Images route through /api/media/upload-image, a normal server endpoint
// that resizes + re-encodes to WebP before storing (see that route for why
// this only works for images, not video/PDF, which stay on the client-
// direct-to-Blob token flow below).
export async function uploadMediaFile(file: File): Promise<{ item: MediaItem } | { error: string }> {
  const baseName = file.name.replace(/\.[^.]+$/, "") || "media";

  if (file.type.startsWith("image/")) {
    const formData = new FormData();
    formData.append("file", file);
    let res: Response;
    try {
      res = await fetch("/api/media/upload-image", { method: "POST", body: formData });
    } catch {
      return { error: "Không thể kết nối máy chủ để upload." };
    }
    const body = await res.json().catch(() => null);
    if (!res.ok || !body?.url) {
      return { error: body?.error ?? "Upload ảnh thất bại." };
    }

    const result = await createMedia({
      filename: body.filename,
      url: body.url,
      mimeType: body.mimeType,
      size: body.size,
      width: body.width,
      height: body.height,
      titleVi: baseName,
      titleEn: baseName,
      altVi: "",
      altEn: "",
    });
    if (result.error || !result.id) return { error: result.error ?? "Có lỗi xảy ra" };

    return {
      item: {
        id: result.id,
        filename: body.filename,
        url: body.url,
        mimeType: body.mimeType,
        size: body.size,
        kind: "IMAGE",
        titleVi: baseName,
        titleEn: baseName,
        altVi: "",
        altEn: "",
        captionVi: "",
        captionEn: "",
        focalX: 0.5,
        focalY: 0.5,
        requireLeadForDownload: false,
        createdAt: new Date().toISOString(),
      },
    };
  }

  // Video/PDF: browser uploads straight to Blob storage via a signed
  // client token — see src/app/api/media/upload/route.ts.
  try {
    const blob = await upload(file.name, file, { access: "public", handleUploadUrl: "/api/media/upload" });

    const result = await createMedia({
      filename: file.name,
      url: blob.url,
      mimeType: file.type,
      size: file.size,
      titleVi: baseName,
      titleEn: baseName,
      altVi: "",
      altEn: "",
    });
    if (result.error || !result.id) return { error: result.error ?? "Có lỗi xảy ra" };

    return {
      item: {
        id: result.id,
        filename: file.name,
        url: blob.url,
        mimeType: file.type,
        size: file.size,
        kind: file.type.startsWith("video/") ? "VIDEO" : "DOCUMENT",
        titleVi: baseName,
        titleEn: baseName,
        altVi: "",
        altEn: "",
        captionVi: "",
        captionEn: "",
        focalX: 0.5,
        focalY: 0.5,
        requireLeadForDownload: false,
        createdAt: new Date().toISOString(),
      },
    };
  } catch (err) {
    // @vercel/blob's client always throws this exact generic message on
    // any non-2xx from /api/media/upload — it never surfaces our route's
    // own error body — so a missing BLOB_READ_WRITE_TOKEN and a real
    // permission error look identical here. Point at the one most likely
    // cause rather than showing the unhelpful generic text verbatim.
    const message = err instanceof Error ? err.message : "Upload thất bại";
    return {
      error: message.includes("retrieve the client token")
        ? "Không thể upload — có thể chưa cấu hình BLOB_READ_WRITE_TOKEN trên server. Xem ADMIN_GUIDE.md mục 9."
        : message,
    };
  }
}
