"use client";

import Image from "next/image";
import { useLang } from "@/lib/i18n";
import { Reveal } from "@/components/Reveal";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import type { ProjectAmenities as ProjectAmenitiesData } from "@/lib/project-detail/types";
import { Accent } from "@/components/Accent";
import { CompactHeading, scrollCardClass } from "./shared";
import { Carousel } from "./Carousel";
import { focalPosition } from "./imageFrame";
import { SectionAction } from "./ProjectContact";

export function AmenitySection({ id, data, compact }: { id: string; data: ProjectAmenitiesData; compact?: boolean }) {
  const { pick } = useLang();
  if (compact) return <AmenityCards id={id} data={data} />;
  return (
    <section id={id} className="bg-[var(--color-limestone)] px-5 py-16 sm:px-8 sm:py-20 md:px-12 md:py-28">
      <Reveal className="mx-auto max-w-[1440px]">
        <div className="mb-5 font-ui text-[length:var(--fs-label)] tracking-[var(--ls-label)] text-[var(--project-accent-dark)] uppercase">
          {pick(data.eyebrow)}
        </div>
        <h2 className="m-0 mb-10 font-display text-[length:var(--fs-h2)] leading-[var(--lh-heading)] font-normal text-[var(--color-charcoal)] md:mb-18">
          <Accent text={pick(data.headline)} />
        </h2>
        <div className="flex flex-col gap-10 md:gap-20">
          {data.chapters.map((ch) => (
            <div
              key={ch.slotId}
              className={`flex flex-col items-center gap-6 md:gap-14 ${
                ch.direction === "row-reverse" ? "md:flex-row-reverse" : "md:flex-row"
              }`}
            >
              <div className="aspect-16/10 min-w-65 w-full flex-1 basis-95 overflow-hidden">
                {ch.image?.src ? (
                  <Image src={ch.image.src} alt={pick(ch.image.alt)} width={960} height={600} className="h-full w-full object-cover" style={{ objectPosition: focalPosition(ch.image) }} />
                ) : (
                  <ImagePlaceholder label={pick(ch.title)} />
                )}
              </div>
              <div className="w-full flex-1 basis-80">
                <div className="mb-4 font-ui text-xs font-bold tracking-[0.14em] text-[var(--project-accent-dark)] uppercase">
                  {ch.kicker}
                </div>
                <h3 className="m-0 mb-4 font-display text-[length:var(--fs-h3)] leading-[var(--lh-heading)] font-normal text-[var(--color-charcoal)]">
                  {pick(ch.title)}
                </h3>
                <p className="m-0 mb-5 max-w-[440px] font-body text-[length:var(--fs-body)] leading-[var(--lh-body)] text-[var(--color-text-muted-accessible)]">
                  {pick(ch.desc)}
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {ch.items.map((item, i) => (
                    <span
                      key={i}
                      className="rounded-full border border-[rgba(38,34,32,0.2)] px-3.5 py-1.5 font-ui text-xs font-semibold tracking-[0.06em] text-[var(--color-charcoal)] uppercase"
                    >
                      {pick(item)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

/** Compact layout: one card per amenity floor (photo, floor, title, short
 * description, items) — a 4-column grid on desktop, a sideways row on
 * mobile. */
function AmenityCards({ id, data }: { id: string; data: ProjectAmenitiesData }) {
  const { pick } = useLang();
  return (
    <section id={id} className="bg-[var(--color-limestone)] px-5 py-14 sm:px-8 sm:py-16 md:px-12 md:py-20">
      <Reveal className="mx-auto max-w-[1440px]">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-6 md:mb-12">
          <CompactHeading eyebrow={pick(data.eyebrow)} headline={<Accent text={pick(data.headline)} />} />
          <SectionAction data={data} show="md-up" />
        </div>
        <Carousel label={pick(data.eyebrow)} className="md:mx-0 md:grid md:gap-6 md:overflow-visible md:scroll-px-0 md:px-0 md:pb-0 md:grid-cols-2 lg:grid-cols-4">
          {data.chapters.map((ch) => (
            <article key={ch.slotId} className={`${scrollCardClass} flex flex-col bg-[var(--color-warm-white)]`}>
              <div className="aspect-4/3 overflow-hidden">
                {ch.image?.src ? (
                  <Image src={ch.image.src} alt={pick(ch.image.alt)} width={640} height={480} className="h-full w-full object-cover" style={{ objectPosition: focalPosition(ch.image) }} />
                ) : (
                  <ImagePlaceholder label={pick(ch.title)} />
                )}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="mb-2 font-ui text-[11px] font-bold tracking-[0.14em] text-[var(--project-accent-dark)] uppercase">{ch.kicker}</div>
                <h3 className="m-0 mb-2 font-display text-xl leading-[1.25] font-normal text-[var(--color-charcoal)]">{pick(ch.title)}</h3>
                <p className="m-0 mb-4 font-body text-sm leading-[var(--lh-body)] text-[var(--color-text-muted-accessible)]">
                  {pick(ch.desc)}
                </p>
                <p className="m-0 mt-auto font-ui text-[11px] font-semibold tracking-[0.06em] text-[var(--color-charcoal)] uppercase">
                  {ch.items.map((item) => pick(item)).join(" · ")}
                </p>
              </div>
            </article>
          ))}
        </Carousel>
        <SectionAction data={data} show="md-down" className="mt-8 w-full" />
      </Reveal>
    </section>
  );
}
