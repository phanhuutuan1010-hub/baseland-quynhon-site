"use client";

import { useState } from "react";
import Image from "next/image";
import { MediaPickerModal } from "@/components/admin/MediaPickerModal";
import type { MediaItem } from "@/app/admin/(protected)/media/types";

// Keeps the plain URL text input (existing content — old /public/images
// paths, values typed in before this component existed — is never migrated
// into the Media Library, see plan) and adds two ways to set it from real
// media: pick something already uploaded, or upload a new file right here
// (which also lands in the Media Library like any other upload) — both via
// the shared MediaPickerModal.
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
          onClick={() => setOpen(true)}
          className="shrink-0 rounded-xs border border-[var(--color-border)] px-3.5 py-2.5 font-ui text-xs font-bold tracking-[0.04em] uppercase hover:bg-[var(--color-sand)]"
        >
          Chọn media
        </button>
      </div>

      <MediaPickerModal open={open} onClose={() => setOpen(false)} onSelect={onChange} kindFilter={kindFilter} />
    </div>
  );
}
