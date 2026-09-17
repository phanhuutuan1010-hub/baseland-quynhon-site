import { z } from "zod";

// Mirrors each slice of HomeContent (src/lib/content/home.ts) exactly, so
// existing/new content round-trips through the DB with no shape drift.
const heroContent = z.object({
  eyebrow: z.string().trim().min(1),
  headlineLines: z.tuple([z.string().trim().min(1), z.string().trim().min(1)]),
  tagline: z.string().trim().min(1),
  ctaPrimary: z.string().trim().min(1),
  ctaSecondary: z.string().trim().min(1),
});

const introContent = z.object({
  kicker: z.string().trim().min(1),
  title: z.string().trim().min(1),
  body: z.string().trim().min(1),
});

const whyQuyNhonContent = z.object({
  kicker: z.string().trim().min(1),
  statement: z.string().trim().min(1),
  points: z.array(z.object({ label: z.string().trim().min(1), desc: z.string().trim().min(1) })).min(1),
});

const featuredProjectContent = z.object({
  kicker: z.string().trim().min(1),
  title: z.string().trim().min(1),
  desc: z.string().trim().min(1),
  locationLabel: z.string().trim().min(1),
  locationValue: z.string().trim().min(1),
  scaleLabel: z.string().trim().min(1),
  scaleValue: z.string().trim().min(1),
  cta: z.string().trim().min(1),
  amenities: z.array(z.string().trim().min(1)).min(1),
});

const projectsTeaserContent = z.object({
  kicker: z.string().trim().min(1),
  title: z.string().trim().min(1),
  items: z
    .array(
      z.object({
        slotId: z.string().trim().min(1),
        name: z.string().trim().min(1),
        location: z.string().trim().min(1),
        status: z.string().trim().min(1),
        cta: z.string().trim().min(1),
      }),
    )
    .min(1),
});

const servicesContent = z.object({
  kicker: z.string().trim().min(1),
  title: z.string().trim().min(1),
  items: z
    .array(z.object({ num: z.string().trim().min(1), title: z.string().trim().min(1), desc: z.string().trim().min(1) }))
    .min(1),
});

const whyBaseLandContent = z.object({
  kicker: z.string().trim().min(1),
  title: z.string().trim().min(1),
  values: z.array(z.object({ name: z.string().trim().min(1), desc: z.string().trim().min(1) })).min(1),
});

const newsTeaserContent = z.object({
  kicker: z.string().trim().min(1),
  title: z.string().trim().min(1),
  viewAll: z.string().trim().min(1),
  items: z.array(z.object({ date: z.string().trim().min(1), title: z.string().trim().min(1) })).min(1),
});

const leadCtaContent = z.object({
  title: z.string().trim().min(1),
  sub: z.string().trim().min(1),
});

export const HOMEPAGE_SECTION_SCHEMAS = {
  HERO: heroContent,
  INTRODUCTION: introContent,
  WHY_QUY_NHON: whyQuyNhonContent,
  FEATURED_PROJECT: featuredProjectContent,
  PROJECTS_TEASER: projectsTeaserContent,
  SERVICES: servicesContent,
  WHY_BASE_LAND: whyBaseLandContent,
  NEWS_TEASER: newsTeaserContent,
  LEAD_CTA: leadCtaContent,
} as const;

export type HomepageSectionTypeKey = keyof typeof HOMEPAGE_SECTION_SCHEMAS;

export function homepageSectionContentSchema(type: HomepageSectionTypeKey) {
  const inner = HOMEPAGE_SECTION_SCHEMAS[type];
  return z.object({ vi: inner, en: inner });
}
