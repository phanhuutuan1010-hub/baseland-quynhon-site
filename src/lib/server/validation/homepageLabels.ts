import type { HomepageSectionTypeKey } from "./homepage";

export const HOMEPAGE_SECTION_LABELS: Record<HomepageSectionTypeKey, string> = {
  HERO: "Hero",
  INTRODUCTION: "Introduction",
  WHY_QUY_NHON: "Why Quy Nhơn",
  FEATURED_PROJECT: "Featured Project",
  PROJECTS_TEASER: "Projects Teaser",
  SERVICES: "Services",
  WHY_BASE_LAND: "Why Base Land",
  NEWS_TEASER: "News Teaser",
  LEAD_CTA: "Lead CTA",
};

export const HOMEPAGE_SECTION_ORDER: HomepageSectionTypeKey[] = [
  "HERO",
  "INTRODUCTION",
  "WHY_QUY_NHON",
  "FEATURED_PROJECT",
  "PROJECTS_TEASER",
  "SERVICES",
  "WHY_BASE_LAND",
  "NEWS_TEASER",
  "LEAD_CTA",
];
