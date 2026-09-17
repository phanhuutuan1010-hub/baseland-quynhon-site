"use client";

import { useLang } from "@/lib/i18n";
import { PRIVACY_COPY, PRIVACY_SECTIONS } from "@/lib/content/privacy";
import { CONTACT_EMAIL, CONTACT_EMAIL_HREF, CONTACT_PHONE, CONTACT_PHONE_HREF } from "@/lib/content/nav";
import { Reveal } from "@/components/Reveal";

export function PrivacyPageClient() {
  const { pick } = useLang();

  return (
    <div className="relative w-full">
      <section className="bg-[var(--color-warm-white)] px-5 pt-30 pb-14 sm:px-8 sm:pt-38 md:px-12 md:pt-42 md:pb-20">
        <div className="mx-auto max-w-[900px]">
          <div className="mb-4 font-ui text-[length:var(--fs-label)] tracking-[var(--ls-label)] text-[var(--color-terracotta-accessible)] uppercase">
            {pick(PRIVACY_COPY.eyebrow)}
          </div>
          <h1 className="m-0 mb-5 font-display text-[length:var(--fs-h1)] leading-[var(--lh-heading)] font-normal text-[var(--color-charcoal)]">
            {pick(PRIVACY_COPY.headline)}
          </h1>
          <p className="m-0 mb-3 max-w-165 font-body text-[length:var(--fs-body-lg)] leading-[var(--lh-body)] text-[var(--color-text-muted)]">
            {pick(PRIVACY_COPY.intro)}
          </p>
          <p className="m-0 font-ui text-xs tracking-[0.04em] text-[var(--color-text-muted-accessible)]">
            {pick(PRIVACY_COPY.lastUpdated)}: {PRIVACY_COPY.lastUpdatedDate}
          </p>
        </div>
      </section>

      <section className="bg-[var(--color-warm-white)] px-5 pb-16 sm:px-8 sm:pb-24 md:px-12 md:pb-28">
        <Reveal className="mx-auto flex max-w-[900px] flex-col gap-10">
          {PRIVACY_SECTIONS.map((section, i) => (
            <div key={i} className="border-t border-[var(--color-border)] pt-7">
              <h2 className="m-0 mb-3 font-display text-[length:var(--fs-h3)] leading-[var(--lh-heading)] font-normal text-[var(--color-charcoal)]">
                {pick(section.title)}
              </h2>
              <p className="m-0 font-body text-[length:var(--fs-body)] leading-[var(--lh-body)] text-[var(--color-text-muted)]">
                {pick(section.body)}
              </p>
            </div>
          ))}

          <div className="border-t border-[var(--color-border)] pt-7">
            <h2 className="m-0 mb-3 font-display text-[length:var(--fs-h3)] leading-[var(--lh-heading)] font-normal text-[var(--color-charcoal)]">
              {pick({ vi: "Liên hệ", en: "Contact" })}
            </h2>
            <p className="m-0 mb-4 font-body text-[length:var(--fs-body)] leading-[var(--lh-body)] text-[var(--color-text-muted)]">
              {pick({
                vi: "Mọi câu hỏi về chính sách bảo mật, vui lòng liên hệ:",
                en: "For any questions about this privacy policy, please contact:",
              })}
            </p>
            <div className="flex flex-col gap-2 font-body text-[15px]">
              <a href={CONTACT_PHONE_HREF} className="font-semibold text-[var(--color-charcoal)] no-underline">
                {CONTACT_PHONE}
              </a>
              <a href={CONTACT_EMAIL_HREF} className="text-[var(--color-charcoal)] no-underline">
                {CONTACT_EMAIL}
              </a>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
