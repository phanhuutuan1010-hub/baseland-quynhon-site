"use client";

import { useRef } from "react";

/** Horizontally-scrolling row with prev/next round buttons, used for the
 * Homepage's Q'Terra amenities strip. */
export function HScroller({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  const scrollBy = (dx: number) => ref.current?.scrollBy({ left: dx, behavior: "smooth" });

  return (
    <div>
      <div className="mb-4 flex justify-end gap-2.5">
        <button
          type="button"
          onClick={() => scrollBy(-300)}
          aria-label="Trước"
          className="flex h-11 w-11 flex-none cursor-pointer items-center justify-center rounded-full border border-[var(--color-terracotta)] bg-transparent text-lg text-[var(--color-warm-white)] hover:bg-[rgba(193,99,60,0.15)]"
        >
          ←
        </button>
        <button
          type="button"
          onClick={() => scrollBy(300)}
          aria-label="Sau"
          className="flex h-11 w-11 flex-none cursor-pointer items-center justify-center rounded-full border border-[var(--color-terracotta)] bg-transparent text-lg text-[var(--color-warm-white)] hover:bg-[rgba(193,99,60,0.15)]"
        >
          →
        </button>
      </div>
      <div ref={ref} className="no-scrollbar flex gap-5 overflow-x-auto pb-2">
        {children}
      </div>
    </div>
  );
}
