"use client";

import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { useSequenceReveal, stepStyle, stepScaleStyle, lineRevealStyle } from "@/lib/useSequenceReveal";
import type { ProjectHero as ProjectHeroData } from "@/lib/project-detail/types";
import type { Localized } from "@/lib/i18n";
import { Accent } from "@/components/Accent";
import { stripAccent } from "@/lib/accent";

/**
 * Staged hero reveal per the Q'Terra brief's mục 5 ("image reveal → project
 * name reveal → location reveal → CTA reveal") and the Simona brief's mục 6
 * ("background fade/reveal → gold line reveal → typography → location →
 * CTA") — the same sequence serves both: the small accent-color divider
 * between the name and address line IS the "line reveal" step, and reads
 * as gold on Simona purely through the --project-accent-light theme token,
 * no special-casing needed.
 */
export function ProjectHero({
  id,
  name,
  data,
  tourCta,
}: {
  id: string;
  name: string;
  data: ProjectHeroData;
  /** Secondary "360° tour" button, derived from the virtualTour section. */
  tourCta?: { label: Localized<string>; href: string };
}) {
  const { pick } = useLang();
  const entered = useSequenceReveal();
  // Compact layout: badge pill + one line of key figures instead of the
  // subhead, and two CTAs only (consult first, then the 360° tour).
  const compact = data.layout === "compact";
  const badge = compact && data.badge ? pick(data.badge) : "";
  const facts = compact && data.facts ? pick(data.facts) : "";
  const showExplore = !!pick(data.ctaExploreLabel) && !(compact && tourCta && pick(tourCta.label));

  return (
    <section id={id} className="relative h-screen min-h-[640px] w-full overflow-hidden">
      <div className="absolute inset-0" style={{ opacity: entered ? 1 : 0, transition: "opacity 600ms var(--ease-editorial)" }}>
        {data.image?.src ? (
          <Image src={data.image.src} alt={pick(data.image.alt)} fill sizes="100vw" priority className="object-cover" />
        ) : (
          <ImagePlaceholder
            label={stripAccent(pick(data.placeholderLabel ?? data.subhead))}
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
      <div
        className={`relative z-[2] mx-auto flex h-full max-w-[1440px] flex-col justify-end px-5 sm:px-8 sm:pb-16 md:px-12 md:pb-22 ${compact ? "pb-20" : "pb-12"}`}
      >
        {badge && (
          <div style={stepStyle(entered, 150, 500)} className="mb-4.5">
            <span className="inline-flex items-center gap-2 rounded-full bg-[var(--project-primary)] px-3.5 py-1.5 font-ui text-[11px] font-bold tracking-[0.1em] text-[var(--project-primary-foreground)] uppercase">
              <span aria-hidden className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--project-primary-foreground)]" />
              {badge}
            </span>
          </div>
        )}
        {!badge && pick(data.eyebrow) && (
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
        {facts && (
          <p
            style={stepStyle(entered, 850, 500)}
            className="m-0 mb-8 flex max-w-[760px] flex-wrap gap-x-3 gap-y-1.5 font-ui text-[15px] font-semibold tracking-[0.04em] text-[var(--color-warm-white)] sm:text-base"
          >
            {facts.split("·").map((f, i, all) => (
              <span key={i} className="flex items-center gap-3 whitespace-nowrap">
                {f.trim()}
                {i < all.length - 1 && <span aria-hidden className="text-[var(--project-accent-light)]">·</span>}
              </span>
            ))}
          </p>
        )}
        {!facts && pick(data.subhead) && (
          <p
            style={stepStyle(entered, 850, 500)}
            className="m-0 mb-9.5 max-w-[520px] font-body text-[length:var(--fs-body-lg)] leading-[var(--lh-body)] text-[var(--color-sand)]"
          >
            <Accent text={pick(data.subhead)} onDark />
          </p>
        )}
        {(pick(data.ctaExploreLabel) || pick(data.ctaConsultLabel) || (tourCta && pick(tourCta.label))) && (
          <div
            style={stepScaleStyle(entered, 1100)}
            className={compact ? "grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:gap-4 [&>a]:justify-center [&>a]:gap-1.5 [&>a]:px-2 [&>a]:text-xs [&>a]:tracking-[0.04em] [&>a]:whitespace-nowrap sm:[&>a]:px-8 sm:[&>a]:text-[13px] sm:[&>a]:tracking-[0.08em]" : "flex flex-wrap gap-4"}
          >
            {showExplore && (
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
            {tourCta && pick(tourCta.label) && (
              <Link
                href={tourCta.href}
                className="inline-flex items-center gap-2.5 rounded-xs border border-[rgba(250,247,242,0.45)] bg-[rgba(38,34,32,0.25)] px-6 py-4 font-ui text-[13px] font-bold tracking-[0.08em] text-[var(--color-warm-white)] uppercase no-underline backdrop-blur-sm hover:bg-[rgba(38,34,32,0.45)]"
              >
                <span aria-hidden className="text-base leading-none">◎</span>
                {pick(tourCta.label)}
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
