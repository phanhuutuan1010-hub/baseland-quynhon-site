"use client";

import Image from "next/image";
import { useLang } from "@/lib/i18n";
import { ABOUT_CONTENT } from "@/lib/content/about";
import { Reveal } from "@/components/Reveal";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { LeadFormFull } from "@/components/LeadFormFull";
import { Accent } from "@/components/Accent";
import { useParallax } from "@/lib/useParallax";
import { CONTACT_EMAIL, CONTACT_EMAIL_HREF, CONTACT_PHONE, CONTACT_PHONE_HREF } from "@/lib/content/nav";

export function AboutPageClient() {
  const { pick } = useLang();
  const t = pick(ABOUT_CONTENT);
  // Subtle parallax on the hero photo only — About's brief (mục 8) allows
  // it explicitly ("nhẹ hơn Q'Terra... subtle parallax"), unlike every
  // other page's brief which bans it outright.
  const heroParallaxRef = useParallax<HTMLDivElement>(40, 0.15);

  return (
    <div className="relative w-full">
      {/* Hero */}
      <section className="relative h-[clamp(460px,72vh,760px)] w-full overflow-hidden">
        <div ref={heroParallaxRef} className="absolute inset-0 -top-10 -bottom-10">
          <ImagePlaceholder
            label={pick({
              vi: "Ảnh kiến trúc / cảnh quan Quy Nhơn",
              en: "Architecture / Quy Nhon landscape photo",
            })}
            tone="dark"
            className="rounded-none border-none"
          />
        </div>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(38,34,32,0.35) 0%, rgba(38,34,32,0.15) 40%, rgba(38,34,32,0.82) 100%)",
          }}
        />
        <div className="relative z-[2] mx-auto flex h-full max-w-[1440px] flex-col justify-end px-5 pb-14 sm:px-8 sm:pb-20 md:px-12 md:pb-22">
          <div className="mb-5 font-ui text-[length:var(--fs-label)] tracking-[var(--ls-label)] text-[var(--color-terracotta-light)] uppercase">
            {t.hero.eyebrow}
          </div>
          <h1 className="m-0 font-display text-[length:var(--fs-hero)] leading-[1.05] font-normal text-[var(--color-warm-white)]">
            {t.hero.headline}
          </h1>
        </div>
      </section>

      {/* Brand statement */}
      <section className="bg-[var(--color-warm-white)] px-5 py-18 sm:px-8 sm:py-24 md:px-12 md:py-35">
        <Reveal className="mx-auto max-w-240 text-center">
          <h2 className="m-0 font-display text-[clamp(1.5rem,3.6vw,2.5rem)] leading-[1.4] font-normal text-[var(--color-charcoal)]">
            <Accent text={t.statement} />
          </h2>
        </Reveal>
      </section>

      {/* Base Land intro */}
      <section className="bg-[var(--color-sand)] px-5 py-16 sm:px-8 sm:py-20 md:px-12 md:py-28">
        <Reveal className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-10 md:gap-18">
          <div className="min-w-[280px] flex-1 basis-105">
            <div className="mb-5 font-ui text-[length:var(--fs-label)] tracking-[var(--ls-label)] text-[var(--color-terracotta-accessible)] uppercase">
              {t.intro.kicker}
            </div>
            <h2 className="m-0 mb-6 font-display text-[length:var(--fs-h1)] leading-[var(--lh-heading)] font-normal text-[var(--color-charcoal)]">
              {t.intro.title}
            </h2>
            <p className="m-0 max-w-140 font-body text-[length:var(--fs-body-lg)] leading-[var(--lh-body)] text-[var(--color-text-muted)]">
              {t.intro.body}
            </p>
          </div>
          <div className="flex aspect-4/5 max-w-85 min-w-60 flex-1 basis-85 items-center justify-center">
            <Image
              src="/images/brand/logo-baseland.png"
              alt="Base Land"
              width={400}
              height={500}
              className="h-full w-full object-contain"
            />
          </div>
        </Reveal>
      </section>

      {/* Why Quy Nhon */}
      <section className="bg-[var(--color-warm-white)] px-5 py-16 sm:px-8 sm:py-20 md:px-12 md:py-28">
        <Reveal className="mx-auto max-w-[1440px]">
          <div className="mb-6 font-ui text-[length:var(--fs-label)] tracking-[var(--ls-label)] text-[var(--color-terracotta-accessible)] uppercase">
            {t.whyqn.kicker}
          </div>
          <h2 className="m-0 mb-16 max-w-none font-display text-[length:var(--fs-h1)] leading-[var(--lh-heading)] font-normal text-[var(--color-charcoal)]">
            <Accent text={t.whyqn.statement} />
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {t.whyqn.points.map((point) => (
              <div key={point.label}>
                <div className="mb-5 aspect-4/3">
                  <ImagePlaceholder label={pick({ vi: "Ảnh Quy Nhơn theo chủ đề", en: "Quy Nhon themed photo" }) + ` — ${point.label}`} />
                </div>
                <div className="mb-2.5 font-ui text-[13px] font-bold tracking-[0.08em] text-[var(--color-deep-earth)] uppercase">
                  {point.label}
                </div>
                <p className="m-0 font-body text-[15px] leading-[var(--lh-body)] text-[var(--color-text-muted)]">
                  {point.desc}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Local expertise */}
      <section className="bg-[var(--color-deep-earth)] px-5 py-16 sm:px-8 sm:py-20 md:px-12 md:py-28">
        <Reveal className="mx-auto max-w-[1440px]">
          <div className="mb-5 font-ui text-[length:var(--fs-label)] tracking-[var(--ls-label)] text-[var(--color-terracotta-light)] uppercase">
            {t.expertise.kicker}
          </div>
          <h2 className="m-0 mb-14 max-w-190 font-display text-[length:var(--fs-h2)] leading-[var(--lh-heading)] font-normal text-[var(--color-warm-white)]">
            <Accent text={t.expertise.title} onDark />
          </h2>
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {t.expertise.points.map((e) => (
              <div key={e.title} className="border-t border-[rgba(193,99,60,0.4)] pt-6">
                <h3 className="m-0 mb-3 font-ui text-base font-bold tracking-[0.02em] text-[var(--color-warm-white)]">
                  {e.title}
                </h3>
                <p className="m-0 font-body text-sm leading-[var(--lh-body)] text-[var(--color-sand)]">{e.desc}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Core values */}
      <section className="bg-[var(--color-sand)] px-5 py-16 sm:px-8 sm:py-20 md:px-12 md:py-28">
        <Reveal className="mx-auto flex max-w-[1440px] flex-wrap gap-10 md:gap-24">
          <div className="min-w-[280px] flex-1 basis-80">
            <div className="mb-5 font-ui text-[length:var(--fs-label)] tracking-[var(--ls-label)] text-[var(--color-terracotta-accessible)] uppercase">
              {t.values.kicker}
            </div>
            <h2 className="m-0 max-w-90 font-display text-[length:var(--fs-h2)] leading-[var(--lh-heading)] font-normal text-[var(--color-charcoal)]">
              <Accent text={t.values.title} />
            </h2>
          </div>
          <div className="flex min-w-[280px] flex-2 basis-120 flex-col">
            {t.values.items.map((val) => (
              <div
                key={val.name}
                className="flex flex-col gap-2 border-t border-[rgba(193,99,60,0.35)] py-5.5 sm:flex-row sm:items-baseline sm:gap-6"
              >
                <div className="flex-none font-ui text-sm font-semibold tracking-[0.04em] text-[var(--color-brand-green)] uppercase sm:w-35">
                  {val.name}
                </div>
                <div className="font-body text-[15px] leading-[var(--lh-body)] text-[var(--color-text-muted)]">
                  {val.desc}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Team & organization */}
      <section className="bg-[var(--color-warm-white)] px-5 py-16 sm:px-8 sm:py-20 md:px-12 md:py-28">
        <Reveal className="mx-auto max-w-[1440px]">
          <div className="mb-5 font-ui text-[length:var(--fs-label)] tracking-[var(--ls-label)] text-[var(--color-terracotta-accessible)] uppercase">
            {t.team.kicker}
          </div>
          <h2 className="m-0 mb-7 font-display text-[length:var(--fs-h2)] leading-[var(--lh-heading)] font-normal text-[var(--color-charcoal)]">
            {t.team.title}
          </h2>
          <p className="m-0 mb-14 max-w-none font-body text-[length:var(--fs-body-lg)] leading-[var(--lh-body)] text-[var(--color-text-muted)]">
            {t.team.body}
          </p>
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {t.team.services.map((svc) => (
              <div key={svc.num} className="border-t border-[rgba(193,99,60,0.35)] pt-7">
                <div className="mb-5 font-display text-3xl text-[var(--color-terracotta-accessible)]">{svc.num}</div>
                <h3 className="m-0 mb-3 font-ui text-[17px] font-bold tracking-[0.01em] text-[var(--color-charcoal)]">
                  {svc.title}
                </h3>
                <p className="m-0 font-body text-[15px] leading-[var(--lh-body)] text-[var(--color-text-muted)]">
                  {svc.desc}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Lead CTA */}
      <section
        id="lead"
        className="px-5 py-16 sm:px-8 sm:py-20 md:px-12 md:py-28"
        style={{ background: "linear-gradient(135deg, var(--color-clay) 0%, var(--color-deep-earth) 100%)" }}
      >
        <Reveal className="mx-auto flex max-w-[1440px] flex-wrap gap-10 md:gap-20">
          <div className="min-w-[280px] flex-1 basis-95">
            <h2 className="m-0 mb-6 font-display text-[length:var(--fs-h1)] leading-[var(--lh-heading)] font-normal text-[var(--color-warm-white)]">
              <Accent text={t.cta.title} onDark />
            </h2>
            <p className="m-0 mb-9 max-w-110 font-body text-[length:var(--fs-body-lg)] leading-[var(--lh-body)] text-[var(--color-sand)]">
              {t.cta.sub}
            </p>
            <div className="mb-9 flex flex-col gap-3.5 font-body text-[17px]">
              <a href={CONTACT_PHONE_HREF} className="text-[var(--color-warm-white)] no-underline">
                {CONTACT_PHONE}
              </a>
              <a href={CONTACT_EMAIL_HREF} className="text-[var(--color-warm-white)] no-underline">
                {CONTACT_EMAIL}
              </a>
            </div>
            <a
              href={CONTACT_PHONE_HREF}
              className="inline-flex items-center rounded-xs border border-[var(--color-terracotta-light)] bg-transparent px-8 py-4 font-ui text-[13px] font-bold tracking-[0.08em] text-[var(--color-warm-white)] uppercase no-underline hover:bg-[rgba(193,99,60,0.15)]"
            >
              {t.cta.callNow} {CONTACT_PHONE}
            </a>
          </div>
          <div className="min-w-[280px] flex-1 basis-95 rounded-sm bg-[var(--color-warm-white)] p-7 sm:p-11">
            <LeadFormFull source="about" />
          </div>
        </Reveal>
      </section>
    </div>
  );
}
