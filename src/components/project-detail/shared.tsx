"use client";

import { useEffect, useRef, useState } from "react";

/** Counts up to `target` once it scrolls into view — used by ProjectStats
 * for animated key numbers (e.g. "864 residences"). Respects
 * prefers-reduced-motion (jumps straight to the target). */
export function AnimatedNumber({ target }: { target: number }) {
  const ref = useRef<HTMLDivElement>(null);
  // Plain `0` initial value (never window-dependent) so server and client
  // render identically on hydration — see useSequenceReveal.ts for why a
  // matchMedia-dependent lazy initializer here caused a hydration mismatch.
  const [value, setValue] = useState(0);

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setValue(target);
      return;
    }
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const t0 = performance.now();
          const dur = 1400;
          const step = (now: number) => {
            const p = Math.min(1, (now - t0) / dur);
            const eased = 1 - Math.pow(1 - p, 3);
            setValue(Math.round(target * eased));
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
    };
  }, [target]);

  return <div ref={ref}>{value}</div>;
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
