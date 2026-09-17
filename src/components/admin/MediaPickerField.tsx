"use client";

import { useRef, useState } from "react";
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

// Keeps the plain URL text input (existing content — old /public/images
// paths, values typed in before this component existed — is never migrated
// into the Media Library, see plan) and adds two ways to set it from real
// media: pick something already uploaded, or upload a new file right here
// (which also lands in the Media Library like any other upload).
export function MediaPickerField({
  label,
  value,
  onChange,
  kindFilter,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  kindFilter?: MediaItem["kind"];
}) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<MediaItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function openPicker() {
    setOpen(true);
    setError(null);
    if (items) return;
    setLoading(true);
    const rows = await listMedia();
    setItems(rows.filter((r) => !kindFilter || r.kind === kindFilter).map(toItem));
    setLoading(false);
  }

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
    onChange(result.item.url);
    setOpen(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  const showPreview = kindFilter === "IMAGE" && value;

  return (
    <div className="flex flex-col gap-1.5">
      <span className="font-ui text-xs font-semibold tracking-[0.04em] text-[var(--color-text-muted)] uppercase">{label}</span>
      <div className="flex items-center gap-2">
        {showPreview && (
          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xs border border-[var(--color-border)] bg-[var(--color-sand)]">
            <Image src={value} alt="" fill sizes="44px" className="object-cover" />
          </div>
        )}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-w-0 flex-1 rounded-xs border border-[var(--color-border)] bg-[var(--color-warm-white)] px-3.5 py-2.5 font-body text-[var(--fs-body)] text-[var(--color-charcoal)] outline-none focus-visible:border-[var(--color-brand-green)] focus-visible:ring-2 focus-visible:ring-[var(--color-brand-green)]/30"
        />
        <button
          type="button"
          onClick={openPicker}
          className="shrink-0 rounded-xs border border-[var(--color-border)] px-3.5 py-2.5 font-ui text-xs font-bold tracking-[0.04em] uppercase hover:bg-[var(--color-sand)]"
        >
          Chọn media
        </button>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6"
          onClick={() => setOpen(false)}
        >
          <div
            className="flex max-h-[80vh] w-full max-w-3xl flex-col gap-4 overflow-y-auto rounded-sm bg-[var(--color-warm-white)] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="m-0 font-ui text-sm font-bold tracking-[0.04em] text-[var(--color-charcoal)] uppercase">Chọn media</h2>
              <button type="button" onClick={() => setOpen(false)} className="font-ui text-xs font-bold uppercase text-[var(--color-text-muted)]">
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

            {loading && <p className="m-0 font-body text-sm text-[var(--color-text-muted)]">Đang tải…</p>}
            {!loading && items?.length === 0 && (
              <p className="m-0 font-body text-sm text-[var(--color-text-muted)]">Chưa có media nào — tải lên ở trên.</p>
            )}
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {items?.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onChange(item.url);
                    setOpen(false);
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
      )}
    </div>
  );
}
