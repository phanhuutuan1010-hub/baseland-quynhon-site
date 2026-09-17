import type { ProjectDetailData } from "./types";

/**
 * SIMONA HEIGHTS — Gold × Art Deco × Quy Nhơn. Second full implementation
 * of the Project Detail Template (after Q'Terra), proving the template
 * scales to a project with its own visual identity via the --project-*
 * theme tokens (see [data-project-theme="simona"] in globals.css) — no
 * component fork.
 *
 * Verified against the official source before writing (per the brief's
 * mục 0): https://simonaheights.vn/, /gioi-thieu-34254, /mat-bang--342549,
 * /chinh-sach-ban-hang-252323 (fetched during this build). All copy below
 * is rewritten as short-form brand copy, not lifted verbatim from the
 * official site.
 *
 * `location.journey` (1/5/10/20/40-minute distance tiers) was corrected
 * after the first pass: the official site's own breakdown renders as an
 * infographic image, not text, so the initial text-based crawl missed the
 * 20-minute tier and several landmark names entirely. Re-checked against
 * that graphic directly — all five tiers and their landmarks below are
 * accurate to it.
 *
 * Still intentionally omitted for lack of verifiable data: a named
 * Partners/logo-wall section, and a dated Progress timeline beyond the
 * single confirmed "topped out" status folded into `legal.body` below.
 */
export const SIMONA_HEIGHTS_PROJECT: ProjectDetailData = {
  slug: "simona-heights",
  name: "SIMONA HEIGHTS",
  category: { vi: "Căn hộ cao cấp", en: "Luxury Apartments" },
  status: { vi: "Đang triển khai · Đã cất nóc", en: "In Progress · Topped Out" },
  theme: "simona",
  sections: {
    intro: true,
    stats: true,
    towers: true,
    location: true,
    gallery: false,
    architecture: true,
    materialStory: true,
    lifestyle: false,
    amenities: true,
    views: true,
    residences: true,
    videoDuo: true,
    floorPlans: true,
    investment: true,
    news: true,
    legal: true,
    documents: true,
  },

  hero: {
    eyebrow: { vi: "Dự án do Base Land phân phối", en: "Marketed by Base Land" },
    addressLine: { vi: "145A Trần Hưng Đạo · Quy Nhơn", en: "145A Tran Hung Dao · Quy Nhon" },
    subhead: {
      vi: "626 căn hộ hạng sang bên Vịnh Quy Nhơn — nơi Art Deco gặp ánh vàng hoàng hôn và mặt biển.",
      en: "626 luxury residences on Quy Nhon Bay — where Art Deco meets golden light and the sea.",
    },
    ctaExploreLabel: { vi: "Khám phá dự án", en: "Explore the Project" },
    ctaExploreHref: "#statement",
    ctaConsultLabel: { vi: "Nhận tư vấn", en: "Request Consultation" },
    ctaConsultHref: "#lead",
    navLabel: "Simona Heights",
    image: {
      src: "/images/simona/hero-twilight.jpg",
      alt: { vi: "Simona Heights lúc hoàng hôn, nhìn ra Vịnh Quy Nhơn", en: "Simona Heights at golden hour, facing Quy Nhon Bay" },
    },
  },

  intro: {
    eyebrow: { vi: "Tuyên ngôn dự án", en: "Project Statement" },
    headline: {
      vi: "Một biểu tượng vàng bên vịnh biển Quy Nhơn",
      en: "A gold landmark on Quy Nhon Bay",
    },
    body: {
      vi: "Simona Heights đứng tại giao lộ của phố cổ Trần Hưng Đạo và mặt Vịnh Quy Nhơn — nơi hai toà tháp The Sea và The Harbour vươn lên giữa ánh sáng thành phố và làn nước Đầm Thị Nại. Ngôn ngữ Art Deco, sắc vàng ấm và tầm nhìn hướng biển tạo nên một chốn an cư và nghỉ dưỡng hiếm có ngay trung tâm thành phố.",
      en: "Simona Heights stands where old Tran Hung Dao Street meets Quy Nhon Bay — two towers, The Sea and The Harbour, rising between city light and the waters of Thi Nai Lagoon. Art Deco form, warm gold, and an open view to the sea create a rare address for living and leisure at the city's center.",
    },
  },

  stats: {
    items: [
      {
        value: "7071",
        label: { vi: "m² diện tích dự án", en: "m² project area" },
        note: { vi: "Diện tích khu đất theo quy hoạch đã công bố.", en: "Land area per the published site plan." },
      },
      {
        value: "29",
        label: { vi: "tầng nổi mỗi toà", en: "floors per tower" },
        note: {
          vi: "The Sea và The Harbour đều cao 29 tầng nổi, 2 tầng hầm.",
          en: "Both The Sea and The Harbour rise 29 floors above ground, with 2 basement levels.",
        },
      },
      {
        value: "626",
        label: { vi: "căn hộ", en: "residences" },
        note: {
          vi: "Tổng số căn hộ tại hai toà, gồm cả Duplex và Penthouse.",
          en: "Total residences across both towers, including Duplex and Penthouse units.",
        },
        animated: true,
      },
      {
        value: "300",
        label: { vi: "m tới biển", en: "m to the sea" },
        note: {
          vi: "Khoảng cách gần nhất từ dự án tới bờ biển Quy Nhơn.",
          en: "The project's closest distance to Quy Nhon beach.",
        },
      },
    ],
  },

  towers: {
    eyebrow: { vi: "Hai toà tháp", en: "Two Towers" },
    headline: { vi: "The Sea & The Harbour — hai bản sắc, một chuẩn sống", en: "The Sea & The Harbour — two identities, one standard" },
    towers: [
      {
        key: "sea",
        name: { vi: "The Sea", en: "The Sea" },
        subtitle: { vi: "Tháp Tâm Vịnh", en: "Bay Heart Tower" },
        description: {
          vi: "Hướng thẳng ra Vịnh Quy Nhơn, The Sea dành cho những ai muốn thức dậy cùng ánh sáng mặt biển mỗi ngày.",
          en: "Facing directly onto Quy Nhon Bay, The Sea is for those who want to wake to the light of the sea every day.",
        },
        characteristics: [
          { vi: "Hướng biển", en: "Sea-facing" },
          { vi: "29 tầng", en: "29 floors" },
          { vi: "Duplex & Penthouse", en: "Duplex & Penthouse" },
        ],
        image: {
          src: "/images/simona/hero-twilight.jpg",
          alt: { vi: "Toà The Sea, Simona Heights", en: "The Sea tower, Simona Heights" },
        },
      },
      {
        key: "harbour",
        name: { vi: "The Harbour", en: "The Harbour" },
        subtitle: { vi: "Tháp Thiên Cảng", en: "Luxury Port Tower" },
        description: {
          vi: "Song hành cùng The Sea, The Harbour mở ra góc nhìn về phía Đầm Thị Nại và nhịp sống đô thị Trần Hưng Đạo.",
          en: "Standing alongside The Sea, The Harbour opens toward Thi Nai Lagoon and the urban rhythm of Tran Hung Dao street.",
        },
        characteristics: [
          { vi: "Hướng đầm & phố", en: "Lagoon & street view" },
          { vi: "29 tầng", en: "29 floors" },
          { vi: "Duplex & Penthouse", en: "Duplex & Penthouse" },
        ],
        // No dedicated exterior render distinguishing The Harbour from The
        // Sea was in the curated asset set (the official renders show both
        // towers together as one massing) — placeholder rather than reuse
        // the same photo twice under two different names.
        placeholderLabel: { vi: "Ảnh riêng toà The Harbour — cần bổ sung", en: "Dedicated The Harbour photo — to be added" },
      },
    ],
  },

  location: {
    eyebrow: { vi: "Vị trí", en: "Location" },
    headline: { vi: "Một toạ độ trung tâm, mọi hướng đều gần", en: "A central address, close to everywhere" },
    body: {
      vi: "145A Trần Hưng Đạo — hai mặt tiền Trần Hưng Đạo và Trần Bình Trọng, cách bờ biển Quy Nhơn chỉ 300m, nhìn ra Vịnh Quy Nhơn và Đầm Thị Nại.",
      en: "145A Tran Hung Dao — fronting both Tran Hung Dao and Tran Binh Trong streets, only 300m from Quy Nhon beach, facing Quy Nhon Bay and Thi Nai Lagoon.",
    },
    mapImage: {
      src: "/images/simona/location-map.jpg",
      alt: { vi: "Bản đồ vị trí Simona Heights tại Quy Nhơn", en: "Simona Heights location map in Quy Nhon" },
    },
    benefits: [],
    // Corrected against the official site's own "journey" road graphic
    // (an image, not text — missed on the first text-based crawl, hence
    // the original 4-tier version here). Five tiers, verified landmark
    // names per tier, matching the graphic exactly.
    journey: [
      {
        tier: { vi: "1 phút", en: "1 minute" },
        landmarks: [
          { vi: "Bệnh viện đa khoa Quy Nhơn", en: "Quy Nhon General Hospital" },
          { vi: "Phố cổ Quy Nhơn", en: "Quy Nhon Old Town" },
          { vi: "Bãi biển & Quảng trường biển", en: "Beach & Seaside Square" },
          { vi: "Công viên & Hồ sinh thái", en: "Park & Ecological Lake" },
        ],
      },
      {
        tier: { vi: "5 phút", en: "5 minutes" },
        landmarks: [
          { vi: "Quảng trường Nguyễn Tất Thành", en: "Nguyen Tat Thanh Square" },
          { vi: "Quảng trường Quy Nhơn", en: "Quy Nhon Square" },
          { vi: "Đại học Quy Nhơn", en: "Quy Nhon University" },
          { vi: "Sân vận động Quy Nhơn", en: "Quy Nhon Stadium" },
          { vi: "GO! Quy Nhơn", en: "GO! Quy Nhon" },
        ],
      },
      {
        tier: { vi: "10 phút", en: "10 minutes" },
        landmarks: [
          { vi: "Đầm Thị Nại", en: "Thi Nai Lagoon" },
          { vi: "Ghềnh Ráng Tiên Sa", en: "Ghenh Rang Tien Sa" },
          { vi: "Bãi Trứng — Bãi Hoàng Hậu", en: "Bai Trung — Bai Hoang Hau Beach" },
        ],
      },
      {
        tier: { vi: "20 phút", en: "20 minutes" },
        landmarks: [
          { vi: "Eo Gió", en: "Eo Gio" },
          { vi: "Bãi Kỳ Co", en: "Ky Co Beach" },
          { vi: "Khu du lịch dã ngoại Trung Lương", en: "Trung Luong Eco-Tourism Area" },
        ],
      },
      {
        tier: { vi: "40 phút", en: "40 minutes" },
        landmarks: [{ vi: "Sân bay Phù Cát", en: "Phu Cat Airport" }],
      },
    ],
  },

  architecture: {
    eyebrow: { vi: "Kiến trúc Art Deco", en: "Art Deco Architecture" },
    headline: { vi: "Đường nét hình học, ánh sáng và vàng kim", en: "Geometric form, light, and gold" },
    body: {
      vi: "Từ khối hình đối xứng đến từng đường chỉ vàng, Simona Heights diễn giải lại tinh thần Art Deco giữa lòng thành phố biển — nơi mỗi mặt đứng được vẽ nên bởi ánh nắng.",
      en: "From symmetric massing to fine gold linework, Simona Heights reinterprets the Art Deco spirit at the heart of this coastal city — every façade shaped by the light that falls on it.",
    },
    image: {
      src: "/images/simona/aerial-context.jpg",
      alt: { vi: "Toàn cảnh Simona Heights và khu vực lân cận", en: "Simona Heights and its surroundings, aerial view" },
    },
    navLabel: { vi: "Kiến trúc", en: "Architecture" },
  },

  materialStory: {
    kicker: { vi: "Nội thất", en: "Interior" },
    headline: { vi: "Art Deco Living — vàng, gỗ tối và đá", en: "Art Deco Living — gold, dark wood and stone" },
    body: {
      vi: "Căn hộ mẫu Simona Heights phối vật liệu ấm: gỗ tối, đá vân, ánh đồng và các chi tiết hình học Art Deco — tạo nên một không gian sống sang trọng mà vẫn gần gũi.",
      en: "The Simona Heights show unit blends warm materials — dark wood, veined stone, brass accents and Art Deco geometry — into a home that feels both luxurious and lived-in.",
    },
    swatches: [
      // ink is light (Ivory), not dark: --project-accent was darkened for
      // WCAG-AA text contrast elsewhere on the page (Dark Antique Gold,
      // #6b532e — see globals.css), so this swatch's own background is now
      // dark enough to need light ink instead of the original dark ink.
      { name: { vi: "Vàng", en: "Gold" }, hex: "var(--project-accent)", ink: "#f7f1e6" },
      { name: { vi: "Gỗ tối", en: "Dark Wood" }, hex: "#3b2a1d", ink: "#f7f1e6" },
      { name: { vi: "Đá", en: "Stone" }, hex: "#8a8580", ink: "#201b15" },
      { name: { vi: "Ngà", en: "Ivory" }, hex: "#f7f1e6", ink: "#201b15" },
    ],
    galleryImages: [
      { label: { vi: "Phòng ngủ căn 1PN", en: "1-bedroom bedroom" }, src: "/images/simona/interiors/1pn-a.jpg" },
      { label: { vi: "Không gian sống căn 2PN", en: "2-bedroom living space" }, src: "/images/simona/interiors/2pn-b.jpg" },
      { label: { vi: "Phòng ngủ căn 3PN", en: "3-bedroom bedroom" }, src: "/images/simona/interiors/3pn-a.jpg" },
    ],
  },

  amenities: {
    eyebrow: { vi: "Tiện ích", en: "Amenities" },
    headline: { vi: "Năm không gian, một chuẩn sống thượng lưu", en: "Five spaces, one standard of living" },
    chapters: [
      {
        slotId: "simona-amen-wellness",
        kicker: "Wellness",
        title: { vi: "Chăm sóc cơ thể và tinh thần", en: "Care for body and mind" },
        desc: {
          vi: "Khu vực Jacuzzi và gym ngoài trời dành cho cư dân muốn giữ nhịp sống lành mạnh ngay trong khuôn viên dự án.",
          en: "A Jacuzzi area and outdoor gym for residents who want to keep an active, healthy rhythm right within the development.",
        },
        items: [
          { vi: "Jacuzzi", en: "Jacuzzi" },
          { vi: "Gym ngoài trời", en: "Outdoor gym" },
        ],
        direction: "row",
        image: {
          src: "/images/simona/amenities/jacuzzi.jpg",
          alt: { vi: "Khu Jacuzzi Simona Heights", en: "Simona Heights Jacuzzi area" },
        },
      },
      {
        slotId: "simona-amen-social",
        kicker: "Social",
        title: { vi: "Không gian gặp gỡ và thư giãn", en: "A space to gather and unwind" },
        desc: {
          vi: "Garden Lounge, Art Bridge và Skywalk kết nối cư dân với nhau và với cảnh quan xanh mát của dự án.",
          en: "The Garden Lounge, Art Bridge and Skywalk connect residents with each other and with the development's landscaped greenery.",
        },
        items: [
          { vi: "Garden Lounge", en: "Garden Lounge" },
          { vi: "Art Bridge", en: "Art Bridge" },
          { vi: "Skywalk", en: "Skywalk" },
        ],
        direction: "row-reverse",
        image: {
          src: "/images/simona/amenities/garden-lounge.jpg",
          alt: { vi: "Garden Lounge Simona Heights", en: "Simona Heights Garden Lounge" },
        },
      },
      {
        slotId: "simona-amen-leisure",
        kicker: "Leisure",
        title: { vi: "Hồ bơi hướng biển", en: "Sea-facing pool deck" },
        desc: {
          vi: "Hồ bơi vô cực và khu pool deck nhìn thẳng ra Vịnh Quy Nhơn — điểm nghỉ dưỡng trung tâm của dự án.",
          en: "An infinity pool and pool deck facing directly onto Quy Nhon Bay — the development's central resort moment.",
        },
        items: [
          { vi: "Hồ bơi vô cực", en: "Infinity pool" },
          { vi: "Pool deck", en: "Pool deck" },
        ],
        direction: "row",
        image: {
          src: "/images/simona/amenities/pool-deck.jpg",
          alt: { vi: "Hồ bơi Simona Heights hướng biển", en: "Simona Heights sea-facing pool" },
        },
      },
      {
        slotId: "simona-amen-family",
        kicker: "Family",
        title: { vi: "Không gian riêng cho gia đình", en: "Dedicated space for families" },
        desc: {
          vi: "Hồ bơi trẻ em, khu vui chơi và không gian dành cho phụ huynh — thiết kế riêng cho các gia đình có con nhỏ.",
          en: "A kids' pool, playground and parenting area — designed specifically for families with young children.",
        },
        items: [
          { vi: "Hồ bơi trẻ em", en: "Kids' pool" },
          { vi: "Khu vui chơi trẻ em", en: "Kids' playground" },
          { vi: "Khu vực phụ huynh", en: "Parenting area" },
        ],
        direction: "row-reverse",
        image: {
          src: "/images/simona/amenities/kid-pool.jpg",
          alt: { vi: "Hồ bơi trẻ em Simona Heights", en: "Simona Heights kids' pool" },
        },
      },
      {
        slotId: "simona-amen-entertainment",
        kicker: "Entertainment",
        title: { vi: "Tầng thượng nhìn toàn cảnh thành phố", en: "A rooftop overlooking the whole city" },
        desc: {
          vi: "Không gian sinh hoạt trên cao dành cho những buổi tối cùng gia đình và bạn bè, giữa ánh đèn thành phố biển.",
          en: "An elevated gathering space for evenings with family and friends, above the lights of this coastal city.",
        },
        items: [{ vi: "Sky Lounge", en: "Sky Lounge" }],
        direction: "row",
        image: {
          src: "/images/simona/amenities/sky-lounge.jpg",
          alt: { vi: "Sky Lounge Simona Heights", en: "Simona Heights Sky Lounge" },
        },
      },
    ],
  },

  views: {
    headline: { vi: "Biển, nhìn từ chính ngôi nhà của bạn", en: "The sea, seen from home" },
    body: {
      vi: "Vịnh Quy Nhơn và Đầm Thị Nại — hai mặt nước ôm lấy Simona Heights, hiện diện trong từng khung nhìn.",
      en: "Quy Nhon Bay and Thi Nai Lagoon — two bodies of water embracing Simona Heights, present in every view.",
    },
    image: {
      src: "/images/simona/amenities/infinity-pool.jpg",
      alt: { vi: "Hồ bơi vô cực Simona Heights nhìn ra biển", en: "Simona Heights infinity pool facing the sea" },
    },
    tone: "ocean-blue",
  },

  residences: {
    eyebrow: { vi: "Căn hộ", en: "Residences" },
    headline: { vi: "Ba dòng sản phẩm, một tinh thần Art Deco", en: "Three product lines, one Art Deco spirit" },
    body: {
      vi: "Chọn một dòng căn hộ để xem diện tích và bố cục phòng theo bộ mặt bằng chính thức của Simona Heights.",
      en: "Select a residence line to view its area and room layout, based on Simona Heights' official floor plan set.",
    },
    unitTypeAria: { vi: "Dòng căn hộ", en: "Residence line" },
    nfaLabel: { vi: "Diện tích căn hộ", en: "Unit area" },
    nsaLabel: { vi: "Cấu hình phòng", en: "Layout" },
    unitCtaLabel: { vi: "Nhận tư vấn căn này", en: "Inquire About This Unit" },
    unitCtaHref: "#lead",
    unitCtaFloorplanLabel: { vi: "Xem mặt bằng", en: "View Floor Plans" },
    unitCtaFloorplanHref: "#floorplans",
    footnote: {
      vi: "Nguồn: mặt bằng căn hộ điển hình theo website chính thức Simona Heights. Hình ảnh, sơ đồ và thông tin mô tả chỉ nhằm mục đích minh hoạ; thông tin chính thức được xác định theo hợp đồng mua bán.",
      en: "Source: typical unit floor plans per Simona Heights' official website. Images, diagrams and descriptions are for illustrative purposes only; official terms are set out in the Sale and Purchase Agreement.",
    },
    items: [
      {
        key: "1pn",
        name: { vi: "First Heights · 1PN+", en: "First Heights · 1BR+" },
        tag: { vi: "1 phòng ngủ + khu làm việc", en: "1 bedroom + work area" },
        nfa: "44 m²",
        nsa: "1PN+",
        desc: {
          vi: "Cấu hình gọn gàng với khu làm việc riêng — phù hợp người độc thân hoặc khai thác cho thuê tại trung tâm thành phố.",
          en: "A compact layout with a dedicated work area — suited to single occupants or rental in the city center.",
        },
        floorPlanImage: {
          src: "/images/simona/floorplans/1pn.jpg",
          alt: { vi: "Mặt bằng First Heights 1PN+", en: "First Heights 1BR+ floor plan" },
        },
      },
      {
        key: "2pn",
        name: { vi: "Profit Heights · 2PN", en: "Profit Heights · 2BR" },
        tag: { vi: "2 phòng ngủ", en: "2 bedrooms" },
        nfa: "65 m²",
        nsa: "2PN",
        desc: {
          vi: "Hai phòng ngủ với phòng master riêng biệt, phù hợp gia đình nhỏ hoặc khai thác cho thuê dài hạn.",
          en: "Two bedrooms with a separate master suite, suited to small families or long-term rental.",
        },
        floorPlanImage: {
          src: "/images/simona/floorplans/2pn.jpg",
          alt: { vi: "Mặt bằng Profit Heights 2PN", en: "Profit Heights 2BR floor plan" },
        },
      },
      {
        key: "3pn",
        name: { vi: "Profit Heights · 3PN", en: "Profit Heights · 3BR" },
        tag: { vi: "3 phòng ngủ · có bản Triple Key", en: "3 bedrooms · Triple Key option" },
        nfa: "87.5 m²",
        nsa: "3PN",
        desc: {
          vi: "Cấu hình lớn nhất trong bộ căn hộ điển hình, có thêm phiên bản Triple Key cho nhu cầu khai thác linh hoạt.",
          en: "The largest layout in the typical unit set, also available in a Triple Key configuration for flexible rental use.",
        },
        floorPlanImage: {
          src: "/images/simona/floorplans/3pn.jpg",
          alt: { vi: "Mặt bằng Profit Heights 3PN", en: "Profit Heights 3BR floor plan" },
        },
      },
    ],
  },

  videoDuo: {
    eyebrow: { vi: "Câu chuyện từ dự án", en: "Stories From The Project" },
    headline: {
      vi: "Những điều đáng biết trước khi chọn căn hộ",
      en: "What's worth knowing before you choose a unit",
    },
    items: [
      {
        key: "construction-progress",
        contentType: "project-update",
        title: { vi: "Simona Heights đang xây đến đâu?", en: "How far along is Simona Heights?" },
        description: {
          vi: "Cập nhật thực tế tiến độ thi công và cảnh quan tại dự án.",
          en: "A real look at construction progress and the landscape at the project.",
        },
        topicSlug: "construction-progress",
        prefillNeed: "Tìm hiểu dự án",
        enabled: true,
        sortOrder: 1,
      },
      {
        key: "first-vs-profit-heights",
        contentType: "product-guide",
        title: {
          vi: "Nên chọn First Heights hay Profit Heights?",
          en: "First Heights or Profit Heights — which suits you?",
        },
        description: {
          vi: "So sánh căn 1PN+ để ở với 2PN/3PN Profit Heights để khai thác cho thuê.",
          en: "Comparing the 1BR+ First Heights line with the 2BR/3BR Profit Heights line for rental use.",
        },
        topicSlug: "first-vs-profit-heights",
        prefillNeed: "Đầu tư",
        enabled: true,
        sortOrder: 2,
      },
    ],
  },

  floorPlans: {
    eyebrow: { vi: "Mặt bằng", en: "Floor Plans" },
    headline: { vi: "Ba dòng căn hộ điển hình", en: "Three typical residence layouts" },
    zoomBtn: { vi: "Phóng to", en: "Zoom in" },
    closeAria: { vi: "Đóng", en: "Close" },
    footnote: {
      vi: "Mặt bằng mang tính minh hoạ, có thể được điều chỉnh theo quyết định của chủ đầu tư tại từng thời điểm.",
      en: "Floor plans are indicative and may be adjusted at the developer's discretion.",
    },
    ctaLabel: { vi: "Nhận mặt bằng chi tiết →", en: "Request Detailed Floor Plans →" },
    ctaHref: "#lead",
    groupLabels: {
      types: { vi: "Dòng căn hộ", en: "Residence Lines" },
    },
    items: [
      {
        key: "1pn",
        group: "types",
        name: { vi: "First Heights · 1PN+", en: "First Heights · 1BR+" },
        src: "/images/simona/floorplans/1pn.jpg",
        alt: { vi: "Mặt bằng First Heights 1PN+", en: "First Heights 1BR+ floor plan" },
        caption: { vi: "First Heights 1PN+ — 44 m², một phòng ngủ và khu làm việc.", en: "First Heights 1BR+ — 44 m², one bedroom plus a work area." },
      },
      {
        key: "2pn",
        group: "types",
        name: { vi: "Profit Heights · 2PN", en: "Profit Heights · 2BR" },
        src: "/images/simona/floorplans/2pn.jpg",
        alt: { vi: "Mặt bằng Profit Heights 2PN", en: "Profit Heights 2BR floor plan" },
        caption: { vi: "Profit Heights 2PN — 65 m², hai phòng ngủ.", en: "Profit Heights 2BR — 65 m², two bedrooms." },
      },
      {
        key: "3pn",
        group: "types",
        name: { vi: "Profit Heights · 3PN", en: "Profit Heights · 3BR" },
        src: "/images/simona/floorplans/3pn.jpg",
        alt: { vi: "Mặt bằng Profit Heights 3PN", en: "Profit Heights 3BR floor plan" },
        caption: { vi: "Profit Heights 3PN — 87,5 m², ba phòng ngủ, có bản Triple Key.", en: "Profit Heights 3BR — 87.5 m², three bedrooms, Triple Key option available." },
      },
    ],
  },

  investment: {
    eyebrow: { vi: "Giá trị & đầu tư", en: "Value & Investment" },
    navLabel: { vi: "Đầu tư", en: "Investment" },
    headline: { vi: "Vì sao Simona Heights đáng cân nhắc", en: "Why Simona Heights is worth considering" },
    headlineMaxWidth: { vi: "20ch", en: "28ch" },
    points: [
      {
        num: "01",
        title: { vi: "Hai mặt tiền trung tâm thành phố", en: "Two street fronts in the city center" },
        desc: {
          vi: "145A Trần Hưng Đạo sở hữu hai mặt tiền Trần Hưng Đạo và Trần Bình Trọng, giữa khu vực đã hình thành đầy đủ hạ tầng và dân cư.",
          en: "145A Tran Hung Dao fronts both Tran Hung Dao and Tran Binh Trong streets, in an area with infrastructure and residents already in place.",
        },
      },
      {
        num: "02",
        title: { vi: "300m tới biển", en: "300m from the sea" },
        desc: {
          vi: "Khoảng cách hiếm có giữa một dự án căn hộ và bờ biển Quy Nhơn, cùng tầm nhìn ra Đầm Thị Nại.",
          en: "A rare distance between an apartment project and Quy Nhon beach, with views onto Thi Nai Lagoon.",
        },
      },
      {
        num: "03",
        title: { vi: "Sản phẩm Duplex & Penthouse", en: "Duplex & Penthouse product" },
        desc: {
          vi: "626 căn hộ tại hai toà The Sea và The Harbour, bao gồm các cấu hình Duplex và Penthouse cao cấp.",
          en: "626 residences across The Sea and The Harbour, including premium Duplex and Penthouse configurations.",
        },
      },
      {
        num: "04",
        title: { vi: "Pháp lý & tài liệu", en: "Legal standing & documentation" },
        desc: {
          vi: "Base Land Quy Nhơn chỉ cung cấp tài liệu pháp lý được phép công bố, không đưa cam kết lợi nhuận.",
          en: "Base Land Quy Nhon provides only legal documentation cleared for disclosure, and makes no profit guarantees.",
        },
      },
    ],
    pricingTitle: { vi: "Bảng giá & chính sách bán hàng", en: "Pricing & Sales Policy" },
    pricingBody: {
      vi: "Chỉ phát hành theo thông tin chính thức từ chủ đầu tư. Base Land Quy Nhơn gửi bảng giá và chính sách bán hàng mới nhất khi có cập nhật.",
      en: "Released only from official developer information. Base Land Quy Nhon shares the latest pricing and sales policy as updates become available.",
    },
    pricingCtaLabel: { vi: "Nhận bảng giá mới nhất", en: "Request Latest Pricing" },
    pricingCtaHref: "#lead",
  },

  news: {
    eyebrow: { vi: "Tin tức", en: "News" },
    headline: { vi: "Cập nhật thị trường & bất động sản Quy Nhơn", en: "Quy Nhon Market & Real Estate Updates" },
    readMoreLabel: { vi: "Đọc bài viết", en: "Read article" },
    // Exactly 3 — matches the section's 3-column grid so it stays a single
    // row (a 4th item would wrap to its own row below).
    articleSlugs: ["market-watch", "city-transform", "slow-living"],
  },

  legal: {
    body: {
      vi: "Simona Heights được phân phối bởi Base Land Quy Nhơn — đơn vị tư vấn tại chính thành phố này, làm việc với dữ liệu đã xác minh từ chủ đầu tư. Dự án hiện đã cất nóc và đang trong giai đoạn hoàn thiện.",
      en: "Simona Heights is marketed by Base Land Quy Nhon — an advisory team based in this city, working from data verified with the developer. The project has topped out and is now in the finishing phase.",
    },
    points: [
      {
        label: { vi: "Tư vấn tại Quy Nhơn", en: "Advisors based in Quy Nhon" },
        desc: { vi: "Đội ngũ làm việc trực tiếp tại thành phố, đi thực địa cùng khách hàng.", en: "A team working directly in the city, visiting the site together with clients." },
      },
      {
        label: { vi: "Thông tin minh bạch", en: "Transparent information" },
        desc: { vi: "Chỉ công bố dữ liệu đã được xác nhận từ chủ đầu tư và tài liệu chính thức.", en: "Only data confirmed with the developer and official documentation is disclosed." },
      },
      {
        label: { vi: "Đồng hành dài hạn", en: "Long-term support" },
        desc: { vi: "Hỗ trợ xuyên suốt từ tìm hiểu đến khi hoàn tất và bàn giao.", en: "Support throughout, from initial research to completion and handover." },
      },
    ],
  },

  documents: {
    eyebrow: { vi: "Thông tin dự án", en: "Project Information" },
    headline: { vi: "Kiểm chứng thông tin trước khi quyết định", en: "Verify the information before you decide" },
    ctaLabel: { vi: "Nhận tài liệu →", en: "Request Documents →" },
    ctaHref: "#lead",
    items: [
      { name: { vi: "Brochure dự án", en: "Project brochure" }, note: { vi: "Tổng quan Simona Heights, vị trí và tiện ích", en: "Overview of Simona Heights, location and amenities" } },
      { name: { vi: "Mặt bằng & loại căn", en: "Floor plans & unit types" }, note: { vi: "Bộ mặt bằng căn hộ điển hình First Heights và Profit Heights", en: "Typical floor plans for First Heights and Profit Heights" } },
      { name: { vi: "Chính sách bán hàng", en: "Sales policy" }, note: { vi: "Chỉ cung cấp tài liệu được phép công bố", en: "Only documents cleared for disclosure are provided" } },
      { name: { vi: "Project presentation", en: "Project presentation" }, note: { vi: "Bản trình bày dành cho khách hàng quan tâm", en: "A presentation for interested clients" } },
    ],
  },

  cta: {
    eyebrow: { vi: "Liên hệ", en: "Contact" },
    headline: { vi: "Đăng ký tư vấn dự án Simona Heights", en: "Register for Consultation on Simona Heights" },
    headlineMaxWidth: { vi: "20ch", en: "30ch" },
    body: {
      vi: "Chuyên viên Base Land Quy Nhơn sẽ liên hệ, gửi tài liệu và bảng giá ngay khi được chủ đầu tư phát hành chính thức.",
      en: "A Base Land Quy Nhon advisor will contact you and share documents and pricing as soon as the developer officially releases them.",
    },
    callNowLabel: { vi: "Gọi ngay", en: "Call Now" },
    leadSource: "simona-heights",
  },
};
