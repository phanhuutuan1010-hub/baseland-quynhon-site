"use client";

import Image from "next/image";
import { useLang } from "@/lib/i18n";
import { Reveal } from "@/components/Reveal";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import type { ProjectLocation as ProjectLocationData } from "@/lib/project-detail/types";
import { Accent } from "@/components/Accent";

export function ProjectLocation({ id, data }: { id: string; data: ProjectLocationData }) {
  const { pick } = useLang();
  const hasJourney = !!data.journey;

  return (
    <section
      id={id}
      className={`px-5 py-16 sm:px-8 sm:py-20 md:px-12 md:py-28 ${hasJourney ? "bg-[var(--project-dark-alt)]" : "bg-[var(--color-warm-white)]"}`}
    >
      <Reveal className="mx-auto max-w-[1440px]">
        <div className="mb-10 flex flex-wrap items-start gap-8 md:mb-18 md:gap-20">
          <div className="min-w-[280px] flex-1 basis-90">
            <div
              className={`mb-5 font-ui text-[length:var(--fs-label)] tracking-[var(--ls-label)] uppercase ${
                hasJourney ? "text-[var(--project-accent-light)]" : "text-[var(--project-accent)]"
              }`}
            >
              {pick(data.eyebrow)}
            </div>
            <h2
              className={`m-0 mb-6 font-display text-[length:var(--fs-h1)] leading-[var(--lh-heading)] font-normal ${
                hasJourney ? "text-[var(--color-warm-white)]" : "text-[var(--color-charcoal)]"
              }`}
            >
              <Accent text={pick(data.headline)} onDark />
            </h2>
            <p
              className={`m-0 max-w-[520px] font-body text-[length:var(--fs-body-lg)] leading-[var(--lh-body)] ${
                hasJourney ? "text-[var(--color-sand)]" : "text-[var(--color-text-muted)]"
              }`}
            >
              <Accent text={pick(data.body)} onDark />
            </p>
          </div>
          <div className="min-w-70 flex-1 basis-105">
            <div className="aspect-4/3 border border-[var(--project-border)] bg-[var(--color-sand)]">
              {data.mapImage?.src ? (
                <Image
                  src={data.mapImage.src}
                  alt={pick(data.mapImage.alt)}
                  width={800}
                  height={600}
                  className="h-full w-full object-cover"
                />
              ) : (
                <ImagePlaceholder
                  label={pick(data.mapPlaceholderLabel ?? { vi: "Bản đồ vị trí", en: "Location map" })}
                />
              )}
            </div>
          </div>
        </div>

        {data.journey ? (
          <div>
            {/* Decorative road strip — echoes the official site's "journey"
                graphic without copying it: a thin gold road with waypoint
                dots, no car animation (keeps to CSS-first, motion-light). */}
            <div className="relative mb-10 h-8 md:mb-14">
              <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-[repeating-linear-gradient(90deg,var(--project-accent)_0,var(--project-accent)_10px,transparent_10px,transparent_20px)] opacity-60" />
              <div className="absolute inset-0 flex items-center justify-between">
                {data.journey.map((_, i) => (
                  <span key={i} className="h-2 w-2 rounded-full bg-[var(--project-accent)]" />
                ))}
              </div>
            </div>
            <div
              className="grid grid-cols-1 gap-10 sm:grid-cols-2"
              style={{ gridTemplateColumns: `repeat(auto-fit, minmax(180px, 1fr))` }}
            >
              {data.journey.map((stop, i) => (
                <Reveal key={i} delayMs={i * 100} className="border-t border-[rgba(var(--project-accent-rgb),0.4)] pt-5">
                  <div className="mb-4 font-display text-2xl text-[var(--project-accent-light)] sm:text-3xl">
                    {pick(stop.tier)}
                  </div>
                  <ul className="m-0 flex list-none flex-col gap-2 p-0">
                    {stop.landmarks.map((l, j) => (
                      <li
                        key={j}
                        className="flex items-start gap-2 font-body text-sm leading-[1.5] text-[var(--color-sand)]"
                      >
                        <span aria-hidden className="mt-2 h-1 w-1 flex-none rounded-full bg-[var(--project-accent)]" />
                        {pick(l)}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-10">
            {data.benefits.map((b, i) => (
              <Reveal key={pick(b.name)} delayMs={i * 120}>
                <div className="mb-4.5 aspect-3/4 border border-[var(--color-border)]">
                  {b.image?.src ? (
                    <Image
                      src={b.image.src}
                      alt={pick(b.image.alt)}
                      width={600}
                      height={800}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <ImagePlaceholder label={pick(b.name)} />
                  )}
                </div>
                <div className="flex items-baseline justify-between gap-3 border-t border-[rgba(var(--project-accent-rgb),0.35)] pt-3.5">
                  <div className="font-ui text-[13px] font-bold tracking-[0.08em] text-[var(--color-charcoal)] uppercase">
                    {pick(b.name)}
                  </div>
                  <div className="whitespace-nowrap font-display text-lg text-[var(--project-accent)]">
                    {pick(b.distance)}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </Reveal>
    </section>
  );
}
