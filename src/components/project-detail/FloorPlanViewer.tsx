"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useLang } from "@/lib/i18n";
import { Reveal } from "@/components/Reveal";
import type { ProjectFloorPlans as ProjectFloorPlansData } from "@/lib/project-detail/types";
import { chipClass } from "./shared";

export function FloorPlanViewer({ id, data }: { id: string; data: ProjectFloorPlansData }) {
  const { pick } = useLang();
  const [planKey, setPlanKey] = useState(data.items[0]?.key ?? "");
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const activePlan = data.items.find((p) => p.key === planKey) ?? data.items[0];
  const groupKeys = Object.keys(data.groupLabels);

  if (!activePlan) return null;

  return (
    <section id={id} className="bg-[var(--color-sand)] px-5 py-16 sm:px-8 sm:py-20 md:px-12 md:py-28">
      <Reveal className="mx-auto max-w-[1440px]">
        <div className="mb-8 flex flex-wrap items-end gap-8 md:mb-12 md:gap-16">
          <div className="min-w-70 flex-1 basis-95">
            <div className="mb-5 font-ui text-[length:var(--fs-label)] tracking-[var(--ls-label)] text-[var(--project-accent-dark)] uppercase">
              {pick(data.eyebrow)}
            </div>
            <h2 className="m-0 max-w-[22ch] font-display text-[length:var(--fs-h2)] leading-[var(--lh-heading)] font-normal text-[var(--color-charcoal)]">
              {pick(data.headline)}
            </h2>
          </div>
          <p className="min-w-70 max-w-110 flex-1 basis-80 font-body text-[length:var(--fs-body)] leading-[var(--lh-body)] text-[var(--color-text-muted)]">
            {pick(activePlan.caption)}
          </p>
        </div>

        <div className="mb-7 flex flex-col gap-4.5 md:mb-10">
          {groupKeys.map((g) => (
            <div key={g} className="flex flex-wrap items-center gap-4">
              <div className="w-27.5 flex-none font-ui text-[11px] font-bold tracking-[0.12em] text-[var(--color-deep-earth)] uppercase">
                {pick(data.groupLabels[g])}
              </div>
              <div className="flex flex-wrap gap-2.5">
                {data.items
                  .filter((p) => p.group === g)
                  .map((p) => (
                    <button key={p.key} type="button" onClick={() => setPlanKey(p.key)} className={chipClass(p.key === planKey)}>
                      {pick(p.name)}
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </div>

        <div
          key={activePlan.key}
          className="relative animate-[fade-slide-in_400ms_var(--ease-editorial)] border border-[var(--color-border)] bg-[var(--color-warm-white)]"
        >
          <Image src={activePlan.src} alt={pick(activePlan.alt)} width={1600} height={1200} className="block h-auto w-full" />
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            className="absolute right-4 bottom-4 cursor-pointer rounded-full border border-[var(--color-border)] bg-[var(--color-warm-white)] px-5 py-2.5 font-ui text-xs font-bold tracking-[0.07em] text-[var(--color-charcoal)] uppercase shadow-[var(--shadow-sm)] hover:border-[var(--project-accent)]"
          >
            {pick(data.zoomBtn)}
          </button>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-5">
          <p className="m-0 max-w-160 font-body text-[13px] text-[var(--color-deep-earth)]">{pick(data.footnote)}</p>
          <Link
            href={data.ctaHref}
            className="whitespace-nowrap font-ui text-xs font-bold tracking-[0.08em] text-[var(--project-primary-text)] uppercase no-underline hover:text-[var(--project-primary-dark)]"
          >
            {pick(data.ctaLabel)}
          </Link>
        </div>
      </Reveal>

      {lightboxOpen && (
        <div
          onClick={() => setLightboxOpen(false)}
          className="fixed inset-0 z-[200] flex cursor-zoom-out items-center justify-center bg-[rgba(38,34,32,0.94)] p-4 sm:p-8 md:p-12"
        >
          <Image src={activePlan.src} alt={pick(activePlan.alt)} width={1600} height={1200} className="max-h-full max-w-full object-contain" />
          <button
            type="button"
            aria-label={pick(data.closeAria)}
            onClick={() => setLightboxOpen(false)}
            className="absolute top-5 right-6 cursor-pointer border-none bg-none text-[32px] leading-none text-[var(--color-warm-white)]"
          >
            ×
          </button>
        </div>
      )}
    </section>
  );
}
