"use client";

import { useEffect, useRef, useState } from "react";

/**
 * True once the returned ref's element has scrolled into view (fires once,
 * like Reveal's own IntersectionObserver, but returns the raw boolean
 * instead of a ready-made fade style — for effects Reveal doesn't cover,
 * e.g. a background image's slow scale-in or a clip-path/mask reveal.
 * Respects prefers-reduced-motion (starts `true`, no observer attached).
 */
export function useInView<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T>(null);
  // Plain `false` initial value — see useSequenceReveal.ts for why a
  // matchMedia-dependent lazy initializer here caused a hydration mismatch.
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setInView(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            io.unobserve(entry.target);
          }
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return { ref, inView };
}
