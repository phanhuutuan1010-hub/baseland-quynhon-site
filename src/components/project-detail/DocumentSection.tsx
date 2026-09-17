"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { Reveal } from "@/components/Reveal";
import type { ProjectDocuments as ProjectDocumentsData } from "@/lib/project-detail/types";

export function DocumentSection({ id, data }: { id: string; data: ProjectDocumentsData }) {
  const { pick } = useLang();
  return (
    <section id={id} className="bg-[var(--color-sand)] px-5 py-16 sm:px-8 sm:py-20 md:px-12 md:py-28">
      <Reveal className="mx-auto max-w-[1440px]">
        <div className="mb-5 font-ui text-[length:var(--fs-label)] tracking-[var(--ls-label)] text-[var(--project-accent-dark)] uppercase">
          {pick(data.eyebrow)}
        </div>
        <h2 className="m-0 mb-8 font-display text-[length:var(--fs-h2)] leading-[var(--lh-heading)] font-normal text-[var(--color-charcoal)] md:mb-14">
          {pick(data.headline)}
        </h2>
        <div className="flex flex-col">
          {data.items.map((d, i) => (
            <div key={i} className="flex flex-wrap items-center justify-between gap-6 border-t border-[rgba(38,34,32,0.15)] py-5.5">
              <div className="min-w-70 flex-1 basis-80">
                <div className="mb-1.5 font-ui text-sm font-bold tracking-[0.06em] text-[var(--color-charcoal)] uppercase">
                  {pick(d.name)}
                </div>
                <div className="font-body text-sm text-[var(--color-text-muted)]">{pick(d.note)}</div>
              </div>
              <Link
                href={data.ctaHref}
                className="whitespace-nowrap font-ui text-xs font-bold tracking-[0.08em] text-[var(--project-primary-text)] uppercase no-underline hover:text-[var(--project-primary-dark)]"
              >
                {pick(data.ctaLabel)}
              </Link>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
