import "server-only";

import { cache } from "react";
import { prisma } from "@/lib/server/db";
import { HOME_CONTENT } from "@/lib/content/home";
import type {
  HomeHeroContent,
  HomeIntroContent,
  HomeWhyQuyNhonContent,
  HomeFeaturedProjectContent,
  HomeProjectsTeaserContent,
  HomeServicesContent,
  HomeWhyBaseLandContent,
  HomeNewsTeaserContent,
  HomeLeadCtaContent,
} from "@/lib/content/home";

// Discriminated union so each renderer (src/app/(site)/page.tsx) gets the
// exact content type for its `type`, no casting at the call site.
export type HomepageSectionData =
  | { type: "HERO"; content: HomeHeroContent }
  | { type: "INTRODUCTION"; content: HomeIntroContent }
  | { type: "WHY_QUY_NHON"; content: HomeWhyQuyNhonContent }
  | { type: "FEATURED_PROJECT"; content: HomeFeaturedProjectContent }
  | { type: "PROJECTS_TEASER"; content: HomeProjectsTeaserContent }
  | { type: "SERVICES"; content: HomeServicesContent }
  | { type: "WHY_BASE_LAND"; content: HomeWhyBaseLandContent }
  | { type: "NEWS_TEASER"; content: HomeNewsTeaserContent }
  | { type: "LEAD_CTA"; content: HomeLeadCtaContent };

// Fallback used only if HomepageSection rows don't exist yet — reuses the
// exact real copy the site already shipped with (HOME_CONTENT), in the
// site's original section order, all enabled.
const FALLBACK_ORDER = [
  "HERO",
  "INTRODUCTION",
  "WHY_QUY_NHON",
  "FEATURED_PROJECT",
  "PROJECTS_TEASER",
  "SERVICES",
  "WHY_BASE_LAND",
  "NEWS_TEASER",
  "LEAD_CTA",
] as const;

function fallbackContentFor(type: (typeof FALLBACK_ORDER)[number]) {
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

export const getHomepageSections = cache(async function getHomepageSections(): Promise<HomepageSectionData[]> {
  const rows = await prisma.homepageSection.findMany({ orderBy: { order: "asc" } });

  if (rows.length === 0) {
    return FALLBACK_ORDER.map((type) => ({ type, content: fallbackContentFor(type) })) as HomepageSectionData[];
  }

  return rows
    .filter((row) => row.enabled)
    .map((row) => ({ type: row.type, content: row.content }) as HomepageSectionData);
});
