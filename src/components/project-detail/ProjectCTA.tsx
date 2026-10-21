"use client";

import { useLang } from "@/lib/i18n";
import { Reveal } from "@/components/Reveal";
import { LeadFormFull } from "@/components/LeadFormFull";
import { CONTACT_EMAIL, CONTACT_EMAIL_HREF } from "@/lib/content/nav";
import { cleanTelHref, useProjectContact } from "./ProjectContact";
import type { ProjectCta as ProjectCtaData } from "@/lib/project-detail/types";
import type { Localized } from "@/lib/i18n";
import { Accent } from "@/components/Accent";

const DEFAULT_BENEFITS_TITLE: Localized<string> = { vi: "Bạn sẽ nhận được", en: "You will receive" };
const DEFAULT_BENEFITS: Localized<string>[] = [
  { vi: "Bảng giá & chính sách thanh toán", en: "Price list & payment plans" },
  { vi: "Mặt bằng theo hướng view", en: "Floor plans by outlook" },
  { vi: "Tư vấn chọn căn phù hợp", en: "Advice on the right unit" },
];

export function ProjectCTA({ id, data }: { id: string; data: ProjectCtaData }) {
  const { pick } = useLang();
  const { phone, phoneHref } = useProjectContact();
  return (
    <section
      id={id}
      className="px-5 py-16 sm:px-8 sm:py-20 md:px-12 md:py-28"
      style={{ background: "linear-gradient(135deg, var(--color-clay) 0%, var(--color-deep-earth) 100%)" }}
    >
      <Reveal className="mx-auto flex max-w-[1440px] flex-wrap gap-10 md:gap-24">
        <div className="min-w-70 flex-1 basis-95">
          {pick(data.eyebrow) && (
            <div className="mb-5 hidden md:block font-ui text-[length:var(--fs-label)] tracking-[var(--ls-label)] text-[var(--color-sand)] uppercase">
              {pick(data.eyebrow)}
            </div>
          )}
          {pick(data.headline) && (
            <h2
              className="m-0 mb-5 font-display md:mb-6 text-[length:var(--fs-h1)] leading-[var(--lh-heading)] font-normal text-[var(--color-warm-white)]"
              style={{ maxWidth: data.headlineMaxWidth ? pick(data.headlineMaxWidth) : "24ch" }}
            >
              <Accent text={pick(data.headline)} onDark />
            </h2>
          )}
          {pick(data.body) && (
            <p className="m-0 mb-9 hidden max-w-110 font-body md:block text-[length:var(--fs-body-lg)] leading-[var(--lh-body)] text-[var(--color-sand)]">
              <Accent text={pick(data.body)} onDark />
            </p>
          )}
          {/* Mobile keeps only the headline + benefits; the form follows. */}
          <div className="mb-2 md:mb-9">
            <div className="mb-3 font-ui text-xs font-bold tracking-[0.12em] text-[var(--color-sand)] uppercase">
              {pick(data.benefitsTitle ?? DEFAULT_BENEFITS_TITLE)}
            </div>
            <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
              {(data.benefits ?? DEFAULT_BENEFITS).map((b, i) => (
                <li key={i} className="flex items-start gap-3 font-body text-base text-[var(--color-warm-white)]">
                  <span aria-hidden className="mt-0.5 text-[var(--project-accent-light)]">✓</span>
                  {pick(b)}
                </li>
              ))}
            </ul>
          </div>
          <div className="mb-9 hidden flex-col gap-3.5 font-body text-[17px] md:flex">
            <a href={cleanTelHref(phoneHref)} className="text-[var(--color-warm-white)] no-underline">
              {phone}
            </a>
            <a href={CONTACT_EMAIL_HREF} className="text-[var(--color-warm-white)] no-underline">
              {CONTACT_EMAIL}
            </a>
          </div>
          {pick(data.callNowLabel) && (
            <a
              href={cleanTelHref(phoneHref)}
              data-track="click_call"
              className="hidden items-center rounded-xs md:inline-flex border border-[var(--project-accent-light)] bg-transparent px-8 py-4 font-ui text-[13px] font-bold tracking-[0.08em] text-[var(--color-warm-white)] uppercase no-underline hover:bg-[rgba(var(--project-accent-rgb),0.15)]"
            >
              {pick(data.callNowLabel)}
            </a>
          )}
        </div>
        <div className="min-w-70 flex-1 basis-95 rounded-sm bg-[var(--color-warm-white)] p-7 sm:p-11">
          <LeadFormFull source={data.leadSource} qualifiers={data.qualifiers} />
        </div>
      </Reveal>
    </section>
  );
}
