"use client";

import { useRef, useState } from "react";
import { uploadMediaFile } from "./uploadFile";
import type { MediaItem } from "./types";

const ACCEPT = "image/jpeg,image/png,image/webp,image/gif,video/mp4,application/pdf";

export function MediaUploader({ onUploaded }: { onUploaded: (item: MediaItem) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setPending(true);
    setError(null);
    const result = await uploadMediaFile(file);
    if ("error" in result) {
      setError(result.error);
    } else {
      onUploaded(result.item);
    }
    setPending(false);
    if (inputRef.current) inputRef.current.value = "";
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
        Ảnh (JPG/PNG/WEBP/GIF, tối đa 4MB, tự nén WebP) · Video MP4 (tối đa 200MB) · PDF (tối đa 20MB)
      </p>
      {pending && <p className="m-0 font-body text-sm text-[var(--color-brand-green)]">Đang tải lên…</p>}
      {error && <p className="m-0 font-body text-sm text-[var(--color-error)]">{error}</p>}
    </div>
  );
}
