"use client";

import Image from "next/image";
import { useLang } from "@/lib/i18n";
import { Reveal } from "@/components/Reveal";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import type { ProjectAmenities as ProjectAmenitiesData } from "@/lib/project-detail/types";
import { Accent } from "@/components/Accent";

export function AmenitySection({ id, data }: { id: string; data: ProjectAmenitiesData }) {
  const { pick } = useLang();
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
                  <Image src={ch.image.src} alt={pick(ch.image.alt)} width={960} height={600} className="h-full w-full object-cover" />
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
