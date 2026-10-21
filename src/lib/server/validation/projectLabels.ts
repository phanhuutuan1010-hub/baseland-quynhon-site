import type { EditableProjectSectionKey } from "./project";

export const PROJECT_SECTION_LABELS: Record<EditableProjectSectionKey, string> = {
  intro: "Giới thiệu (Intro)",
  stats: "Số liệu (Stats)",
  towers: "Tháp (Towers)",
  salesPhases: "Giai đoạn bán hàng (Sales Phases)",
  virtualTour: "Tham quan ảo 360° (Virtual Tour)",
  leadPopup: "Popup thu lead (Lead Popup)",
  location: "Vị trí (Location)",
  masterplan: "Mặt bằng tổng thể (Masterplan)",
  architecture: "Kiến trúc (Architecture)",
  materialStory: "Chất liệu (Material Story)",
  lifestyle: "Phong cách sống (Lifestyle)",
  education: "Giáo dục (Education)",
  views: "Tầm nhìn (Views)",
  investment: "Đầu tư (Investment)",
  legal: "Pháp lý & Uy tín (Legal)",
  faq: "Hỏi đáp (FAQ)",
  verification: "Minh bạch dữ liệu (Verification)",
  videoDuo: "Video Duo",
  news: "Tin tức liên quan (News Teaser)",
  residences: "Loại căn hộ (Residences)",
  floorPlans: "Mặt bằng (Floor Plans)",
  amenities: "Tiện ích (Amenities)",
  gallery: "Thư viện ảnh (Gallery)",
  documents: "Tài liệu (Documents)",
};

// Order shown in the admin's section list = the standard layout's page
// order (fixed in ProjectPage.tsx, not admin-controlled).
export const PROJECT_SECTION_ORDER: EditableProjectSectionKey[] = [
  // Standard (Q'Terra) layout, in page order
  "towers",
  "location",
  "gallery",
  "architecture",
  "education",
  "masterplan",
  "residences",
  "floorPlans",
  "virtualTour",
  "amenities",
  "videoDuo",
  "investment",
  "salesPhases",
  "documents",
  "legal",
  "verification",
  "faq",
  "news",
  "leadPopup",
  // Used by the hero (stats → key-figure line) or only by the older full layout
  "stats",
  "intro",
  "materialStory",
  "lifestyle",
  "views",
];
