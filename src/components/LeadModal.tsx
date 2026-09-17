"use client";

import { useEffect, useRef } from "react";
import type { Localized } from "@/lib/i18n";
import { useLang } from "@/lib/i18n";
import { LeadFormFull } from "@/components/LeadFormFull";

/**
 * Lightweight lead-capture dialog — wraps the existing LeadFormFull instead
 * of duplicating form logic. Used by ProjectVideoDuo's desktop CTA (mục 3:
 * "desktop mở Lead Modal/Contact Panel kèm context"); no portal (matches
 * Nav.tsx's mobile menu overlay, the only other full-screen overlay on the
 * site — same fixed-position pattern, no portal infrastructure exists).
 * Escape-to-close and body-scroll-lock follow the same approach already
 * established for that overlay.
 */
export function LeadModal({
  open,
  onClose,
  source,
  prefillNeed,
  contextNote,
}: {
  open: boolean;
  onClose: () => void;
  source: string;
  prefillNeed?: string;
  contextNote?: Localized<string>;
}) {
  const { pick } = useLang();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="presentation"
      onClick={onClose}
      className="fixed inset-0 z-[300] flex items-center justify-center overflow-y-auto bg-[rgba(38,34,32,0.7)] p-4 py-10 sm:p-8"
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={pick({ vi: "Biểu mẫu liên hệ tư vấn viên", en: "Sales advisor contact form" })}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-135 rounded-sm bg-[var(--color-warm-white)] p-6 shadow-[var(--shadow-lg)] outline-none sm:p-9"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={pick({ vi: "Đóng", en: "Close" })}
          className="absolute top-4 right-4 cursor-pointer border-none bg-transparent text-2xl leading-none text-[var(--color-clay)] hover:text-[var(--color-charcoal)]"
        >
          ×
        </button>
        <LeadFormFull source={source} prefillNeed={prefillNeed} contextNote={contextNote} />
      </div>
    </div>
  );
}
