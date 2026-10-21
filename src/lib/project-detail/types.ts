import type { Localized } from "@/lib/i18n";

/**
 * Project Detail Template — shared data schema.
 *
 * Every text field is a Localized<T> pair (`{ vi, en }`) living side by side
 * in the same record, per the site's bilingual content architecture: image
 * fields (`src`) are never split by language — swap the file once and both
 * languages pick it up.
 *
 * A project only needs the sections it has data for. `sections` lets a
 * project explicitly force a section off even when data is present (e.g.
 * "investment" pricing isn't ready to publish yet) — see `isSectionVisible`
 * below. Omitting a data field is enough to skip a section in the common
 * case; `sections[key] = false` is the explicit override.
 */

export type ProjectSectionKey =
  | "intro"
  | "stats"
  | "towers"
  | "location"
  | "masterplan"
  | "gallery"
  | "architecture"
  | "materialStory"
  | "lifestyle"
  | "education"
  | "amenities"
  | "views"
  | "residences"
  | "floorPlans"
  | "investment"
  | "news"
  | "legal"
  | "documents"
  | "verification"
  | "faq"
  | "videoDuo"
  | "salesPhases"
  | "virtualTour"
  | "leadPopup";

export type ProjectSections = Partial<Record<ProjectSectionKey, boolean>>;

export type ProjectHero = {
  eyebrow: Localized<string>;
  addressLine: Localized<string>;
  subhead: Localized<string>;
  ctaExploreLabel: Localized<string>;
  ctaExploreHref: string;
  ctaConsultLabel: Localized<string>;
  ctaConsultHref: string;
  /** Optional — a new project may not have a hero photo ready yet. Falls
   * back to ImagePlaceholder (dark tone, to keep hero text legible). */
  image?: { src: string; alt: Localized<string> };
  placeholderLabel?: Localized<string>;
  /** Short label for ProjectNav's first item (e.g. "Q'Terra", not the
   * stylized all-caps hero title). Falls back to `project.name`. */
  navLabel?: string;
  /** "compact" = the shorter conversion-first page flow (see
   * ProjectPage's CompactProjectPage). Omitted = the full editorial flow. */
  layout?: ProjectLayout;
  /** Compact layout: small status pill above the name (e.g. "Đang nhận
   * booking"). Empty = no pill. */
  badge?: Localized<string>;
  /** Compact layout: one line of key figures separated by " · ", shown
   * instead of `subhead` (e.g. "39 tầng · 864 căn · 50m tới biển"). */
  facts?: Localized<string>;
};

export type ProjectLayout = "full" | "compact";

/** Section-level call to action used by the compact layout. `href` is an
 * anchor/URL, or "call" for the site hotline (Admin → Cài đặt). */
export type ProjectSectionAction = {
  actionLabel?: Localized<string>;
  actionHref?: string;
};

export type ProjectIntro = {
  eyebrow: Localized<string>;
  headline: Localized<string>;
  body: Localized<string>;
};

export type ProjectStat = {
  value: string;
  label: Localized<string>;
  note: Localized<string>;
  /** Count up from 0 when scrolled into view (see AnimatedNumber). */
  animated?: boolean;
};

export type ProjectStats = {
  items: ProjectStat[];
};

export type ProjectLocationBenefit = {
  name: Localized<string>;
  distance: Localized<string>;
  image?: { src: string; alt: Localized<string> };
};

/** One time-tier of a journey/timeline location experience (e.g. "1 phút" /
 * "1 minute"), each holding the real named landmarks confirmed for that
 * tier. Renders as a vertical timeline instead of ProjectLocation's flat
 * benefit grid when `ProjectLocation.journey` is present. */
export type ProjectLocationJourneyStop = {
  tier: Localized<string>;
  landmarks: Localized<string>[];
};

export type ProjectLocation = ProjectSectionAction & {
  eyebrow: Localized<string>;
  headline: Localized<string>;
  body: Localized<string>;
  mapImage?: { src: string; alt: Localized<string> };
  mapPlaceholderLabel?: Localized<string>;
  benefits: ProjectLocationBenefit[];
  /** Optional vertical-timeline presentation (time-tier → named landmarks),
   * rendered instead of the flat `benefits` grid when present. */
  journey?: ProjectLocationJourneyStop[];
  /** ProjectNav label override — falls back to `eyebrow` if omitted. */
  navLabel?: Localized<string>;
};

/** One explorable zone of a masterplan (e.g. "Shophouse trục Tây Sơn",
 * "Trường học liên cấp") — rendered as a described zone card rather than an
 * image hotspot, since precise hover-highlight coordinates require a real,
 * dimensioned masterplan graphic (see ProjectMasterplan). */
export type ProjectMasterplanZone = {
  key: string;
  name: Localized<string>;
  desc: Localized<string>;
  tag?: Localized<string>;
};

export type ProjectMasterplan = {
  eyebrow: Localized<string>;
  headline: Localized<string>;
  body: Localized<string>;
  image?: { src: string; alt: Localized<string> };
  placeholderLabel?: Localized<string>;
  zones: ProjectMasterplanZone[];
  ctaLabel: Localized<string>;
  ctaHref: string;
  /** ProjectNav label override — falls back to `eyebrow`. */
  navLabel?: Localized<string>;
};

export type ProjectTower = {
  key: string;
  name: Localized<string>;
  subtitle: Localized<string>;
  description: Localized<string>;
  characteristics: Localized<string>[];
  image?: { src: string; alt: Localized<string> };
  placeholderLabel?: Localized<string>;
  /** Per-tower contextual CTA (e.g. "Inquire about The Maestro" vs "Inquire
   * about The Sailing") — falls back to no button when omitted, so
   * existing towers (Q'Terra/Simona) render exactly as before. */
  ctaLabel?: Localized<string>;
  ctaHref?: string;
};

/** "The Sea / The Harbour" style split-screen tower comparison — each
 * tower keeps its own visual identity and never collapses into a single
 * shared card (see ProjectTowerSplit). */
export type ProjectTowers = ProjectSectionAction & {
  eyebrow: Localized<string>;
  headline: Localized<string>;
  towers: [ProjectTower, ProjectTower];
  navLabel?: Localized<string>;
  /** Compact layout: the section renders as "Vì sao …" reason cards
   * instead of the split-screen towers. */
  reasons?: ProjectReason[];
};

export type ProjectReason = { kicker: Localized<string>; title: Localized<string>; desc: Localized<string> };

export type ProjectNewsTeaser = {
  eyebrow: Localized<string>;
  headline: Localized<string>;
  readMoreLabel: Localized<string>;
  /** Article slugs from the shared lib/content/news.ts ARTICLES array —
   * teaser only, links out to the real /news/[slug] route (never a
   * separate News page fork). */
  articleSlugs: string[];
};

export type ProjectGalleryItem = {
  key: string;
  name: Localized<string>;
  /** Optional — falls back to ImagePlaceholder when the real photo isn't
   * available yet, matching every other photo-bearing section's `image?`
   * convention (ProjectHero, AmenitySection, ProjectLocation, ...). */
  src?: string;
  desc: Localized<string>;
};

export type ProjectGallery = {
  intro: Localized<string>;
  items: ProjectGalleryItem[];
};

/** Full-bleed photo statement — shared shape for both "architecture" and
 * "views" section types (see ProjectPhotoStatement). */
export type ProjectPhotoStatement = {
  eyebrow?: Localized<string>;
  headline: Localized<string>;
  body: Localized<string>;
  image?: { src: string; alt: Localized<string> };
  placeholderLabel?: Localized<string>;
  tone?: "charcoal" | "ocean-blue";
  /** ProjectNav label override (architecture variant only — "views" never
   * gets a nav item) — falls back to `eyebrow`. */
  navLabel?: Localized<string>;
};

export type ProjectMaterialSwatch = { name: Localized<string>; hex: string; ink: string };

export type ProjectMaterialStory = {
  kicker: Localized<string>;
  headline: Localized<string>;
  body: Localized<string>;
  swatches: ProjectMaterialSwatch[];
  galleryImages: { label: Localized<string>; src?: string }[];
};

export type ProjectLifestyleChapter = {
  slotId: string;
  time: string;
  label: string;
  statement: Localized<string>;
  image?: { src: string; alt: Localized<string> };
};

export type ProjectLifestyle = {
  eyebrow: Localized<string>;
  headline: Localized<string>;
  chapters: ProjectLifestyleChapter[];
};

export type ProjectAmenityChapter = {
  slotId: string;
  kicker: string;
  title: Localized<string>;
  desc: Localized<string>;
  items: Localized<string>[];
  direction: "row" | "row-reverse";
  image?: { src: string; alt: Localized<string> };
};

export type ProjectAmenities = ProjectSectionAction & {
  eyebrow: Localized<string>;
  headline: Localized<string>;
  chapters: ProjectAmenityChapter[];
  /** ProjectNav label override — falls back to `eyebrow`. */
  navLabel?: Localized<string>;
};

export type ProjectResidenceUnit = {
  key: string;
  name: Localized<string>;
  tag: Localized<string>;
  nfa: string;
  nsa: string;
  desc: Localized<string>;
  floorPlanImage?: { src: string; alt: Localized<string> };
  /** Per-unit CTA override — e.g. a shophouse type reading "Inquire about
   * Shophouse" instead of the section's generic unitCtaLabel, so the CTA
   * tracks which product type is active (see mục 25). Falls back to
   * ProjectResidences.unitCtaLabel/unitCtaHref when omitted. */
  ctaLabel?: Localized<string>;
  ctaHref?: string;
  /** Single area figure (e.g. "32 – 38 m²") for projects whose source
   * gives one area per type instead of an NFA/NSA pair — shown under
   * `ProjectResidences.areaLabel`. Empty nfa/nsa rows are hidden. */
  area?: string;
  /** Share of the unit mix (e.g. "~67% quỹ căn", "142 căn"). */
  share?: Localized<string>;
};

/** "Mặt bằng tầng điển hình" summary under the residence table. */
export type ProjectTypicalFloor = {
  title: Localized<string>;
  body: Localized<string>;
  /** View orientations of the typical floor (e.g. "Hướng biển"). */
  orientations: Localized<string>[];
};

export type ProjectResidences = {
  eyebrow: Localized<string>;
  headline: Localized<string>;
  body: Localized<string>;
  unitTypeAria: Localized<string>;
  nfaLabel: Localized<string>;
  nsaLabel: Localized<string>;
  unitCtaLabel: Localized<string>;
  unitCtaHref: string;
  unitCtaFloorplanLabel: Localized<string>;
  unitCtaFloorplanHref: string;
  footnote: Localized<string>;
  items: ProjectResidenceUnit[];
  areaLabel?: Localized<string>;
  shareLabel?: Localized<string>;
  /** Present = render the unit-mix table (type · area · share) under the
   * selector. */
  tableTitle?: Localized<string>;
  typicalFloor?: ProjectTypicalFloor;
  /** ProjectNav label override — falls back to `eyebrow`. */
  navLabel?: Localized<string>;
};

export type ProjectFloorPlanGroupKey = string;

export type ProjectFloorPlanItem = {
  key: string;
  group: ProjectFloorPlanGroupKey;
  name: Localized<string>;
  src: string;
  alt: Localized<string>;
  caption: Localized<string>;
};

export type ProjectFloorPlans = {
  eyebrow: Localized<string>;
  headline: Localized<string>;
  zoomBtn: Localized<string>;
  closeAria: Localized<string>;
  footnote: Localized<string>;
  ctaLabel: Localized<string>;
  ctaHref: string;
  groupLabels: Record<ProjectFloorPlanGroupKey, Localized<string>>;
  items: ProjectFloorPlanItem[];
  /** ProjectNav label override — falls back to `eyebrow`. */
  navLabel?: Localized<string>;
};

export type ProjectInvestmentPoint = { num: string; title: Localized<string>; desc: Localized<string> };

export type ProjectPriceFact = { label: Localized<string>; value: Localized<string> };

export type ProjectPaymentStep = { milestone: Localized<string>; desc: Localized<string> };

export type ProjectPaymentPlan = {
  key: string;
  name: Localized<string>;
  summary: Localized<string>;
  steps: ProjectPaymentStep[];
};

export type ProjectInvestment = {
  eyebrow: Localized<string>;
  headline: Localized<string>;
  /** Per-language headline max-width (vi tends to wrap tighter than en). */
  headlineMaxWidth?: Localized<string>;
  points: ProjectInvestmentPoint[];
  pricingTitle: Localized<string>;
  pricingBody: Localized<string>;
  pricingCtaLabel: Localized<string>;
  pricingCtaHref: string;
  /** Indicative price figures (from-price, entry ticket, booking). */
  priceFacts?: ProjectPriceFact[];
  paymentTitle?: Localized<string>;
  paymentPlans?: ProjectPaymentPlan[];
  /** Small print under the payment plans (e.g. "dự kiến, theo từng đợt"). */
  paymentNote?: Localized<string>;
  /** ProjectNav label override — falls back to `eyebrow`. */
  navLabel?: Localized<string>;
};

/** One fact tracked through the "verified/source/lastUpdated" governance
 * layer (see The Sailing brief mục 6) — for a project whose only source is
 * an unofficial third-party site, every important number/claim needs this
 * instead of being hard-coded straight into a section's copy. `verified:
 * false` items render with hedged wording in this section (never asserted
 * elsewhere on the page as settled fact); flip to `true` once an official
 * document confirms it. */
export type ProjectVerificationItem = {
  label: Localized<string>;
  note: Localized<string>;
  source: string;
  verified: boolean;
  lastUpdated: string;
};

export type ProjectVerification = {
  eyebrow: Localized<string>;
  headline: Localized<string>;
  body: Localized<string>;
  items: ProjectVerificationItem[];
  /** ProjectNav label override — falls back to `eyebrow`. */
  navLabel?: Localized<string>;
};

export type ProjectFAQItem = { q: Localized<string>; a: Localized<string>; group: string };

export type ProjectFAQ = {
  eyebrow: Localized<string>;
  headline: Localized<string>;
  groupLabels: Record<string, Localized<string>>;
  items: ProjectFAQItem[];
  /** ProjectNav label override — falls back to `eyebrow`. */
  navLabel?: Localized<string>;
};

export type ProjectDocumentItem = {
  name: Localized<string>;
  note: Localized<string>;
  /** Optional — a document row may exist before the real PDF is ready.
   * Absent means the row renders as a listed-but-not-yet-downloadable item
   * (no broken link) rather than an empty href. */
  fileUrl?: string;
  /** Link text for `fileUrl` (e.g. an external page, not a PDF) — falls
   * back to the section's ctaLabel. */
  linkLabel?: Localized<string>;
};

export type ProjectDocuments = ProjectSectionAction & {
  eyebrow: Localized<string>;
  headline: Localized<string>;
  ctaLabel: Localized<string>;
  ctaHref: string;
  items: ProjectDocumentItem[];
};

export type ProjectTrustPoint = { label: Localized<string>; desc: Localized<string> };

/** "Legal / Trust" section — Base Land credibility block, not a legal
 * disclosure document list (that's ProjectDocuments). */
export type ProjectLegal = {
  body: Localized<string>;
  points: ProjectTrustPoint[];
  /** Outbound reference links (developer site, 360 tour, legal file…). */
  links?: { label: Localized<string>; href: string }[];
};

export type ProjectCta = {
  eyebrow: Localized<string>;
  headline: Localized<string>;
  headlineMaxWidth?: Localized<string>;
  body: Localized<string>;
  callNowLabel: Localized<string>;
  /** "Bạn sẽ nhận được" list beside the form; omitted = default three items. */
  benefitsTitle?: Localized<string>;
  benefits?: Localized<string>[];
  /** Identifies this project to the shared lead form / API (e.g. "qterra"). */
  leadSource: string;
  /** Extra select fields on this project's lead form, stored on the Lead
   * row (see LEAD_QUALIFIER_KEYS). The submitted value is the option's
   * `vi` text. Present = replaces the generic "Bạn đang tìm gì?" select. */
  qualifiers?: ProjectLeadQualifier[];
};

export const LEAD_QUALIFIER_KEYS = ["region", "purpose", "timeframe"] as const;
export type LeadQualifierKey = (typeof LEAD_QUALIFIER_KEYS)[number];

export type ProjectLeadQualifier = {
  key: LeadQualifierKey;
  label: Localized<string>;
  options: Localized<string>[];
};

/**
 * A Sales Advisor (TVBH) — a project/campaign-specific contact person, not
 * the branch hotline. `name` is a proper noun (kept invariant across
 * languages, like `ProjectDetailData.name`); `title` (role/team label) is
 * localized. No admin/CMS exists yet to manage real advisor records safely,
 * so no project currently populates `primaryAdvisor`/`secondaryAdvisor` —
 * every video's CTA falls back to Base Land's own branch contact
 * (CONTACT_PHONE/CONTACT_PHONE_HREF) until a real advisor is configured.
 * `enabled` lets an advisor be turned off (e.g. left the team) without
 * deleting the record.
 */
export type ProjectAdvisor = {
  name: string;
  title: Localized<string>;
  phone: string;
  phoneHref: string;
  avatar?: string;
  enabled: boolean;
};

export type ProjectVideoContentType =
  | "project-update"
  | "product-guide"
  | "location"
  | "lifestyle"
  | "amenities"
  | "faq"
  | "sales-insight";

export type ProjectVideoItem = {
  key: string;
  contentType: ProjectVideoContentType;
  title: Localized<string>;
  description: Localized<string>;
  /** Absent until real footage exists — the card renders an honest
   * ImagePlaceholder-style "video đang được sản xuất" state instead of a
   * broken/blank player (see VideoStoryCard). */
  videoUrl?: string;
  posterUrl?: string;
  posterAlt?: Localized<string>;
  /** CTA label override — defaults to "Liên hệ ngay với TVBH" / "Talk to a
   * Sales Advisor" (mục 3) when omitted. */
  ctaLabel?: Localized<string>;
  /** Per-video advisor override — falls back to the section's
   * primary/secondary advisor, then the branch contact (see ProjectAdvisor
   * doc comment). */
  advisor?: ProjectAdvisor;
  /** Lead-source topic slug for analytics + the emailed lead's `source`
   * field (mục 8) — e.g. "construction-progress", "1br-location". Kept
   * separate from the visible NEED_OPTIONS dropdown (which stays generic
   * sitewide) so this video-specific context doesn't pollute that list. */
  topicSlug: string;
  /** Optional NEED_OPTIONS value (see lib/content/lead.ts) to preselect in
   * the lead modal's "Interest" field when this video's CTA opens it. */
  prefillNeed?: string;
  enabled: boolean;
  sortOrder: number;
};

export type ProjectVideoDuo = {
  eyebrow: Localized<string>;
  headline: Localized<string>;
  body?: Localized<string>;
  /** 1–2 videos, ordered by `sortOrder`. Enforced at render time (mục 9):
   * an empty list hides the whole section rather than showing empty cards. */
  items: ProjectVideoItem[];
  primaryAdvisor?: ProjectAdvisor;
  secondaryAdvisor?: ProjectAdvisor;
  /** ProjectNav label override — falls back to `eyebrow`. */
  navLabel?: Localized<string>;
};

export type ProjectSalesPhaseStep = {
  title: Localized<string>;
  body: Localized<string>;
  /** Small label on the step card (e.g. "Mốc mở bán"). A non-empty tag
   * also highlights that card. Empty = plain card. */
  tag: Localized<string>;
};

/** "Giai đoạn bán hàng" — timeline of sale phases with a large key date.
 * Renders right before Location. Empty strings hide the matching element
 * (date card, CTA, Zalo button…). */
export type ProjectSalesPhases = {
  eyebrow: Localized<string>;
  headline: Localized<string>;
  body: Localized<string>;
  dateLabel: Localized<string>;
  /** Shown large, same in both languages (e.g. "30/10/2026"). */
  date: string;
  dateCaption: Localized<string>;
  steps: ProjectSalesPhaseStep[];
  ctaLeadLabel: Localized<string>;
  ctaLeadHref: string;
  ctaCallLabel: Localized<string>;
  ctaZaloLabel: Localized<string>;
  zaloUrl: string;
  /** Faint backdrop photo. Empty src → falls back to the hero image. */
  backgroundImage: { src: string; alt: Localized<string> };
};

/** "Tham quan ảo 360°" — an external 360° tour (developer-hosted). The
 * page only ever shows the poster until the visitor clicks play: the
 * iframe is never loaded up front (it is heavy WebGL content). Desktop +
 * `allowEmbed` → iframe in place with a fullscreen button; mobile or
 * `allowEmbed: false` → opens `tourUrl` in a new tab. */
export type ProjectVirtualTour = {
  eyebrow: Localized<string>;
  headline: Localized<string>;
  body: Localized<string>;
  tourUrl: string;
  /** Set false if the tour host starts refusing to be framed. */
  allowEmbed: boolean;
  /** Empty src → falls back to the hero image. */
  poster: { src: string; alt: Localized<string> };
  playLabel: Localized<string>;
  fullscreenLabel: Localized<string>;
  newTabLabel: Localized<string>;
  /** Secondary hero button that scrolls to this section; empty = no button. */
  heroCtaLabel: Localized<string>;
  /** CTA under the tour, opens the lead form. */
  ctaLabel: Localized<string>;
  /** Banner shown above the lead form the CTA opens; empty = none. */
  ctaNote: Localized<string>;
  /** Lead `source` for that CTA (e.g. "qterra-360"); empty → "<slug>-360". */
  leadSource: string;
  /** Small print under the tour (e.g. "Tour do chủ đầu tư cung cấp"). */
  note: Localized<string>;
  navLabel?: Localized<string>;
};

/** Lead-capture popup (not a page section — rendered as an overlay). The
 * dialog code is only loaded once a trigger fires; see LeadPopupTrigger. */
export type ProjectLeadPopup = {
  title: Localized<string>;
  subtitle: Localized<string>;
  benefits: Localized<string>[];
  phoneLabel: Localized<string>;
  phonePlaceholder: Localized<string>;
  phoneError: Localized<string>;
  nameLabel: Localized<string>;
  submitLabel: Localized<string>;
  submittingLabel: Localized<string>;
  /** Text before the privacy link, e.g. "Bảo mật thông tin · Không spam ·". */
  privacyNote: Localized<string>;
  privacyLinkLabel: Localized<string>;
  successMessage: Localized<string>;
  errorMessage: Localized<string>;
  callLabel: Localized<string>;
  zaloLabel: Localized<string>;
  /** Empty = no Zalo button on the success screen. */
  zaloUrl: string;
  closeLabel: Localized<string>;
  /** Triggers: after N seconds, after scrolling N% of the page, or
   * exit-intent (desktop only). Closing hides it for `dismissDays`. */
  delaySeconds: number;
  scrollPercent: number;
  dismissDays: number;
  /** Lead `source`; empty → "<slug>-popup". */
  leadSource: string;
  /** Saved as the lead's name when the visitor leaves it blank. */
  fallbackName: string;
};

export type ProjectDetailData = {
  slug: string;
  /** Proper noun — kept invariant across languages (matches how every page
   * on this site already renders project names). */
  name: string;
  category: Localized<string>;
  status: Localized<string>;
  /** Opt-in visual theme name (e.g. "simona"). Sets a `data-project-theme`
   * attribute that scopes a --project-* token override in globals.css (see
   * [data-project-theme="simona"]) — no component fork required. Omit for
   * the site's default Brand Green / Terracotta look (Q'Terra, The
   * Sailing, and any project without a dedicated theme). */
  theme?: string;
  sections: ProjectSections;
  hero: ProjectHero;
  intro?: ProjectIntro;
  stats?: ProjectStats;
  towers?: ProjectTowers;
  salesPhases?: ProjectSalesPhases;
  location?: ProjectLocation;
  masterplan?: ProjectMasterplan;
  gallery?: ProjectGallery;
  architecture?: ProjectPhotoStatement;
  materialStory?: ProjectMaterialStory;
  lifestyle?: ProjectLifestyle;
  education?: ProjectPhotoStatement;
  amenities?: ProjectAmenities;
  views?: ProjectPhotoStatement;
  residences?: ProjectResidences;
  /** Renders immediately after Residences, before Floor Plans/Amenities —
   * fixed position per the brief (the "vừa chọn xong loại căn → tôi nên
   * quan tâm gì tiếp theo" transition point), not reorderable per project. */
  videoDuo?: ProjectVideoDuo;
  floorPlans?: ProjectFloorPlans;
  virtualTour?: ProjectVirtualTour;
  leadPopup?: ProjectLeadPopup;
  investment?: ProjectInvestment;
  news?: ProjectNewsTeaser;
  legal?: ProjectLegal;
  documents?: ProjectDocuments;
  verification?: ProjectVerification;
  faq?: ProjectFAQ;
  cta: ProjectCta;
  /** Optional admin-set SEO overrides — read only by generateMetadata(),
   * never rendered on the page itself. */
  seo?: { title?: string; description?: string; ogImageUrl?: string };
};

/** A section renders when data is present, unless `sections` explicitly
 * forces it off (`sections.investment === false`) — the override always
 * wins, even over present data. Sections with no toggle key (hero, cta)
 * are always shown; they're required fields on ProjectDetailData. */
/** The standard (Q'Terra) layout is the default for every project; only
 * an explicit hero.layout = "full" keeps the older editorial flow. */
export function isCompactLayout(project: ProjectDetailData): boolean {
  return project.hero.layout !== "full";
}

export function isSectionVisible(project: ProjectDetailData, key: ProjectSectionKey): boolean {
  if (project.sections[key] === false) return false;
  return project[key] != null;
}

export type ProjectNavItem = { href: string; label: Localized<string> };

/**
 * ProjectNav's anchor list — the flagship Q'Terra page anchors to a curated
 * subset of its sections (location, architecture, residences, floorPlans,
 * amenities, investment), not every section it renders (intro/stats/
 * materialStory/lifestyle/views/documents/legal never get a nav item on
 * Q'Terra either). Deriving the list from `isSectionVisible` means a
 * project with fewer sections (e.g. The Sailing) automatically gets a
 * shorter nav — no per-project nav config needed.
 */
export function getProjectNavItems(project: ProjectDetailData): ProjectNavItem[] {
  if (isCompactLayout(project)) return [...getCompactAnchorItems(project), { href: "#lead", label: project.cta.eyebrow }];
  const items: ProjectNavItem[] = [
    { href: `#${project.slug}`, label: { vi: project.hero.navLabel ?? project.name, en: project.hero.navLabel ?? project.name } },
  ];

  if (isSectionVisible(project, "towers") && project.towers) {
    items.push({ href: "#towers", label: project.towers.navLabel ?? project.towers.eyebrow });
  }
  if (isSectionVisible(project, "location") && project.location) {
    items.push({ href: "#location", label: project.location.navLabel ?? project.location.eyebrow });
  }
  if (isSectionVisible(project, "masterplan") && project.masterplan) {
    items.push({ href: "#masterplan", label: project.masterplan.navLabel ?? project.masterplan.eyebrow });
  }
  if (isSectionVisible(project, "architecture") && project.architecture) {
    items.push({ href: "#architecture", label: project.architecture.navLabel ?? project.architecture.eyebrow ?? project.architecture.headline });
  }
  if (isSectionVisible(project, "residences") && project.residences) {
    items.push({ href: "#residences", label: project.residences.navLabel ?? project.residences.eyebrow });
  }
  if (isSectionVisible(project, "videoDuo") && project.videoDuo && project.videoDuo.items.some((v) => v.enabled)) {
    items.push({ href: "#video-stories", label: project.videoDuo.navLabel ?? project.videoDuo.eyebrow });
  }
  if (isSectionVisible(project, "floorPlans") && project.floorPlans) {
    items.push({ href: "#floorplans", label: project.floorPlans.navLabel ?? project.floorPlans.eyebrow });
  }
  if (isSectionVisible(project, "virtualTour") && project.virtualTour?.tourUrl) {
    items.push({ href: "#virtual-tour", label: project.virtualTour.navLabel ?? project.virtualTour.eyebrow });
  }
  if (isSectionVisible(project, "education") && project.education) {
    items.push({
      href: "#education",
      label: project.education.navLabel ?? project.education.eyebrow ?? project.education.headline,
    });
  }
  if (isSectionVisible(project, "amenities") && project.amenities) {
    items.push({ href: "#amenities", label: project.amenities.navLabel ?? project.amenities.eyebrow });
  }
  if (isSectionVisible(project, "investment") && project.investment) {
    items.push({ href: "#investment", label: project.investment.navLabel ?? project.investment.eyebrow });
  }
  if (isSectionVisible(project, "faq") && project.faq) {
    items.push({ href: "#faq", label: project.faq.navLabel ?? project.faq.eyebrow });
  }

  items.push({ href: "#lead", label: project.cta.eyebrow });
  return items;
}

/** Compact layout's sticky anchor bar (Tổng quan · Vị trí · Căn hộ ·
 * Tiện ích · Giá) — labels come from each section's `navLabel`. */
export function getCompactAnchorItems(project: ProjectDetailData): ProjectNavItem[] {
  const items: ProjectNavItem[] = [];
  const towers = project.towers;
  if (isSectionVisible(project, "towers") && (towers?.reasons?.length || towers?.towers?.length === 2)) {
    items.push({ href: "#overview", label: navLabelOf(towers) });
  }
  if (isSectionVisible(project, "location") && project.location) {
    items.push({ href: "#location", label: navLabelOf(project.location) });
  }
  if (isSectionVisible(project, "residences") && project.residences?.items.length) {
    items.push({ href: "#residences", label: navLabelOf(project.residences) });
  } else if (isSectionVisible(project, "masterplan") && project.masterplan) {
    items.push({ href: "#masterplan", label: navLabelOf(project.masterplan) });
  }
  if (isSectionVisible(project, "amenities") && project.amenities?.chapters.length) {
    items.push({ href: "#amenities", label: navLabelOf(project.amenities) });
  }
  // The price block is always rendered (at least its "Nhận bảng giá" CTA).
  const investment = isSectionVisible(project, "investment") ? project.investment : undefined;
  items.push({ href: "#investment", label: investment ? navLabelOf(investment) : { vi: "Giá", en: "Pricing" } });
  return items;
}

/** A section's anchor label: its navLabel when filled, else its eyebrow. */
function navLabelOf(section: { navLabel?: Localized<string>; eyebrow: Localized<string> }): Localized<string> {
  const nav = section.navLabel;
  return nav && (nav.vi.trim() || nav.en.trim()) ? nav : section.eyebrow;
}
