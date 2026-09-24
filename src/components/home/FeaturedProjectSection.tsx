"use client";

import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { Reveal } from "@/components/Reveal";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { HScroller } from "@/components/HScroller";
import type { HomeFeaturedProjectContent } from "@/lib/content/home";
import { Accent } from "@/components/Accent";

// The id="featured" anchor is targeted by HeroSection's primary CTA — kept
// structural (not admin-editable) for the same reason as that href.
// Link target is still hardcoded to Q'Terra pending a real Project picker
// for this section; the image itself is admin-settable (imageSrc), falling
// back to the built-in Q'Terra facade shot when unset.
export function FeaturedProjectSection({ content }: { content: HomeFeaturedProjectContent }) {
  const { pick } = useLang();
  const t = pick(content);

  return (
    <section id="featured" className="bg-[var(--color-deep-earth)] px-5 py-16 sm:px-8 sm:py-20 md:px-12 md:py-28">
      <Reveal className="mx-auto max-w-[1440px]">
        <div className="mb-14 flex flex-wrap items-start gap-10 md:gap-20">
          <div className="aspect-4/3 min-w-[280px] flex-1 basis-115 border border-[var(--color-sand)] box-border">
            <Image
              src={t.imageSrc || "/images/qterra/qterra-facade.jpg"}
              alt="Phối cảnh Q'Terra Quy Nhơn"
              width={800}
              height={600}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="min-w-[280px] flex-1 basis-95">
            {t.kicker && (
              <div className="mb-5 font-ui text-[length:var(--fs-label)] tracking-[var(--ls-label)] text-[var(--color-terracotta-light)] uppercase">
                {t.kicker}
              </div>
            )}
            {t.title && (
              <h2 className="m-0 mb-6 font-display text-[length:var(--fs-h1)] leading-[var(--lh-heading)] font-normal text-[var(--color-warm-white)]">
                <Accent text={t.title} onDark />
              </h2>
            )}
            {t.desc && (
              <p className="m-0 mb-9 font-body text-[length:var(--fs-body-lg)] leading-[var(--lh-body)] text-[var(--color-sand)]">
                <Accent text={t.desc} onDark />
              </p>
            )}
            {(t.locationLabel || t.locationValue || t.scaleLabel || t.scaleValue) && (
              <div className="mb-9 flex flex-wrap gap-10">
                {(t.locationLabel || t.locationValue) && (
                  <div>
                    {t.locationLabel && (
                      <div className="mb-1.5 font-ui text-xs tracking-[0.08em] text-[var(--color-terracotta-light)] uppercase">
                        {t.locationLabel}
                      </div>
                    )}
                    {t.locationValue && <div className="font-body text-[17px] text-[var(--color-warm-white)]">{t.locationValue}</div>}
                  </div>
                )}
                {(t.scaleLabel || t.scaleValue) && (
                  <div>
                    {t.scaleLabel && (
                      <div className="mb-1.5 font-ui text-xs tracking-[0.08em] text-[var(--color-terracotta-light)] uppercase">
                        {t.scaleLabel}
                      </div>
                    )}
                    {t.scaleValue && <div className="font-body text-[17px] text-[var(--color-warm-white)]">{t.scaleValue}</div>}
                  </div>
                )}
              </div>
            )}
            {t.cta && (
              <Link
                href="/projects/qterra"
                className="inline-flex items-center rounded-xs border border-[var(--color-brand-green)] bg-[var(--color-brand-green)] px-8 py-4 font-ui text-[13px] font-semibold tracking-[0.08em] text-[var(--color-warm-white)] uppercase no-underline hover:bg-[var(--color-brand-green-dark)]"
              >
                {t.cta}
              </Link>
            )}
          </div>
        </div>
        <HScroller>
          {t.amenities.map((amenity, i) => (
            <div key={amenity.label || i} className="w-65 flex-none">
              <div className="relative mb-3.5 aspect-4/3 border border-[var(--color-sand)] box-border">
                {amenity.imageSrc ? (
                  <Image
                    src={amenity.imageSrc}
                    alt={amenity.label || "Tiện ích Q'Terra"}
                    fill
                    sizes="260px"
                    className="object-cover"
                  />
                ) : (
                  <ImagePlaceholder label={amenity.label ? `Tiện ích Q'Terra: ${amenity.label}` : "Tiện ích Q'Terra"} />
                )}
              </div>
              {amenity.label && (
                <div className="font-ui text-[13px] font-semibold tracking-[0.04em] text-[var(--color-warm-white)]">
                  {amenity.label}
                </div>
              )}
            </div>
          ))}
        </HScroller>
      </Reveal>
    </section>
  );
}
