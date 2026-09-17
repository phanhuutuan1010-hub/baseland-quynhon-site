"use client";

import { useLang } from "@/lib/i18n";
import { Reveal } from "@/components/Reveal";
import { LeadFormSimple } from "@/components/LeadFormSimple";
import type { HomeLeadCtaContent } from "@/lib/content/home";

export function LeadCtaSection({
  content,
  contactPhone,
  contactPhoneHref,
}: {
  content: HomeLeadCtaContent;
  contactPhone: string;
  contactPhoneHref: string;
}) {
  const { pick } = useLang();
  const t = pick(content);

  return (
    <section
      id="lead"
      className="px-5 py-16 sm:px-8 sm:py-20 md:px-12 md:py-28"
      style={{ background: "linear-gradient(135deg, var(--color-clay) 0%, var(--color-deep-earth) 100%)" }}
    >
      <Reveal className="mx-auto flex max-w-[1440px] flex-wrap gap-10 md:gap-20">
        <div className="min-w-[280px] flex-1 basis-95">
          <h2 className="m-0 mb-6 font-display text-[length:var(--fs-h1)] leading-[var(--lh-heading)] font-normal text-[var(--color-warm-white)]">
            {t.title}
          </h2>
          <p className="m-0 mb-10 max-w-110 font-body text-[length:var(--fs-body-lg)] leading-[var(--lh-body)] text-[var(--color-sand)]">
            {t.sub}
          </p>
          <a
            href={contactPhoneHref}
            className="inline-flex items-center gap-2.5 rounded-xs border border-[var(--color-terracotta-light)] bg-transparent px-8 py-4 font-ui text-[13px] font-bold tracking-[0.08em] text-[var(--color-warm-white)] uppercase no-underline hover:bg-[rgba(193,99,60,0.15)]"
          >
            {pick({ vi: `Gọi ngay ${contactPhone}`, en: `Call now ${contactPhone}` })}
          </a>
        </div>
        <div className="min-w-[280px] flex-1 basis-95 rounded-sm bg-[var(--color-warm-white)] p-7 sm:p-11">
          <LeadFormSimple />
        </div>
      </Reveal>
    </section>
  );
}
