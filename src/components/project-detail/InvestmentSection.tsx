"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { Reveal } from "@/components/Reveal";
import type { ProjectInvestment as ProjectInvestmentData } from "@/lib/project-detail/types";
import { Accent } from "@/components/Accent";

export function InvestmentSection({ id, data }: { id: string; data: ProjectInvestmentData }) {
  const { pick } = useLang();
  return (
    <section id={id} className="bg-[var(--color-deep-earth)] px-5 py-16 sm:px-8 sm:py-20 md:px-12 md:py-28">
      <Reveal className="mx-auto max-w-[1440px]">
        <div className="mb-10 flex flex-wrap gap-8 md:mb-16 md:gap-20">
          <div className="min-w-70 flex-1 basis-85">
            <div className="mb-5 font-ui text-[length:var(--fs-label)] tracking-[var(--ls-label)] text-[var(--project-accent-light)] uppercase">
              {pick(data.eyebrow)}
            </div>
            <h2
              className="m-0 font-display text-[length:var(--fs-h1)] leading-[var(--lh-heading)] font-normal text-[var(--color-warm-white)]"
              style={{ maxWidth: data.headlineMaxWidth ? pick(data.headlineMaxWidth) : "24ch" }}
            >
              <Accent text={pick(data.headline)} onDark />
            </h2>
          </div>
          <div className="min-w-70 flex flex-1 basis-120 flex-col">
            {data.points.map((v) => (
              <div key={v.num} className="flex gap-6 border-t border-[rgba(var(--project-accent-rgb),0.4)] py-6 sm:gap-8">
                <div className="w-11 flex-none font-display text-xl text-[var(--project-accent-light)]">{v.num}</div>
                <div>
                  <div className="mb-2 font-ui text-[13px] font-bold tracking-[0.08em] text-[var(--color-warm-white)] uppercase">
                    {pick(v.title)}
                  </div>
                  <p className="m-0 font-body text-[15px] leading-[var(--lh-body)] text-[var(--color-sand)] opacity-90">
                    {pick(v.desc)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-8 border border-[rgba(233,220,199,0.28)] p-6 md:p-10">
          <div className="min-w-70 flex-1 basis-90">
            <h3 className="m-0 mb-2.5 font-display text-[length:var(--fs-h3)] font-normal text-[var(--color-warm-white)]">
              {pick(data.pricingTitle)}
            </h3>
            <p className="m-0 max-w-130 font-body text-[15px] leading-[var(--lh-body)] text-[var(--color-sand)] opacity-85">
              {pick(data.pricingBody)}
            </p>
          </div>
          <Link
            href={data.pricingCtaHref}
            className="inline-flex items-center rounded-xs border border-[var(--project-primary)] bg-[var(--project-primary)] px-8 py-4 font-ui text-[13px] font-bold tracking-[0.08em] text-[var(--project-primary-foreground)] uppercase no-underline hover:bg-[var(--project-primary-dark)]"
          >
            {pick(data.pricingCtaLabel)}
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
