"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Fade-and-rise-in wrapper, replicating the design bundle's per-section
 * IntersectionObserver reveal (revealMap/refs pattern in each .dc.html).
 * Respects prefers-reduced-motion by rendering already-visible.
 */
export function Reveal({
  children,
  className,
  delayMs = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setVisible(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        // "none" once visible (not translate(0)): a transformed ancestor
        // would trap position:fixed overlays (fullscreen 360°, modals).
        // Offset comes from the project theme (--reveal-x/--reveal-y), e.g.
        // a sideways slide for Cyra Estero; default is a 28px rise.
        transform: visible ? "none" : "translate(var(--reveal-x, 0px), var(--reveal-y, 28px))",
        transition: `opacity var(--duration-slow) var(--ease-editorial) ${delayMs}ms, transform var(--duration-slow) var(--ease-editorial) ${delayMs}ms`,
      }}
    >
      {children}
    </div>
  );
}
