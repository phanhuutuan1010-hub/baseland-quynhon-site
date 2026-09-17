"use client";

import { useLang } from "@/lib/i18n";
import { Reveal } from "@/components/Reveal";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { HScroller } from "@/components/HScroller";
import type { ProjectLifestyle as ProjectLifestyleData } from "@/lib/project-detail/types";

export function ProjectLifestyle({ id, data }: { id: string; data: ProjectLifestyleData }) {
  const { pick } = useLang();
  return (
    <section id={id} className="bg-[var(--color-warm-white)] py-16 sm:py-20 md:py-28">
      <Reveal>
        <div className="mx-auto mb-8 flex max-w-[1440px] flex-wrap items-end justify-between gap-6 px-5 sm:px-8 md:mb-14 md:px-12">
          <div>
            <div className="mb-5 font-ui text-[length:var(--fs-label)] tracking-[var(--ls-label)] text-[var(--project-accent)] uppercase">
              {pick(data.eyebrow)}
            </div>
            <h2 className="m-0 font-display text-[length:var(--fs-h2)] leading-[var(--lh-heading)] font-normal text-[var(--color-charcoal)]">
              {pick(data.headline)}
            </h2>
          </div>
        </div>
        <div className="px-5 sm:px-8 md:px-12">
          <HScroller>
            {data.chapters.map((c) => (
              <div key={c.slotId} className="w-65 flex-none sm:w-80">
                <div className="mb-4.5 aspect-3/4">
                  <ImagePlaceholder label={`${c.time} · ${c.label}`} />
                </div>
                <div className="mb-2.5 flex items-baseline gap-3.5">
                  <span className="font-ui text-xs font-bold tracking-[0.12em] text-[var(--project-accent)]">
                    {c.time}
                  </span>
                  <span className="font-ui text-xs font-semibold tracking-[0.1em] text-[var(--color-text-muted)] uppercase">
                    {c.label}
                  </span>
                </div>
                <p className="m-0 font-display text-xl leading-[1.45] text-[var(--color-charcoal)]">
                  {pick(c.statement)}
                </p>
              </div>
            ))}
          </HScroller>
        </div>
      </Reveal>
    </section>
  );
}
