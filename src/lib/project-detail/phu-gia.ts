import type { ProjectDetailData } from "./types";

/**
 * Phú Gia Royal Park Quy Nhơn — third Project Detail Template
 * implementation (Townhouse × Community × Commerce × Green theme).
 *
 * Data sourced from https://phu-gia.com/du-an/phu-gia-royal-park/ (primary
 * — investor's own site) and https://phugiaroyalpark.vn/ (secondary —
 * a distributor's marketing microsite, used only for descriptive/product
 * detail, never for legal or pricing claims). Notable divergence between
 * the two: the primary source gives the project's current administrative
 * address as "Phường Quy Nhơn Nam, tỉnh Gia Lai" (post-2025 province
 * merger), while the secondary source still says "tỉnh Bình Định" — the
 * hero/location copy below uses the primary source's current unit combined
 * with "Tây Sơn" as the street identity (only the secondary source names
 * the street, but it's a plain geographic fact, not a legal claim).
 *
 * Deliberately NOT included, per the brief's own data-governance rule (see
 * mục 0 — "không bịa/suy đoán... không copy trực tiếp các claim thương
 * mại"):
 *  - Any profit/appreciation promise ("đảm bảo sinh lời", "tăng giá hàng
 *    đầu") — present on the distributor site for the Tây Sơn shophouse,
 *    excluded entirely.
 *  - "Sổ hồng lâu dài" — only ever seen on the distributor site, not
 *    confirmed by the investor's own page; excluded until an official
 *    source confirms it. What IS stated below (legal progress items) comes
 *    straight from the primary source's own "TIẾN ĐỘ PHÁP LÝ" section.
 *  - Any specific price (the distributor page's own price field is a
 *    literal unfilled "xx triệu/m²" placeholder).
 *  - A dedicated "Sales Policy" section with specific payment/loan/discount
 *    terms — those numbers on the distributor site belong to a different
 *    sales agency (One Vision Land), not confirmed as Base Land's own
 *    current policy. The "Request latest sales policy" CTA is kept (see
 *    `documents.ctaLabel`) as a pure lead-capture prompt instead.
 *  - A dated construction-progress timeline — no confirmed milestone dates
 *    exist yet; `gallery` below uses honestly-labeled placeholders instead.
 *  - A separate floor-plan section (FloorPlanViewer) — no real floor-plan
 *    artwork exists yet for any of the three product types; fabricating
 *    plan graphics would be actively misleading for a technical document,
 *    unlike a labeled empty gallery tile. ResidenceSelector already covers
 *    each product type honestly via its own placeholder fallback.
 */
export const PHU_GIA_ROYAL_PARK_PROJECT: ProjectDetailData = {
  slug: "phu-gia-royal-park",
  name: "PHÚ GIA ROYAL PARK",
  category: { vi: "Nhà phố & Biệt thự", en: "Townhouses & Villas" },
  status: { vi: "Đang triển khai", en: "In Progress" },
  theme: "phu-gia",
  sections: {
    intro: true,
    stats: true,
    location: true,
    masterplan: true,
    gallery: true,
    architecture: true,
    lifestyle: true,
    education: true,
    amenities: true,
    residences: true,
    videoDuo: true,
    investment: true,
    documents: true,
    legal: true,
  },

  hero: {
    eyebrow: { vi: "Dự án do Base Land phân phối", en: "Marketed by Base Land" },
    addressLine: { vi: "Đường Tây Sơn · Phường Quy Nhơn Nam", en: "Tây Sơn Street · Quy Nhơn Nam Ward" },
    subhead: {
      vi: "283 căn liền kề, shophouse và một khu đô thị nơi sống, kinh doanh và học tập cùng tồn tại — ngay phía Tây Quy Nhơn.",
      en: "283 townhouses and shophouses within a low-rise urban community where living, business and education meet — west of Quy Nhon.",
    },
    ctaExploreLabel: { vi: "Khám phá dự án", en: "Explore the project" },
    ctaExploreHref: "#statement",
    ctaConsultLabel: { vi: "Nhận tư vấn", en: "Request consultation" },
    ctaConsultHref: "#lead",
    navLabel: "Phú Gia Royal Park",
    placeholderLabel: {
      vi: "Phối cảnh tổng thể Phú Gia Royal Park, ảnh aerial/masterplan",
      en: "Phú Gia Royal Park — aerial / master plan rendering",
    },
  },

  intro: {
    eyebrow: { vi: "Tuyên ngôn dự án", en: "Project statement" },
    headline: {
      vi: "Không chỉ là một căn nhà — là một khu đô thị để sống, kinh doanh và học tập.",
      en: "Not just a home — an urban community to live, work and learn in.",
    },
    body: {
      vi: "Phú Gia Royal Park là tổ hợp khu dân cư, dịch vụ và giáo dục quy mô 6,3 ha phía Tây Quy Nhơn, nơi 283 căn liền kề, 2 trung tâm dịch vụ – thương mại và một trường học liên cấp cùng tồn tại trong một cộng đồng đô thị thấp tầng.",
      en: "Phú Gia Royal Park is a 6.3-hectare residential, commercial and education complex west of Quy Nhon, where 283 townhouses, two commercial-service centers and an inter-level school coexist within one low-rise urban community.",
    },
  },

  stats: {
    items: [
      {
        value: "6.3",
        label: { vi: "Ha quy mô dự án", en: "Hectares" },
        note: { vi: "Tổng diện tích quy hoạch toàn dự án.", en: "Total planned area of the project." },
      },
      {
        value: "283",
        label: { vi: "Căn liền kề", en: "Homes" },
        note: {
          vi: "Nhà phố liên kế, hoàn thiện mặt ngoài, bàn giao thô.",
          en: "Terraced townhouses, exterior-finished, shell-and-core handover.",
        },
        animated: true,
      },
      {
        value: "2",
        label: { vi: "Trung tâm dịch vụ – thương mại", en: "Commercial centers" },
        note: { vi: "Phục vụ nhu cầu thương mại hằng ngày của cư dân.", en: "Serving residents' everyday commercial needs." },
        animated: true,
      },
      {
        value: "4000",
        label: { vi: "m² trường học liên cấp", en: "m² inter-level school" },
        note: { vi: "Hệ thống giáo dục nằm ngay trong lòng dự án.", en: "A school system within the project itself." },
        animated: true,
      },
    ],
  },

  location: {
    eyebrow: { vi: "Vị trí", en: "Location" },
    headline: { vi: "Thành phố quanh bạn", en: "The city around you" },
    body: {
      vi: "Phú Gia Royal Park nằm ngay phía Tây đường Tây Sơn, kết nối nhanh tới trường đại học, quảng trường trung tâm, bệnh viện và bờ biển Quy Nhơn — không phải một khu đô thị biệt lập, mà là một phần của nhịp sống thành phố.",
      en: "Phú Gia Royal Park sits just west of Tây Sơn street, minutes from the university, the city's central square, the hospital and Quy Nhon's beach — not an isolated development, but part of the city's own rhythm.",
    },
    mapPlaceholderLabel: { vi: "Bản đồ vị trí Phú Gia Royal Park", en: "Location map — Phú Gia Royal Park" },
    benefits: [],
    journey: [
      { tier: { vi: "1 KM", en: "1 KM" }, landmarks: [{ vi: "Bệnh viện tỉnh", en: "Provincial hospital" }] },
      { tier: { vi: "1.5 KM", en: "1.5 KM" }, landmarks: [{ vi: "Trường Đại học Quy Nhơn", en: "Quy Nhon University" }] },
      {
        tier: { vi: "2 KM", en: "2 KM" },
        landmarks: [{ vi: "Quảng trường Nguyễn Tất Thành", en: "Nguyen Tat Thanh Square" }],
      },
      { tier: { vi: "2.2 KM", en: "2.2 KM" }, landmarks: [{ vi: "Biển Quy Nhơn", en: "Quy Nhon beach" }] },
      {
        tier: { vi: "~30 KM", en: "~30 KM" },
        landmarks: [{ vi: "Sân bay quốc tế Phù Cát", en: "Phu Cat International Airport" }],
      },
    ],
  },

  masterplan: {
    eyebrow: { vi: "Mặt bằng tổng thể", en: "Master Plan" },
    headline: { vi: "Một khu đô thị để khám phá, không chỉ để ở", en: "An urban community to explore, not just to live in" },
    body: {
      vi: "Trục thương mại, khu liền kề nội khu, trường học và hệ thống tiện ích xanh được quy hoạch thành từng khu chức năng rõ ràng trong 6,3 ha của dự án.",
      en: "The commercial spine, internal townhouse clusters, the school and the green amenity system are laid out as distinct functional zones across the project's 6.3 hectares.",
    },
    placeholderLabel: { vi: "Mặt bằng tổng thể Phú Gia Royal Park", en: "Phú Gia Royal Park master plan" },
    zones: [
      {
        key: "truc-thuong-mai",
        name: { vi: "Trục Thương Mại Tây Sơn", en: "Tây Sơn Commercial Spine" },
        tag: { vi: "Shophouse mặt tiền", en: "Frontage shophouse" },
        desc: {
          vi: "Dãy shophouse mặt tiền Quốc lộ Tây Sơn — khu vực kinh doanh sầm uất nhất dự án.",
          en: "A row of shophouses fronting Tây Sơn national road — the project's busiest commercial stretch.",
        },
      },
      {
        key: "khu-lien-ke-noi-khu",
        name: { vi: "Khu Liền Kề Nội Khu", en: "Internal Townhouse Cluster" },
        tag: { vi: "An cư riêng tư", en: "Private residential" },
        desc: {
          vi: "Nằm sâu bên trong dự án, tách khỏi tiếng ồn trục chính — không gian sống yên tĩnh cho gia đình.",
          en: "Set deep within the project, away from the main road's noise — a quiet living space for families.",
        },
      },
      {
        key: "trung-tam-dich-vu",
        name: { vi: "2 Trung Tâm Dịch Vụ – Thương Mại", en: "2 Commercial-Service Centers" },
        tag: { vi: "Tiện ích hằng ngày", en: "Everyday amenities" },
        desc: {
          vi: "Điểm mua sắm và dịch vụ nội khu, phục vụ nhu cầu hằng ngày của cư dân.",
          en: "Internal shopping and service points for residents' daily needs.",
        },
      },
      {
        key: "truong-hoc-lien-cap",
        name: { vi: "Trường Học Liên Cấp (~4.000 m²)", en: "Inter-Level School (~4,000 m²)" },
        tag: { vi: "Giáo dục", en: "Education" },
        desc: {
          vi: "Hệ thống giáo dục nằm ngay trong lòng khu đô thị, không cần một hành trình xa.",
          en: "A school system within the community itself — no long commute required.",
        },
      },
      {
        key: "he-thong-tien-ich-xanh",
        name: { vi: "Hệ Thống Tiện Ích Xanh", en: "Green Amenity System" },
        tag: { vi: "Công viên · Sân chơi · Hồ bơi", en: "Park · Playground · Pool" },
        desc: {
          vi: "Công viên cảnh quan, sân chơi trẻ em, hồ bơi và phòng gym phục vụ đời sống hằng ngày.",
          en: "A landscaped park, kids' playground, pool and gym supporting everyday life.",
        },
      },
    ],
    ctaLabel: { vi: "Nhận mặt bằng", en: "Request floor plan" },
    ctaHref: "#lead",
  },

  gallery: {
    intro: {
      vi: "Hình ảnh thực tế công trường và phối cảnh dự án sẽ được cập nhật liên tục trong quá trình triển khai.",
      en: "Real construction photos and renderings will be updated continuously as the project progresses.",
    },
    items: [
      {
        key: "tong-the",
        name: { vi: "Phối cảnh tổng thể", en: "Overall rendering" },
        desc: {
          vi: "Toàn cảnh khu đô thị thấp tầng, cây xanh và trục nội khu.",
          en: "A wide view of the low-rise community, its greenery and internal roads.",
        },
      },
      {
        key: "truc-tay-son",
        name: { vi: "Trục thương mại Tây Sơn", en: "Tây Sơn commercial frontage" },
        desc: {
          vi: "Dãy shophouse mặt tiền Quốc lộ Tây Sơn.",
          en: "The row of shophouses facing Tây Sơn national road.",
        },
      },
      {
        key: "khu-lien-ke",
        name: { vi: "Khu liền kề nội khu", en: "Internal townhouse cluster" },
        desc: { vi: "Không gian an cư yên tĩnh bên trong dự án.", en: "A quiet residential space within the project." },
      },
      {
        key: "cong-vien",
        name: { vi: "Công viên & mảng xanh", en: "Park & green space" },
        desc: { vi: "Khu vực cây xanh và sân chơi trung tâm.", en: "The central greenery and playground area." },
      },
    ],
  },

  architecture: {
    eyebrow: { vi: "Phố thương mại", en: "Commercial Street" },
    headline: { vi: "Một khu phố đang hình thành trên trục Tây Sơn", en: "A neighborhood taking shape along Tây Sơn" },
    body: {
      vi: "Shophouse mặt tiền, vỉa hè sinh hoạt và dòng người qua lại mỗi ngày — thương mại ở đây không phải một tiện ích, mà là một phần của đời sống khu đô thị.",
      en: "Frontage shophouses, an active sidewalk and daily foot traffic — commerce here isn't an amenity, it's part of the community's everyday life.",
    },
    placeholderLabel: { vi: "Phối cảnh mặt tiền Tây Sơn, ảnh full-bleed", en: "Tây Sơn frontage rendering — full-bleed photo" },
    tone: "charcoal",
    navLabel: { vi: "Phố thương mại", en: "Commercial Street" },
  },

  lifestyle: {
    eyebrow: { vi: "Một ngày ở Phú Gia Royal Park", en: "A day at Phú Gia Royal Park" },
    headline: {
      vi: "Sống, học tập và kinh doanh trong cùng một nhịp ngày",
      en: "Living, learning and doing business in the same daily rhythm",
    },
    chapters: [
      {
        slotId: "phugia-day-morning",
        time: "06:30",
        label: "Morning",
        statement: {
          vi: "Buổi sáng bắt đầu trong sân nhà, trước khi các con đến trường.",
          en: "The morning begins in the courtyard, before the children head to school.",
        },
      },
      {
        slotId: "phugia-day-school",
        time: "07:00",
        label: "School",
        statement: {
          vi: "Trường học liên cấp ngay trong khu, không cần một hành trình dài.",
          en: "The inter-level school sits within the community — no long commute needed.",
        },
      },
      {
        slotId: "phugia-day-work",
        time: "08:00",
        label: "Work",
        statement: {
          vi: "Tầng trệt shophouse mở cửa, một ngày kinh doanh bắt đầu ngay dưới nhà.",
          en: "The shophouse ground floor opens — a day of business begins right downstairs.",
        },
      },
      {
        slotId: "phugia-day-shop",
        time: "12:00",
        label: "Shop",
        statement: {
          vi: "Buổi trưa ghé cửa hàng tiện lợi hoặc quán quen ngay trong khu.",
          en: "At midday, a quick stop at the convenience store or a familiar spot nearby.",
        },
      },
      {
        slotId: "phugia-day-park",
        time: "17:00",
        label: "Park",
        statement: {
          vi: "Chiều muộn, công viên và sân chơi đầy tiếng trẻ con.",
          en: "Late afternoon, the park and playground fill with children's voices.",
        },
      },
      {
        slotId: "phugia-day-home",
        time: "19:00",
        label: "Home",
        statement: {
          vi: "Bữa tối trên tầng sinh hoạt riêng, tách biệt khỏi không gian kinh doanh.",
          en: "Dinner upstairs in the private living floor, separate from the business space below.",
        },
      },
      {
        slotId: "phugia-day-community",
        time: "20:30",
        label: "Community",
        statement: {
          vi: "Buổi tối, clubhouse và không gian chung là nơi hàng xóm gặp nhau.",
          en: "In the evening, the clubhouse and shared spaces are where neighbors meet.",
        },
      },
    ],
  },

  education: {
    eyebrow: { vi: "Giáo dục", en: "Education" },
    headline: { vi: "Học tập trong lòng cộng đồng", en: "Learn within the community" },
    body: {
      vi: "Một trường học liên cấp rộng khoảng 4.000 m² nằm ngay trong dự án — để việc học của con không còn là một hành trình mỗi ngày.",
      en: "An inter-level school of roughly 4,000 sqm sits within the project itself — so a child's education is no longer a daily commute.",
    },
    placeholderLabel: {
      vi: "Trường học liên cấp Phú Gia Royal Park",
      en: "Phú Gia Royal Park inter-level school",
    },
    tone: "charcoal",
    navLabel: { vi: "Giáo dục", en: "Education" },
  },

  amenities: {
    eyebrow: { vi: "Tiện ích", en: "Amenities" },
    headline: { vi: "Năm nhóm không gian cho một nhịp sống hằng ngày", en: "Five amenity groups for everyday living" },
    chapters: [
      {
        slotId: "phugia-amen-green",
        kicker: "GREEN",
        title: { vi: "Công viên cảnh quan hơn 2.000 m²", en: "A 2,000+ sqm landscaped park" },
        desc: {
          vi: "Không gian cây xanh trung tâm, nơi cư dân thư giãn và vận động mỗi ngày.",
          en: "A central green space where residents relax and move through the day.",
        },
        items: [
          { vi: "Công viên cảnh quan", en: "Landscaped park" },
          { vi: "Cây xanh nội khu", en: "Internal greenery" },
        ],
        direction: "row",
      },
      {
        slotId: "phugia-amen-family",
        kicker: "FAMILY",
        title: { vi: "Sân chơi chủ đề cho trẻ em", en: "A themed play area for children" },
        desc: {
          vi: "Khu vui chơi liên hoàn rộng 100 m², thiết kế an toàn cho mọi lứa tuổi.",
          en: "A 100 sqm connected play area, designed to be safe for every age.",
        },
        items: [{ vi: "Sân chơi trẻ em", en: "Kids' playground" }],
        direction: "row-reverse",
      },
      {
        slotId: "phugia-amen-wellness",
        kicker: "WELLNESS",
        title: { vi: "Gym và hồ bơi ngay trong khu", en: "A gym and pool within the community" },
        desc: {
          vi: "Phòng gym và hồ bơi phục vụ nhu cầu vận động, thư giãn hằng ngày của cư dân.",
          en: "A gym and pool for residents' daily exercise and relaxation.",
        },
        items: [
          { vi: "Phòng gym", en: "Gym" },
          { vi: "Hồ bơi", en: "Swimming pool" },
        ],
        direction: "row",
      },
      {
        slotId: "phugia-amen-community",
        kicker: "COMMUNITY",
        title: { vi: "Clubhouse và an ninh 3 lớp", en: "A clubhouse and 3-layer security" },
        desc: {
          vi: "Không gian sinh hoạt cộng đồng cùng hệ thống camera, chốt bảo vệ và kiểm soát ra vào.",
          en: "A community gathering space alongside camera, guard-post and access-control security.",
        },
        items: [
          { vi: "Clubhouse", en: "Clubhouse" },
          { vi: "An ninh 24/7", en: "24/7 security" },
        ],
        direction: "row-reverse",
      },
      {
        slotId: "phugia-amen-commerce",
        kicker: "COMMERCE",
        title: { vi: "Mua sắm và ăn uống ngay dưới nhà", en: "Shopping and dining at your doorstep" },
        desc: {
          vi: "Khu mua sắm, cửa hàng tiện lợi, quán cà phê và nhà hàng phục vụ nhu cầu hằng ngày.",
          en: "Retail, convenience stores, cafés and restaurants for everyday needs.",
        },
        items: [
          { vi: "Cửa hàng tiện lợi", en: "Convenience stores" },
          { vi: "Cà phê & nhà hàng", en: "Cafés & restaurants" },
        ],
        direction: "row",
      },
    ],
  },

  residences: {
    eyebrow: { vi: "Sản phẩm", en: "Product Types" },
    headline: { vi: "Ba loại hình, ba cách sống và kinh doanh", en: "Three product types, three ways to live and do business" },
    body: {
      vi: "Chọn một loại hình để xem vị trí, diện tích, mặt tiền và cách sử dụng phù hợp.",
      en: "Select a product type to see its position, area, frontage and how it's typically used.",
    },
    unitTypeAria: { vi: "Loại hình sản phẩm", en: "Product type" },
    nfaLabel: { vi: "Diện tích đất", en: "Land Area" },
    nsaLabel: { vi: "Mặt tiền · Số tầng", en: "Frontage · Floors" },
    unitCtaLabel: { vi: "Nhận tư vấn", en: "Request consultation" },
    unitCtaHref: "#lead",
    unitCtaFloorplanLabel: { vi: "Nhận mặt bằng", en: "Request floor plan" },
    unitCtaFloorplanHref: "#lead",
    footnote: {
      vi: "Thông tin diện tích tham khảo theo công bố ban đầu của dự án, cần đối chiếu lại với hồ sơ pháp lý và hợp đồng mua bán chính thức.",
      en: "Area figures are indicative per the project's initial disclosure and should be verified against the official legal file and sale contract.",
    },
    items: [
      {
        key: "shophouse-mat-tien",
        name: { vi: "Shophouse Mặt Tiền Tây Sơn", en: "Tây Sơn Frontage Shophouse" },
        tag: { vi: "SHOPHOUSE · Live + Business — Lô 1-2-6", en: "SHOPHOUSE · Live + Business — Plots 1-2-6" },
        nfa: "60 – 144 m²",
        nsa: "4 tầng + lửng + sân thượng",
        desc: {
          vi: "Vị trí mặt tiền Quốc lộ Tây Sơn — diện tích 60-144 m², thiết kế 4 tầng có tầng lửng và sân thượng, phù hợp kinh doanh F&B, showroom hoặc văn phòng đại diện.",
          en: "A frontage position directly on Tây Sơn national road — 60-144 sqm, 4 floors with a mezzanine and rooftop, suited to F&B, showrooms or representative offices.",
        },
        ctaLabel: { vi: "Tư vấn Shophouse", en: "Inquire about Shophouse" },
      },
      {
        key: "shophouse-noi-khu",
        name: { vi: "Shophouse Nội Khu", en: "Internal Shophouse" },
        tag: { vi: "INTERNAL SHOPHOUSE · Live + Serve", en: "INTERNAL SHOPHOUSE · Live + Serve" },
        nfa: "70 – 130 m²",
        nsa: "Mặt tiền 5m · 4 tầng + sân thượng",
        desc: {
          vi: "Nằm tại khu vực trung tâm nội khu, tiếp cận tiện ích công cộng và dòng cư dân ổn định — phù hợp dịch vụ, nhà hàng, cửa hàng nội bộ.",
          en: "Located at the community's internal center, close to public amenities and a steady resident flow — suited to services, restaurants and neighborhood retail.",
        },
        ctaLabel: { vi: "Tư vấn Shophouse", en: "Inquire about Shophouse" },
      },
      {
        key: "lien-ke-noi-khu",
        name: { vi: "Liền Kề Nội Khu", en: "Townhouse" },
        tag: { vi: "TOWNHOUSE · Live + Private", en: "TOWNHOUSE · Live + Private" },
        nfa: "58 – 135 m²",
        nsa: "Mặt tiền 5m · 4 tầng + sân thượng",
        desc: {
          vi: "Nằm sâu trong nội khu, tránh xa tiếng ồn trục chính — không gian an cư riêng tư cho gia đình nhiều thế hệ, có sân thượng thư giãn ngoài trời.",
          en: "Set deep within the community, away from the main road's noise — a private residential layout for multi-generation families, with an open-air rooftop terrace.",
        },
        ctaLabel: { vi: "Tư vấn Liền kề", en: "Inquire about Townhouse" },
      },
    ],
  },

  videoDuo: {
    eyebrow: { vi: "Câu chuyện từ dự án", en: "Stories From The Project" },
    headline: {
      vi: "Những điều đáng biết trước khi chọn sản phẩm",
      en: "What's worth knowing before you choose a product type",
    },
    items: [
      {
        key: "construction-progress",
        contentType: "project-update",
        title: { vi: "Phú Gia Royal Park đang xây đến đâu?", en: "How far along is Phú Gia Royal Park?" },
        description: {
          vi: "Cập nhật thực tế tiến độ thi công hạ tầng và cảnh quan nội khu.",
          en: "A real look at infrastructure and landscape progress within the community.",
        },
        topicSlug: "construction-progress",
        prefillNeed: "Tìm hiểu dự án",
        enabled: true,
        sortOrder: 1,
      },
      {
        key: "shophouse-vs-lien-ke",
        contentType: "product-guide",
        title: { vi: "Nên chọn Shophouse hay Liền Kề?", en: "Shophouse or Townhouse — which fits you?" },
        description: {
          vi: "So sánh vị trí, mục đích sử dụng và khả năng kinh doanh giữa Shophouse và Liền Kề.",
          en: "Comparing position, use case and business potential between Shophouse and Townhouse.",
        },
        topicSlug: "shophouse-vs-lien-ke",
        prefillNeed: "Đầu tư",
        enabled: true,
        sortOrder: 2,
      },
    ],
  },

  investment: {
    eyebrow: { vi: "Giá trị", en: "Value" },
    navLabel: { vi: "Giá trị", en: "Value" },
    headline: { vi: "Những yếu tố có thể kiểm chứng", en: "The factors you can verify" },
    headlineMaxWidth: { vi: "18ch", en: "26ch" },
    points: [
      {
        num: "01",
        title: { vi: "Vị trí mặt tiền Tây Sơn", en: "A Tây Sơn frontage location" },
        desc: {
          vi: "Nằm trên trục Quốc lộ Tây Sơn, tuyến giao thông chính của khu vực phía Tây Quy Nhơn.",
          en: "Positioned on Tây Sơn national road, the main traffic route through western Quy Nhon.",
        },
      },
      {
        num: "02",
        title: { vi: "Sản phẩm thấp tầng giới hạn", en: "A limited-supply low-rise product" },
        desc: {
          vi: "Chỉ 283 căn liền kề trong toàn dự án — quy mô giới hạn trong khu vực đang đô thị hoá.",
          en: "Only 283 townhouses in the entire project — a limited supply in a fast-urbanizing area.",
        },
      },
      {
        num: "03",
        title: { vi: "Hạ tầng giáo dục & thương mại sẵn có", en: "Built-in education & commercial infrastructure" },
        desc: {
          vi: "Trường học liên cấp và 2 trung tâm dịch vụ – thương mại nằm ngay trong dự án, không phụ thuộc quy hoạch tương lai.",
          en: "An inter-level school and two commercial-service centers sit within the project itself, independent of future planning promises.",
        },
      },
      {
        num: "04",
        title: { vi: "Pháp lý đã có tiến triển xác nhận", en: "Confirmed legal progress" },
        desc: {
          vi: "Dự án đã được chấp thuận chủ trương đầu tư, phê duyệt quy hoạch 1/500 và cấp giấy chứng nhận quyền sử dụng đất cho 100% diện tích.",
          en: "The project has investment policy approval, an approved 1/500 plan, and a land-use rights certificate covering 100% of its area.",
        },
      },
    ],
    pricingTitle: { vi: "Bảng giá & chính sách bán hàng", en: "Pricing & sales policy" },
    pricingBody: {
      vi: "Chỉ phát hành theo thông tin chính thức từ chủ đầu tư. Base Land Quy Nhơn gửi bảng giá và chính sách mới nhất khi có cập nhật.",
      en: "Released only from official developer information. Base Land Quy Nhon shares the latest pricing and policy as updates become available.",
    },
    pricingCtaLabel: { vi: "Nhận bảng giá", en: "Request latest pricing" },
    pricingCtaHref: "#lead",
  },

  documents: {
    eyebrow: { vi: "Thông tin dự án", en: "Project Information" },
    headline: { vi: "Kiểm chứng thông tin trước khi quyết định", en: "Verify the information before you decide" },
    ctaLabel: { vi: "Nhận chính sách mới nhất →", en: "Request latest sales policy →" },
    ctaHref: "#lead",
    items: [
      {
        name: { vi: "Brochure dự án", en: "Project brochure" },
        note: { vi: "Tổng quan Phú Gia Royal Park, vị trí và tiện ích", en: "Overview of Phú Gia Royal Park, location and amenities" },
      },
      {
        name: { vi: "Mặt bằng tổng thể & sản phẩm", en: "Master plan & product types" },
        note: {
          vi: "Sơ đồ phân khu, shophouse và liền kề nội khu",
          en: "Zoning diagram, shophouse and internal townhouse layout",
        },
      },
      {
        name: { vi: "Thông tin pháp lý", en: "Legal information" },
        note: {
          vi: "Chấp thuận chủ trương đầu tư, phê duyệt 1/500, giấy chứng nhận quyền sử dụng đất (100% diện tích) — theo công bố của chủ đầu tư",
          en: "Investment policy approval, approved 1/500 plan, land-use rights certificate (100% of area) — as disclosed by the developer",
        },
      },
      {
        name: { vi: "Chính sách bán hàng mới nhất", en: "Latest sales policy" },
        note: {
          vi: "Cập nhật theo thông báo chính thức tại từng thời điểm mở bán",
          en: "Updated per official announcements at each sales phase",
        },
      },
    ],
  },

  legal: {
    body: {
      vi: "Phú Gia Royal Park được Base Land Quy Nhơn tư vấn và hỗ trợ khách hàng — đội ngũ tại địa phương, làm việc với dữ liệu đã xác minh từ chủ đầu tư.",
      en: "Phú Gia Royal Park is advised and supported by Base Land Quy Nhon — a local team working from data verified with the developer.",
    },
    points: [
      {
        label: { vi: "Tư vấn tại Quy Nhơn", en: "Advisors based in Quy Nhon" },
        desc: {
          vi: "Đội ngũ làm việc trực tiếp tại thành phố, đi thực địa cùng khách hàng.",
          en: "A team working directly in the city, visiting the site together with clients.",
        },
      },
      {
        label: { vi: "Thông tin minh bạch", en: "Transparent information" },
        desc: {
          vi: "Chỉ công bố dữ liệu đã được xác nhận từ chủ đầu tư và tài liệu chính thức.",
          en: "Only data confirmed by the developer and official documentation is disclosed.",
        },
      },
      {
        label: { vi: "Đồng hành dài hạn", en: "Long-term support" },
        desc: {
          vi: "Hỗ trợ xuyên suốt từ tìm hiểu đến khi hoàn tất và bàn giao.",
          en: "Support throughout, from initial research to completion and handover.",
        },
      },
    ],
  },

  cta: {
    eyebrow: { vi: "Liên hệ", en: "Contact" },
    headline: { vi: "Đăng ký nhận bảng giá Phú Gia Royal Park", en: "Register to receive Phú Gia Royal Park pricing" },
    headlineMaxWidth: { vi: "20ch", en: "30ch" },
    body: {
      vi: "Chuyên viên Base Land Quy Nhơn sẽ liên hệ, gửi bảng giá, mặt bằng và chính sách bán hàng ngay khi được chủ đầu tư công bố chính thức.",
      en: "A Base Land Quy Nhon advisor will contact you and share pricing, floor plans and sales policy as soon as the developer officially releases them.",
    },
    callNowLabel: { vi: "Gọi ngay", en: "Call now" },
    leadSource: "phu-gia-royal-park",
  },
};
