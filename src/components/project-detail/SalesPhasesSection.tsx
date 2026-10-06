"use client";

import Image from "next/image";
import { useLang } from "@/lib/i18n";
import { CONTACT_PHONE, CONTACT_PHONE_HREF } from "@/lib/content/nav";
import type { ProjectSalesPhases } from "@/lib/project-detail/types";

const btnOutline =
  "inline-flex min-h-12 items-center justify-center rounded-xs border border-[rgba(250,245,238,0.45)] bg-transparent px-8 py-4 font-ui text-[13px] font-bold tracking-[0.08em] text-[var(--color-warm-white)] uppercase no-underline transition-colors hover:border-[var(--color-warm-white)] hover:bg-[rgba(250,245,238,0.08)]";

/**
 * "Giai đoạn bán hàng" — admin-editable per project (Admin → Dự án → Sections
 * → Giai đoạn bán hàng). Dark, image-backed timeline with a large key date.
 * No reveal animation (fixed layout → no CLS). Any empty text hides its
 * element; the call button uses the site-wide hotline (nav.ts).
 */
export function SalesPhasesSection({
  id,
  data,
  fallbackImage,
}: {
  id: string;
  data: ProjectSalesPhases;
  fallbackImage?: string;
}) {
  const { pick } = useLang();
  const bgImage = data.backgroundImage?.src || fallbackImage;
  const steps = (data.steps ?? []).filter((step) => pick(step.title) || pick(step.body));
  const hasDate = !!data.date?.trim();

  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="relative isolate overflow-hidden bg-[var(--project-dark-alt)] px-5 py-18 sm:px-8 sm:py-22 md:px-12 md:py-28"
    >
      {bgImage && (
        <Image src={bgImage} alt="" fill sizes="100vw" className="-z-20 object-cover opacity-40" aria-hidden="true" />
      )}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 85% 10%, rgba(var(--project-accent-rgb),0.45) 0%, transparent 60%), linear-gradient(180deg, rgba(20,16,14,0.62) 0%, rgba(20,16,14,0.9) 100%)",
        }}
      />

      <div className="mx-auto max-w-[1440px]">
        <div
          className={`mb-12 grid grid-cols-1 items-end gap-10 md:mb-18 md:gap-16 ${hasDate ? "md:grid-cols-[1.25fr_1fr]" : ""}`}
        >
          <div>
            {pick(data.eyebrow) && (
              <div className="mb-5 flex items-center gap-3 font-ui text-[length:var(--fs-label)] tracking-[var(--ls-label)] text-[var(--project-accent-light)] uppercase">
                <span aria-hidden="true" className="h-px w-10 bg-[var(--project-accent-light)]" />
                {pick(data.eyebrow)}
              </div>
            )}
            <h2
              id={`${id}-title`}
              className="m-0 mb-6 font-display text-[clamp(2.5rem,6vw,4.75rem)] leading-[1.02] font-normal text-[var(--color-warm-white)]"
            >
              {pick(data.headline)}
            </h2>
            {pick(data.body) && (
              <p className="m-0 max-w-[560px] font-body text-[length:var(--fs-body-lg)] leading-[var(--lh-body)] text-[var(--color-sand)]">
                {pick(data.body)}
              </p>
            )}
          </div>

          {hasDate && (
            <div className="relative rounded-sm border border-[rgba(250,245,238,0.18)] bg-[rgba(250,245,238,0.06)] p-6 backdrop-blur-sm sm:p-8">
              <span aria-hidden="true" className="absolute top-0 left-6 h-[3px] w-16 bg-[var(--project-accent-light)] sm:left-8" />
              {pick(data.dateLabel) && (
                <div className="mb-3 font-ui text-xs font-bold tracking-[0.14em] text-[var(--project-accent-light)] uppercase">
                  {pick(data.dateLabel)}
                </div>
              )}
              <div className="font-display text-[clamp(3rem,8vw,5.5rem)] leading-none text-[var(--color-warm-white)] tabular-nums">
                {data.date}
              </div>
              {pick(data.dateCaption) && (
                <p className="m-0 mt-4 font-body text-sm text-[rgba(233,220,199,0.75)]">{pick(data.dateCaption)}</p>
              )}
            </div>
          )}
        </div>

        {steps.length > 0 && (
          <ol
            className={`m-0 grid list-none grid-cols-1 gap-4 p-0 md:gap-6 ${
              steps.length === 2 ? "md:grid-cols-2" : steps.length >= 4 ? "md:grid-cols-2 xl:grid-cols-4" : steps.length === 3 ? "md:grid-cols-3" : ""
            }`}
          >
            {steps.map((step, i) => {
              const tag = pick(step.tag);
              return (
                <li
                  key={i}
                  className={`relative flex flex-col rounded-sm border p-6 transition-colors sm:p-8 ${
                    tag
                      ? "border-[var(--project-accent-light)] bg-[rgba(250,245,238,0.1)]"
                      : "border-[rgba(250,245,238,0.14)] bg-[rgba(250,245,238,0.04)] hover:border-[rgba(250,245,238,0.3)]"
                  }`}
                >
                  <div className="mb-6 flex items-center justify-between gap-3">
                    <span
                      className={`flex h-12 w-12 items-center justify-center rounded-full font-ui text-sm font-bold ${
                        tag
                          ? "bg-[var(--project-accent-light)] text-[var(--project-dark-alt)]"
                          : "border border-[rgba(250,245,238,0.35)] bg-[var(--project-dark-alt)] text-[var(--color-warm-white)]"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {tag && (
                      <span className="rounded-full bg-[rgba(250,245,238,0.12)] px-3 py-1 font-ui text-[11px] font-bold tracking-[0.1em] text-[var(--project-accent-light)] uppercase">
                        {tag}
                      </span>
                    )}
                  </div>
                  {pick(step.title) && (
                    <h3 className="m-0 mb-3 font-display text-[clamp(1.5rem,2.4vw,2rem)] leading-[var(--lh-heading)] font-normal text-[var(--color-warm-white)]">
                      {pick(step.title)}
                    </h3>
                  )}
                  {pick(step.body) && (
                    <p className="m-0 font-body text-[15px] leading-[var(--lh-body)] text-[rgba(233,220,199,0.85)]">
                      {pick(step.body)}
                    </p>
                  )}
                </li>
              );
            })}
          </ol>
        )}

        {(pick(data.ctaLeadLabel) || pick(data.ctaCallLabel) || (data.zaloUrl && pick(data.ctaZaloLabel))) && (
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap md:mt-14">
            {pick(data.ctaLeadLabel) && (
              <a
                href={data.ctaLeadHref || "#lead"}
                className="inline-flex min-h-12 items-center justify-center rounded-xs border border-[var(--color-warm-white)] bg-[var(--color-warm-white)] px-8 py-4 font-ui text-[13px] font-bold tracking-[0.08em] text-[var(--color-charcoal)] uppercase no-underline transition-colors hover:border-[var(--project-accent-light)] hover:bg-[var(--project-accent-light)]"
              >
                {pick(data.ctaLeadLabel)} →
              </a>
            )}
            {pick(data.ctaCallLabel) && (
              <a href={CONTACT_PHONE_HREF} data-track="click_call" className={btnOutline}>
                {pick(data.ctaCallLabel)} · {CONTACT_PHONE}
              </a>
            )}
            {data.zaloUrl && pick(data.ctaZaloLabel) && (
              <a href={data.zaloUrl} target="_blank" rel="noopener noreferrer" data-track="click_zalo" className={btnOutline}>
                {pick(data.ctaZaloLabel)}
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
