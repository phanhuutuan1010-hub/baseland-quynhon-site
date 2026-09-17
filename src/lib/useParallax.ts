"use client";

import { useEffect, useRef } from "react";

/**
 * Subtle scroll parallax for a hero background — About page only (its
 * brief explicitly allows "subtle parallax"; every other page's brief
 * explicitly bans heavy parallax, so this hook is deliberately not reused
 * elsewhere). Moves the ref'd element a few px slower than scroll, capped
 * to `maxOffsetPx` so it never reads as more than a light drift. Passive
 * scroll listener, transform-only (no layout reflow). Disabled entirely
 * under prefers-reduced-motion — the element just stays put.
 */
export function useParallax<T extends HTMLElement>(maxOffsetPx = 40, strength = 0.15) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const rect = el.getBoundingClientRect();
        const offset = Math.max(-maxOffsetPx, Math.min(maxOffsetPx, rect.top * strength));
        el.style.transform = `translateY(${offset}px)`;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [maxOffsetPx, strength]);

  return ref;
}
