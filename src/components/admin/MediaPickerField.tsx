"use client";

import { useState } from "react";
import Image from "next/image";
import { listMedia } from "@/app/admin/(protected)/media/actions";
import type { MediaItem } from "@/app/admin/(protected)/media/types";

// Keeps the plain URL text input (existing content — old /public/images
// paths, values typed in before this component existed — is never migrated
// into the Media Library, see plan) and adds an optional "Chọn từ Media"
// picker on top of it, rather than replacing the input outright.
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

  async function openPicker() {
    setOpen(true);
    if (items) return;
    setLoading(true);
    const rows = await listMedia();
    setItems(
      rows
        .filter((r) => !kindFilter || r.kind === kindFilter)
        .map((r) => ({
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
        })),
    );
    setLoading(false);
  }

  return (
    <div className="flex flex-col gap-1.5">
      <span className="font-ui text-xs font-semibold tracking-[0.04em] text-[var(--color-text-muted)] uppercase">{label}</span>
      <div className="flex gap-2">
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
          Chọn từ Media
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
            {loading && <p className="m-0 font-body text-sm text-[var(--color-text-muted)]">Đang tải…</p>}
            {!loading && items?.length === 0 && (
              <p className="m-0 font-body text-sm text-[var(--color-text-muted)]">Chưa có media nào — tải lên ở trang Media trước.</p>
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
