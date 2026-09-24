"use client";

import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { Reveal } from "@/components/Reveal";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { useInView } from "@/lib/useInView";
import type { ProjectMasterplan as ProjectMasterplanData } from "@/lib/project-detail/types";
import { Accent } from "@/components/Accent";

/**
 * Masterplan as a "product exploration" read: a large site image paired
 * with described zone cards (commercial spine, residential clusters,
 * school, amenities…) rather than image hotspots — precise hover-highlight
 * regions need a real, dimensioned masterplan graphic to place accurately,
 * which isn't available yet (see mục 12 in the Phú Gia brief). Swap in
 * `data.image` plus per-zone pixel regions later without changing this
 * component's shape once that asset exists.
 */
export function ProjectMasterplan({ id, data }: { id: string; data: ProjectMasterplanData }) {
  const { pick } = useLang();
  const { ref: imageRef, inView } = useInView<HTMLDivElement>(0.15);

  return (
    <section id={id} className="bg-[var(--project-background)] px-5 py-16 sm:px-8 sm:py-20 md:px-12 md:py-28">
      <Reveal className="mx-auto max-w-[1440px]">
        <div className="mb-10 max-w-170 md:mb-14">
          <div className="mb-5 font-ui text-[length:var(--fs-label)] tracking-[var(--ls-label)] text-[var(--project-accent-dark)] uppercase">
            {pick(data.eyebrow)}
          </div>
          <h2 className="m-0 mb-5 font-display text-[length:var(--fs-h1)] leading-[var(--lh-heading)] font-normal text-[var(--color-charcoal)]">
            <Accent text={pick(data.headline)} />
          </h2>
          <p className="m-0 font-body text-[length:var(--fs-body-lg)] leading-[var(--lh-body)] text-[var(--project-muted)]">
            <Accent text={pick(data.body)} />
          </p>
        </div>

        <div
          ref={imageRef}
          className="mb-10 aspect-16/9 w-full overflow-hidden border border-[var(--project-border)] md:mb-14"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "scale(1)" : "scale(1.03)",
            transition: "opacity 700ms var(--ease-editorial), transform 900ms var(--ease-editorial)",
          }}
        >
          {data.image?.src ? (
            <Image
              src={data.image.src}
              alt={pick(data.image.alt)}
              width={1600}
              height={900}
              className="h-full w-full object-cover"
            />
          ) : (
            <ImagePlaceholder
              label={pick(data.placeholderLabel ?? { vi: "Mặt bằng tổng thể dự án", en: "Project master plan" })}
            />
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.zones.map((zone, i) => (
            <Reveal key={zone.key} delayMs={i * 100} className="border-t border-[var(--project-border)] pt-5">
              {zone.tag && (
                <div className="mb-2 font-ui text-xs font-bold tracking-[0.1em] text-[var(--project-accent)] uppercase">
                  {pick(zone.tag)}
                </div>
              )}
              <h3 className="m-0 mb-2 font-display text-[clamp(1.1rem,1.6vw,1.35rem)] leading-[1.3] font-normal text-[var(--color-charcoal)]">
                {pick(zone.name)}
              </h3>
              <p className="m-0 font-body text-sm leading-[var(--lh-body)] text-[var(--project-muted)]">
                {pick(zone.desc)}
              </p>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 md:mt-14">
          <Link
            href={data.ctaHref}
            className="inline-flex items-center rounded-xs border border-[var(--project-primary)] bg-[var(--project-primary)] px-8 py-4 font-ui text-[13px] font-bold tracking-[0.08em] text-[var(--project-primary-foreground)] uppercase no-underline hover:bg-[var(--project-primary-dark)]"
          >
            {pick(data.ctaLabel)}
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
