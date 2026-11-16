"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { useLang } from "@/lib/i18n";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { cssStep, cssScaleStep, cssLine } from "@/lib/useSequenceReveal";
import type { ProjectHero as ProjectHeroData } from "@/lib/project-detail/types";
import type { Localized } from "@/lib/i18n";
import { Accent } from "@/components/Accent";
import { stripAccent } from "@/lib/accent";
import { focalPosition } from "./imageFrame";

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
  // Compact layout: badge pill + one line of key figures instead of the
  // subhead, and two CTAs only (consult first, then the 360° tour).
  const compact = data.layout === "compact";
  const frame = heroFrame(data);
  const badge = compact && data.badge ? pick(data.badge) : "";
  const facts = compact && data.facts ? pick(data.facts) : "";
  const showExplore = !!pick(data.ctaExploreLabel) && !(compact && tourCta && pick(tourCta.label));

  return (
    <section id={id} className="relative h-screen min-h-[640px] w-full overflow-hidden">
      {/* Visible from the first paint (no JS fade-in): the hero photo is the
          mobile LCP element, and an opacity-0 image only counts once the
          fade finishes after hydration. Text still reveals in sequence. */}
      <div className={`absolute inset-0 ${frame.vars ? "hero-frame" : ""}`}>
        {data.image?.src ? (
          <Image
            src={data.image.src}
            alt={pick(data.image.alt)}
            fill
            sizes="100vw"
            preload
            className={`object-cover ${frame.vars ? "hero-frame-img" : ""}`}
            style={{ objectPosition: frame.position, ...frame.vars }}
          />
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
      {/* Phones: the text covers the lower half of the photo, whatever is
          there — a deeper shade from the middle down keeps white text at AA
          contrast even over a bright facade. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] md:hidden"
        style={{ background: "linear-gradient(180deg, rgba(20,22,24,0) 30%, rgba(20,22,24,0.62) 52%, rgba(20,22,24,0.8) 100%)" }}
      />
      {/* Desktop: the text block sits in the left 55% — darken that side so
          white text keeps AA contrast on any photo; the subject stays clear
          on the right. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] hidden md:block"
        style={{ background: "linear-gradient(90deg, rgba(20,22,24,0.72) 0%, rgba(20,22,24,0.5) 32%, rgba(20,22,24,0) 62%)" }}
      />
      {data.image?.src && data.imageNote && pick(data.imageNote) && (
        <span className="absolute top-20 right-4 z-[2] font-body text-[11px] italic text-[rgba(250,245,238,0.8)] md:top-24 md:right-8">
          {pick(data.imageNote)}
        </span>
      )}
      <div
        className={`relative z-[2] mx-auto flex h-full max-w-[1440px] flex-col justify-end px-5 sm:px-8 sm:pb-16 md:px-12 md:pb-22 ${compact ? "pb-20" : "pb-12"}`}
      >
        <div className="md:max-w-[55%]">
        {badge && (
          <div style={cssStep(150, 500)} className="mb-4.5">
            <span className="inline-flex items-center gap-2 rounded-full bg-[var(--project-primary)] px-3.5 py-1.5 font-ui text-[11px] font-bold tracking-[0.1em] text-[var(--project-primary-foreground)] uppercase">
              <span aria-hidden className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--project-primary-foreground)]" />
              {badge}
            </span>
          </div>
        )}
        {!badge && pick(data.eyebrow) && (
          <div
            style={cssStep(150, 500)}
            className="mb-4.5 font-ui text-[length:var(--fs-label)] tracking-[var(--ls-label)] text-[var(--color-sand)] uppercase"
          >
            {pick(data.eyebrow)}
          </div>
        )}
        <h1
          style={cssStep(300, 650, { fade: false })}
          className="m-0 mb-4.5 font-display text-[clamp(44px,6.5vw,96px)] leading-[1] font-normal tracking-[-0.02em] text-[var(--color-warm-white)]"
        >
          {name}
        </h1>
        {pick(data.addressLine) && (
          <div className="mb-6.5 flex flex-wrap items-center gap-4 md:max-w-[88%]">
            <span style={cssLine(650, 48)} className="block h-0.5 rounded-sm bg-[var(--project-accent-light)]" />
            <span
              style={cssStep(700, 500)}
              className="font-ui text-sm font-semibold tracking-[0.16em] text-[var(--color-warm-white)] uppercase [text-wrap:balance]"
            >
              {pick(data.addressLine)}
            </span>
          </div>
        )}
        {facts && (
          // Each figure carries its "·" in front; the row is pulled left by
          // that much and clipped, so the first figure of every line loses
          // its dot and no dot is ever left dangling at a line end.
          <div style={cssStep(850, 500)} className="mb-8 max-w-[760px] overflow-hidden">
            <p className="m-0 -ml-6 flex flex-wrap gap-y-1.5 font-ui text-[15px] font-semibold tracking-[0.04em] text-[var(--color-warm-white)] sm:text-base">
              {facts.split("·").map((f, i) => (
                <span key={i} className="relative pl-6 whitespace-nowrap">
                  <span aria-hidden className="absolute left-2 text-[var(--project-accent-light)]">·</span>
                  {f.trim()}
                </span>
              ))}
            </p>
          </div>
        )}
        {!facts && pick(data.subhead) && (
          <p
            style={cssStep(850, 500)}
            className="m-0 mb-9.5 max-w-[520px] font-body text-[length:var(--fs-body-lg)] leading-[var(--lh-body)] text-[var(--color-sand)]"
          >
            <Accent text={pick(data.subhead)} onDark />
          </p>
        )}
        {(pick(data.ctaExploreLabel) || pick(data.ctaConsultLabel) || (tourCta && pick(tourCta.label))) && (
          <div
            style={cssScaleStep(1100)}
            className={compact ? "grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:gap-4 [&>a]:justify-center [&>a]:gap-1.5 [&>a]:px-2 [&>a]:text-xs [&>a]:tracking-[0.04em] [&>a]:text-center [&>a]:leading-[1.35] sm:[&>a]:px-8 sm:[&>a]:text-[13px] sm:[&>a]:tracking-[0.08em]" : "flex flex-wrap gap-4"}
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
      </div>
    </section>
  );
}

/**
 * How the hero photo sits in its frame.
 *
 * Default (no imageFocus / imageTrim): a plain cover crop anchored on the
 * Media focal point — `position` only.
 *
 * With `imageFocus` (the subject's place in the photo) and/or `imageTrim`
 * (strips never shown), and when the image's real size is known, the photo
 * is laid out by CSS (globals.css, .hero-frame) from these custom
 * properties: the kept part always covers the frame, the trimmed strips
 * stay outside at any screen shape, and the subject is centred on phones
 * but placed in the right-hand part on desktop — clear of the text block
 * in the left 55%.
 */
function heroFrame(data: ProjectHeroData): { position: string; vars?: CSSProperties } {
  const meta = (data.image ?? {}) as { width?: number; height?: number; focalX?: number; focalY?: number };
  const focus = data.imageFocus;
  const sx = focus ? clampPct(focus.x) / 100 : (meta.focalX ?? 0.5);
  const sy = focus ? clampPct(focus.y) / 100 : (meta.focalY ?? 0.5);
  const position = focus ? `${Math.round(sx * 100)}% ${Math.round(sy * 100)}%` : focalPosition(data.image);
  const t = data.imageTrim;
  const top = clampPct(t?.top) / 100;
  const right = clampPct(t?.right) / 100;
  const bottom = clampPct(t?.bottom) / 100;
  const left = clampPct(t?.left) / 100;
  const keepW = 1 - left - right;
  const keepH = 1 - top - bottom;
  const hasTrim = top + right + bottom + left > 0;
  if (!meta.width || !meta.height || (!focus && !hasTrim) || keepW < 0.2 || keepH < 0.2) return { position };
  return {
    position,
    vars: {
      "--hero-ratio": meta.width / meta.height,
      "--hero-keep-w": keepW,
      "--hero-keep-h": keepH,
      "--hero-trim-l": left,
      "--hero-trim-t": top,
      "--hero-sx": sx,
      "--hero-sy": sy,
      // Without an explicit subject, desktop keeps it centred too.
      ...(focus ? {} : { "--hero-tx-desktop": 0.5 }),
    } as CSSProperties,
  };
}

function clampPct(v: unknown): number {
  const n = Number(v);
  return Number.isFinite(n) ? Math.min(100, Math.max(0, n)) : 0;
}
