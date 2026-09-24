"use client";

import { useLang } from "@/lib/i18n";
import { Reveal } from "@/components/Reveal";
import type { ProjectVerification as ProjectVerificationData } from "@/lib/project-detail/types";
import { Accent } from "@/components/Accent";

/**
 * Data-governance disclosure (see The Sailing brief mục 6): a project whose
 * only source is an unofficial third-party site tracks every important
 * number/claim as verified/pending here, instead of quietly asserting it
 * elsewhere as settled fact. Renders as a compact, plainly-labeled list —
 * not hidden fine print — since the point is transparency, not compliance
 * theater.
 */
export function ProjectVerificationNote({ id, data }: { id: string; data: ProjectVerificationData }) {
  const { pick } = useLang();
  return (
    <section id={id} className="bg-[var(--color-limestone)] px-5 py-14 sm:px-8 sm:py-18 md:px-12 md:py-20">
      <Reveal className="mx-auto max-w-[1440px]">
        <div className="mb-4 font-ui text-[length:var(--fs-label)] tracking-[var(--ls-label)] text-[var(--project-accent-dark)] uppercase">
          {pick(data.eyebrow)}
        </div>
        <h2 className="m-0 mb-4 font-display text-[length:var(--fs-h3)] leading-[var(--lh-heading)] font-normal text-[var(--color-charcoal)]">
          <Accent text={pick(data.headline)} />
        </h2>
        <p className="m-0 mb-8 max-w-170 font-body text-sm leading-[var(--lh-body)] text-[var(--color-text-muted-accessible)]">
          <Accent text={pick(data.body)} />
        </p>
        <div className="flex flex-col">
          {data.items.map((item, i) => (
            <div
              key={i}
              className="flex flex-wrap items-start justify-between gap-4 border-t border-[rgba(38,34,32,0.12)] py-4"
            >
              <div className="min-w-60 flex-1">
                <div className="mb-1 font-ui text-[13px] font-bold tracking-[0.04em] text-[var(--color-charcoal)] uppercase">
                  {pick(item.label)}
                </div>
                <p className="m-0 mb-1.5 font-body text-sm leading-[var(--lh-body)] text-[var(--color-text-muted-accessible)]">
                  {pick(item.note)}
                </p>
                <div className="font-ui text-[11px] tracking-[0.03em] text-[var(--color-deep-earth)] opacity-80">
                  {pick({ vi: "Nguồn", en: "Source" })}: {item.source} · {pick({ vi: "Cập nhật", en: "Updated" })}{" "}
                  {item.lastUpdated}
                </div>
              </div>
              <div className="flex flex-none items-center gap-2">
                <span
                  className={`h-1.5 w-1.5 flex-none rounded-full ${
                    item.verified ? "bg-[var(--color-brand-green)]" : "bg-[var(--color-clay)]"
                  }`}
                  aria-hidden
                />
                <span className="font-ui text-[11px] font-bold tracking-[0.08em] text-[var(--color-deep-earth)] uppercase">
                  {item.verified
                    ? pick({ vi: "Đã xác nhận", en: "Verified" })
                    : pick({ vi: "Chưa xác nhận", en: "Pending verification" })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
