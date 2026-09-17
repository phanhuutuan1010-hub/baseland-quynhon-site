import { z } from "zod";

export const projectSectionKeys = [
  "intro",
  "stats",
  "towers",
  "location",
  "masterplan",
  "architecture",
  "materialStory",
  "lifestyle",
  "education",
  "views",
  "investment",
  "legal",
  "faq",
  "verification",
  "videoDuo",
  "news",
  "residences",
  "floorPlans",
  "amenities",
  "gallery",
  "documents",
] as const;

export type EditableProjectSectionKey = (typeof projectSectionKeys)[number];

export const NAMED_TABLE_KEYS = ["residences", "floorPlans", "amenities", "gallery", "documents"] as const;
export type NamedTableKey = (typeof NAMED_TABLE_KEYS)[number];

// Deliberately generic: content shape varies a lot across 21 section types
// (see lib/project-detail/types.ts), and rebuilding a full field-by-field
// Zod schema per type would be a page-builder in disguise. Every Project
// section is ONE object whose text fields are individually `Localized<T>`
// (`{ vi, en }`) leaves — unlike Homepage sections, which duplicate the
// whole object once per language. This validates the one real invariant
// (a plain object) and lets the generic admin form, which only edits
// values of fields that already exist and never invents new ones, handle
// the rest. `verification` gets a stricter check below since it carries
// the price/legal-adjacent verified/source/lastUpdated governance fields.
export const genericSectionContentSchema = z.record(z.string(), z.unknown());

const localizedString = z.object({ vi: z.string(), en: z.string() });

export const verificationContentSchema = z.object({
  eyebrow: localizedString,
  headline: localizedString,
  body: localizedString,
  items: z.array(
    z.object({
      label: localizedString,
      note: localizedString,
      source: z.string(),
      verified: z.boolean(),
      lastUpdated: z.string(),
    }),
  ),
  navLabel: localizedString.optional(),
});

// Only `name` (the project's identity — shown everywhere, can't sensibly be
// blank) and hrefs/leadSource (technical — a blank href is a dead link, not
// a content choice) stay required. Every other field is display copy an
// admin may leave blank while staging content; ProjectPage's components
// hide the element instead of rendering it empty (see e.g. ProjectHero).
export const projectOverviewSchema = z.object({
  name: z.string().trim().min(1, "Bắt buộc"),
  categoryVi: z.string().trim(),
  categoryEn: z.string().trim(),
  statusLabelVi: z.string().trim(),
  statusLabelEn: z.string().trim(),
  theme: z.string().trim().optional().or(z.literal("")),
  verificationRequired: z.boolean(),
  heroEyebrowVi: z.string().trim(),
  heroEyebrowEn: z.string().trim(),
  heroAddressLineVi: z.string().trim(),
  heroAddressLineEn: z.string().trim(),
  heroSubheadVi: z.string().trim(),
  heroSubheadEn: z.string().trim(),
  heroCtaExploreLabelVi: z.string().trim(),
  heroCtaExploreLabelEn: z.string().trim(),
  heroCtaExploreHref: z.string().trim().min(1),
  heroCtaConsultLabelVi: z.string().trim(),
  heroCtaConsultLabelEn: z.string().trim(),
  heroCtaConsultHref: z.string().trim().min(1),
  heroImageSrc: z.string().trim().optional().or(z.literal("")),
  ctaEyebrowVi: z.string().trim(),
  ctaEyebrowEn: z.string().trim(),
  ctaHeadlineVi: z.string().trim(),
  ctaHeadlineEn: z.string().trim(),
  ctaBodyVi: z.string().trim(),
  ctaBodyEn: z.string().trim(),
  ctaCallNowLabelVi: z.string().trim(),
  ctaCallNowLabelEn: z.string().trim(),
  ctaLeadSource: z.string().trim().min(1),
  seoTitle: z.string().trim().optional().or(z.literal("")),
  seoDescription: z.string().trim().optional().or(z.literal("")),
  seoOgImageUrl: z.string().trim().optional().or(z.literal("")),
});

export const createProjectSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1, "Bắt buộc")
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Slug chỉ gồm chữ thường, số và dấu gạch ngang"),
  name: z.string().trim().min(1, "Bắt buộc"),
  categoryVi: z.string().trim(),
  categoryEn: z.string().trim(),
  statusLabelVi: z.string().trim(),
  statusLabelEn: z.string().trim(),
});
