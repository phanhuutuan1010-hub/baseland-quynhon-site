"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useLang } from "@/lib/i18n";
import { Reveal } from "@/components/Reveal";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { useInView } from "@/lib/useInView";
import type { ProjectTowers as ProjectTowersData, ProjectTower } from "@/lib/project-detail/types";

/**
 * Split-screen tower comparison (Simona Heights: The Sea / The Harbour).
 * Each tower keeps a fully separate visual identity — a vertical gold
 * divider line separates two independent panels, never a single shared
 * card. Desktop: side-by-side halves, each revealing its description on
 * hover. Mobile: stacked, always-visible storytelling (no hover needed).
 */
export function ProjectTowerSplit({ id, data }: { id: string; data: ProjectTowersData }) {
  const { pick } = useLang();
  return (
    <section id={id} className="bg-[var(--project-dark)] px-5 py-16 sm:px-8 sm:py-20 md:px-0 md:py-0">
      <Reveal>
        <div className="mx-auto mb-10 max-w-[1440px] px-0 sm:px-0 md:mb-0 md:px-0">
          <div className="px-5 pt-0 sm:px-8 md:px-12 md:pt-16">
            <div className="mb-5 font-ui text-[length:var(--fs-label)] tracking-[var(--ls-label)] text-[var(--project-accent-light)] uppercase">
              {pick(data.eyebrow)}
            </div>
            <h2 className="m-0 mb-10 font-display text-[length:var(--fs-h2)] leading-[var(--lh-heading)] font-normal text-[var(--color-warm-white)] md:mb-16">
              {pick(data.headline)}
            </h2>
          </div>
        </div>
        <div className="relative flex flex-col md:flex-row">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[var(--project-accent)] md:inset-y-0 md:left-1/2 md:h-auto md:w-px" />
          <TowerPanel tower={data.towers[0]} curtainDelayMs={0} />
          <TowerPanel tower={data.towers[1]} curtainDelayMs={150} />
        </div>
      </Reveal>
    </section>
  );
}

function TowerPanel({ tower, curtainDelayMs }: { tower: ProjectTower; curtainDelayMs: number }) {
  const { pick } = useLang();
  const [hover, setHover] = useState(false);
  const { ref: curtainRef, inView } = useInView<HTMLDivElement>(0.2);

  return (
    <div
      ref={curtainRef}
      className="group relative aspect-3/4 flex-1 overflow-hidden md:aspect-auto md:min-h-[640px]"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {tower.image ? (
        <Image src={tower.image.src} alt={pick(tower.image.alt)} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
      ) : (
        <ImagePlaceholder label={pick(tower.placeholderLabel ?? tower.name)} tone="dark" className="rounded-none border-none" />
      )}
      {/* Curtain reveal (Simona brief mục 23): a solid panel draws away
          upward to uncover the tower photo, instead of a plain fade. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] bg-[var(--project-dark)]"
        style={{
          transform: inView ? "scaleY(0)" : "scaleY(1)",
          transformOrigin: "top",
          transition: `transform 900ms var(--ease-editorial) ${curtainDelayMs}ms`,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(23,19,15,0.15) 0%, rgba(23,19,15,0.35) 55%, rgba(23,19,15,0.92) 100%)",
        }}
      />
      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-9 md:p-12">
        <div className="mb-2 font-ui text-xs font-bold tracking-[0.14em] text-[var(--project-accent-light)] uppercase">
          {pick(tower.subtitle)}
        </div>
        <h3 className="m-0 mb-4 font-display text-[clamp(1.75rem,3.5vw,2.75rem)] leading-[1.1] font-normal text-[var(--color-warm-white)]">
          {pick(tower.name)}
        </h3>
        <p
          className={`m-0 max-w-105 overflow-hidden font-body text-[15px] leading-[var(--lh-body)] text-[var(--color-sand)] transition-all duration-500 ${
            hover ? "max-h-40 opacity-100" : "max-h-0 opacity-0 md:max-h-40 md:opacity-100"
          }`}
        >
          {pick(tower.description)}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {tower.characteristics.map((c, i) => (
            <span
              key={i}
              className="rounded-full border border-[var(--project-accent-light)] px-3.5 py-1.5 font-ui text-xs font-semibold tracking-[0.05em] text-[var(--color-warm-white)] uppercase"
            >
              {pick(c)}
            </span>
          ))}
        </div>
        {tower.ctaLabel && tower.ctaHref && (
          <Link
            href={tower.ctaHref}
            className="mt-5 inline-flex w-fit items-center rounded-xs border border-[var(--project-primary)] bg-[var(--project-primary)] px-6 py-3 font-ui text-xs font-bold tracking-[0.08em] text-[var(--project-primary-foreground)] uppercase no-underline hover:bg-[var(--project-primary-dark)]"
          >
            {pick(tower.ctaLabel)}
          </Link>
        )}
      </div>
    </div>
  );
}
