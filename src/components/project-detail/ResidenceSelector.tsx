"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useLang } from "@/lib/i18n";
import { Reveal } from "@/components/Reveal";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import type { ProjectResidences as ProjectResidencesData } from "@/lib/project-detail/types";
import { chipClass } from "./shared";

export function ResidenceSelector({ id, data }: { id: string; data: ProjectResidencesData }) {
  const { pick } = useLang();
  const [unitIndex, setUnitIndex] = useState(0);
  const activeUnit = data.items[unitIndex];

  return (
    <section id={id} className="bg-[var(--color-warm-white)] px-5 py-16 sm:px-8 sm:py-20 md:px-12 md:py-28">
      <Reveal className="mx-auto max-w-[1440px]">
        <div className="mb-5 font-ui text-[length:var(--fs-label)] tracking-[var(--ls-label)] text-[var(--project-accent)] uppercase">
          {pick(data.eyebrow)}
        </div>
        <h2 className="m-0 mb-5 font-display text-[length:var(--fs-h1)] leading-[var(--lh-heading)] font-normal text-[var(--color-charcoal)]">
          {pick(data.headline)}
        </h2>
        <p className="m-0 mb-8 font-body text-[length:var(--fs-body-lg)] leading-[var(--lh-body)] text-[var(--color-text-muted)] md:mb-12">
          {pick(data.body)}
        </p>

        <div
          role="tablist"
          aria-label={pick(data.unitTypeAria)}
          className="no-scrollbar mb-7 flex gap-2.5 overflow-x-auto pb-1.5 md:mb-10"
        >
          {data.items.map((u, i) => (
            <button
              key={u.key}
              type="button"
              role="tab"
              aria-selected={i === unitIndex}
              onClick={() => setUnitIndex(i)}
              className={chipClass(i === unitIndex)}
            >
              {pick(u.name)}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-start gap-8 md:gap-16">
          <div className="min-w-70 flex-1 basis-115">
            <div
              key={activeUnit.key}
              className="relative aspect-4/3 animate-[fade-slide-in_400ms_var(--ease-editorial)] border border-[var(--color-border)] bg-[var(--color-sand)]"
            >
              {activeUnit.floorPlanImage?.src ? (
                <Image
                  src={activeUnit.floorPlanImage.src}
                  alt={pick(activeUnit.floorPlanImage.alt)}
                  width={800}
                  height={600}
                  className="h-full w-full object-cover"
                />
              ) : (
                <ImagePlaceholder
                  label={pick({
                    vi: `Mặt bằng ${pick(activeUnit.name)}`,
                    en: `${pick(activeUnit.name)} floor plan`,
                  })}
                />
              )}
            </div>
          </div>
          <div
            key={`${activeUnit.key}-info`}
            className="min-w-65 flex-1 basis-80 animate-[fade-slide-in_400ms_var(--ease-editorial)]"
          >
            <h3 className="m-0 mb-2 font-display text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.2] font-normal text-[var(--color-charcoal)]">
              {pick(activeUnit.name)}
            </h3>
            <div className="mb-7 font-ui text-xs font-bold tracking-[0.1em] text-[var(--color-deep-earth)] uppercase">
              {pick(activeUnit.tag)}
            </div>
            <div className="mb-7 flex flex-col gap-4.5">
              <div className="border-t border-[rgba(var(--project-accent-rgb),0.35)] pt-3.5">
                <div className="mb-2 font-ui text-xs font-bold tracking-[0.1em] text-[var(--project-accent)] uppercase">
                  {pick(data.nfaLabel)}
                </div>
                <div className="font-display text-2xl text-[var(--color-charcoal)]">{activeUnit.nfa}</div>
              </div>
              <div className="border-t border-[rgba(var(--project-accent-rgb),0.35)] pt-3.5">
                <div className="mb-2 font-ui text-xs font-bold tracking-[0.1em] text-[var(--project-accent)] uppercase">
                  {pick(data.nsaLabel)}
                </div>
                <div className="font-display text-2xl text-[var(--color-charcoal)]">{activeUnit.nsa}</div>
              </div>
            </div>
            <p className="m-0 mb-7 max-w-105 font-body text-[15px] leading-[var(--lh-body)] text-[var(--color-text-muted)]">
              {pick(activeUnit.desc)}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href={activeUnit.ctaHref ?? data.unitCtaHref}
                className="inline-flex items-center rounded-xs border border-[var(--project-primary)] bg-[var(--project-primary)] px-8 py-4 font-ui text-[13px] font-bold tracking-[0.08em] text-[var(--project-primary-foreground)] uppercase no-underline hover:bg-[var(--project-primary-dark)]"
              >
                {pick(activeUnit.ctaLabel ?? data.unitCtaLabel)}
              </Link>
              <Link
                href={data.unitCtaFloorplanHref}
                className="inline-flex items-center rounded-xs border border-[var(--project-accent)] bg-transparent px-8 py-4 font-ui text-[13px] font-bold tracking-[0.08em] text-[var(--color-charcoal)] uppercase no-underline hover:bg-[rgba(var(--project-accent-rgb),0.15)]"
              >
                {pick(data.unitCtaFloorplanLabel)}
              </Link>
            </div>
          </div>
        </div>
        <p className="m-0 mt-8 max-w-180 font-body text-[13px] leading-[var(--lh-body)] text-[var(--color-deep-earth)] md:mt-10">
          {pick(data.footnote)}
        </p>
      </Reveal>
    </section>
  );
}
