"use client";

import Image from "next/image";
import { useLang } from "@/lib/i18n";
import { Reveal } from "@/components/Reveal";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import type { ProjectMaterialStory as ProjectMaterialStoryData } from "@/lib/project-detail/types";

export function ProjectMaterialStory({ data }: { data: ProjectMaterialStoryData }) {
  const { pick } = useLang();
  return (
    <section className="bg-[var(--color-sand)] px-5 py-16 sm:px-8 sm:py-20 md:px-12 md:py-28">
      <Reveal className="mx-auto max-w-[1440px]">
        <div className="mb-10 flex flex-wrap items-end gap-8 md:mb-16 md:gap-20">
          <div className="min-w-[280px] flex-1 basis-105">
            <div className="mb-6 font-ui text-[length:var(--fs-label)] tracking-[var(--ls-label)] text-[var(--project-accent-dark)] uppercase">
              {pick(data.kicker)}
            </div>
            <h2 className="m-0 mb-6 max-w-[20ch] font-display text-[length:var(--fs-h1)] leading-[var(--lh-heading)] font-normal text-[var(--color-charcoal)]">
              {pick(data.headline)}
            </h2>
            <p className="m-0 max-w-[520px] font-body text-[length:var(--fs-body-lg)] leading-[var(--lh-body)] text-[var(--color-text-muted)]">
              {pick(data.body)}
            </p>
          </div>
          <div className="min-w-75 grid flex-1 basis-75 grid-cols-4 gap-0.5">
            {data.swatches.map((s) => (
              <div key={pick(s.name)} className="flex aspect-1/2 items-end p-2.5" style={{ background: s.hex }}>
                <span className="font-ui text-[11px] font-bold tracking-[0.08em] uppercase" style={{ color: s.ink }}>
                  {pick(s.name)}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-0.5 sm:grid-cols-3">
          {data.galleryImages.map((g, i) => (
            <div key={i} className="aspect-square overflow-hidden">
              {g.src ? (
                <Image src={g.src} alt={pick(g.label)} width={600} height={600} className="h-full w-full object-cover" />
              ) : (
                <ImagePlaceholder label={pick(g.label)} className="rounded-none" />
              )}
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
