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
      <div ref={barRef} className="no-scrollbar mx-auto flex max-w-[1440px] gap-1 overflow-x-auto px-3 sm:px-6 md:justify-center md:gap-2 md:px-12">
        {items.map((item) => {
          const isActive = item.href === active;
          return (
            <a
              key={item.href}
              href={item.href}
              aria-current={isActive ? "true" : undefined}
              className={`relative flex-none px-3.5 py-3.5 font-ui text-xs font-bold tracking-[0.08em] whitespace-nowrap uppercase no-underline transition-colors md:px-5 ${
                isActive ? "text-[var(--project-primary-text)]" : "text-[var(--color-charcoal)] opacity-75 hover:opacity-100"
              }`}
            >
              {pick(item.label)}
              <span
                aria-hidden
                className={`absolute inset-x-3.5 bottom-0 h-0.5 bg-[var(--project-primary)] transition-opacity md:inset-x-5 ${isActive ? "opacity-100" : "opacity-0"}`}
              />
            </a>
          );
        })}
      </div>
    </nav>
  );
}
