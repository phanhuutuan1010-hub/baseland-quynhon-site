"use client";

import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { useSequenceReveal, stepStyle, stepScaleStyle, lineRevealStyle } from "@/lib/useSequenceReveal";
import type { ProjectHero as ProjectHeroData } from "@/lib/project-detail/types";

/**
 * Staged hero reveal per the Q'Terra brief's mục 5 ("image reveal → project
 * name reveal → location reveal → CTA reveal") and the Simona brief's mục 6
 * ("background fade/reveal → gold line reveal → typography → location →
 * CTA") — the same sequence serves both: the small accent-color divider
 * between the name and address line IS the "line reveal" step, and reads
 * as gold on Simona purely through the --project-accent-light theme token,
 * no special-casing needed.
 */
export function ProjectHero({ id, name, data }: { id: string; name: string; data: ProjectHeroData }) {
  const { pick } = useLang();
  const entered = useSequenceReveal();

  return (
    <section id={id} className="relative h-screen min-h-[640px] w-full overflow-hidden">
      <div className="absolute inset-0" style={{ opacity: entered ? 1 : 0, transition: "opacity 600ms var(--ease-editorial)" }}>
        {data.image ? (
          <Image src={data.image.src} alt={pick(data.image.alt)} fill priority className="object-cover" />
        ) : (
          <ImagePlaceholder
            label={pick(data.placeholderLabel ?? data.subhead)}
            tone="dark"
            className="rounded-none border-none"
          />
        )}
      </div>
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background: "linear-gradient(180deg, rgba(38,34,32,0.30) 0%, rgba(38,34,32,0.10) 34%, rgba(38,34,32,0.78) 100%)",
        }}
      />
      <div className="relative z-[2] mx-auto flex h-full max-w-[1440px] flex-col justify-end px-5 pb-12 sm:px-8 sm:pb-16 md:px-12 md:pb-22">
        {pick(data.eyebrow) && (
          <div
            style={stepStyle(entered, 150, 500)}
            className="mb-4.5 font-ui text-[length:var(--fs-label)] tracking-[var(--ls-label)] text-[var(--color-sand)] uppercase"
          >
            {pick(data.eyebrow)}
          </div>
        )}
        <h1
          style={stepStyle(entered, 300, 650)}
          className="m-0 mb-4.5 font-display text-[clamp(3rem,11vw,8.5rem)] leading-[0.95] font-normal tracking-[-0.02em] text-[var(--color-warm-white)]"
        >
          {name}
        </h1>
        {pick(data.addressLine) && (
          <div className="mb-6.5 flex flex-wrap items-center gap-4">
            <span style={lineRevealStyle(entered, 650, 48)} className="block h-0.5 rounded-sm bg-[var(--project-accent-light)]" />
            <span
              style={stepStyle(entered, 700, 500)}
              className="font-ui text-sm font-semibold tracking-[0.16em] text-[var(--color-warm-white)] uppercase"
            >
              {pick(data.addressLine)}
            </span>
          </div>
        )}
        {pick(data.subhead) && (
          <p
            style={stepStyle(entered, 850, 500)}
            className="m-0 mb-9.5 max-w-[520px] font-body text-[length:var(--fs-body-lg)] leading-[var(--lh-body)] text-[var(--color-sand)]"
          >
            {pick(data.subhead)}
          </p>
        )}
        {(pick(data.ctaExploreLabel) || pick(data.ctaConsultLabel)) && (
          <div style={stepScaleStyle(entered, 1100)} className="flex flex-wrap gap-4">
            {pick(data.ctaExploreLabel) && (
              <Link
                href={data.ctaExploreHref}
                className="inline-flex items-center rounded-xs border border-[var(--project-accent-light)] px-8 py-4 font-ui text-[13px] font-bold tracking-[0.08em] text-[var(--color-warm-white)] uppercase no-underline hover:bg-[rgba(var(--project-accent-rgb),0.15)]"
              >
                {pick(data.ctaExploreLabel)}
              </Link>
            )}
            {pick(data.ctaConsultLabel) && (
              <Link
                href={data.ctaConsultHref}
                className="inline-flex items-center rounded-xs border border-[var(--project-primary)] bg-[var(--project-primary)] px-8 py-4 font-ui text-[13px] font-bold tracking-[0.08em] text-[var(--project-primary-foreground)] uppercase no-underline hover:bg-[var(--project-primary-dark)]"
              >
                {pick(data.ctaConsultLabel)}
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
