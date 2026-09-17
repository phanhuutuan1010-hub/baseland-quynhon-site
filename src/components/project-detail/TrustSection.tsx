"use client";

import Image from "next/image";
import { useLang } from "@/lib/i18n";
import { Reveal } from "@/components/Reveal";
import type { ProjectLegal as ProjectLegalData } from "@/lib/project-detail/types";

/** "Legal / Trust" section — Base Land credibility block. */
export function TrustSection({ data }: { data: ProjectLegalData }) {
  const { pick } = useLang();
  return (
    <section className="bg-[var(--color-warm-white)] px-5 py-16 sm:px-8 sm:py-20 md:px-12 md:py-24">
      <Reveal className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-8 md:gap-20">
        <div className="flex-0 min-w-50 basis-65">
          <Image src="/images/brand/logo-baseland.png" alt="Base Land" width={220} height={110} className="h-auto w-full max-w-55" />
        </div>
        <div className="min-w-70 flex-1 basis-105">
          <h2 className="m-0 mb-6 max-w-155 font-display text-[clamp(1.25rem,2.4vw,1.75rem)] leading-[1.45] font-normal text-[var(--color-charcoal)]">
            {pick(data.body)}
          </h2>
          <div className="flex flex-wrap gap-6 md:gap-12">
            {data.points.map((p, i) => (
              <div key={i} className="max-w-55 border-l border-[rgba(var(--project-accent-rgb),0.5)] pl-4">
                <div className="mb-2 font-ui text-xs font-bold tracking-[0.1em] text-[var(--color-deep-earth)] uppercase">
                  {pick(p.label)}
                </div>
                <div className="font-body text-sm leading-[var(--lh-body)] text-[var(--color-text-muted)]">
                  {pick(p.desc)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
