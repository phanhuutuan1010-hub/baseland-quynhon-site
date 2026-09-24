"use client";

import Image from "next/image";
import { useLang } from "@/lib/i18n";
import { Reveal } from "@/components/Reveal";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import type { ProjectGallery as ProjectGalleryData } from "@/lib/project-detail/types";
import { Accent } from "@/components/Accent";

/** Nearby-destinations / gallery grid (Q'Terra: "6 điểm đến lân cận"). */
export function ProjectGallery({ id, data }: { id: string; data: ProjectGalleryData }) {
  const { pick } = useLang();
  return (
    <section id={id} className="bg-[var(--color-warm-white)] px-5 pb-16 sm:px-8 sm:pb-20 md:px-12 md:pb-28">
      <Reveal className="mx-auto max-w-[1440px]">
        <h2 className="m-0 mb-10 max-w-[900px] font-display text-[clamp(1.5rem,3vw,2.1rem)] leading-[1.4] font-normal text-[var(--color-charcoal)] md:mb-16">
          <Accent text={pick(data.intro)} />
        </h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {data.items.map((d) => (
            <div key={d.key}>
              <div className="mb-4 aspect-square overflow-hidden">
                {d.src ? (
                  <Image src={d.src} alt={pick(d.name)} width={800} height={800} className="h-full w-full object-cover" />
                ) : (
                  <ImagePlaceholder label={pick(d.name)} />
                )}
              </div>
              <div className="mb-2 font-ui text-sm font-bold tracking-[0.08em] text-[var(--project-accent-dark)] uppercase">
                {pick(d.name)}
              </div>
              <p className="m-0 font-body text-sm leading-[var(--lh-body)] text-[var(--color-text-muted)]">
                {pick(d.desc)}
              </p>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
