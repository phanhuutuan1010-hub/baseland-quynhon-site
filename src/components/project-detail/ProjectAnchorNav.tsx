"use client";

import { useEffect, useRef, useState } from "react";
import { useLang } from "@/lib/i18n";
import type { ProjectNavItem } from "@/lib/project-detail/types";

/**
 * Compact layout's sticky anchor bar (Tổng quan · Vị trí · Căn hộ · Tiện ích
 * · Giá). Sits in the page flow right after the hero and sticks under the
 * fixed ProjectNav header (57px mobile / 72px desktop). The active item
 * follows the section in view; on mobile the bar scrolls sideways and keeps
 * the active item visible.
 */
export function ProjectAnchorNav({ items }: { items: ProjectNavItem[] }) {
  const { pick } = useLang();
  const [active, setActive] = useState("");
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    // Current = the last section whose top has passed the two sticky bars.
    const update = () => {
      frame = 0;
      let current = "";
      for (const it of items) {
        const el = document.getElementById(it.href.slice(1));
        if (el && el.getBoundingClientRect().top <= 140) current = it.href;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [items]);

  useEffect(() => {
    const bar = barRef.current;
    const link = bar?.querySelector<HTMLElement>(`a[href="${active}"]`);
    if (!bar || !link) return;
    const left = link.offsetLeft - (bar.clientWidth - link.offsetWidth) / 2;
    bar.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
  }, [active]);

  if (items.length < 2) return null;

  return (
    <nav
      aria-label={pick({ vi: "Mục lục trang", en: "On this page" })}
      className="sticky top-[57px] z-[90] border-b border-[var(--color-border)] bg-[rgba(250,247,242,0.96)] backdrop-blur md:top-[72px]"
    >
      {/* Phones: the row scrolls sideways; the fade on the right edge and
          the half-visible next item show there is more (peek). */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-10 bg-[linear-gradient(90deg,rgba(250,247,242,0),rgba(250,247,242,0.96))] lg:hidden"
      />
      <div
        ref={barRef}
        className="no-scrollbar mx-auto flex max-w-[1440px] gap-1 overflow-x-auto px-3 pr-10 sm:px-6 sm:pr-10 lg:justify-center lg:gap-2 lg:px-12"
      >
        {items.map((item) => {
          const isActive = item.href === active;
          return (
            <a
              key={item.href}
              href={item.href}
              aria-current={isActive ? "true" : undefined}
              className={`relative flex min-h-11 flex-none items-center px-3.5 py-3.5 font-ui text-xs font-bold tracking-[0.08em] whitespace-nowrap uppercase no-underline transition-colors lg:px-5 ${
                isActive ? "text-[var(--project-primary-text)]" : "text-[var(--color-charcoal)] opacity-75 hover:opacity-100"
              }`}
            >
              {pick(item.label)}
              <span
                aria-hidden
                className={`absolute inset-x-3.5 bottom-0 h-0.5 bg-[var(--project-primary)] transition-opacity lg:inset-x-5 ${isActive ? "opacity-100" : "opacity-0"}`}
              />
            </a>
          );
        })}
      </div>
    </nav>
  );
}
