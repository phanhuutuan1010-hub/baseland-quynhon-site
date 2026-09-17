import type { Lang, Localized } from "@/lib/i18n";

export type NewsCategory = "project" | "market" | "investment" | "quynhon" | "lifestyle" | "news";

export type ProjectKey = "qterra" | "sailing" | "simona" | "phugia";

export type Article = {
  /** URL-friendly slug — also the route param for /news/[slug]. */
  slug: string;
  category: NewsCategory;
  /** ISO date (yyyy-mm-dd); format for display with formatArticleDate(). */
  date: string;
  /** Key for the ImagePlaceholder label — no real photography available yet. */
  slotId: string;
  title: Localized<string>;
  excerpt: Localized<string>;
  /** Paragraphs. Only "qterra-center" has real long-form copy from the
   * source handoff; the other stubs reuse their excerpt as a single
   * paragraph since no fuller body copy exists in the design bundle. */
  body: Localized<string[]>;
  relatedProject: ProjectKey | null;
};

// Fixed category taxonomy — mirrors the design bundle's _categoriesData.
// Do not add categories outside this list without an explicit request.
export const NEWS_CATEGORIES: { key: NewsCategory; label: Localized<string> }[] = [
  { key: "project", label: { vi: "Dự án", en: "Project" } },
  { key: "market", label: { vi: "Thị trường", en: "Market" } },
  { key: "investment", label: { vi: "Đầu tư", en: "Investment" } },
  { key: "quynhon", label: { vi: "Quy Nhơn", en: "Quy Nhon" } },
  { key: "lifestyle", label: { vi: "Đời sống", en: "Lifestyle" } },
  { key: "news", label: { vi: "Tin tức", en: "News" } },
];

export const CATEGORY_ALL_LABEL: Localized<string> = { vi: "Tất cả", en: "All" };

export const PROJECT_LINKS: Record<ProjectKey, { name: string; href: string; slotId: string }> = {
  qterra: { name: "Q'Terra Quy Nhơn", href: "/projects/qterra", slotId: "qterra-featured-01" },
  sailing: { name: "The Sailing Quy Nhơn", href: "/projects/the-sailing", slotId: "local-project-sailing" },
  simona: { name: "Simona Heights", href: "/projects/simona-heights", slotId: "local-project-simona" },
  phugia: { name: "Phú Gia Royal Park Quy Nhơn", href: "/projects/phu-gia-royal-park", slotId: "local-project-phugia" },
};

// CMS-ready shape (content / media / metadata separated); author is always
// the organization, never a person — mirrors the design bundle's comment.
export const ARTICLES: Article[] = [
  {
    slug: "qterra-center",
    category: "project",
    date: "2026-09-01",
    slotId: "news-qterra-center",
    title: { vi: "Q'Terra tại trung tâm Quy Nhơn", en: "Q'Terra at the Heart of Quy Nhon" },
    excerpt: {
      vi: "Vì sao vị trí 01 Ngô Mây đặt Q'Terra ngay giữa nhịp sống của thành phố biển.",
      en: "Why the 01 Ngo May address places Q'Terra right at the pulse of this coastal city.",
    },
    body: {
      vi: [
        "Một dự án ở giữa trung tâm không cần giải thích về khoảng cách — mọi điểm đến quan trọng của thành phố đã ở ngay gần đó. Đó là vị trí của Q'Terra: 01 Ngô Mây, nơi phố xá, bờ biển và các dịch vụ thiết yếu cùng tồn tại trong một bán kính đi bộ.",
        "Với người chọn sống ở đây, điều này có nghĩa là ít thời gian di chuyển hơn và nhiều thời gian hơn cho những điều thực sự quan trọng: một buổi sáng ở biển, một bữa tối gần nhà, một cuối tuần không cần lên kế hoạch.",
        "Với người tìm cơ hội đầu tư, vị trí trung tâm luôn là yếu tố nền tảng — nơi giá trị của một tài sản gắn liền với sự phát triển lâu dài của khu vực xung quanh nó.",
      ],
      en: [
        "A project at the true center of a city doesn't need to explain distance — every place that matters is already close by. That is the position of Q'Terra: 01 Ngo May, where streets, coastline and daily services all exist within a short walk.",
        "For those who choose to live here, this means less time in transit and more time for what actually matters: a morning by the sea, dinner close to home, a weekend that needs no planning.",
        "For those looking at investment potential, a central location remains a foundational factor — where an asset's value is tied to the long-term growth of everything around it.",
      ],
    },
    relatedProject: "qterra",
  },
  {
    slug: "market-watch",
    category: "market",
    date: "2026-08-24",
    slotId: "news-market-watch",
    title: {
      vi: "Thị trường bất động sản Quy Nhơn: những điều đáng theo dõi",
      en: "Quy Nhon Real Estate: What to Watch",
    },
    excerpt: {
      vi: "Một góc nhìn tổng quan về nhịp phát triển của thị trường bất động sản địa phương.",
      en: "A broad look at the pace of the local real estate market's development.",
    },
    body: {
      vi: ["Một góc nhìn tổng quan về nhịp phát triển của thị trường bất động sản địa phương."],
      en: ["A broad look at the pace of the local real estate market's development."],
    },
    relatedProject: null,
  },
  {
    slug: "invest-resort",
    category: "investment",
    date: "2026-08-15",
    slotId: "news-invest-resort",
    title: {
      vi: "Đầu tư bất động sản nghỉ dưỡng: những yếu tố cần cân nhắc",
      en: "Investing in Resort Real Estate: What to Consider",
    },
    excerpt: {
      vi: "Những tiêu chí cơ bản khi đánh giá một tài sản nghỉ dưỡng ven biển.",
      en: "Baseline criteria for evaluating a coastal resort asset.",
    },
    body: {
      vi: ["Những tiêu chí cơ bản khi đánh giá một tài sản nghỉ dưỡng ven biển."],
      en: ["Baseline criteria for evaluating a coastal resort asset."],
    },
    relatedProject: "sailing",
  },
  {
    slug: "city-transform",
    category: "quynhon",
    date: "2026-08-05",
    slotId: "news-city-transform",
    title: { vi: "Quy Nhơn — thành phố biển đang chuyển mình", en: "Quy Nhon — A Coastal City in Transformation" },
    excerpt: {
      vi: "Những thay đổi về hạ tầng và cảnh quan đô thị đang định hình lại thành phố.",
      en: "Infrastructure and urban-landscape changes now reshaping the city.",
    },
    body: {
      vi: ["Những thay đổi về hạ tầng và cảnh quan đô thị đang định hình lại thành phố."],
      en: ["Infrastructure and urban-landscape changes now reshaping the city."],
    },
    relatedProject: null,
  },
  {
    slug: "slow-living",
    category: "lifestyle",
    date: "2026-07-28",
    slotId: "news-slow-living",
    title: { vi: "Một ngày sống chậm bên bờ biển Quy Nhơn", en: "A Slow Day by the Quy Nhon Coastline" },
    excerpt: {
      vi: "Nhịp sống ven biển và những điều làm nên một buổi sáng đáng nhớ ở đây.",
      en: "The rhythm of coastal living and what makes a morning here worth remembering.",
    },
    body: {
      vi: ["Nhịp sống ven biển và những điều làm nên một buổi sáng đáng nhớ ở đây."],
      en: ["The rhythm of coastal living and what makes a morning here worth remembering."],
    },
    relatedProject: "simona",
  },
  {
    slug: "baseland-update",
    category: "news",
    date: "2026-07-10",
    slotId: "news-baseland-update",
    title: { vi: "Cập nhật từ Base Land Quy Nhơn", en: "An Update from Base Land Quy Nhon" },
    excerpt: {
      vi: "Những hoạt động và cập nhật gần đây từ Base Land tại Quy Nhơn.",
      en: "Recent activity and updates from Base Land in Quy Nhon.",
    },
    body: {
      vi: ["Những hoạt động và cập nhật gần đây từ Base Land tại Quy Nhơn."],
      en: ["Recent activity and updates from Base Land in Quy Nhon."],
    },
    relatedProject: "phugia",
  },
];

export function getArticleBySlug(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

export function formatArticleDate(iso: string, lang: Lang): string {
  const d = new Date(iso + "T00:00:00");
  if (lang === "vi") {
    return String(d.getDate()).padStart(2, "0") + "/" + String(d.getMonth() + 1).padStart(2, "0") + "/" + d.getFullYear();
  }
  return d.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });
}

/** Related articles for the detail page: same category first, then most
 * recent others, excluding the current article — capped at 3. */
export function getRelatedArticles(current: Article, max = 3): Article[] {
  const others = ARTICLES.filter((a) => a.slug !== current.slug);
  const sameCategory = others.filter((a) => a.category === current.category);
  const rest = others.filter((a) => a.category !== current.category);
  return [...sameCategory, ...rest].slice(0, max);
}

// Page-level bilingual copy shared by the News list page.
export const NEWS_PAGE_COPY = {
  pageEyebrow: { vi: "Insights", en: "Insights" },
  pageTitle: {
    vi: "Quy Nhơn Real Estate & Lifestyle Insights",
    en: "Quy Nhon Real Estate & Lifestyle Insights",
  },
  readMore: { vi: "Đọc bài viết", en: "Read article" },
  featuredKicker: { vi: "Bài viết nổi bật", en: "Featured Articles" },
  latestTitle: { vi: "Insights mới nhất", en: "Latest Insights" },
  emptyMsg: { vi: "Chưa có bài viết trong danh mục này.", en: "No articles in this category yet." },
  projectCtaTitle: { vi: "Khám phá dự án tại Quy Nhơn", en: "Explore projects in Quy Nhon" },
  projectCtaBody: {
    vi: "Xem danh mục dự án bất động sản đang được Base Land Quy Nhơn phân phối và tư vấn.",
    en: "Browse the real estate projects currently marketed and advised by Base Land Quy Nhon.",
  },
  projectCtaBtn: { vi: "Xem dự án", en: "View Projects" },
} satisfies Record<string, Localized<string>>;

// Page-level bilingual copy shared by the Article detail page.
export const ARTICLE_PAGE_COPY = {
  backToInsights: { vi: "Tất cả Insights", en: "All Insights" },
  authorName: { vi: "Base Land Quy Nhơn", en: "Base Land Quy Nhon" },
  viewProject: { vi: "Xem dự án", en: "View project" },
  relatedProjectKicker: { vi: "Dự án liên quan", en: "Related Project" },
  relatedArticlesKicker: { vi: "Bài viết liên quan", en: "Related Articles" },
} satisfies Record<string, Localized<string>>;

// Shared lead-CTA copy (identical gradient section on both News and Article).
export const NEWS_LEAD_COPY = {
  ctaTitle: {
    vi: "Bạn đang quan tâm bất động sản tại Quy Nhơn?",
    en: "Interested in real estate in Quy Nhon?",
  },
  ctaSub: {
    vi: "Để lại thông tin, chuyên viên Base Land Quy Nhơn sẽ liên hệ tư vấn trong thời gian sớm nhất.",
    en: "Leave your details and a Base Land Quy Nhon advisor will be in touch shortly.",
  },
} satisfies Record<string, Localized<string>>;
