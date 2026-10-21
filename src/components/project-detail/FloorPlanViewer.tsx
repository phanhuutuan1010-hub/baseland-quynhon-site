"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useLang } from "@/lib/i18n";
import { Reveal } from "@/components/Reveal";
import type { ProjectFloorPlans as ProjectFloorPlansData } from "@/lib/project-detail/types";
import { chipClass } from "./shared";
import { Accent } from "@/components/Accent";

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
              <Accent text={pick(data.headline)} />
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

/**
 * Compact layout: the same plan picker (groups -> chips -> image) in a
 * full-screen dialog, opened from the Residences "Xem mặt bằng tầng"
 * button instead of a separate Floor Plans section. Mount it outside any
 * Reveal (a transformed ancestor would trap `position: fixed`).
 */
export function FloorPlanModal({ data, open, onClose }: { data: ProjectFloorPlansData; open: boolean; onClose: () => void }) {
  const { pick } = useLang();
  const groupKeys = Object.keys(data.groupLabels);
  // Start on the first plan of the first group shown (the chips' order).
  const firstPlan = data.items.find((p) => p.group === groupKeys[0]) ?? data.items[0];
  const [planKey, setPlanKey] = useState(firstPlan?.key ?? "");
  const activePlan = data.items.find((p) => p.key === planKey) ?? firstPlan;

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open || !activePlan) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={pick(data.eyebrow)}
      onClick={onClose}
      className="fixed inset-0 z-[210] flex items-end justify-center bg-[rgba(38,34,32,0.82)] sm:items-center sm:p-6"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[92svh] w-full max-w-[1100px] flex-col overflow-hidden rounded-t-md bg-[var(--color-warm-white)] sm:rounded-md"
      >
        <div className="flex items-start justify-between gap-4 border-b border-[var(--color-border)] px-5 py-4 sm:px-7">
          <div>
            <div className="font-ui text-[11px] font-bold tracking-[0.12em] text-[var(--project-accent-dark)] uppercase">{pick(data.eyebrow)}</div>
            <div className="mt-1 font-display text-xl text-[var(--color-charcoal)]">{pick(activePlan.name)}</div>
          </div>
          <button
            type="button"
            aria-label={pick(data.closeAria)}
            onClick={onClose}
            className="-mt-1 cursor-pointer border-none bg-transparent text-3xl leading-none text-[var(--color-charcoal)]"
          >
            ×
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-5 sm:px-7">
          <div className="mb-5 flex flex-col gap-3">
            {groupKeys.map((g) => (
              <div key={g} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                <div className="w-24 flex-none font-ui text-[11px] font-bold tracking-[0.12em] text-[var(--color-deep-earth)] uppercase">
                  {pick(data.groupLabels[g])}
                </div>
                <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0">
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
          <a
            key={activePlan.key}
            href={activePlan.src}
            target="_blank"
            rel="noopener noreferrer"
            className="block animate-[fade-slide-in_400ms_var(--ease-editorial)] border border-[var(--color-border)] bg-white"
          >
            <Image
              src={activePlan.src}
              alt={pick(activePlan.alt)}
              width={1600}
              height={1200}
              sizes="(min-width: 1100px) 1050px, 100vw"
              className="block h-auto w-full"
            />
          </a>
          <p className="m-0 mt-3 font-body text-sm text-[var(--color-text-muted)]">{pick(activePlan.caption)}</p>
          <p className="m-0 mt-2 font-body text-xs text-[var(--color-deep-earth)]">{pick(data.footnote)}</p>
        </div>
        <div className="border-t border-[var(--color-border)] px-5 py-4 sm:px-7">
          <Link
            href={data.ctaHref}
            onClick={onClose}
            className="inline-flex min-h-12 w-full items-center justify-center rounded-xs border border-[var(--project-primary)] bg-[var(--project-primary)] px-7 py-3.5 font-ui text-[13px] font-bold tracking-[0.08em] text-[var(--project-primary-foreground)] uppercase no-underline hover:bg-[var(--project-primary-dark)] sm:w-auto"
          >
            {pick(data.ctaLabel)}
          </Link>
        </div>
      </div>
    </div>
  );
}
