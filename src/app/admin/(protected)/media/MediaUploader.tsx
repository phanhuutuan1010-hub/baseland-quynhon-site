"use client";

import { useRef, useState } from "react";
import { uploadMediaFile } from "./uploadFile";
import type { MediaItem } from "./types";

const ACCEPT = "image/jpeg,image/png,image/webp,image/gif,video/mp4,application/pdf";

// Vercel Blob + the image resize route can handle a few requests at once,
// but firing 50 uploads in parallel would hammer both — process in a small
// fixed-size pool instead of Promise.all-ing the whole batch.
const CONCURRENCY = 4;
const MAX_FILES = 50;

type FileStatus = "pending" | "uploading" | "success" | "error";
type FileState = { key: string; name: string; status: FileStatus; error?: string };

export function MediaUploader({ onUploaded }: { onUploaded: (item: MediaItem) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [queue, setQueue] = useState<FileState[] | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [limitError, setLimitError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const busy = queue !== null && queue.some((f) => f.status === "pending" || f.status === "uploading");

  function updateFile(key: string, patch: Partial<FileState>) {
    setQueue((prev) => prev && prev.map((f) => (f.key === key ? { ...f, ...patch } : f)));
  }

  async function handleFiles(fileList: FileList | File[]) {
    const files = Array.from(fileList);
    if (files.length === 0) return;
    setLimitError(null);
    setSummary(null);

    if (files.length > MAX_FILES) {
      setLimitError(`Bạn đã chọn ${files.length} file — tối đa ${MAX_FILES} file/lượt. Vui lòng chọn ít file hơn.`);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    const initial: FileState[] = files.map((file, i) => ({
      key: `${Date.now()}-${i}-${file.name}`,
      name: file.name,
      status: "pending",
    }));
    setQueue(initial);

    let succeeded = 0;
    let failed = 0;
    let cursor = 0;

    async function worker() {
      while (cursor < files.length) {
        const index = cursor;
        cursor += 1;
        const file = files[index];
        const key = initial[index].key;

        updateFile(key, { status: "uploading" });
        const result = await uploadMediaFile(file);
        if ("error" in result) {
          failed += 1;
          updateFile(key, { status: "error", error: result.error });
        } else {
          succeeded += 1;
          updateFile(key, { status: "success" });
          onUploaded(result.item);
        }
      }
    }

    await Promise.all(Array.from({ length: Math.min(CONCURRENCY, files.length) }, worker));

    setSummary(`${succeeded}/${files.length} thành công${failed > 0 ? `, ${failed} lỗi` : ""}.`);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div
      className={`flex flex-col gap-3 rounded-sm border border-dashed p-5 transition-colors ${
        dragging ? "border-[var(--color-brand-green)] bg-[var(--color-brand-green)]/5" : "border-[var(--color-border)]"
      } bg-[var(--color-warm-white)]`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        if (e.dataTransfer.files.length > 0) handleFiles(e.dataTransfer.files);
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        multiple
        disabled={busy}
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) handleFiles(e.target.files);
        }}
        className="font-body text-sm"
      />
      <p className="m-0 font-body text-xs text-[var(--color-text-muted)]">
        Chọn hoặc kéo-thả nhiều file cùng lúc (tối đa {MAX_FILES}) · Ảnh (JPG/PNG/WEBP/GIF, tối đa 4MB, tự nén WebP) · Video MP4 (tối
        đa 200MB) · PDF (tối đa 20MB)
      </p>
      {limitError && <p className="m-0 font-body text-sm text-[var(--color-error)]">{limitError}</p>}
      {queue && (
        <ul className="m-0 flex list-none flex-col gap-1 p-0">
          {queue.map((f) => (
            <li key={f.key} className="flex items-center justify-between gap-3 font-body text-sm">
              <span className="truncate text-[var(--color-text)]">{f.name}</span>
              <span
                className={
                  f.status === "success"
                    ? "text-[var(--color-brand-green)]"
                    : f.status === "error"
                      ? "text-[var(--color-error)]"
                      : "text-[var(--color-text-muted)]"
                }
              >
                {f.status === "pending" && "Đang chờ"}
                {f.status === "uploading" && "Đang tải lên…"}
                {f.status === "success" && "Thành công"}
                {f.status === "error" && `Lỗi — ${f.error}`}
              </span>
            </li>
          ))}
        </ul>
      )}
      {summary && <p className="m-0 font-body text-sm font-semibold text-[var(--color-text)]">{summary}</p>}
    </div>
  );
}
