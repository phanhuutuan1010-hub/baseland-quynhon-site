"use client";

import { useLang } from "@/lib/i18n";
import { CONTACT_COPY, TRUST_POINTS } from "@/lib/content/contact";
import { CONTACT_ADDRESS, CONTACT_EMAIL, CONTACT_EMAIL_HREF, CONTACT_PHONE, CONTACT_PHONE_HREF } from "@/lib/content/nav";
import { Reveal } from "@/components/Reveal";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { LeadFormFull } from "@/components/LeadFormFull";

export function ContactPageClient() {
  const { pick } = useLang();

  return (
    <div className="relative w-full">
      <section
        className="relative px-5 pt-35 pb-14 sm:px-8 sm:pt-42 sm:pb-20 md:px-12 md:pb-24"
        style={{ background: "linear-gradient(135deg, var(--color-clay) 0%, var(--color-deep-earth) 100%)" }}
      >
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-5 font-ui text-[length:var(--fs-label)] tracking-[var(--ls-label)] text-[var(--color-terracotta-light)] uppercase">
            {pick(CONTACT_COPY.heroEyebrow)}
          </div>
          <h1 className="m-0 mb-5 font-display text-[length:var(--fs-hero)] leading-[1.05] font-normal text-[var(--color-warm-white)]">
            {pick(CONTACT_COPY.heroHeadline)}
          </h1>
          <p className="m-0 max-w-140 font-body text-[length:var(--fs-body-lg)] leading-[var(--lh-body)] text-[var(--color-sand)]">
            {pick(CONTACT_COPY.heroSub)}
          </p>
        </div>
      </section>

      <section id="lead-form" className="bg-[var(--color-warm-white)] px-5 py-12 sm:px-8 sm:py-16 md:px-12 md:py-22">
        <Reveal className="mx-auto flex max-w-[1440px] flex-wrap-reverse items-start gap-8 md:gap-20">
          <div className="min-w-[300px] flex-1 basis-105 rounded-sm bg-[var(--color-sand)] p-7 sm:p-11">
            <LeadFormFull />
          </div>
          <div className="flex min-w-70 flex-1 basis-80 flex-col gap-8">
            <div>
              <div className="mb-5 font-ui text-[length:var(--fs-label)] tracking-[var(--ls-label)] text-[var(--color-terracotta-accessible)] uppercase">
                {pick(CONTACT_COPY.infoKicker)}
              </div>
              <div className="mb-3.5 font-ui text-base font-bold tracking-[0.03em] text-[var(--color-charcoal)]">
                BASE LAND QUY NHƠN
              </div>
              <div className="flex flex-col gap-3 font-body text-[15px] text-[var(--color-text-muted)]">
                <span>{pick(CONTACT_ADDRESS)}</span>
                <a href={CONTACT_PHONE_HREF} className="font-semibold text-[var(--color-charcoal)] no-underline">
                  {CONTACT_PHONE}
                </a>
                <a href={CONTACT_EMAIL_HREF} className="text-[var(--color-charcoal)] no-underline">
                  {CONTACT_EMAIL}
                </a>
              </div>
            </div>
            <div className="aspect-4/3">
              <ImagePlaceholder
                label={pick({
                  vi: "Bản đồ / ảnh văn phòng Base Land Quy Nhơn",
                  en: "Map / Base Land Quy Nhon office photo",
                })}
              />
            </div>
          </div>
        </Reveal>
      </section>

      <section className="bg-[var(--color-deep-earth)] px-5 py-14 sm:px-8 sm:py-20 md:px-12 md:py-24">
        <Reveal className="mx-auto max-w-[1440px]">
          <div className="mb-9 font-ui text-[length:var(--fs-label)] tracking-[var(--ls-label)] text-[var(--color-terracotta-light)] uppercase">
            {pick(CONTACT_COPY.trustKicker)}
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {TRUST_POINTS.map((p, i) => (
              <div key={i} className="border-t border-[rgba(193,99,60,0.4)] pt-5">
                <h3 className="m-0 mb-2.5 font-ui text-[15px] font-bold text-[var(--color-warm-white)]">
                  {pick(p.title)}
                </h3>
                <p className="m-0 font-body text-sm leading-[var(--lh-body)] text-[var(--color-sand)]">
                  {pick(p.desc)}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>
    </div>
  );
}
