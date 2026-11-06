"use client";

import { useEffect } from "react";

const SETTLE_MS = 4000;
const USER_EVENTS = ["wheel", "touchstart", "keydown", "mousedown"] as const;

/**
 * Deep links from ads (/projects/qterra#gia): the browser's own jump happens
 * before fonts, the hero image and lazy images have settled, so the target
 * drifts. This re-aligns the target section to the top (scrollIntoView
 * honours each section's scroll-margin-top = header + anchor bar) whenever
 * the page height changes during the first few seconds — and stops for good
 * the moment the visitor scrolls, taps or presses a key themselves.
 */
export function HashScroll() {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id || !document.getElementById(id)) return;

    let done = false;
    const align = () => {
      if (done) return;
      document.getElementById(id)?.scrollIntoView({ block: "start", behavior: "instant" });
    };
    const finish = () => {
      done = true;
      ro.disconnect();
      window.clearTimeout(timer);
      window.removeEventListener("load", align);
      USER_EVENTS.forEach((e) => window.removeEventListener(e, finish));
    };

    USER_EVENTS.forEach((e) => window.addEventListener(e, finish, { passive: true }));
    const ro = new ResizeObserver(align);
    ro.observe(document.body);
    if (document.readyState === "complete") align();
    else window.addEventListener("load", align, { once: true });
    document.fonts?.ready.then(align).catch(() => {});
    const timer = window.setTimeout(finish, SETTLE_MS);
    align();
    return finish;
  }, []);

  return null;
}
