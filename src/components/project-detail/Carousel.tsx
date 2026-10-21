"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useLang } from "@/lib/i18n";

/**
 * Sideways card row with snap, a peek of the next card and prev/next
 * arrows (CLAUDE.md: an overflowing card row is always a carousel — never
 * silently clipped). Arrows only appear while the row actually overflows,
 * so the same markup can become a plain grid at wider breakpoints via
 * `className` (e.g. `md:grid md:grid-cols-4`).
 *
 * Children should carry their own width (`itemClass` helps: ~78% on
 * phones, so the next card always peeks in).
 */
export function Carousel({
  children,
  className = "",
  dark,
  label,
}: {
  children: ReactNode;
  /** Extra classes for the scrolling row (gap, breakpoint grid…). */
  className?: string;
  /** Arrow colours for dark sections. */
  dark?: boolean;
  label?: string;
}) {
  const { pick } = useLang();
  const rowRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState({ overflow: false, atStart: true, atEnd: false });

  const measure = useCallback(() => {
    const el = rowRef.current;
    if (!el) return;
    const overflow = el.scrollWidth > el.clientWidth + 2;
    setState({ overflow, atStart: el.scrollLeft <= 2, atEnd: el.scrollLeft + el.clientWidth >= el.scrollWidth - 2 });
  }, []);

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    el.addEventListener("scroll", measure, { passive: true });
    return () => {
      ro.disconnect();
      el.removeEventListener("scroll", measure);
    };
  }, [measure]);

  const step = (dir: 1 | -1) => {
    const el = rowRef.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 16;
    el.scrollBy({ left: dir * ((card?.offsetWidth ?? el.clientWidth * 0.8) + gap), behavior: "smooth" });
  };

  const arrow = `flex h-11 w-11 flex-none cursor-pointer items-center justify-center rounded-full border text-lg transition-opacity disabled:cursor-default disabled:opacity-30 ${
    dark
      ? "border-[rgba(250,245,238,0.45)] bg-transparent text-[var(--color-warm-white)] hover:bg-[rgba(250,245,238,0.1)]"
      : "border-[var(--color-border)] bg-[var(--color-warm-white)] text-[var(--color-charcoal)] hover:border-[var(--project-accent)]"
  }`;

  return (
    <div role="region" aria-roledescription="carousel" aria-label={label}>
      <div
        ref={rowRef}
        className={`no-scrollbar -mx-5 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-2 sm:-mx-8 sm:scroll-px-8 sm:px-8 ${className}`}
      >
        {children}
      </div>
      {state.overflow && (
        <div className="mt-4 flex justify-end gap-2.5">
          <button type="button" onClick={() => step(-1)} disabled={state.atStart} aria-label={pick({ vi: "Trước", en: "Previous" })} className={arrow}>
            ←
          </button>
          <button type="button" onClick={() => step(1)} disabled={state.atEnd} aria-label={pick({ vi: "Sau", en: "Next" })} className={arrow}>
            →
          </button>
        </div>
      )}
    </div>
  );
}

/** Card width inside a Carousel: the next card always peeks in on phones. */
export const carouselItemClass = "w-[78%] max-w-80 flex-none snap-start";
