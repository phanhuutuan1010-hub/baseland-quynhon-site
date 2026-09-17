"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { HeroCarousel } from "@/components/HeroCarousel";
import { useSequenceReveal, stepStyle, stepScaleStyle, lineRevealStyle } from "@/lib/useSequenceReveal";
import type { HomeHeroContent } from "@/lib/content/home";

// The two CTA hrefs (#featured / /contact) are structural — #featured must
// keep matching FeaturedProjectSection's anchor id, so they aren't exposed
// as editable fields (see Phase 1 scope note in the plan). The background
// defaults to a 4-slide carousel but swaps to a single admin-set image
// (heroImageSrc, via Media Library) when one is configured.
export function HeroSection({ content }: { content: HomeHeroContent }) {
  const { pick } = useLang();
  const t = pick(content);
  const entered = useSequenceReveal();

  return (
    <section className="relative h-screen min-h-[640px] w-full overflow-hidden">
      <div style={{ opacity: entered ? 1 : 0, transition: "opacity 600ms var(--ease-editorial)" }}>
        <HeroCarousel
          slides={
            t.heroImageSrc
              ? [{ src: t.heroImageSrc, alt: t.eyebrow || "Base Land Quy Nhơn" }]
              : [
                  { src: "/images/qterra/qterra-facade.jpg", alt: "Phối cảnh Q'Terra Quy Nhơn" },
                  { placeholder: "Ảnh biển Quy Nhơn" },
                  { src: "/images/qterra/qterra-amenities.jpg", alt: "Tiện ích & kiến trúc Q'Terra" },
                  { placeholder: "Ảnh skyline Quy Nhơn" },
                ]
          }
        />
      </div>
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background: "linear-gradient(180deg, rgba(38,34,32,0.18) 0%, rgba(38,34,32,0.05) 38%, rgba(38,34,32,0.72) 100%)",
        }}
      />
      <div className="relative z-[2] mx-auto flex h-full max-w-[1440px] flex-col justify-end px-5 pb-12 sm:px-8 sm:pb-16 md:px-12 md:pb-24">
        {t.eyebrow && (
          <div
            style={stepStyle(entered, 0, 500)}
            className="mb-5 font-ui text-[length:var(--fs-label)] tracking-[var(--ls-label)] text-[var(--color-sand)] uppercase"
          >
            {t.eyebrow}
          </div>
        )}
        {(t.headlineLines[0] || t.headlineLines[1]) && (
          <h1 className="m-0 mb-5 max-w-full font-display text-[length:var(--fs-hero)] leading-[var(--lh-tight)] font-normal tracking-[-0.01em] text-[var(--color-warm-white)]">
            {t.headlineLines[0] && (
              <span style={stepStyle(entered, 250, 600)} className="block">
                {t.headlineLines[0]}
              </span>
            )}
            {t.headlineLines[1] && (
              <span style={stepStyle(entered, 400, 600)} className="block">
                {t.headlineLines[1]}
              </span>
            )}
          </h1>
        )}
        <div style={lineRevealStyle(entered, 650, 64)} className="mb-7 h-0.5 rounded-sm bg-[var(--color-terracotta-light)]" />
        {t.tagline && (
          <p
            style={stepStyle(entered, 750, 500)}
            className="m-0 mb-10 max-w-[520px] font-body text-[length:var(--fs-body-lg)] leading-[var(--lh-body)] text-[var(--color-sand)]"
          >
            {t.tagline}
          </p>
        )}
        {(t.ctaPrimary || t.ctaSecondary) && (
          <div style={stepScaleStyle(entered, 1050)} className="flex flex-wrap gap-4">
            {t.ctaPrimary && (
              <Link
                href="#featured"
                className="inline-flex items-center rounded-xs border border-[var(--color-terracotta)] px-8 py-4 font-ui text-[13px] font-semibold tracking-[0.08em] text-[var(--color-warm-white)] uppercase no-underline hover:bg-[rgba(193,99,60,0.15)]"
              >
                {t.ctaPrimary}
              </Link>
            )}
            {t.ctaSecondary && (
              <Link
                href="/contact"
                className="inline-flex items-center rounded-xs border border-[var(--color-brand-green)] bg-[var(--color-brand-green)] px-8 py-4 font-ui text-[13px] font-semibold tracking-[0.08em] text-[var(--color-warm-white)] uppercase no-underline hover:bg-[var(--color-brand-green-dark)]"
              >
                {t.ctaSecondary}
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
