"use client";

import { useState } from "react";
import { useLang } from "@/lib/i18n";
import { Reveal } from "@/components/Reveal";
import type { ProjectFAQ as ProjectFAQData } from "@/lib/project-detail/types";

/**
 * Grouped FAQ accordion — generic across projects (group keys/labels come
 * entirely from data, e.g. Project/Location/Legal/Payment for The Sailing).
 * Only one panel open at a time per group render pass; state is a single
 * "open key" rather than a boolean per item, keeping the common "close the
 * others" accordion behavior without per-item effects.
 */
export function FAQSection({ id, data }: { id: string; data: ProjectFAQData }) {
  const { pick } = useLang();
  const [openKey, setOpenKey] = useState<string | null>(null);
  const groupKeys = Object.keys(data.groupLabels);

  return (
    <section id={id} className="bg-[var(--color-warm-white)] px-5 py-16 sm:px-8 sm:py-20 md:px-12 md:py-28">
      <Reveal className="mx-auto max-w-[1440px]">
        <div className="mb-5 font-ui text-[length:var(--fs-label)] tracking-[var(--ls-label)] text-[var(--project-accent-dark)] uppercase">
          {pick(data.eyebrow)}
        </div>
        <h2 className="m-0 mb-10 font-display text-[length:var(--fs-h2)] leading-[var(--lh-heading)] font-normal text-[var(--color-charcoal)] md:mb-14">
          {pick(data.headline)}
        </h2>

        <div className="flex flex-col gap-12 md:gap-16">
          {groupKeys.map((g) => {
            const groupItems = data.items.filter((it) => it.group === g);
            if (groupItems.length === 0) return null;
            return (
              <div key={g}>
                <div className="mb-5 font-ui text-xs font-bold tracking-[0.12em] text-[var(--color-deep-earth)] uppercase">
                  {pick(data.groupLabels[g])}
                </div>
                <div className="flex flex-col">
                  {groupItems.map((item, i) => {
                    const key = `${g}-${i}`;
                    const isOpen = openKey === key;
                    return (
                      <div key={key} className="border-t border-[rgba(38,34,32,0.15)] last:border-b">
                        <button
                          type="button"
                          aria-expanded={isOpen}
                          onClick={() => setOpenKey(isOpen ? null : key)}
                          className="flex w-full cursor-pointer items-center justify-between gap-6 py-5 text-left font-ui text-[15px] font-semibold text-[var(--color-charcoal)]"
                        >
                          <span>{pick(item.q)}</span>
                          <span
                            aria-hidden
                            className="flex-none font-display text-xl text-[var(--project-accent)] transition-transform duration-300"
                            style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
                          >
                            +
                          </span>
                        </button>
                        <div
                          className="grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out"
                          style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                        >
                          <div className="min-h-0">
                            <p className="m-0 max-w-170 pb-5 font-body text-sm leading-[var(--lh-body)] text-[var(--color-text-muted)]">
                              {pick(item.a)}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
}
