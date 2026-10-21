"use client";

import Image from "next/image";
import { useLang } from "@/lib/i18n";
import { Reveal } from "@/components/Reveal";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import type { ProjectGallery, ProjectLocation as ProjectLocationData } from "@/lib/project-detail/types";
import { Accent } from "@/components/Accent";
import { CompactHeading } from "./shared";
import { Carousel } from "./Carousel";
import { focalPosition, frameRatio } from "./imageFrame";
import { SectionAction } from "./ProjectContact";

export function ProjectLocation({
  id,
  data,
  compact,
  destinations,
}: {
  id: string;
  data: ProjectLocationData;
  /** Compact layout: smaller map, time groups in one row, nearby
   * destinations (Gallery section) as a sideways carousel. */
  compact?: boolean;
  destinations?: ProjectGallery;
}) {
  const { pick } = useLang();
  if (compact) return <CompactLocation id={id} data={data} destinations={destinations} />;
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
            <div
              className="border border-[var(--project-border)] bg-[var(--color-sand)]"
              style={{ aspectRatio: frameRatio(data.mapImage, "4 / 3") }}
            >
              {data.mapImage?.src ? (
                <Image
                  src={data.mapImage.src}
                  alt={pick(data.mapImage.alt)}
                  width={800}
                  height={600}
                  className="h-full w-full object-contain"
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
                      style={{ objectPosition: focalPosition(b.image) }}
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

function CompactLocation({ id, data, destinations }: { id: string; data: ProjectLocationData; destinations?: ProjectGallery }) {
  const { pick } = useLang();
  return (
    <section id={id} className="bg-[var(--project-dark-alt)] px-5 py-14 sm:px-8 sm:py-16 md:px-12 md:py-20">
      <Reveal className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_1.1fr] md:items-center md:gap-14">
          <div>
            <CompactHeading
              dark
              eyebrow={pick(data.eyebrow)}
              headline={<Accent text={pick(data.headline)} onDark />}
              body={<Accent text={pick(data.body)} onDark />}
              className="mb-8"
            />
            {data.journey && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
                {data.journey.map((stop, i) => (
                  <div key={i} className="border-t border-[rgba(var(--project-accent-rgb),0.45)] pt-3.5">
                    <div className="mb-2.5 font-display text-xl text-[var(--project-accent-light)]">{pick(stop.tier)}</div>
                    <p className="m-0 font-body text-[13px] leading-[1.6] text-[var(--color-sand)]">
                      {stop.landmarks.map((l) => pick(l)).join(" · ")}
                    </p>
                  </div>
                ))}
              </div>
            )}
            <SectionAction data={data} variant="light" show="md-up" className="mt-8" />
          </div>
          <div
            className="overflow-hidden border border-[rgba(250,245,238,0.16)] bg-[var(--color-sand)]"
            style={{ aspectRatio: frameRatio(data.mapImage, "4 / 3") }}
          >
            {data.mapImage?.src ? (
              <Image src={data.mapImage.src} alt={pick(data.mapImage.alt)} width={800} height={600} className="h-full w-full object-contain" />
            ) : (
              <ImagePlaceholder label={pick(data.mapPlaceholderLabel ?? { vi: "Bản đồ vị trí", en: "Location map" })} />
            )}
          </div>
        </div>

        {!!destinations?.items.length && (
          <div className="mt-12 md:mt-16">
            <h3 className="m-0 mb-5 max-w-180 font-display font-normal text-[length:var(--fs-h3)] leading-[1.35] text-[var(--color-warm-white)]">
              <Accent text={pick(destinations.intro)} onDark />
            </h3>
            {/* The photos are posters with the place name printed on them,
                so: real ratio, no crop, no duplicate caption (name → alt). */}
            <Carousel dark label={pick(destinations.intro).replace(/\[\[|\]\]/g, "")} className="gap-3.5 md:mx-0 md:scroll-px-0 md:px-0">
              {destinations.items.map((d) => (
                <div key={d.key} className="w-[42%] max-w-60 flex-none snap-start sm:w-56">
                  <div className="overflow-hidden bg-[rgba(250,245,238,0.06)]" style={{ aspectRatio: frameRatio(d, "1 / 1") }}>
                    {d.src ? (
                      <Image src={d.src} alt={pick(d.name)} width={480} height={480} sizes="(min-width: 640px) 224px, 42vw" className="h-full w-full object-contain" />
                    ) : (
                      <ImagePlaceholder label={pick(d.name)} tone="dark" />
                    )}
                  </div>
                </div>
              ))}
            </Carousel>
          </div>
        )}
        <SectionAction data={data} variant="light" show="md-down" className="mt-8 w-full" />
      </Reveal>
    </section>
  );
}
