import type { Localized } from "@/lib/i18n";

export type HomeContent = {
  hero: {
    eyebrow: string;
    headlineLines: [string, string];
    tagline: string;
    ctaPrimary: string;
    ctaSecondary: string;
    /** Optional admin-set background — falls back to the built-in 4-slide
     * carousel (HeroCarousel) when unset. Duplicated in both vi/en (same
     * value) purely because Homepage sections store one object per
     * language — the image itself isn't language-specific. */
    heroImageSrc?: string;
  };
  intro: { kicker: string; title: string; body: string };
  whyqn: {
    kicker: string;
    statement: string;
    points: { label: string; desc: string }[];
  };
  featured: {
    kicker: string;
    title: string;
    desc: string;
    locationLabel: string;
    locationValue: string;
    scaleLabel: string;
    scaleValue: string;
    cta: string;
    amenities: string[];
  };
  local: {
    kicker: string;
    title: string;
    items: { slotId: string; name: string; location: string; status: string; cta: string }[];
  };
  services: { kicker: string; title: string; items: { num: string; title: string; desc: string }[] };
  whybl: { kicker: string; title: string; values: { name: string; desc: string }[] };
  news: {
    kicker: string;
    title: string;
    viewAll: string;
    items: { date: string; title: string }[];
  };
  cta: { title: string; sub: string };
};

// Per-section slices of HomeContent, each still wrapped in Localized<T> —
// used by the DB-driven homepage (src/lib/server/mappers/homepage.ts and
// src/components/home/*) so each section component's prop type stays
// derived from this single source instead of being redeclared.
export type HomeHeroContent = Localized<HomeContent["hero"]>;
export type HomeIntroContent = Localized<HomeContent["intro"]>;
export type HomeWhyQuyNhonContent = Localized<HomeContent["whyqn"]>;
export type HomeFeaturedProjectContent = Localized<HomeContent["featured"]>;
export type HomeProjectsTeaserContent = Localized<HomeContent["local"]>;
export type HomeServicesContent = Localized<HomeContent["services"]>;
export type HomeWhyBaseLandContent = Localized<HomeContent["whybl"]>;
export type HomeNewsTeaserContent = Localized<HomeContent["news"]>;
export type HomeLeadCtaContent = Localized<HomeContent["cta"]>;

// Kept as the canonical real copy — no longer imported by the live homepage
// (src/app/(site)/page.tsx now reads from the DB), but reused by
// prisma/seed.ts to seed the 9 HomepageSection rows with this exact
// (already-approved, already-bilingual) content instead of re-typing it.
export const HOME_CONTENT: Localized<HomeContent> = {
  vi: {
    hero: {
      eyebrow: "BASE LAND QUY NHƠN",
      headlineLines: ["AN CƯ & ĐẦU TƯ", "BÊN BỜ BIỂN QUY NHƠN"],
      tagline:
        "Chi nhánh Base Land tại Quy Nhơn — kết nối cơ hội bất động sản đắc địa với sự am hiểu địa phương và cam kết minh bạch.",
      ctaPrimary: "Khám phá dự án",
      ctaSecondary: "Nhận tư vấn",
    },
    intro: {
      kicker: "GIỚI THIỆU",
      title: "Base Land Quy Nhơn",
      body: "Là chi nhánh của Base Land tại thành phố biển Quy Nhơn, chúng tôi mang đến dịch vụ phân phối và tư vấn bất động sản chuyên nghiệp, xây dựng trên nền tảng uy tín, minh bạch và am hiểu sâu sắc thị trường địa phương. Mỗi khách hàng được đồng hành từ bước đầu tiên đến khi hoàn tất giao dịch, với sự tận tâm và trách nhiệm dài hạn.",
    },
    whyqn: {
      kicker: "TẠI SAO QUY NHƠN",
      statement:
        "Một thành phố biển đang bước vào giai đoạn phát triển mới — nơi cảnh quan tự nhiên, đô thị hiện đại và tiềm năng đầu tư gặp nhau.",
      points: [
        { label: "Biển", desc: "Bờ biển dài, vịnh nước trong, khí hậu ôn hoà quanh năm." },
        { label: "Đô thị", desc: "Hạ tầng mở rộng nhanh, quy hoạch bài bản, kết nối thuận tiện." },
        {
          label: "Du lịch & đầu tư",
          desc: "Lượng khách du lịch tăng trưởng liên tục, kéo theo nhu cầu bất động sản nghỉ dưỡng và an cư.",
        },
      ],
    },
    featured: {
      kicker: "DỰ ÁN NỔI BẬT",
      title: "Q'Terra Quy Nhơn",
      desc: "Tổ hợp căn hộ tại vị trí đắc địa 01 Ngô Mây, ngay trung tâm thành phố biển Quy Nhơn. Dự án do Base Land phân phối, hướng đến chuẩn sống nghỉ dưỡng cao cấp bên bờ biển.",
      locationLabel: "Vị trí",
      locationValue: "01 Ngô Mây, Quy Nhơn",
      scaleLabel: "Quy mô",
      scaleValue: "864 căn hộ",
      cta: "Khám phá Q'Terra",
      amenities: ["Hồ bơi vô cực", "Nhà hàng", "Phòng gym", "Spa", "Sky bar"],
    },
    local: {
      kicker: "DỰ ÁN TẠI QUY NHƠN",
      title: "Cơ hội đầu tư & an cư khác tại Quy Nhơn",
      items: [
        {
          slotId: "local-project-sailing",
          name: "The Sailing Quy Nhơn",
          location: "Lê Duẩn · Vũ Bảo · Nguyễn Tư",
          status: "Đang triển khai",
          cta: "Xem thêm",
        },
        {
          slotId: "local-project-simona",
          name: "Simona Heights",
          location: "Quy Nhơn",
          status: "Đang triển khai",
          cta: "Xem thêm",
        },
        {
          slotId: "local-project-phugia",
          name: "Phú Gia Royal Park Quy Nhơn",
          location: "Quy Nhơn",
          status: "Đang triển khai",
          cta: "Xem thêm",
        },
      ],
    },
    services: {
      kicker: "DỊCH VỤ",
      title: "Hệ sinh thái dịch vụ bất động sản toàn diện",
      items: [
        {
          num: "01",
          title: "Phân phối & Tiếp thị dự án",
          desc: "Kết nối khách hàng với những dự án chất lượng từ các chủ đầu tư uy tín, cung cấp thông tin minh bạch và tư vấn chuyên sâu.",
        },
        {
          num: "02",
          title: "Tư vấn & Kinh doanh bất động sản",
          desc: "Đồng hành cùng khách hàng phân tích thị trường, đánh giá tiềm năng và xây dựng chiến lược đầu tư hiệu quả.",
        },
        {
          num: "03",
          title: "Đầu tư & Phát triển dự án",
          desc: "Giải pháp bán hàng, marketing và phát triển thị trường cho chủ đầu tư, đối tác tại khu vực Quy Nhơn.",
        },
      ],
    },
    whybl: {
      kicker: "VÌ SAO BASE LAND",
      title: "Nền tảng cho một quyết định an tâm",
      values: [
        { name: "Uy tín", desc: "Thương hiệu được xây dựng từ lòng tin của khách hàng và đối tác." },
        { name: "Minh bạch", desc: "Thông tin dự án và quy trình giao dịch rõ ràng ở mọi bước." },
        { name: "Chuyên nghiệp", desc: "Đội ngũ tư vấn được đào tạo bài bản, am hiểu sản phẩm và thị trường." },
        { name: "Am hiểu thị trường", desc: "Bám sát diễn biến bất động sản Quy Nhơn và khu vực lân cận." },
        { name: "Đồng hành dài hạn", desc: "Hỗ trợ khách hàng không chỉ ở giao dịch mà xuyên suốt quá trình sở hữu." },
      ],
    },
    news: {
      kicker: "TIN TỨC",
      title: "Cập nhật thị trường & bất động sản",
      viewAll: "Xem tất cả tin tức",
      items: [
        { date: "07/09/2026", title: "Gần 3.900 căn biệt thự du lịch đang được xây dựng" },
        {
          date: "04/09/2026",
          title: "Dòng vốn tìm đến bất động sản chất lượng, ưu tiên khả năng khai thác dài hạn",
        },
        { date: "04/09/2026", title: "Điều gì tạo nên giá trị bền vững cho một căn hộ sau 10 năm?" },
      ],
    },
    cta: {
      title: "Tìm kiếm cơ hội bất động sản tại Quy Nhơn?",
      sub: "Để lại thông tin, chuyên viên Base Land Quy Nhơn sẽ liên hệ tư vấn trong thời gian sớm nhất.",
    },
  },
  en: {
    hero: {
      eyebrow: "BASE LAND QUY NHƠN",
      headlineLines: ["LIVE & INVEST", "ON QUY NHON'S COASTLINE"],
      tagline:
        "Base Land's Quy Nhơn branch — connecting you to prime real estate opportunities with local expertise and full transparency.",
      ctaPrimary: "Explore Projects",
      ctaSecondary: "Get in Touch",
    },
    intro: {
      kicker: "ABOUT",
      title: "Base Land Quy Nhơn",
      body: "As Base Land's branch in the coastal city of Quy Nhơn, we bring professional real estate distribution and advisory services built on trust, transparency and deep local market knowledge. Every client is guided from the first conversation through to closing, with genuine care and long-term commitment.",
    },
    whyqn: {
      kicker: "WHY QUY NHƠN",
      statement:
        "A coastal city entering a new stage of growth — where natural landscape, modern urban living and investment potential meet.",
      points: [
        { label: "Sea", desc: "A long coastline, clear bays and a mild climate year-round." },
        { label: "Urban growth", desc: "Fast-expanding infrastructure, coherent planning and easy connectivity." },
        {
          label: "Tourism & investment",
          desc: "Steadily growing tourism driving demand for resort and residential real estate.",
        },
      ],
    },
    featured: {
      kicker: "FEATURED PROJECT",
      title: "Q'Terra Quy Nhơn",
      desc: "A residential complex at the prime address of 01 Ngô Mây, in the heart of coastal Quy Nhơn. Distributed by Base Land, the development is designed around premium seaside living.",
      locationLabel: "Location",
      locationValue: "01 Ngô Mây, Quy Nhơn",
      scaleLabel: "Scale",
      scaleValue: "864 units",
      cta: "Discover Q'Terra",
      amenities: ["Infinity Pool", "Restaurant", "Fitness Center", "Spa", "Sky Bar"],
    },
    local: {
      kicker: "PROJECTS IN QUY NHƠN",
      title: "More investment & living opportunities in Quy Nhơn",
      items: [
        {
          slotId: "local-project-sailing",
          name: "The Sailing Quy Nhơn",
          location: "Lê Duẩn · Vũ Bảo · Nguyễn Tư",
          status: "In Progress",
          cta: "Learn more",
        },
        { slotId: "local-project-simona", name: "Simona Heights", location: "Quy Nhơn", status: "In Progress", cta: "Learn more" },
        {
          slotId: "local-project-phugia",
          name: "Phú Gia Royal Park Quy Nhơn",
          location: "Quy Nhơn",
          status: "In Progress",
          cta: "Learn more",
        },
      ],
    },
    services: {
      kicker: "SERVICES",
      title: "A full ecosystem of real estate services",
      items: [
        {
          num: "01",
          title: "Project Distribution & Marketing",
          desc: "Connecting clients with quality projects from reputable developers, with transparent information and in-depth advice.",
        },
        {
          num: "02",
          title: "Real Estate Advisory & Brokerage",
          desc: "Helping clients analyze the market, assess potential and build effective investment strategies.",
        },
        {
          num: "03",
          title: "Investment & Project Development",
          desc: "Sales, marketing and market development solutions for developers and partners across Quy Nhơn.",
        },
      ],
    },
    whybl: {
      kicker: "WHY BASE LAND",
      title: "A foundation for peace of mind",
      values: [
        { name: "Trust", desc: "A brand built on the trust of clients and partners alike." },
        { name: "Transparency", desc: "Clear project information and process at every step." },
        { name: "Professionalism", desc: "A well-trained team with deep product and market knowledge." },
        { name: "Market insight", desc: "Close attention to real estate trends in Quy Nhơn and beyond." },
        { name: "Long-term partnership", desc: "Support that continues well beyond the transaction itself." },
      ],
    },
    news: {
      kicker: "NEWS",
      title: "Market & real estate updates",
      viewAll: "View all news",
      items: [
        { date: "07 Sep 2026", title: "Nearly 3,900 resort villas currently under construction" },
        {
          date: "04 Sep 2026",
          title: "Capital flows toward quality real estate, favoring long-term performance",
        },
        { date: "04 Sep 2026", title: "What gives an apartment lasting value after 10 years?" },
      ],
    },
    cta: {
      title: "Looking for real estate opportunities in Quy Nhơn?",
      sub: "Leave your details and a Base Land Quy Nhơn advisor will get back to you shortly.",
    },
  },
};
