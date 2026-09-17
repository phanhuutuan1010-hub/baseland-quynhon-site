"use client";

import { useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import { createMedia } from "./actions";
import type { MediaItem } from "./types";

const ACCEPT = "image/jpeg,image/png,image/webp,image/gif,video/mp4,application/pdf";

export function MediaUploader({ onUploaded }: { onUploaded: (item: MediaItem) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setPending(true);
    setError(null);
    try {
      const blob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/media/upload",
      });

      const baseName = file.name.replace(/\.[^.]+$/, "");
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

      if (result.error || !result.id) {
        setError(result.error ?? "Có lỗi xảy ra");
        return;
      }

      onUploaded({
        id: result.id,
        filename: file.name,
        url: blob.url,
        mimeType: file.type,
        size: file.size,
        kind: file.type.startsWith("image/") ? "IMAGE" : file.type.startsWith("video/") ? "VIDEO" : "DOCUMENT",
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
      });
    } catch (err) {
      // @vercel/blob's client always throws this exact generic message on
      // any non-2xx from /api/media/upload — it never surfaces our route's
      // own error body — so a missing BLOB_READ_WRITE_TOKEN and a real
      // permission error look identical here. Point at the one most likely
      // cause rather than showing the unhelpful generic text verbatim.
      const message = err instanceof Error ? err.message : "Upload thất bại";
      setError(
        message.includes("retrieve the client token")
          ? "Không thể upload — có thể chưa cấu hình BLOB_READ_WRITE_TOKEN trên server. Xem ADMIN_GUIDE.md mục 9."
          : message,
      );
    } finally {
      setPending(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-2 rounded-sm border border-dashed border-[var(--color-border)] bg-[var(--color-warm-white)] p-5">
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        disabled={pending}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
        className="font-body text-sm"
      />
      <p className="m-0 font-body text-xs text-[var(--color-text-muted)]">
        Ảnh (JPG/PNG/WEBP/GIF, tối đa 10MB) · Video MP4 (tối đa 200MB) · PDF (tối đa 20MB)
      </p>
      {pending && <p className="m-0 font-body text-sm text-[var(--color-brand-green)]">Đang tải lên…</p>}
      {error && <p className="m-0 font-body text-sm text-[var(--color-error)]">{error}</p>}
    </div>
  );
}
