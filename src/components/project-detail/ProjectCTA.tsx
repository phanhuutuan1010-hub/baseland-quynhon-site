"use client";

import { useLang } from "@/lib/i18n";
import { Reveal } from "@/components/Reveal";
import { LeadFormFull } from "@/components/LeadFormFull";
import { CONTACT_EMAIL, CONTACT_EMAIL_HREF, CONTACT_PHONE, CONTACT_PHONE_HREF } from "@/lib/content/nav";
import type { ProjectCta as ProjectCtaData } from "@/lib/project-detail/types";

export function ProjectCTA({ id, data }: { id: string; data: ProjectCtaData }) {
  const { pick } = useLang();
  return (
    <section
      id={id}
      className="px-5 py-16 sm:px-8 sm:py-20 md:px-12 md:py-28"
      style={{ background: "linear-gradient(135deg, var(--color-clay) 0%, var(--color-deep-earth) 100%)" }}
    >
      <Reveal className="mx-auto flex max-w-[1440px] flex-wrap gap-10 md:gap-24">
        <div className="min-w-70 flex-1 basis-95">
          <div className="mb-5 font-ui text-[length:var(--fs-label)] tracking-[var(--ls-label)] text-[var(--color-sand)] uppercase">
            {pick(data.eyebrow)}
          </div>
          <h2
            className="m-0 mb-6 font-display text-[length:var(--fs-h1)] leading-[var(--lh-heading)] font-normal text-[var(--color-warm-white)]"
            style={{ maxWidth: data.headlineMaxWidth ? pick(data.headlineMaxWidth) : "24ch" }}
          >
            {pick(data.headline)}
          </h2>
          <p className="m-0 mb-9 max-w-110 font-body text-[length:var(--fs-body-lg)] leading-[var(--lh-body)] text-[var(--color-sand)]">
            {pick(data.body)}
          </p>
          <div className="mb-9 flex flex-col gap-3.5 font-body text-[17px]">
            <a href={CONTACT_PHONE_HREF} className="text-[var(--color-warm-white)] no-underline">
              {CONTACT_PHONE}
            </a>
            <a href={CONTACT_EMAIL_HREF} className="text-[var(--color-warm-white)] no-underline">
              {CONTACT_EMAIL}
            </a>
          </div>
          <a
            href={CONTACT_PHONE_HREF}
            className="inline-flex items-center rounded-xs border border-[var(--project-accent-light)] bg-transparent px-8 py-4 font-ui text-[13px] font-bold tracking-[0.08em] text-[var(--color-warm-white)] uppercase no-underline hover:bg-[rgba(var(--project-accent-rgb),0.15)]"
          >
            {pick(data.callNowLabel)}
          </a>
        </div>
        <div className="min-w-70 flex-1 basis-95 rounded-sm bg-[var(--color-warm-white)] p-7 sm:p-11">
          <LeadFormFull source={data.leadSource} />
        </div>
      </Reveal>
    </section>
  );
}
