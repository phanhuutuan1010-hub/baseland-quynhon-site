import type { EditableProjectSectionKey } from "./project";

// Minimal starter skeleton per section key — used only when a project has
// no content yet for that section ("Thêm nội dung"), so the generic admin
// form has real top-level fields to render instead of a blank object. Text
// fields are `Localized<string>` leaves (`{ vi, en }`) inline, matching the
// real shape from lib/project-detail/types.ts — NOT an outer vi/en split
// (that's the Homepage sections' shape, not Project sections'). Item
// arrays start empty; the admin adds rows via the form's own "+ Thêm" control.
const L = { vi: "", en: "" };
const emptyImage = { src: "", alt: L };

export const PROJECT_SECTION_DEFAULTS: Record<EditableProjectSectionKey, object> = {
  intro: { eyebrow: L, headline: L, body: L },
  stats: { items: [] },
  towers: { eyebrow: L, headline: L, towers: [] },
  // Prefilled with a ready-to-edit 3-step template (not blank) so a new
  // project gets a usable section after filling in the date.
  salesPhases: {
    eyebrow: L,
    headline: { vi: "Giai đoạn mở bán", en: "Sales Phases" },
    body: {
      vi: "Thông tin dự kiến, có thể thay đổi theo thông báo chính thức của chủ đầu tư và đơn vị phân phối.",
      en: "Indicative information, subject to change per official announcements from the developer and distributors.",
    },
    dateLabel: { vi: "Mở bán dự kiến", en: "Expected launch" },
    date: "",
    dateCaption: { vi: "Ngày chính xác theo thông báo của chủ đầu tư.", en: "Exact date per the developer's announcement." },
    steps: [
      {
        title: { vi: "Đăng ký nguyện vọng", en: "Register your interest" },
        body: {
          vi: "Chọn tầng, loại căn, hướng bạn quan tâm. Điều kiện giữ chỗ (nếu có) gửi bằng văn bản trước khi bạn chuyển tiền.",
          en: "Choose the floor, unit type and orientation you prefer. Any reservation terms are sent in writing before you transfer money.",
        },
        tag: L,
      },
      {
        title: { vi: "Mở bán · chọn căn", en: "Launch · unit selection" },
        body: {
          vi: "Quy tắc chọn căn được công bố bằng văn bản trước ngày mở bán.",
          en: "Unit-selection rules are published in writing before launch day.",
        },
        tag: { vi: "Mốc mở bán", en: "Launch milestone" },
      },
      {
        title: { vi: "Bán theo giỏ hàng", en: "Open inventory sales" },
        body: {
          vi: "Các căn còn lại mở bán công khai theo bảng hàng cập nhật.",
          en: "Remaining units are sold openly from the updated inventory list.",
        },
        tag: L,
      },
    ],
    ctaLeadLabel: { vi: "Nhận tư vấn chọn căn", en: "Get unit advice" },
    ctaLeadHref: "#lead",
    ctaCallLabel: { vi: "Gọi ngay", en: "Call now" },
    ctaZaloLabel: { vi: "Chat Zalo", en: "Chat on Zalo" },
    zaloUrl: "",
    backgroundImage: emptyImage,
  },
  location: { eyebrow: L, headline: L, body: L, mapImage: emptyImage, benefits: [] },
  masterplan: { eyebrow: L, headline: L, body: L, image: emptyImage, zones: [], ctaLabel: L, ctaHref: "#lead" },
  architecture: { headline: L, body: L, image: emptyImage },
  materialStory: { kicker: L, headline: L, body: L, swatches: [], galleryImages: [] },
  lifestyle: { eyebrow: L, headline: L, chapters: [] },
  education: { headline: L, body: L, image: emptyImage },
  views: { headline: L, body: L, image: emptyImage },
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
