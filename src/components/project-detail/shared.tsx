"use client";

import { useEffect, useRef } from "react";

/** Counts up to `target` once it scrolls into view — used by ProjectStats
 * for animated key numbers (e.g. "864 residences"). Respects
 * prefers-reduced-motion (jumps straight to the target). */
export function AnimatedNumber({ target }: { target: number }) {
  const ref = useRef<HTMLDivElement>(null);

  // The server HTML always carries the real number (crawlers, link
  // previews and no-JS readers used to get "0" — the count-up's start
  // value). The count-up only runs client-side for numbers still below the
  // fold, writing to the DOM directly so React state/hydration never sees 0.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced || el.getBoundingClientRect().top < window.innerHeight) return;
    el.textContent = "0";
    let raf = 0;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const t0 = performance.now();
          const dur = 1400;
          const step = (now: number) => {
            const p = Math.min(1, (now - t0) / dur);
            el.textContent = String(Math.round(target * (1 - Math.pow(1 - p, 3))));
            if (p < 1) raf = requestAnimationFrame(step);
          };
          raf = requestAnimationFrame(step);
          io.unobserve(entry.target);
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
      el.textContent = String(target);
    };
  }, [target]);

  return <div ref={ref}>{target}</div>;
}

/** Pill/tab chip shared by the unit-type selector (ResidenceSelector) and
 * the floor-plan picker (FloorPlanViewer). */
export function chipClass(active: boolean) {
  return `whitespace-nowrap rounded-full border px-5 py-3 font-ui text-xs font-bold tracking-[0.07em] uppercase cursor-pointer transition-colors duration-200 ${
    active
      ? "border-[var(--color-charcoal)] bg-[var(--color-charcoal)] text-[var(--color-warm-white)]"
      : "border-[rgba(38,34,32,0.25)] bg-transparent text-[var(--color-charcoal)]"
  }`;
}
