"use client";

import { useLang } from "@/lib/i18n";
import { Reveal } from "@/components/Reveal";
import type { ProjectStats as ProjectStatsData } from "@/lib/project-detail/types";
import { AnimatedNumber } from "./shared";

export function ProjectStats({ id, data }: { id: string; data: ProjectStatsData }) {
  const { pick } = useLang();
  // Column count divides the item count evenly so the grid never leaves a
  // lone orphan item wrapped onto its own row (a fixed lg:grid-cols-3 broke
  // exactly that way for Simona's 4 stats, and lg:grid-cols-4 would do the
  // same for The Sailing's 6). Prefer 4 columns when it divides evenly,
  // otherwise 3 — covers every stat count actually used across projects
  // (3, 4, 5, 6) without a per-project override.
  const n = data.items.length;
  const lgCols = n % 4 === 0 ? "lg:grid-cols-4" : "lg:grid-cols-3";
  return (
    <section id={id} className="bg-[var(--project-dark)] px-5 py-16 sm:px-8 sm:py-20 md:px-12 md:py-28">
      <Reveal className="mx-auto max-w-[1440px]">
        <div className={`grid grid-cols-1 gap-10 sm:grid-cols-2 md:gap-14 ${lgCols}`}>
          {data.items.map((n, i) => (
            <div key={i} className="border-t border-[rgba(var(--project-accent-rgb),0.45)] pt-7">
              <div className="mb-4 font-display text-[clamp(3rem,7vw,5.5rem)] leading-none text-[var(--color-warm-white)]">
                {n.animated ? <AnimatedNumber target={parseInt(n.value, 10)} /> : n.value}
              </div>
              <div className="mb-2.5 font-ui text-xs font-bold tracking-[0.14em] text-[var(--project-accent-light)] uppercase">
                {pick(n.label)}
              </div>
              <p className="m-0 font-body text-[15px] leading-[var(--lh-body)] text-[var(--color-sand)] opacity-85">
                {pick(n.note)}
              </p>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
