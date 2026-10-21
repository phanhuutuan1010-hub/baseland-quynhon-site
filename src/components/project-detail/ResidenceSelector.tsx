"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useState } from "react";
import { useLang } from "@/lib/i18n";
import { Reveal } from "@/components/Reveal";
import type { ProjectFloorPlans, ProjectResidences as ProjectResidencesData } from "@/lib/project-detail/types";
import { FloorPlanModal } from "./FloorPlanViewer";
import { chipClass } from "./shared";
import { Accent } from "@/components/Accent";
import { frameRatio } from "./imageFrame";

export function ResidenceSelector({
  id,
  data,
  compact,
  floorPlans,
}: {
  id: string;
  data: ProjectResidencesData;
  /** Compact layout: no unit-mix table, a one-line typical-floor summary,
   * and the floor-plan button opens `floorPlans` in a dialog. */
  compact?: boolean;
  floorPlans?: ProjectFloorPlans;
}) {
  const { pick } = useLang();
  const [unitIndex, setUnitIndex] = useState(0);
  const [plansOpen, setPlansOpen] = useState(false);
  const closePlans = useCallback(() => setPlansOpen(false), []);
  const activeUnit = data.items[unitIndex];
  const floorplanBtnClass =
    "inline-flex cursor-pointer items-center rounded-xs border border-[var(--project-accent)] bg-transparent px-8 py-4 font-ui text-[13px] font-bold tracking-[0.08em] text-[var(--color-charcoal)] uppercase no-underline hover:bg-[rgba(var(--project-accent-rgb),0.15)]";

  return (
    <section
      id={id}
      className={`bg-[var(--color-warm-white)] px-5 sm:px-8 md:px-12 ${compact ? "py-14 sm:py-16 md:py-20" : "py-16 sm:py-20 md:py-28"}`}
    >
      <Reveal className="mx-auto max-w-[1440px]">
        <div className="mb-5 font-ui text-[length:var(--fs-label)] tracking-[var(--ls-label)] text-[var(--project-accent)] uppercase">
          {pick(data.eyebrow)}
        </div>
        <h2 className="m-0 mb-5 font-display text-[length:var(--fs-h1)] leading-[var(--lh-heading)] font-normal text-[var(--color-charcoal)]">
          <Accent text={pick(data.headline)} />
        </h2>
        <p className="m-0 mb-8 font-body text-[length:var(--fs-body-lg)] leading-[var(--lh-body)] text-[var(--color-text-muted)] md:mb-12">
          <Accent text={pick(data.body)} />
        </p>

        <div
          role="tablist"
          aria-label={pick(data.unitTypeAria)}
          className="mb-7 flex flex-wrap gap-2.5 md:mb-10"
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
          {/* No floor-plan image for this unit → details only (no grey box). */}
          {activeUnit.floorPlanImage?.src && (
            <div className="min-w-70 flex-1 basis-115">
              <div
                key={activeUnit.key}
                className="relative animate-[fade-slide-in_400ms_var(--ease-editorial)] border border-[var(--color-border)] bg-[var(--color-sand)]"
                style={{ aspectRatio: frameRatio(activeUnit.floorPlanImage, "4 / 3") }}
              >
                <Image
                  src={activeUnit.floorPlanImage.src}
                  alt={pick(activeUnit.floorPlanImage.alt)}
                  width={800}
                  height={600}
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
          )}
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
              {[
                { label: data.nfaLabel, value: activeUnit.nfa },
                { label: data.nsaLabel, value: activeUnit.nsa },
                { label: data.areaLabel, value: activeUnit.area },
                { label: data.shareLabel, value: activeUnit.share ? pick(activeUnit.share) : undefined },
              ]
                .filter((row): row is { label: NonNullable<typeof row.label>; value: string } => !!row.label && !!row.value)
                .map((row, i) => (
                  <div key={i} className="border-t border-[rgba(var(--project-accent-rgb),0.35)] pt-3.5">
                    <div className="mb-2 font-ui text-xs font-bold tracking-[0.1em] text-[var(--project-accent)] uppercase">
                      {pick(row.label)}
                    </div>
                    <div className="font-display text-2xl text-[var(--color-charcoal)]">{row.value}</div>
                  </div>
                ))}
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
              {compact ? (
                !!floorPlans?.items.length && (
                  <button type="button" onClick={() => setPlansOpen(true)} className={floorplanBtnClass}>
                    {pick(data.unitCtaFloorplanLabel)}
                  </button>
                )
              ) : (
                <Link href={data.unitCtaFloorplanHref} className={floorplanBtnClass}>
                  {pick(data.unitCtaFloorplanLabel)}
                </Link>
              )}
            </div>
          </div>
        </div>
        {!compact && data.tableTitle && (
          <div className="mt-12 md:mt-16">
            <h3 className="m-0 mb-5 font-display text-[length:var(--fs-h3)] leading-[var(--lh-heading)] font-normal text-[var(--color-charcoal)]">
              {pick(data.tableTitle)}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-[rgba(var(--project-accent-rgb),0.5)] font-ui text-xs font-bold tracking-[0.1em] text-[var(--project-accent)] uppercase">
                    <th className="py-3 pr-4 font-bold">{pick(data.unitTypeAria)}</th>
                    <th className="py-3 pr-4 font-bold">{pick(data.areaLabel ?? data.nsaLabel)}</th>
                    {data.shareLabel && <th className="py-3 font-bold">{pick(data.shareLabel)}</th>}
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((u, i) => (
                    <tr
                      key={u.key}
                      onClick={() => setUnitIndex(i)}
                      className={`cursor-pointer border-b border-[var(--color-border)] font-body text-[15px] text-[var(--color-charcoal)] transition-colors hover:bg-[var(--color-limestone)] ${
                        i === unitIndex ? "bg-[var(--color-limestone)]" : ""
                      }`}
                    >
                      <td className="py-3.5 pr-4 font-ui text-[13px] font-bold tracking-[0.06em] uppercase">{pick(u.name)}</td>
                      <td className="py-3.5 pr-4">{u.area || u.nsa}</td>
                      {data.shareLabel && <td className="py-3.5">{u.share ? pick(u.share) : "—"}</td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {compact && data.typicalFloor && (
          <p className="m-0 mt-8 border-t border-[var(--color-border)] pt-5 font-body text-[15px] leading-[var(--lh-body)] text-[var(--color-charcoal)]">
            <strong className="font-ui text-xs font-bold tracking-[0.08em] uppercase">{pick(data.typicalFloor.title)}:</strong>{" "}
            {pick(data.typicalFloor.body)}{" "}
            <span className="text-[var(--color-text-muted)]">{data.typicalFloor.orientations.map((o) => pick(o)).join(" · ")}</span>
          </p>
        )}

        {!compact && data.typicalFloor && (
          <div className="mt-10 flex flex-wrap gap-6 border border-[var(--color-border)] p-6 md:mt-12 md:gap-12 md:p-9">
            <div className="min-w-60 flex-1 basis-80">
              <h3 className="m-0 mb-3 font-display text-[length:var(--fs-h3)] leading-[var(--lh-heading)] font-normal text-[var(--color-charcoal)]">
                {pick(data.typicalFloor.title)}
              </h3>
              <p className="m-0 max-w-120 font-body text-[15px] leading-[var(--lh-body)] text-[var(--color-text-muted)]">
                {pick(data.typicalFloor.body)}
              </p>
            </div>
            <ul className="m-0 grid min-w-60 flex-1 basis-80 list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2">
              {data.typicalFloor.orientations.map((o, i) => (
                <li
                  key={i}
                  className="border-t border-[rgba(var(--project-accent-rgb),0.35)] pt-3 font-ui text-[13px] font-bold tracking-[0.06em] text-[var(--color-charcoal)] uppercase"
                >
                  {pick(o)}
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="m-0 mt-8 max-w-180 font-body text-[13px] leading-[var(--lh-body)] text-[var(--color-deep-earth)] md:mt-10">
          {pick(data.footnote)}
        </p>
      </Reveal>
      {compact && floorPlans && <FloorPlanModal data={floorPlans} open={plansOpen} onClose={closePlans} />}
    </section>
  );
}
