"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Continuously tracks whether the ref'd element is in view — unlike
 * useInView (which fires once and disconnects, for one-shot reveal
 * animations), this keeps observing so video playback can start when a
 * card scrolls in and stop when it scrolls out, per the brief's mục 3
 * ("rời viewport thì pause — không để 2 video cùng chạy khi section không
 * còn được xem"). Starts `false` on both server and client (no
 * matchMedia-in-lazy-initializer — see useSequenceReveal.ts for why that
 * caused a real hydration bug); reduced-motion is handled by the caller
 * (VideoStoryCard never autoplays when it's set, regardless of viewport).
 */
export function useViewportPlayback<T extends HTMLElement>(threshold = 0.5) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          setInView(entry.isIntersecting);
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return { ref, inView };
}
