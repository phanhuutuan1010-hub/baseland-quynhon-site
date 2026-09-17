"use client";

import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { Reveal } from "@/components/Reveal";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import type { HomeProjectsTeaserContent } from "@/lib/content/home";

export function ProjectsTeaserSection({ content }: { content: HomeProjectsTeaserContent }) {
  const { pick } = useLang();
  const t = pick(content);

  return (
    <section className="bg-[var(--color-warm-white)] px-5 py-16 sm:px-8 sm:py-20 md:px-12 md:py-28">
      <Reveal className="mx-auto max-w-[1440px]">
        {t.kicker && (
          <div className="mb-5 font-ui text-[length:var(--fs-label)] tracking-[var(--ls-label)] text-[var(--color-terracotta-accessible)] uppercase">
            {t.kicker}
          </div>
        )}
        {t.title && (
          <h2 className="m-0 mb-14 font-display text-[length:var(--fs-h2)] leading-[var(--lh-heading)] font-normal text-[var(--color-charcoal)]">
            {t.title}
          </h2>
        )}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {t.items.map((item, i) => (
            <div key={item.slotId || i}>
              <div className="relative mb-5 aspect-4/3">
                {item.imageSrc ? (
                  <Image
                    src={item.imageSrc}
                    alt={item.name || "Ảnh dự án"}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                ) : (
                  <ImagePlaceholder label={item.name ? `${item.name}.jpg` : "Ảnh dự án"} />
                )}
                {item.status && (
                  <div className="absolute top-3.5 left-3.5 rounded-full bg-[var(--color-warm-white)] px-3.5 py-1.5 font-ui text-[11px] font-bold tracking-[0.05em] text-[var(--color-deep-earth)] uppercase">
                    {item.status}
                  </div>
                )}
              </div>
              {item.name && <h3 className="m-0 mb-1.5 font-display text-xl font-normal text-[var(--color-charcoal)]">{item.name}</h3>}
              {item.location && <div className="mb-3.5 font-body text-sm text-[var(--color-text-muted)]">{item.location}</div>}
              {item.cta && (
                <Link
                  href="/projects#grid"
                  className="font-ui text-xs font-bold tracking-[0.06em] text-[var(--color-brand-green)] uppercase no-underline hover:text-[var(--color-brand-green-dark)]"
                >
                  {item.cta} →
                </Link>
              )}
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
