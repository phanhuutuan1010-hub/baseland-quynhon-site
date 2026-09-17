import type { EditableProjectSectionKey } from "./project";

export const PROJECT_SECTION_LABELS: Record<EditableProjectSectionKey, string> = {
  intro: "Giới thiệu (Intro)",
  stats: "Số liệu (Stats)",
  towers: "Tháp (Towers)",
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

// Order shown in the admin's section list — NOT the public render order
// (that's fixed by ProjectPage.tsx and not admin-controlled, see the plan's
// scope decision on why project sections aren't freely reorderable).
export const PROJECT_SECTION_ORDER: EditableProjectSectionKey[] = [
  "intro",
  "stats",
  "towers",
  "location",
  "masterplan",
  "architecture",
  "materialStory",
  "lifestyle",
  "education",
  "amenities",
  "views",
  "residences",
  "videoDuo",
  "floorPlans",
  "investment",
  "news",
  "legal",
  "documents",
  "verification",
  "faq",
];
