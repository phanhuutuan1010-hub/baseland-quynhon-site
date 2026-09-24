"use client";

import { useLang } from "@/lib/i18n";
import { Reveal } from "@/components/Reveal";
import type { HomeWhyBaseLandContent } from "@/lib/content/home";
import { Accent } from "@/components/Accent";

export function WhyBaseLandSection({ content }: { content: HomeWhyBaseLandContent }) {
  const { pick } = useLang();
  const t = pick(content);

  return (
    <section className="bg-[var(--color-sand)] px-5 py-16 sm:px-8 sm:py-20 md:px-12 md:py-28">
      <Reveal className="mx-auto flex max-w-[1440px] flex-wrap gap-10 md:gap-20">
        <div className="min-w-[280px] flex-1 basis-80">
          {t.kicker && (
            <div className="mb-5 font-ui text-[length:var(--fs-label)] tracking-[var(--ls-label)] text-[var(--color-terracotta-accessible)] uppercase">
              {t.kicker}
            </div>
          )}
          {t.title && (
            <h2 className="m-0 max-w-90 font-display text-[length:var(--fs-h2)] leading-[var(--lh-heading)] font-normal text-[var(--color-charcoal)]">
              <Accent text={t.title} />
            </h2>
          )}
        </div>
        <div className="flex min-w-[280px] flex-2 basis-120 flex-col">
          {t.values.map((val, i) => (
            <div
              key={val.name || i}
              className="flex flex-col gap-2 border-t border-[rgba(193,99,60,0.35)] py-5 sm:flex-row sm:items-baseline sm:gap-6"
            >
              {val.name && (
                <div className="flex-none font-ui text-sm font-semibold tracking-[0.04em] text-[var(--color-brand-green)] uppercase sm:w-27.5">
                  {val.name}
                </div>
              )}
              {val.desc && (
                <div className="font-body text-[15px] leading-[var(--lh-body)] text-[var(--color-text-muted)]">
                  {val.desc}
                </div>
              )}
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
