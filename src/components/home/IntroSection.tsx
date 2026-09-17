"use client";

import Image from "next/image";
import { useLang } from "@/lib/i18n";
import { Reveal } from "@/components/Reveal";
import type { HomeIntroContent } from "@/lib/content/home";

export function IntroSection({ content }: { content: HomeIntroContent }) {
  const { pick } = useLang();
  const t = pick(content);

  return (
    <section className="bg-[var(--color-warm-white)] px-5 py-16 sm:px-8 sm:py-20 md:px-12 md:py-28">
      <Reveal className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-10 md:gap-20">
        <div className="min-w-[280px] flex-1 basis-[420px]">
          {t.kicker && (
            <div className="mb-5 font-ui text-[length:var(--fs-label)] tracking-[var(--ls-label)] text-[var(--color-terracotta-accessible)] uppercase">
              {t.kicker}
            </div>
          )}
          {t.title && (
            <h2 className="m-0 mb-6 font-display text-[length:var(--fs-h1)] leading-[var(--lh-heading)] font-normal text-[var(--color-charcoal)]">
              {t.title}
            </h2>
          )}
          {t.body && (
            <p className="m-0 max-w-[560px] font-body text-[length:var(--fs-body-lg)] leading-[var(--lh-body)] text-[var(--color-text-muted)]">
              {t.body}
            </p>
          )}
        </div>
        <div className="flex aspect-4/5 max-w-110 min-w-70 flex-1 basis-80 items-center justify-center rounded-sm bg-[var(--color-sand)] p-8">
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
  );
}
