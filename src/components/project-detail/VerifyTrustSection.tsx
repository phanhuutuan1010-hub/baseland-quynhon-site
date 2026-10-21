"use client";

import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { Reveal } from "@/components/Reveal";
import type { ProjectDocuments, ProjectLegal } from "@/lib/project-detail/types";
import { Accent } from "@/components/Accent";
import { trackTourLinkClick } from "@/lib/analytics";
import { CompactHeading } from "./shared";
import { SectionAction } from "./ProjectContact";

/**
 * Compact layout's "Kiểm chứng & Base Land" block — the Documents list and
 * the Base Land trust points (Legal section) in one section. The Legal
 * section's outbound links are not repeated here: the same links already
 * sit in the document list.
 */
export function VerifyTrustSection({
  id,
  documents,
  legal,
  tourUrl,
  projectSlug,
}: {
  id: string;
  documents?: ProjectDocuments;
  legal?: ProjectLegal;
  tourUrl?: string;
  projectSlug: string;
}) {
  const { pick, lang } = useLang();
  const head = documents ?? { eyebrow: { vi: "", en: "" }, headline: { vi: "", en: "" } };

  return (
    <section id={id} className="bg-[var(--color-sand)] px-5 py-14 sm:px-8 sm:py-16 md:px-12 md:py-20">
      <Reveal className="mx-auto grid max-w-[1440px] grid-cols-1 gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
        <div>
          <CompactHeading eyebrow={pick(head.eyebrow)} headline={<Accent text={pick(head.headline)} />} className="mb-8" />
          {legal && (
            <div className="flex flex-col gap-6">
              <div className="flex items-start gap-5">
                <Image src="/images/brand/logo-baseland.png" alt="Base Land" width={220} height={110} className="h-auto w-24 flex-none sm:w-28" />
                <p className="m-0 font-body text-[15px] leading-[var(--lh-body)] text-[var(--color-charcoal)]">
                  <Accent text={pick(legal.body)} />
                </p>
              </div>
              <ul className="m-0 grid list-none grid-cols-2 gap-x-6 gap-y-4 p-0">
                {legal.points.map((p, i) => (
                  <li key={i} className="border-l border-[rgba(var(--project-accent-rgb),0.5)] pl-3.5">
                    <div className="font-ui text-xs leading-[1.5] font-bold tracking-[0.08em] text-[var(--color-deep-earth)] uppercase">{pick(p.label)}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {documents && <SectionAction data={documents} show="lg-up" className="mt-8" />}
        </div>

        {documents && (
          <div className="flex flex-col">
            {documents.items.map((d, i) => (
              <div key={i} className="flex items-center justify-between gap-4 border-t border-[rgba(38,34,32,0.15)] py-4">
                <div className="min-w-0">
                  <div className="font-ui text-[13px] leading-[1.45] font-bold tracking-[0.06em] text-[var(--color-charcoal)] uppercase">{pick(d.name)}</div>
                  <div className="mt-1 font-body text-[13px] text-[var(--color-text-muted)]">{pick(d.note)}</div>
                </div>
                {d.fileUrl ? (
                  <a
                    href={d.fileUrl}
                    onClick={() => trackTourLinkClick(d.fileUrl!, tourUrl, projectSlug, "documents", lang)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-none font-ui text-xs font-bold tracking-[0.08em] text-[var(--project-primary-text)] uppercase no-underline hover:text-[var(--project-primary-dark)]"
                  >
                    {pick(d.linkLabel ?? documents.ctaLabel)}
                  </a>
                ) : (
                  <Link
                    href={documents.ctaHref}
                    className="flex-none font-ui text-xs font-bold tracking-[0.08em] text-[var(--project-primary-text)] uppercase no-underline hover:text-[var(--project-primary-dark)]"
                  >
                    {pick(documents.ctaLabel)}
                  </Link>
                )}
              </div>
            ))}
            <SectionAction data={documents} show="lg-down" className="mt-6 w-full" />
          </div>
        )}
      </Reveal>
    </section>
  );
}
