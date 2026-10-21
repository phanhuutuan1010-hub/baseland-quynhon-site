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
  towers: { eyebrow: L, headline: L, navLabel: L, reasons: [], towers: [], actionLabel: L, actionHref: "#lead" },
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
  virtualTour: {
    eyebrow: { vi: "Tham quan ảo 360°", en: "360° Virtual Tour" },
    headline: L,
    body: L,
    tourUrl: "",
    allowEmbed: true,
    poster: emptyImage,
    playLabel: { vi: "Tham quan 360°", en: "Take the 360° tour" },
    fullscreenLabel: { vi: "Toàn màn hình", en: "Full screen" },
    newTabLabel: { vi: "Mở trong tab mới", en: "Open in a new tab" },
    heroCtaLabel: { vi: "Tham quan 360°", en: "360° tour" },
    ctaLabel: { vi: "Nhận tư vấn căn bạn vừa xem", en: "Ask about the unit you just viewed" },
    ctaNote: L,
    leadSource: "",
    note: L,
  },
  leadPopup: {
    title: L,
    subtitle: L,
    benefits: [],
    phoneLabel: { vi: "Số điện thoại / Zalo", en: "Phone / Zalo" },
    phonePlaceholder: { vi: "VD: 0901 234 567", en: "e.g. 0901 234 567" },
    phoneError: { vi: "Số điện thoại chưa đúng (VD: 0901 234 567).", en: "Please enter a valid Vietnamese phone number." },
    nameLabel: { vi: "Họ tên (không bắt buộc)", en: "Name (optional)" },
    submitLabel: L,
    submittingLabel: { vi: "Đang gửi…", en: "Sending…" },
    privacyNote: { vi: "Bảo mật thông tin · Không spam ·", en: "Your details stay private · No spam ·" },
    privacyLinkLabel: { vi: "Chính sách bảo mật", en: "Privacy policy" },
    successMessage: L,
    errorMessage: L,
    callLabel: { vi: "Gọi ngay", en: "Call now" },
    zaloLabel: { vi: "Nhắn Zalo", en: "Message on Zalo" },
    zaloUrl: "",
    closeLabel: { vi: "Đóng", en: "Close" },
    delaySeconds: 35,
    scrollPercent: 50,
    dismissDays: 7,
    leadSource: "",
    fallbackName: "Khách để lại SĐT (popup)",
  },
  location: { eyebrow: L, headline: L, body: L, navLabel: L, mapImage: emptyImage, journey: [], benefits: [], actionLabel: L, actionHref: "call" },
  masterplan: { eyebrow: L, headline: L, body: L, image: emptyImage, zones: [], ctaLabel: L, ctaHref: "#lead" },
  architecture: { headline: L, body: L, image: emptyImage },
  materialStory: { kicker: L, headline: L, body: L, swatches: [], galleryImages: [] },
  lifestyle: { eyebrow: L, headline: L, chapters: [] },
  education: { headline: L, body: L, image: emptyImage },
  views: { headline: L, body: L, image: emptyImage },
  investment: {
    eyebrow: L,
    headline: L,
    navLabel: L,
    points: [],
    pricingTitle: L,
    pricingBody: L,
    pricingCtaLabel: { vi: "Nhận bảng giá mới nhất", en: "Get the latest price list" },
    pricingCtaHref: "#lead",
    priceFacts: [],
    paymentTitle: L,
    paymentPlans: [],
    paymentNote: L,
  },
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
    navLabel: L,
    areaLabel: L,
    shareLabel: L,
    items: [],
  },
  floorPlans: { eyebrow: L, headline: L, zoomBtn: L, closeAria: L, footnote: L, ctaLabel: L, ctaHref: "#lead", groupLabels: {}, items: [] },
  amenities: { eyebrow: L, headline: L, navLabel: L, chapters: [], actionLabel: L, actionHref: "#lead" },
  gallery: { intro: L, items: [] },
  documents: { eyebrow: L, headline: L, ctaLabel: L, ctaHref: "#lead", items: [], actionLabel: L, actionHref: "call" },
};

/** Shape of one new item for list fields that may start empty (keyed by
 * field name, per section) — lets the generic form offer "+ Thêm" with the
 * same item structure Q'Terra uses, for every project. */
export const PROJECT_SECTION_ITEM_TEMPLATES: Partial<Record<EditableProjectSectionKey, Record<string, unknown>>> = {
  intro: {},
  stats: { items: { value: "", label: L, note: L } },
  towers: {
    reasons: { kicker: L, title: L, desc: L },
    towers: { key: "", name: L, subtitle: L, description: L, characteristics: [], image: emptyImage },
    characteristics: L,
  },
  location: {
    journey: { tier: L, landmarks: [] },
    landmarks: L,
    benefits: { name: L, distance: L, image: emptyImage },
  },
  masterplan: { zones: { key: "", name: L, desc: L, tag: L } },
  investment: {
    points: { num: "", title: L, desc: L },
    priceFacts: { label: L, value: L },
    paymentPlans: { key: "", name: L, summary: L, steps: [] },
    steps: { milestone: L, desc: L },
  },
  legal: { points: { label: L, desc: L }, links: { label: L, href: "" } },
  verification: { items: { label: L, note: L, source: "", verified: false, lastUpdated: "" } },
  faq: { items: { q: L, a: L, group: "" } },
  salesPhases: { steps: { title: L, body: L, tag: L } },
  leadPopup: { benefits: L },
  residences: {
    items: { key: "", name: L, tag: L, nfa: "", nsa: "", area: "", share: L, desc: L, floorPlanImage: emptyImage },
    orientations: L,
  },
  floorPlans: { items: { key: "", group: "", name: L, src: "", alt: L, caption: L } },
  amenities: { chapters: { slotId: "", kicker: "", title: L, desc: L, items: [], direction: "row", image: emptyImage }, items: L },
  gallery: { items: { key: "", name: L, src: "", desc: L } },
  documents: { items: { name: L, note: L, fileUrl: "", linkLabel: L } },
};
