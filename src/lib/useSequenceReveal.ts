"use client";

import { useEffect, useState } from "react";

/**
 * Flips to `true` shortly after mount — the trigger for staged hero
 * sequences (bg fade-in → title reveal → tagline → CTA), matching the
 * design briefs' "step0/step1/step2..." pattern: every element reads this
 * SAME boolean and applies its own CSS transition-delay, so the whole
 * sequence is just a handful of inline styles keyed off one flag.
 * Respects prefers-reduced-motion — starts `true` immediately so nothing
 * ever depends on a timed reveal to become visible.
 */
export function useSequenceReveal() {
  // Plain `false` initial value (never window-dependent) so server and
  // client render identically on hydration — matching Reveal.tsx's proven
  // pattern. Computing this from matchMedia() in a lazy initializer instead
  // caused a real SSR/CSR hydration mismatch (client's first paint could
  // differ from the server's), which left the whole reveal stuck.
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setEntered(true);
      return;
    }
    // setTimeout, not requestAnimationFrame: rAF is paused by the browser
    // while the tab/pane is hidden or backgrounded, which would leave the
    // whole hero stuck at opacity:0 indefinitely for a page opened in a
    // background tab. A short timeout still fires (possibly throttled, but
    // never blocked) and gives the browser one tick to paint the initial
    // hidden state before flipping, so the CSS transition still animates.
    const t = setTimeout(() => setEntered(true), 30);
    return () => clearTimeout(t);
  }, []);

  return entered;
}

/** Fade + rise style for one step of a staged reveal sequence — pass an
 * increasing `delayMs` per element to stagger them off the same
 * `entered` flag from useSequenceReveal(). */
export function stepStyle(entered: boolean, delayMs: number, durationMs = 550) {
  return {
    opacity: entered ? 1 : 0,
    transform: entered ? "translateY(0)" : "translateY(20px)",
    transition: `opacity ${durationMs}ms var(--ease-editorial) ${delayMs}ms, transform ${durationMs}ms var(--ease-editorial) ${delayMs}ms`,
  } as const;
}

/** Fade + scale style — used for the final CTA step ("fade-in + scale nhẹ"
 * per the Homepage/Q'Terra briefs). */
export function stepScaleStyle(entered: boolean, delayMs: number, durationMs = 450) {
  return {
    opacity: entered ? 1 : 0,
    transform: entered ? "scale(1)" : "scale(0.94)",
    transition: `opacity ${durationMs}ms var(--ease-editorial) ${delayMs}ms, transform ${durationMs}ms var(--ease-editorial) ${delayMs}ms`,
  } as const;
}

/** A horizontal divider/accent line that grows from 0 to full width as part
 * of the reveal sequence ("gold line reveal" / line-reveal step shared by
 * every project hero — Simona's gold accent color makes it read as the
 * Art Deco gold-line moment without any project-specific fork). */
export function lineRevealStyle(entered: boolean, delayMs: number, widthPx: number, durationMs = 500) {
  return {
    width: entered ? `${widthPx}px` : "0px",
    opacity: entered ? 1 : 0,
    transition: `width ${durationMs}ms var(--ease-editorial) ${delayMs}ms, opacity ${Math.round(durationMs * 0.6)}ms var(--ease-editorial) ${delayMs}ms`,
  } as const;
}
