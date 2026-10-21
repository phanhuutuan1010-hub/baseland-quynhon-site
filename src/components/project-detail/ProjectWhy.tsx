"use client";

import { useLang } from "@/lib/i18n";
import { Reveal } from "@/components/Reveal";
import type { ProjectTowers } from "@/lib/project-detail/types";
import { Accent } from "@/components/Accent";
import { CompactHeading, cardRowClass, scrollCardClass } from "./shared";
import { SectionAction } from "./ProjectContact";

/**
 * Compact layout's "Vì sao …" block — the towers section's `reasons`
 * (brand, operator, interiors, location) as four numbered cards. Replaces
 * the split-screen towers, the value points and the stats row.
 */
export function ProjectWhy({ id, data }: { id: string; data: ProjectTowers }) {
  const { pick } = useLang();
  const reasons = data.reasons ?? [];

  return (
    <section id={id} className="bg-[var(--project-dark)] px-5 py-14 sm:px-8 sm:py-16 md:px-12 md:py-20">
      <Reveal className="mx-auto max-w-[1440px]">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-6 md:mb-12">
          <CompactHeading dark eyebrow={pick(data.eyebrow)} headline={<Accent text={pick(data.headline)} onDark />} />
          <SectionAction data={data} show="md-up" />
        </div>
        <ol className={`m-0 list-none ${cardRowClass(4)}`}>
          {reasons.map((r, i) => (
            <li
              key={i}
              className={`${scrollCardClass} flex flex-col rounded-sm border border-[rgba(250,245,238,0.16)] bg-[rgba(250,245,238,0.05)] p-6 md:p-7`}
            >
              <div className="mb-6 flex items-center justify-between gap-3">
                <span className="font-display text-3xl leading-none text-[var(--project-accent-light)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {pick(r.kicker) && (
                  <span className="font-ui text-[11px] font-bold tracking-[0.12em] text-[var(--color-sand)] uppercase opacity-80">
                    {pick(r.kicker)}
                  </span>
                )}
              </div>
              <h3 className="m-0 mb-2.5 font-display text-[length:var(--fs-h3)] leading-[1.25] font-normal text-[var(--color-warm-white)]">
                {pick(r.title)}
              </h3>
              <p className="m-0 font-body text-[15px] leading-[var(--lh-body)] text-[var(--color-sand)]">
                {pick(r.desc)}
              </p>
            </li>
          ))}
        </ol>
        <SectionAction data={data} show="md-down" className="mt-8 w-full" />
      </Reveal>
    </section>
  );
}
