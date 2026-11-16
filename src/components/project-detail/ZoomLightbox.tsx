"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLang } from "@/lib/i18n";

const MIN = 1;
const MAX = 5;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/**
 * Full-screen viewer for text-bearing images (floor plans, amenity plans,
 * location maps, unit layouts): the whole image fits the screen first
 * (never smaller), then zooms with +/−, the mouse wheel, double-click/tap
 * or a pinch, and pans by dragging. Rendered into <body> so no transformed
 * ancestor can trap it. Esc / ✕ closes.
 */
export function ZoomLightbox({
  src,
  alt,
  caption,
  width,
  height,
  onClose,
}: {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
  onClose: () => void;
}) {
  const { pick } = useLang();
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<{ dist: number; scale: number } | null>(null);
  const lastTap = useRef(0);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "+" || e.key === "=") zoomTo((s) => s * 1.5);
      if (e.key === "-") zoomTo((s) => s / 1.5);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  function zoomTo(next: (s: number) => number) {
    setScale((s) => {
      const v = clamp(next(s), MIN, MAX);
      if (v === 1) setPos({ x: 0, y: 0 });
      return v;
    });
  }

  function onWheel(e: React.WheelEvent) {
    zoomTo((s) => s * (e.deltaY < 0 ? 1.2 : 1 / 1.2));
  }

  function onPointerDown(e: React.PointerEvent) {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinch.current = { dist: Math.hypot(a.x - b.x, a.y - b.y), scale };
    }
  }

  function onPointerMove(e: React.PointerEvent) {
    const prev = pointers.current.get(e.pointerId);
    if (!prev) return;
    const cur = { x: e.clientX, y: e.clientY };
    pointers.current.set(e.pointerId, cur);
    if (pointers.current.size === 2 && pinch.current) {
      const [a, b] = [...pointers.current.values()];
      const ratio = Math.hypot(a.x - b.x, a.y - b.y) / (pinch.current.dist || 1);
      const base = pinch.current.scale;
      zoomTo(() => base * ratio);
      return;
    }
    if (scale > 1) setPos((p) => ({ x: p.x + cur.x - prev.x, y: p.y + cur.y - prev.y }));
  }

  function onPointerUp(e: React.PointerEvent) {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinch.current = null;
    // Double tap (touch) toggles 2.5× / fit.
    if (e.pointerType === "touch") {
      const now = e.timeStamp;
      if (now - lastTap.current < 300) zoomTo((s) => (s > 1 ? 1 : 2.5));
      lastTap.current = now;
    }
  }

  const btn =
    "flex h-11 min-w-11 cursor-pointer items-center justify-center rounded-full border border-[rgba(250,247,242,0.5)] bg-[rgba(20,20,20,0.55)] px-3 font-ui text-lg leading-none text-[var(--color-warm-white)] backdrop-blur-sm disabled:opacity-40";

  return createPortal(
    <div role="dialog" aria-modal="true" aria-label={alt} className="fixed inset-0 z-[260] flex flex-col bg-[rgba(24,22,20,0.96)]">
      <div
        className="relative min-h-0 flex-1 touch-none overflow-hidden select-none"
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        // (a touch double tap is handled in onPointerUp — skip its dblclick)
        onDoubleClick={(e) => e.timeStamp - lastTap.current > 600 && zoomTo((s) => (s > 1 ? 1 : 2.5))}
        style={{ cursor: scale > 1 ? "grab" : "zoom-in" }}
      >
        <div
          className="absolute inset-0 flex items-center justify-center p-3 transition-transform duration-150 ease-out sm:p-8"
          style={{ transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})` }}
        >
          <Image
            src={src}
            alt={alt}
            width={width || 2400}
            height={height || 1800}
            sizes="100vw"
            quality={90}
            draggable={false}
            className="pointer-events-none max-h-full w-auto max-w-full object-contain"
          />
        </div>
      </div>
      <div className="flex flex-none flex-wrap items-center justify-between gap-3 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))]">
        <p className="m-0 min-w-0 flex-1 basis-60 font-body text-[13px] leading-[1.5] text-[var(--color-sand)]">{caption}</p>
        <div className="flex flex-none gap-2">
          <button type="button" className={btn} onClick={() => zoomTo((s) => s / 1.5)} disabled={scale <= MIN} aria-label={pick({ vi: "Thu nhỏ", en: "Zoom out" })}>
            −
          </button>
          <button type="button" className={btn} onClick={() => zoomTo((s) => s * 1.5)} disabled={scale >= MAX} aria-label={pick({ vi: "Phóng to", en: "Zoom in" })}>
            +
          </button>
          <button type="button" className={`${btn} gap-2 px-4 text-xs font-bold tracking-[0.08em] uppercase`} onClick={onClose}>
            <span aria-hidden>✕</span> {pick({ vi: "Đóng", en: "Close" })}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

/** Small "⤢ Phóng to" chip placed over a zoomable image. */
export function ZoomBadge({ label }: { label: string }) {
  return (
    <span className="pointer-events-none absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-warm-white)] px-3.5 py-2 font-ui text-[11px] font-bold tracking-[0.07em] text-[var(--color-charcoal)] uppercase shadow-[var(--shadow-sm)]">
      <svg aria-hidden viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-none stroke-current stroke-2">
        <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
      </svg>
      {label}
    </span>
  );
}
