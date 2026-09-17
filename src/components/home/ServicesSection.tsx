"use client";

import { useLang } from "@/lib/i18n";
import { Reveal } from "@/components/Reveal";
import type { HomeServicesContent } from "@/lib/content/home";

export function ServicesSection({ content }: { content: HomeServicesContent }) {
  const { pick } = useLang();
  const t = pick(content);

  return (
    <section className="bg-[var(--color-limestone)] px-5 py-16 sm:px-8 sm:py-20 md:px-12 md:py-28">
      <Reveal className="mx-auto max-w-[1440px]">
        <div className="mb-5 font-ui text-[length:var(--fs-label)] tracking-[var(--ls-label)] text-[var(--color-terracotta-accessible)] uppercase">
          {t.kicker}
        </div>
        <h2 className="m-0 mb-14 font-display text-[length:var(--fs-h2)] leading-[var(--lh-heading)] font-normal text-[var(--color-charcoal)]">
          {t.title}
        </h2>
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {t.items.map((svc) => (
            <div key={svc.num} className="border-t border-[rgba(193,99,60,0.35)] pt-7">
              <div className="mb-5 font-display text-3xl text-[var(--color-terracotta-accessible)]">{svc.num}</div>
              <h3 className="m-0 mb-3 font-ui text-[17px] font-bold tracking-[0.01em] text-[var(--color-charcoal)]">
                {svc.title}
              </h3>
              <p className="m-0 font-body text-[15px] leading-[var(--lh-body)] text-[var(--color-text-muted-accessible)]">
                {svc.desc}
              </p>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
