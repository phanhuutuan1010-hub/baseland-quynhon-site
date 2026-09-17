"use client";

import { useState } from "react";
import Image from "next/image";
import { AdminTextField, AdminTextAreaField } from "@/components/admin/AdminField";
import { updateMedia, deleteMedia } from "./actions";
import type { MediaItem } from "./types";

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function MediaThumb({ item }: { item: MediaItem }) {
  if (item.kind === "IMAGE") {
    return (
      <div className="relative h-32 w-full overflow-hidden bg-[var(--color-sand)]">
        <Image src={item.url} alt={item.altVi || item.titleVi} fill sizes="200px" className="object-cover" />
      </div>
    );
  }
  return (
    <div className="flex h-32 w-full items-center justify-center bg-[var(--color-sand)] font-ui text-xs font-bold uppercase text-[var(--color-text-muted)]">
      {item.kind === "VIDEO" ? "Video" : "Tài liệu"}
    </div>
  );
}

function MediaCard({ item, onChange, onRemove }: { item: MediaItem; onChange: (item: MediaItem) => void; onRemove: (id: string) => void }) {
  const [draft, setDraft] = useState(item);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setSaving(true);
    setError(null);
    const result = await updateMedia(item.id, draft);
    setSaving(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    onChange(draft);
  }

  async function remove() {
    if (!confirm(`Xoá "${item.titleVi}"? Không thể hoàn tác.`)) return;
    const result = await deleteMedia(item.id);
    if (result.error) {
      alert(result.error);
      return;
    }
    onRemove(item.id);
  }

  return (
    <details className="overflow-hidden rounded-sm border border-[var(--color-border)] bg-[var(--color-warm-white)]">
      <summary className="cursor-pointer list-none">
        <MediaThumb item={item} />
        <div className="p-3">
          <p className="m-0 truncate font-ui text-xs font-semibold text-[var(--color-charcoal)]">{item.titleVi}</p>
          <p className="m-0 mt-0.5 font-body text-[11px] text-[var(--color-text-muted)]">{formatSize(item.size)}</p>
        </div>
      </summary>
      <div className="flex flex-col gap-3 border-t border-[var(--color-border)] p-4">
        <div className="grid grid-cols-2 gap-3">
          <AdminTextField label="Tiêu đề (VI)" value={draft.titleVi} onChange={(v) => setDraft({ ...draft, titleVi: v })} />
          <AdminTextField label="Tiêu đề (EN)" value={draft.titleEn} onChange={(v) => setDraft({ ...draft, titleEn: v })} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <AdminTextField label="Alt text (VI)" value={draft.altVi} onChange={(v) => setDraft({ ...draft, altVi: v })} />
          <AdminTextField label="Alt text (EN)" value={draft.altEn} onChange={(v) => setDraft({ ...draft, altEn: v })} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <AdminTextAreaField label="Chú thích (VI)" value={draft.captionVi} onChange={(v) => setDraft({ ...draft, captionVi: v })} rows={2} />
          <AdminTextAreaField label="Chú thích (EN)" value={draft.captionEn} onChange={(v) => setDraft({ ...draft, captionEn: v })} rows={2} />
        </div>
        {item.kind === "IMAGE" && (
          <div className="grid grid-cols-2 gap-3">
            <AdminTextField
              label="Điểm lấy nét X (0-1)"
              type="number"
              value={String(draft.focalX)}
              onChange={(v) => setDraft({ ...draft, focalX: Math.min(1, Math.max(0, Number(v) || 0)) })}
            />
            <AdminTextField
              label="Điểm lấy nét Y (0-1)"
              type="number"
              value={String(draft.focalY)}
              onChange={(v) => setDraft({ ...draft, focalY: Math.min(1, Math.max(0, Number(v) || 0)) })}
            />
          </div>
        )}
        {item.kind === "DOCUMENT" && (
          <label className="flex items-center gap-2 font-ui text-xs font-semibold tracking-[0.04em] uppercase">
            <input
              type="checkbox"
              checked={draft.requireLeadForDownload}
              onChange={(e) => setDraft({ ...draft, requireLeadForDownload: e.target.checked })}
            />
            Yêu cầu điền form liên hệ trước khi tải (chưa áp dụng ở site public)
          </label>
        )}
        <div>
          <p className="m-0 font-ui text-[10px] font-bold tracking-[0.04em] text-[var(--color-text-muted)] uppercase">URL</p>
          <p className="m-0 mt-1 truncate font-body text-xs text-[var(--color-charcoal)]">{draft.url}</p>
        </div>
        {error && <p className="m-0 font-body text-sm text-[var(--color-error)]">{error}</p>}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="rounded-xs bg-[var(--color-brand-green)] px-4 py-2 font-ui text-xs font-bold tracking-[0.04em] text-[var(--color-warm-white)] uppercase disabled:opacity-60"
          >
            {saving ? "Đang lưu…" : "Lưu"}
          </button>
          <button
            type="button"
            onClick={remove}
            className="rounded-xs border border-[var(--color-error)] px-4 py-2 font-ui text-xs font-bold tracking-[0.04em] text-[var(--color-error)] uppercase"
          >
            Xoá
          </button>
        </div>
      </div>
    </details>
  );
}

export function MediaGrid({ items, onChange, onRemove }: { items: MediaItem[]; onChange: (item: MediaItem) => void; onRemove: (id: string) => void }) {
  if (items.length === 0) {
    return <p className="m-0 font-body text-sm text-[var(--color-text-muted)]">Chưa có media nào — tải lên ở trên.</p>;
  }
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((item) => (
        <MediaCard key={item.id} item={item} onChange={onChange} onRemove={onRemove} />
      ))}
    </div>
  );
}
