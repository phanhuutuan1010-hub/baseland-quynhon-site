import { notFound } from "next/navigation";
import { requireRole } from "@/lib/server/auth";
import { prisma } from "@/lib/server/db";
import { HOME_CONTENT } from "@/lib/content/home";
import { HOMEPAGE_SECTION_LABELS } from "@/lib/server/validation/homepageLabels";
import type { HomepageSectionTypeKey } from "@/lib/server/validation/homepage";
import { HeroForm } from "../forms/HeroForm";
import { IntroForm } from "../forms/IntroForm";
import { WhyQuyNhonForm } from "../forms/WhyQuyNhonForm";
import { FeaturedProjectForm } from "../forms/FeaturedProjectForm";
import { ProjectsTeaserForm } from "../forms/ProjectsTeaserForm";
import { ServicesForm } from "../forms/ServicesForm";
import { WhyBaseLandForm } from "../forms/WhyBaseLandForm";
import { NewsTeaserForm } from "../forms/NewsTeaserForm";
import { LeadCtaForm } from "../forms/LeadCtaForm";

const VALID_TYPES = Object.keys(HOMEPAGE_SECTION_LABELS) as HomepageSectionTypeKey[];

function fallbackContentFor(type: HomepageSectionTypeKey) {
  switch (type) {
    case "HERO":
      return { vi: HOME_CONTENT.vi.hero, en: HOME_CONTENT.en.hero };
    case "INTRODUCTION":
      return { vi: HOME_CONTENT.vi.intro, en: HOME_CONTENT.en.intro };
    case "WHY_QUY_NHON":
      return { vi: HOME_CONTENT.vi.whyqn, en: HOME_CONTENT.en.whyqn };
    case "FEATURED_PROJECT":
      return { vi: HOME_CONTENT.vi.featured, en: HOME_CONTENT.en.featured };
    case "PROJECTS_TEASER":
      return { vi: HOME_CONTENT.vi.local, en: HOME_CONTENT.en.local };
    case "SERVICES":
      return { vi: HOME_CONTENT.vi.services, en: HOME_CONTENT.en.services };
    case "WHY_BASE_LAND":
      return { vi: HOME_CONTENT.vi.whybl, en: HOME_CONTENT.en.whybl };
    case "NEWS_TEASER":
      return { vi: HOME_CONTENT.vi.news, en: HOME_CONTENT.en.news };
    case "LEAD_CTA":
      return { vi: HOME_CONTENT.vi.cta, en: HOME_CONTENT.en.cta };
  }
}

export default async function EditHomepageSectionPage({ params }: { params: Promise<{ type: string }> }) {
  await requireRole("ADMIN");
  const { type: rawType } = await params;

  if (!VALID_TYPES.includes(rawType as HomepageSectionTypeKey)) notFound();
  const type = rawType as HomepageSectionTypeKey;

  const row = await prisma.homepageSection.findUnique({ where: { type } });
  const content = (row?.content as ReturnType<typeof fallbackContentFor> | undefined) ?? fallbackContentFor(type);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="m-0 font-ui text-xs font-bold tracking-[0.04em] text-[var(--color-brand-green)] uppercase">
          Trang chủ
        </p>
        <h1 className="m-0 mt-1 font-ui text-2xl font-bold text-[var(--color-charcoal)]">
          {HOMEPAGE_SECTION_LABELS[type]}
        </h1>
      </div>

      <div className="rounded-sm border border-[var(--color-border)] bg-[var(--color-warm-white)]">
        {type === "HERO" && <HeroForm initial={content as never} />}
        {type === "INTRODUCTION" && <IntroForm initial={content as never} />}
        {type === "WHY_QUY_NHON" && <WhyQuyNhonForm initial={content as never} />}
        {type === "FEATURED_PROJECT" && <FeaturedProjectForm initial={content as never} />}
        {type === "PROJECTS_TEASER" && <ProjectsTeaserForm initial={content as never} />}
        {type === "SERVICES" && <ServicesForm initial={content as never} />}
        {type === "WHY_BASE_LAND" && <WhyBaseLandForm initial={content as never} />}
        {type === "NEWS_TEASER" && <NewsTeaserForm initial={content as never} />}
        {type === "LEAD_CTA" && <LeadCtaForm initial={content as never} />}
      </div>
    </div>
  );
}
