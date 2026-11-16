"use client";

import Image from "next/image";
import { useState } from "react";
import { useLang } from "@/lib/i18n";
import type { ProjectPhotoStrip } from "@/lib/project-detail/types";
import { Carousel } from "./Carousel";
import { focalPosition, frameRatio } from "./imageFrame";
import { ZoomLightbox } from "./ZoomLightbox";

/** True when the strip has at least one photo to show. */
export function hasPhotos(strip?: ProjectPhotoStrip): strip is ProjectPhotoStrip {
  return !!strip?.photos?.some((p) => p.src?.trim());
}

/**
 * Captioned photo row (e.g. "Bên trong căn hộ mẫu"): each photo keeps its
 * own ratio at a fixed row height, in the shared Carousel (snap, peek,
 * arrows). A photo opens full screen on tap.
 */
export function PhotoStrip({ data, dark, className = "" }: { data: ProjectPhotoStrip; dark?: boolean; className?: string }) {
  const { pick } = useLang();
  const photos = data.photos.filter((p) => p.src?.trim());
  const [open, setOpen] = useState<number | null>(null);
  const active = open != null ? photos[open] : undefined;
  if (!photos.length) return null;

  return (
    <div className={className}>
      {pick(data.title) && (
        <h3
          className={`m-0 mb-5 font-display text-[length:var(--fs-h3)] leading-[1.35] font-normal ${dark ? "text-[var(--color-warm-white)]" : "text-[var(--color-charcoal)]"}`}
        >
          {pick(data.title)}
        </h3>
      )}
      <Carousel dark={dark} label={pick(data.title)} className="gap-3 md:gap-4">
        {photos.map((p, i) => (
          <figure key={`${p.src}-${i}`} className="m-0 flex max-w-[86vw] flex-none snap-start flex-col sm:max-w-none">
            <button
              type="button"
              onClick={() => setOpen(i)}
              aria-label={pick(p.caption) || pick(p.alt)}
              className="block h-56 cursor-zoom-in overflow-hidden border-none bg-[var(--color-sand)] p-0 sm:h-64 md:h-80"
              style={{ aspectRatio: frameRatio(p, "4 / 3") }}
            >
              <Image
                src={p.src}
                alt={pick(p.alt) || pick(p.caption)}
                width={960}
                height={720}
                sizes="(min-width: 768px) 560px, 86vw"
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
                style={{ objectPosition: focalPosition(p) }}
              />
            </button>
            {pick(p.caption) && (
              <figcaption className={`mt-2.5 max-w-80 font-ui text-xs font-semibold tracking-[0.06em] uppercase ${dark ? "text-[var(--color-sand)]" : "text-[var(--color-charcoal)]"}`}>
                {pick(p.caption)}
              </figcaption>
            )}
          </figure>
        ))}
      </Carousel>
      {pick(data.note) && (
        <p className={`m-0 mt-3 font-body text-[13px] italic ${dark ? "text-[var(--color-sand)]" : "text-[var(--color-deep-earth)]"}`}>{pick(data.note)}</p>
      )}
      {active && (
        <ZoomLightbox
          src={active.src}
          alt={pick(active.alt) || pick(active.caption)}
          caption={[pick(active.caption), pick(data.note)].filter(Boolean).join(" · ")}
          width={Number((active as { width?: number }).width) || undefined}
          height={Number((active as { height?: number }).height) || undefined}
          onClose={() => setOpen(null)}
        />
      )}
    </div>
  );
}
