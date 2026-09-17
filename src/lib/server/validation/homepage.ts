import { z } from "zod";

// Mirrors each slice of HomeContent (src/lib/content/home.ts) exactly, so
// existing/new content round-trips through the DB with no shape drift.
// Every text/list field here is display copy an admin may legitimately want
// to leave blank while staging a section (e.g. no tagline yet) — validation
// only enforces the field's *type*, not that it be non-empty. The matching
// public components hide the element instead of rendering an empty
// heading/paragraph/list-item when a value is blank (see e.g. HeroSection).
const heroContent = z.object({
  eyebrow: z.string().trim(),
  headlineLines: z.tuple([z.string().trim(), z.string().trim()]),
  tagline: z.string().trim(),
  ctaPrimary: z.string().trim(),
  ctaSecondary: z.string().trim(),
  heroImageSrc: z.string().trim().optional().or(z.literal("")),
});

const introContent = z.object({
  kicker: z.string().trim(),
  title: z.string().trim(),
  body: z.string().trim(),
});

const whyQuyNhonContent = z.object({
  kicker: z.string().trim(),
  statement: z.string().trim(),
  points: z.array(
    z.object({ label: z.string().trim(), desc: z.string().trim(), imageSrc: z.string().trim().optional().or(z.literal("")) }),
  ),
});

const featuredProjectContent = z.object({
  kicker: z.string().trim(),
  title: z.string().trim(),
  desc: z.string().trim(),
  locationLabel: z.string().trim(),
  locationValue: z.string().trim(),
  scaleLabel: z.string().trim(),
  scaleValue: z.string().trim(),
  cta: z.string().trim(),
  amenities: z.array(z.object({ label: z.string().trim(), imageSrc: z.string().trim().optional().or(z.literal("")) })),
  imageSrc: z.string().trim().optional().or(z.literal("")),
});

const projectsTeaserContent = z.object({
  kicker: z.string().trim(),
  title: z.string().trim(),
  items: z.array(
    z.object({
      slotId: z.string().trim(),
      name: z.string().trim(),
      location: z.string().trim(),
      status: z.string().trim(),
      cta: z.string().trim(),
      imageSrc: z.string().trim().optional().or(z.literal("")),
    }),
  ),
});

const servicesContent = z.object({
  kicker: z.string().trim(),
  title: z.string().trim(),
  items: z.array(z.object({ num: z.string().trim(), title: z.string().trim(), desc: z.string().trim() })),
});

const whyBaseLandContent = z.object({
  kicker: z.string().trim(),
  title: z.string().trim(),
  values: z.array(z.object({ name: z.string().trim(), desc: z.string().trim() })),
});

const newsTeaserContent = z.object({
  kicker: z.string().trim(),
  title: z.string().trim(),
  viewAll: z.string().trim(),
  items: z.array(z.object({ date: z.string().trim(), title: z.string().trim() })),
});

const leadCtaContent = z.object({
  title: z.string().trim(),
  sub: z.string().trim(),
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
