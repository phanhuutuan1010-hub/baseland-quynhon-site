"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { listMedia } from "@/app/admin/(protected)/media/actions";
import { uploadMediaFile } from "@/app/admin/(protected)/media/uploadFile";
import type { MediaItem } from "@/app/admin/(protected)/media/types";

function toItem(r: Awaited<ReturnType<typeof listMedia>>[number]): MediaItem {
  return {
    id: r.id,
    filename: r.filename,
    url: r.url,
    mimeType: r.mimeType,
    size: r.size,
    kind: r.kind,
    titleVi: r.titleVi,
    titleEn: r.titleEn,
    altVi: r.altVi,
    altEn: r.altEn,
    captionVi: r.captionVi ?? "",
    captionEn: r.captionEn ?? "",
    focalX: r.focalX,
    focalY: r.focalY,
    requireLeadForDownload: r.requireLeadForDownload,
    createdAt: r.createdAt.toISOString(),
  };
}

const ACCEPT_BY_KIND: Record<MediaItem["kind"], string> = {
  IMAGE: "image/jpeg,image/png,image/webp,image/gif",
  VIDEO: "video/mp4",
  DOCUMENT: "application/pdf",
};

// The "browse Media Library or upload right here" modal — shared by
// MediaPickerField (single-value form fields) and RichTextEditor's Image
// toolbar button (insert-at-cursor), so there's exactly one picker UI
// instead of a second one growing inside the editor.
export function MediaPickerModal({
  open,
  onClose,
  onSelect,
  kindFilter,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  kindFilter?: MediaItem["kind"];
}) {
  // No separate `loading` boolean: `items` is null until the fetch below
  // resolves, which is all the "Đang tải…" state needs — one less setState
  // call in the effect (see the setState-in-effect rule this repo enforces).
  const [items, setItems] = useState<MediaItem[] | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    listMedia().then((rows) => {
      if (cancelled) return;
      setItems(rows.filter((r) => !kindFilter || r.kind === kindFilter).map(toItem));
    });
    return () => {
      cancelled = true;
    };
  }, [open, kindFilter]);

  async function handleUpload(file: File) {
    setUploading(true);
    setError(null);
    const result = await uploadMediaFile(file);
    setUploading(false);
    if ("error" in result) {
      setError(result.error);
      return;
    }
    setItems((prev) => [result.item, ...(prev ?? [])]);
    onSelect(result.item.url);
    onClose();
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6" onClick={onClose}>
      <div
        className="flex max-h-[80vh] w-full max-w-3xl flex-col gap-4 overflow-y-auto rounded-sm bg-[var(--color-warm-white)] p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="m-0 font-ui text-sm font-bold tracking-[0.04em] text-[var(--color-charcoal)] uppercase">Chọn media</h2>
          <button type="button" onClick={onClose} className="font-ui text-xs font-bold uppercase text-[var(--color-text-muted)]">
            Đóng
          </button>
        </div>

        <div className="flex items-center gap-3 rounded-xs border border-dashed border-[var(--color-border)] p-3">
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPT_BY_KIND[kindFilter ?? "IMAGE"]}
            disabled={uploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleUpload(file);
            }}
            className="min-w-0 flex-1 font-body text-sm"
          />
          {uploading && <span className="shrink-0 font-body text-xs text-[var(--color-brand-green)]">Đang tải lên…</span>}
        </div>
        {error && <p className="m-0 font-body text-sm text-[var(--color-error)]">{error}</p>}

        {items === null && <p className="m-0 font-body text-sm text-[var(--color-text-muted)]">Đang tải…</p>}
        {items?.length === 0 && (
          <p className="m-0 font-body text-sm text-[var(--color-text-muted)]">Chưa có media nào — tải lên ở trên.</p>
        )}
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {items?.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onSelect(item.url);
                onClose();
              }}
              className="overflow-hidden rounded-xs border border-[var(--color-border)] text-left hover:border-[var(--color-brand-green)]"
            >
              {item.kind === "IMAGE" ? (
                <div className="relative h-24 w-full bg-[var(--color-sand)]">
                  <Image src={item.url} alt={item.altVi || item.titleVi} fill sizes="150px" className="object-cover" />
                </div>
              ) : (
                <div className="flex h-24 w-full items-center justify-center bg-[var(--color-sand)] font-ui text-[10px] font-bold uppercase text-[var(--color-text-muted)]">
                  {item.kind === "VIDEO" ? "Video" : "Tài liệu"}
                </div>
              )}
              <p className="m-0 truncate p-2 font-ui text-[11px] font-semibold text-[var(--color-charcoal)]">{item.titleVi}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
