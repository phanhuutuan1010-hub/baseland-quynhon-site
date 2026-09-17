import type { EditableProjectSectionKey } from "./project";

// Minimal starter skeleton per section key — used only when a project has
// no content yet for that section ("Thêm nội dung"), so the generic admin
// form has real top-level fields to render instead of a blank object. Text
// fields are `Localized<string>` leaves (`{ vi, en }`) inline, matching the
// real shape from lib/project-detail/types.ts — NOT an outer vi/en split
// (that's the Homepage sections' shape, not Project sections'). Item
// arrays start empty; the admin adds rows via the form's own "+ Thêm" control.
const L = { vi: "", en: "" };

export const PROJECT_SECTION_DEFAULTS: Record<EditableProjectSectionKey, object> = {
  intro: { eyebrow: L, headline: L, body: L },
  stats: { items: [] },
  towers: { eyebrow: L, headline: L, towers: [] },
  location: { eyebrow: L, headline: L, body: L, benefits: [] },
  masterplan: { eyebrow: L, headline: L, body: L, zones: [], ctaLabel: L, ctaHref: "#lead" },
  architecture: { headline: L, body: L },
  materialStory: { kicker: L, headline: L, body: L, swatches: [], galleryImages: [] },
  lifestyle: { eyebrow: L, headline: L, chapters: [] },
  education: { headline: L, body: L },
  views: { headline: L, body: L },
  investment: { eyebrow: L, headline: L, points: [], pricingTitle: L, pricingBody: L, pricingCtaLabel: L, pricingCtaHref: "#lead" },
  legal: { body: L, points: [] },
  faq: { eyebrow: L, headline: L, groupLabels: {}, items: [] },
  verification: { eyebrow: L, headline: L, body: L, items: [] },
  videoDuo: { eyebrow: L, headline: L, items: [] },
  news: { eyebrow: L, headline: L, readMoreLabel: L, articleSlugs: [] },
  residences: {
    eyebrow: L,
    headline: L,
    body: L,
    unitTypeAria: L,
    nfaLabel: L,
    nsaLabel: L,
    unitCtaLabel: L,
    unitCtaHref: "#lead",
    unitCtaFloorplanLabel: L,
    unitCtaFloorplanHref: "#lead",
    footnote: L,
    items: [],
  },
  floorPlans: { eyebrow: L, headline: L, zoomBtn: L, closeAria: L, footnote: L, ctaLabel: L, ctaHref: "#lead", groupLabels: {}, items: [] },
  amenities: { eyebrow: L, headline: L, chapters: [] },
  gallery: { intro: L, items: [] },
  documents: { eyebrow: L, headline: L, ctaLabel: L, ctaHref: "#lead", items: [] },
};
