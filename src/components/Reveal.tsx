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
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity var(--duration-slow) var(--ease-editorial) ${delayMs}ms, transform var(--duration-slow) var(--ease-editorial) ${delayMs}ms`,
      }}
    >
      {children}
    </div>
  );
}
