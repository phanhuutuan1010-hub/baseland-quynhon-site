"use client";

import { useLang } from "@/lib/i18n";
import { Reveal } from "@/components/Reveal";
import type { ProjectIntro as ProjectIntroData } from "@/lib/project-detail/types";
import { Accent } from "@/components/Accent";

export function ProjectIntro({ id, data }: { id: string; data: ProjectIntroData }) {
  const { pick } = useLang();
  return (
    <section id={id} className="bg-[var(--color-warm-white)] px-5 py-16 sm:px-8 sm:py-20 md:px-12 md:py-28">
      <Reveal className="mx-auto max-w-[1040px]">
        <div className="mb-9 font-ui text-[length:var(--fs-label)] tracking-[var(--ls-label)] text-[var(--project-accent)] uppercase">
          {pick(data.eyebrow)}
        </div>
        <h2 className="m-0 font-display text-[clamp(1.75rem,4.2vw,3.25rem)] leading-[1.3] font-normal text-[var(--color-charcoal)]">
          <Accent text={pick(data.headline)} />
        </h2>
        <p className="m-0 mt-10 max-w-[1040px] font-body text-[length:var(--fs-body-lg)] leading-[var(--lh-body)] text-[var(--color-text-muted)]">
          <Accent text={pick(data.body)} />
        </p>
      </Reveal>
    </section>
  );
}
