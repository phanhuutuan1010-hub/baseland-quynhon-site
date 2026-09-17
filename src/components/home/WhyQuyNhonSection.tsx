"use client";

import Image from "next/image";
import { useLang } from "@/lib/i18n";
import { Reveal } from "@/components/Reveal";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import type { HomeWhyQuyNhonContent } from "@/lib/content/home";

export function WhyQuyNhonSection({ content }: { content: HomeWhyQuyNhonContent }) {
  const { pick } = useLang();
  const t = pick(content);

  return (
    <section className="bg-[var(--color-sand)] px-5 py-16 sm:px-8 sm:py-20 md:px-12 md:py-28">
      <Reveal className="mx-auto max-w-[1440px]">
        {t.kicker && (
          <div className="mb-6 font-ui text-[length:var(--fs-label)] tracking-[var(--ls-label)] text-[var(--color-terracotta-accessible)] uppercase">
            {t.kicker}
          </div>
        )}
        {t.statement && (
          <h2 className="m-0 mb-16 max-w-230 font-display text-[length:var(--fs-h1)] leading-[var(--lh-heading)] font-normal text-[var(--color-charcoal)]">
            {t.statement}
          </h2>
        )}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {t.points.map((point, i) => (
            <div key={point.label || i}>
              <div className="relative mb-5 aspect-4/3">
                {point.imageSrc ? (
                  <Image
                    src={point.imageSrc}
                    alt={point.label || "Ảnh Quy Nhơn"}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                ) : (
                  <ImagePlaceholder label={point.label ? `Ảnh Quy Nhơn: ${point.label}` : "Ảnh Quy Nhơn"} />
                )}
              </div>
              {point.label && (
                <div className="mb-2.5 font-ui text-[13px] font-bold tracking-[0.08em] text-[var(--color-deep-earth)] uppercase">
                  {point.label}
                </div>
              )}
              {point.desc && (
                <p className="m-0 font-body text-[15px] leading-[var(--lh-body)] text-[var(--color-text-muted)]">
                  {point.desc}
                </p>
              )}
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
