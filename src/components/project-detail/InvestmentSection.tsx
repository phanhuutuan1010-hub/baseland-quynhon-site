"use client";

import Link from "next/link";
import { useState } from "react";
import { useLang } from "@/lib/i18n";
import { Reveal } from "@/components/Reveal";
import type { ProjectInvestment as ProjectInvestmentData, ProjectPaymentPlan } from "@/lib/project-detail/types";
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
        {!!(data.priceFacts?.length || data.paymentPlans?.length) && (
          <PricingBlock data={data} />
        )}
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

/** Indicative price figures + payment-plan tabs. Shown only when the
 * project has `priceFacts`/`paymentPlans` data. */
function PricingBlock({ data }: { data: ProjectInvestmentData }) {
  const { pick } = useLang();
  const plans = data.paymentPlans ?? [];
  const [planIndex, setPlanIndex] = useState(0);
  const plan: ProjectPaymentPlan | undefined = plans[planIndex];

  return (
    <div className="mb-10 md:mb-14">
      {!!data.priceFacts?.length && (
        <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-3 md:mb-12">
          {data.priceFacts.map((f, i) => (
            <div key={i} className="border-t border-[rgba(var(--project-accent-rgb),0.45)] pt-5">
              <div className="mb-2 font-ui text-xs font-bold tracking-[0.14em] text-[var(--project-accent-light)] uppercase">
                {pick(f.label)}
              </div>
              <div className="font-display text-[clamp(1.75rem,3.5vw,2.5rem)] leading-[1.1] text-[var(--color-warm-white)]">
                {pick(f.value)}
              </div>
            </div>
          ))}
        </div>
      )}

      {plan && (
        <div>
          {data.paymentTitle && (
            <h3 className="m-0 mb-5 font-display text-[length:var(--fs-h3)] font-normal text-[var(--color-warm-white)]">
              {pick(data.paymentTitle)}
            </h3>
          )}
          <div role="tablist" className="no-scrollbar mb-6 flex gap-2.5 overflow-x-auto pb-1.5">
            {plans.map((p, i) => (
              <button
                key={p.key}
                type="button"
                role="tab"
                aria-selected={i === planIndex}
                onClick={() => setPlanIndex(i)}
                className={`whitespace-nowrap rounded-full border px-5 py-3 font-ui text-xs font-bold tracking-[0.07em] uppercase transition-colors duration-200 ${
                  i === planIndex
                    ? "border-[var(--color-warm-white)] bg-[var(--color-warm-white)] text-[var(--color-charcoal)]"
                    : "border-[rgba(233,220,199,0.4)] bg-transparent text-[var(--color-warm-white)]"
                }`}
              >
                {pick(p.name)}
              </button>
            ))}
          </div>
          <div key={plan.key} className="animate-[fade-slide-in_400ms_var(--ease-editorial)]">
            {pick(plan.summary) && (
              <p className="m-0 mb-5 max-w-150 font-body text-[15px] leading-[var(--lh-body)] text-[var(--color-sand)]">
                {pick(plan.summary)}
              </p>
            )}
            <ol className="m-0 flex list-none flex-col p-0">
              {plan.steps.map((step, i) => (
                <li
                  key={i}
                  className="flex flex-wrap gap-x-8 gap-y-1 border-t border-[rgba(var(--project-accent-rgb),0.3)] py-4"
                >
                  <div className="w-32 flex-none font-display text-lg text-[var(--project-accent-light)]">
                    {pick(step.milestone)}
                  </div>
                  <div className="min-w-50 flex-1 font-body text-[15px] leading-[var(--lh-body)] text-[var(--color-warm-white)]">
                    {pick(step.desc)}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}

      {data.paymentNote && (
        <p className="m-0 mt-6 max-w-180 font-body text-[13px] leading-[var(--lh-body)] text-[var(--color-sand)] opacity-80">
          {pick(data.paymentNote)}
        </p>
      )}
    </div>
  );
}
