import type { ProjectDetailData } from "./types";

/**
 * The Sailing Quy Nhơn — fourth Project Detail Template implementation
 * (Sailing × Sea × City × Iconic Architecture theme), and a full rebuild of
 * this project's earlier minimal stub (hero/intro/stats/legal/cta only).
 *
 * This project has NO official website. The only available reference is
 * https://quynhoncity.com.vn/the-sailing-quy-nhon/ — an unofficial
 * third-party site, not a legal or developer source. Every important fact
 * below is therefore tracked in `verification.items` with a source,
 * verified flag and lastUpdated date (see ProjectVerificationNote), and no
 * section's copy asserts an unverified number/claim as settled fact —
 * hedged wording ("theo thông tin tham khảo", "chưa xác nhận") is used
 * throughout instead.
 *
 * Deliberately NOT included / NOT asserted as fact:
 *  - The developer's name (Công ty CP Đầu Tư Phát Triển BĐS Đô Thành) —
 *    tracked in `verification.items` only, never shown in visible copy,
 *    per this brief's explicit instruction (same rule as Q'Terra's own
 *    developer-name governance).
 *  - Any handover date. The reference source states "Q3–Q4 2026", which is
 *    known to likely be wrong (actual date is more likely Q4 2027) — this
 *    number is not used anywhere, including in Documents/Progress/FAQ;
 *    those sections say "đang xác minh" instead of showing a placeholder
 *    date that could be mistaken for a real one.
 *  - Best Western Premier as a confirmed operator/brand tie-up for The
 *    Maestro — mentioned only inside `verification.items` as an unverified
 *    reference-source claim, never in the Two Towers narrative itself.
 *  - A "Partners & Operators" section (Vinaconex 2, Best Western Premier)
 *    — omitted entirely per mục 18 ("chỉ tạo... nếu quan hệ đã xác minh").
 *  - Residence types / floor plans (1BR/2BR/3BR/Penthouse/Shophouse) — the
 *    reference source gives no verified per-type areas, floor ranges or
 *    availability for either tower, only building-level floor/unit
 *    totals. Fabricating specific unit types would misrepresent a level of
 *    detail nobody has confirmed; ResidenceSelector/FloorPlanViewer are
 *    left unset until real unit data exists.
 *  - Distance/time landmarks for the location experience (mục 10's
 *    "01/03/30 MIN" style) — no verified travel-time data exists at all
 *    for this project (unlike Q'Terra/Phú Gia, which had real distances).
 *    `location.journey` instead showcases the three confirmed street
 *    frontages, not fabricated travel times.
 *  - Any price, payment schedule, bank support, discount, or legal
 *    ownership claim (freehold, "sổ hồng", 50-year foreign ownership) —
 *    all CTA-gated ("Nhận bảng giá mới nhất" / "Nhận hồ sơ pháp lý")
 *    instead of stated as fact.
 *  - A dated construction-progress timeline — no verified milestone dates
 *    exist; `gallery` uses honestly-labeled placeholders instead.
 */
export const THE_SAILING_PROJECT: ProjectDetailData = {
  slug: "the-sailing",
  name: "THE SAILING",
  category: { vi: "Căn hộ", en: "Apartments" },
  status: { vi: "Đang triển khai", en: "In Progress" },
  theme: "the-sailing",
  sections: {
    intro: true,
    stats: true,
    towers: true,
    location: true,
    gallery: true,
    architecture: true,
    lifestyle: true,
    amenities: true,
    views: true,
    videoDuo: true,
    documents: true,
    verification: true,
    faq: true,
    legal: true,
  },

  hero: {
    eyebrow: { vi: "Dự án do Base Land phân phối", en: "Marketed by Base Land" },
    addressLine: { vi: "Lê Duẩn · Vũ Bảo · Nguyễn Tư", en: "Lê Duẩn · Vũ Bảo · Nguyễn Tư" },
    subhead: {
      vi: "Tổ hợp hai tòa tháp — The Maestro và The Sailing — hướng biển tại trung tâm Quy Nhơn.",
      en: "A two-tower complex — The Maestro and The Sailing — facing the sea at the heart of Quy Nhon.",
    },
    ctaExploreLabel: { vi: "Khám phá dự án", en: "Explore the project" },
    ctaExploreHref: "#statement",
    ctaConsultLabel: { vi: "Nhận tư vấn", en: "Request consultation" },
    ctaConsultHref: "#lead",
    navLabel: "The Sailing",
    placeholderLabel: {
      vi: "Phối cảnh The Maestro & The Sailing, view biển",
      en: "The Maestro & The Sailing rendering — sea view",
    },
  },

  intro: {
    eyebrow: { vi: "Tuyên ngôn dự án", en: "Project statement" },
    headline: { vi: "Hai tòa tháp, một đường chân trời", en: "Two towers, one horizon" },
    body: {
      vi: "The Sailing Quy Nhơn là tổ hợp hai tòa tháp cao tầng tại giao lộ Lê Duẩn – Vũ Bảo – Nguyễn Tư, hướng ra biển Quy Nhơn. Quy mô, vận hành và pháp lý đang được Base Land xác minh cùng chủ đầu tư trước khi công bố chính thức.",
      en: "The Sailing Quy Nhon is a two-tower complex at the Lê Duẩn – Vũ Bảo – Nguyễn Tư intersection, facing the sea. Scale, operations and legal details are being verified by Base Land with the developer before official release.",
    },
  },

  stats: {
    items: [
      {
        value: "10748",
        label: { vi: "M² Diện Tích Đất", en: "m² Land Area" },
        note: { vi: "Theo thông tin tham khảo, chưa xác nhận chính thức.", en: "Per reference information, not yet officially confirmed." },
        animated: true,
      },
      {
        value: "2",
        label: { vi: "Tòa Tháp", en: "Towers" },
        note: { vi: "The Maestro và The Sailing.", en: "The Maestro and The Sailing." },
      },
      {
        value: "36 · 41",
        label: { vi: "Số Tầng (Maestro · Sailing)", en: "Floors (Maestro · Sailing)" },
        note: { vi: "Theo thông tin tham khảo.", en: "Per reference information." },
      },
      {
        value: "1341",
        label: { vi: "Tổng Số Căn (Tham Khảo)", en: "Total Residences (Reference)" },
        note: {
          vi: "Chưa xác nhận chính thức — xem mục minh bạch dữ liệu.",
          en: "Not yet officially confirmed — see the data transparency section.",
        },
        animated: true,
      },
      {
        value: "2",
        label: { vi: "Tầng Hầm", en: "Basement Levels" },
        note: { vi: "Theo thông tin tham khảo.", en: "Per reference information." },
      },
      {
        value: "3",
        label: { vi: "Mặt Tiền", en: "Street Frontages" },
        note: { vi: "Lê Duẩn · Vũ Bảo · Nguyễn Tư.", en: "Lê Duẩn · Vũ Bảo · Nguyễn Tư." },
      },
    ],
  },

  location: {
    eyebrow: { vi: "Vị trí", en: "Location" },
    headline: { vi: "Ba mặt tiền, một vị trí trung tâm", en: "Three frontages, one central position" },
    body: {
      vi: "The Sailing Quy Nhơn toạ lạc tại giao lộ ba tuyến đường Lê Duẩn, Vũ Bảo và Nguyễn Tư — một vị trí nhiều mặt tiền hiếm có tại trung tâm thành phố. Khoảng cách cụ thể tới các điểm đến trong thành phố sẽ được cập nhật cùng dữ liệu chính thức.",
      en: "The Sailing Quy Nhon sits at the intersection of Lê Duẩn, Vũ Bảo and Nguyễn Tư streets — a rare multi-frontage position at the city's center. Specific distances to city destinations will be published together with official data.",
    },
    mapPlaceholderLabel: {
      vi: "Bản đồ vị trí giao lộ Lê Duẩn – Vũ Bảo – Nguyễn Tư",
      en: "Location map — Lê Duẩn – Vũ Bảo – Nguyễn Tư intersection",
    },
    benefits: [],
    journey: [
      { tier: { vi: "Mặt tiền 1", en: "Frontage 1" }, landmarks: [{ vi: "Đường Lê Duẩn", en: "Lê Duẩn Street" }] },
      { tier: { vi: "Mặt tiền 2", en: "Frontage 2" }, landmarks: [{ vi: "Đường Vũ Bảo", en: "Vũ Bảo Street" }] },
      { tier: { vi: "Mặt tiền 3", en: "Frontage 3" }, landmarks: [{ vi: "Đường Nguyễn Tư", en: "Nguyễn Tư Street" }] },
    ],
  },

  towers: {
    eyebrow: { vi: "Hai tòa tháp", en: "Two Towers" },
    headline: { vi: "The Maestro và The Sailing", en: "The Maestro and The Sailing" },
    towers: [
      {
        key: "maestro",
        name: { vi: "The Maestro", en: "The Maestro" },
        subtitle: { vi: "Tòa A · 36 tầng (tham khảo)", en: "Tower A · 36 Floors (reference)" },
        description: {
          vi: "Theo thông tin tham khảo, tòa tháp cao khoảng 36 tầng với khoảng 563 căn. Định hướng vận hành và đơn vị quản lý đang được xác minh.",
          en: "Per reference information, this tower spans roughly 36 floors with around 563 units. Its operating model and management brand are still being verified.",
        },
        characteristics: [
          { vi: "~563 căn (tham khảo)", en: "~563 units (reference)" },
          { vi: "36 tầng", en: "36 floors" },
          { vi: "Đang xác minh vận hành", en: "Operator pending verification" },
        ],
        placeholderLabel: { vi: "Phối cảnh The Maestro", en: "The Maestro rendering" },
        ctaLabel: { vi: "Tư vấn The Maestro", en: "Inquire about The Maestro" },
        ctaHref: "#lead",
      },
      {
        key: "sailing",
        name: { vi: "The Sailing", en: "The Sailing" },
        subtitle: { vi: "Tòa B · 41 tầng (tham khảo)", en: "Tower B · 41 Floors (reference)" },
        description: {
          vi: "Theo thông tin tham khảo, tòa tháp cao khoảng 41 tầng với khoảng 778 căn hướng biển — tòa mang tên dự án.",
          en: "Per reference information, this tower rises roughly 41 floors with around 778 sea-facing units — the tower that gives the project its name.",
        },
        characteristics: [
          { vi: "~778 căn (tham khảo)", en: "~778 units (reference)" },
          { vi: "41 tầng", en: "41 floors" },
          { vi: "Hướng biển", en: "Sea-facing" },
        ],
        placeholderLabel: { vi: "Phối cảnh The Sailing", en: "The Sailing rendering" },
        ctaLabel: { vi: "Tư vấn The Sailing", en: "Inquire about The Sailing" },
        ctaHref: "#lead",
      },
    ],
  },

  gallery: {
    intro: {
      vi: "Hình ảnh phối cảnh và thực tế dự án sẽ được cập nhật khi có tài liệu chính thức từ chủ đầu tư.",
      en: "Renderings and real project photos will be added once official developer materials are available.",
    },
    items: [
      {
        key: "tong-the",
        name: { vi: "Phối cảnh tổng thể hai tòa tháp", en: "Overall two-tower rendering" },
        desc: { vi: "Tổng thể The Maestro và The Sailing nhìn từ hướng biển.", en: "The Maestro and The Sailing seen from the sea." },
      },
      {
        key: "giao-lo",
        name: { vi: "Giao lộ Lê Duẩn – Vũ Bảo – Nguyễn Tư", en: "Lê Duẩn – Vũ Bảo – Nguyễn Tư intersection" },
        desc: { vi: "Vị trí ba mặt tiền của dự án.", en: "The project's three-frontage position." },
      },
      {
        key: "khoi-de",
        name: { vi: "Khối đế thương mại & tiện ích", en: "Podium retail & amenities" },
        desc: { vi: "Không gian tiện ích tại khối đế hai tòa tháp.", en: "Amenity spaces at the towers' podium." },
      },
    ],
  },

  architecture: {
    eyebrow: { vi: "Kiến trúc", en: "Architecture" },
    headline: { vi: "Hai khối tháp, một ngôn ngữ kiến trúc", en: "Two towers, one architectural language" },
    body: {
      vi: "Đường nét thẳng đứng, mặt kính phản chiếu ánh sáng và bầu trời — hình khối gợi nhắc cánh buồm căng gió mà không sao chép nguyên literal hình con thuyền.",
      en: "Vertical lines and glass that reflect light and sky — a form that evokes a sail catching the wind without literally copying a boat's shape.",
    },
    placeholderLabel: { vi: "Kiến trúc The Sailing, ảnh full-bleed", en: "The Sailing architecture — full-bleed photo" },
    tone: "charcoal",
    navLabel: { vi: "Kiến trúc", en: "Architecture" },
  },

  lifestyle: {
    eyebrow: { vi: "Một ngày tại The Sailing", en: "A day at The Sailing" },
    headline: { vi: "Nhịp sống giữa thành phố và biển", en: "A rhythm between city and sea" },
    chapters: [
      {
        slotId: "sailing-day-morning",
        time: "06:00",
        label: "Morning",
        statement: { vi: "Buổi sáng bắt đầu với ánh nắng đầu ngày trên mặt biển.", en: "The morning begins with early light on the water." },
      },
      {
        slotId: "sailing-day-city",
        time: "09:00",
        label: "City",
        statement: { vi: "Nhịp sống thành phố ngay dưới chân tháp.", en: "The city's rhythm right at the tower's base." },
      },
      {
        slotId: "sailing-day-sea",
        time: "13:00",
        label: "Sea",
        statement: { vi: "Buổi trưa, tầm nhìn hướng biển trải dài đến đường chân trời.", en: "At midday, the sea view stretches to the horizon." },
      },
      {
        slotId: "sailing-day-dining",
        time: "18:00",
        label: "Dining",
        statement: { vi: "Bữa tối tại khối đế, ánh đèn thành phố bắt đầu lên.", en: "Dinner at the podium as the city lights begin to rise." },
      },
      {
        slotId: "sailing-day-sunset",
        time: "18:30",
        label: "Sunset",
        statement: { vi: "Hoàng hôn nhuộm màu mặt kính hai tòa tháp.", en: "Sunset colors the glass of both towers." },
      },
      {
        slotId: "sailing-day-night",
        time: "21:00",
        label: "Night",
        statement: { vi: "Thành phố lên đèn, biển lặng dần trong bóng tối.", en: "The city lights up as the sea settles into darkness." },
      },
    ],
  },

  amenities: {
    eyebrow: { vi: "Tiện ích", en: "Amenities" },
    headline: { vi: "Định hướng tiện ích tại khối đế hai tòa tháp", en: "Planned amenities across the towers' podium" },
    chapters: [
      {
        slotId: "sailing-amen-wellness",
        kicker: "WELLNESS",
        title: { vi: "Hồ bơi & khu vực thư giãn", en: "Pool & wellness deck" },
        desc: {
          vi: "Định hướng tiện ích tham khảo — hồ bơi và không gian thư giãn tại khối đế.",
          en: "Reference amenity direction — a pool and relaxation deck at the podium.",
        },
        items: [
          { vi: "Hồ bơi", en: "Swimming pool" },
          { vi: "Khu thư giãn", en: "Relaxation deck" },
        ],
        direction: "row",
      },
      {
        slotId: "sailing-amen-leisure",
        kicker: "LEISURE",
        title: { vi: "Sky Bar hướng biển", en: "Sea-facing Sky Bar" },
        desc: {
          vi: "Không gian giải trí trên cao, tầm nhìn hướng biển — theo định hướng tham khảo.",
          en: "An elevated leisure space with sea views — per reference planning.",
        },
        items: [
          { vi: "Sky Bar", en: "Sky Bar" },
          { vi: "Lounge", en: "Lounge" },
        ],
        direction: "row-reverse",
      },
      {
        slotId: "sailing-amen-dining",
        kicker: "DINING",
        title: { vi: "Không gian ẩm thực tại khối đế", en: "Dining at the podium" },
        desc: {
          vi: "Khu vực nhà hàng, quán cà phê phục vụ cư dân và khách lưu trú.",
          en: "Restaurant and café spaces serving residents and guests.",
        },
        items: [
          { vi: "Nhà hàng", en: "Restaurant" },
          { vi: "Cà phê", en: "Café" },
        ],
        direction: "row",
      },
      {
        slotId: "sailing-amen-family",
        kicker: "FAMILY",
        title: { vi: "Kid Club", en: "Kid Club" },
        desc: { vi: "Không gian vui chơi dành cho trẻ em — theo định hướng tham khảo.", en: "A play space for children — per reference planning." },
        items: [{ vi: "Kid Club", en: "Kid Club" }],
        direction: "row-reverse",
      },
      {
        slotId: "sailing-amen-social",
        kicker: "SOCIAL",
        title: { vi: "Khối đế thương mại", en: "Retail podium" },
        desc: { vi: "Không gian thương mại, dịch vụ tại khối đế hai tòa tháp.", en: "Retail and service space at the towers' podium." },
        items: [
          { vi: "Thương mại", en: "Retail" },
          { vi: "Dịch vụ", en: "Services" },
        ],
        direction: "row",
      },
    ],
  },

  views: {
    headline: { vi: "Biển và đường chân trời Quy Nhơn", en: "The sea and Quy Nhon's horizon" },
    body: {
      vi: "Nơi kiến trúc dừng lại và đường chân trời bắt đầu.",
      en: "Where the architecture ends and the horizon begins.",
    },
    placeholderLabel: { vi: "Sea View The Sailing, ảnh full-bleed ngang", en: "The Sailing sea view — full-bleed photo" },
    tone: "ocean-blue",
  },

  videoDuo: {
    eyebrow: { vi: "Câu chuyện từ dự án", en: "Stories From The Project" },
    headline: {
      vi: "Những điều đáng biết trước khi tìm hiểu The Sailing",
      en: "What's worth knowing before you look into The Sailing",
    },
    items: [
      {
        key: "two-towers-orientation",
        contentType: "project-update",
        title: { vi: "Tìm hiểu về hai tòa The Maestro & The Sailing", en: "An orientation to The Maestro & The Sailing" },
        description: {
          vi: "Giới thiệu tổng quan hai tòa tháp theo thông tin tham khảo hiện có, trong khi hồ sơ chính thức đang được xác minh.",
          en: "A general orientation to both towers based on currently available reference information, while the official file is being verified.",
        },
        topicSlug: "two-towers-orientation",
        prefillNeed: "Tìm hiểu dự án",
        enabled: true,
        sortOrder: 1,
      },
      {
        key: "maestro-vs-sailing",
        contentType: "product-guide",
        title: { vi: "Nên chọn The Maestro hay The Sailing?", en: "The Maestro or The Sailing — which tower?" },
        description: {
          vi: "So sánh hai tòa theo số tầng và định hướng căn hộ đã công bố tham khảo, giúp bạn định hình sở thích trước khi có bảng hàng chính thức.",
          en: "Comparing the two towers by their reference floor counts and unit orientation, to help shape your preference ahead of the official unit list.",
        },
        topicSlug: "maestro-vs-sailing",
        prefillNeed: "Căn hộ",
        enabled: true,
        sortOrder: 2,
      },
    ],
  },

  documents: {
    eyebrow: { vi: "Thông tin dự án", en: "Project Information" },
    headline: { vi: "Yêu cầu tài liệu chính thức trước khi quyết định", en: "Request official documents before you decide" },
    ctaLabel: { vi: "Nhận hồ sơ pháp lý →", en: "Request legal documents →" },
    ctaHref: "#lead",
    items: [
      { name: { vi: "Brochure dự án", en: "Project brochure" }, note: { vi: "Gửi khi chủ đầu tư phát hành chính thức", en: "Sent once officially released by the developer" } },
      {
        name: { vi: "Mặt bằng & bảng giá", en: "Floor plans & price list" },
        note: { vi: "Chưa có dữ liệu chính thức — đăng ký để nhận cập nhật đầu tiên", en: "No official data yet — register to be notified first" },
      },
      {
        name: { vi: "Chính sách bán hàng", en: "Sales policy" },
        note: { vi: "Sẽ công bố cùng bảng giá chính thức", en: "Will be released together with the official price list" },
      },
      {
        name: { vi: "Hồ sơ pháp lý", en: "Legal documents" },
        note: { vi: "Chỉ cung cấp tài liệu đã được chủ đầu tư xác nhận", en: "Only documents confirmed by the developer are provided" },
      },
      {
        name: { vi: "Tiến độ xây dựng", en: "Construction progress" },
        note: { vi: "Cập nhật hình ảnh thực tế khi có nguồn xác minh", en: "Updated with real photos once a verified source is available" },
      },
    ],
  },

  verification: {
    eyebrow: { vi: "Minh bạch dữ liệu", en: "Data Transparency" },
    headline: { vi: "Thông tin nào đã xác nhận, thông tin nào đang chờ", en: "What's confirmed, and what's still pending" },
    body: {
      vi: "The Sailing Quy Nhơn hiện chưa có website chính thức. Toàn bộ số liệu dưới đây tham khảo từ quynhoncity.com.vn — một nguồn không chính thức — và sẽ được cập nhật ngay khi có xác nhận từ chủ đầu tư.",
      en: "The Sailing Quy Nhon does not yet have an official website. All figures below are referenced from quynhoncity.com.vn — an unofficial source — and will be updated as soon as the developer confirms them.",
    },
    items: [
      {
        label: { vi: "Chủ đầu tư", en: "Developer" },
        note: { vi: "Chưa công bố công khai cho tới khi xác nhận.", en: "Not disclosed publicly until confirmed." },
        source: "quynhoncity.com.vn",
        verified: false,
        lastUpdated: "2026-09",
      },
      {
        label: { vi: "Diện tích đất & tầng hầm", en: "Land area & basement" },
        note: { vi: "10.748 m², 2 tầng hầm — theo thông tin tham khảo.", en: "10,748 sqm, 2 basement levels — per reference information." },
        source: "quynhoncity.com.vn",
        verified: false,
        lastUpdated: "2026-09",
      },
      {
        label: { vi: "Quy mô hai tòa tháp", en: "Two-tower scale" },
        note: {
          vi: "The Maestro 36 tầng/~563 căn, The Sailing 41 tầng/~778 căn — theo thông tin tham khảo.",
          en: "The Maestro 36 floors/~563 units, The Sailing 41 floors/~778 units — per reference information.",
        },
        source: "quynhoncity.com.vn",
        verified: false,
        lastUpdated: "2026-09",
      },
      {
        label: { vi: "Đơn vị vận hành", en: "Operating brand" },
        note: {
          vi: "Best Western Premier được nhắc tới tại nguồn tham khảo cho Tòa A — chưa xác nhận quan hệ hợp tác chính thức.",
          en: "Best Western Premier is mentioned at the reference source for Tower A — the official partnership is not yet confirmed.",
        },
        source: "quynhoncity.com.vn",
        verified: false,
        lastUpdated: "2026-09",
      },
      {
        label: { vi: "Ngày bàn giao", en: "Handover date" },
        note: {
          vi: "Nguồn tham khảo nêu Quý III–IV/2026; thông tin này được biết là có khả năng sai lệch. Base Land không sử dụng mốc này cho tới khi có xác nhận chính thức.",
          en: "The reference source states Q3–Q4 2026; this figure is known to likely be inaccurate. Base Land does not use this date until officially confirmed.",
        },
        source: "quynhoncity.com.vn",
        verified: false,
        lastUpdated: "2026-09",
      },
      {
        label: { vi: "Pháp lý & sở hữu", en: "Legal status & ownership" },
        note: {
          vi: "Nguồn tham khảo nêu đất ở đô thị, sổ hồng, sở hữu 50 năm với người nước ngoài — chưa có tài liệu pháp lý xác nhận.",
          en: "The reference source states urban residential land, freehold title, and 50-year foreign ownership — not yet confirmed by legal documentation.",
        },
        source: "quynhoncity.com.vn",
        verified: false,
        lastUpdated: "2026-09",
      },
      {
        label: { vi: "Giá bán & chính sách thanh toán", en: "Pricing & payment policy" },
        note: { vi: "Chưa có bảng giá hoặc chính sách chính thức được duyệt.", en: "No official price list or payment policy has been approved yet." },
        source: "—",
        verified: false,
        lastUpdated: "2026-09",
      },
    ],
  },

  faq: {
    eyebrow: { vi: "Câu hỏi thường gặp", en: "FAQ" },
    headline: { vi: "Những câu hỏi khách hàng thường đặt ra", en: "Questions clients often ask" },
    groupLabels: {
      project: { vi: "Dự án", en: "Project" },
      location: { vi: "Vị trí", en: "Location" },
      legal: { vi: "Pháp lý", en: "Legal" },
      payment: { vi: "Thanh toán", en: "Payment" },
      handover: { vi: "Bàn giao", en: "Handover" },
      operator: { vi: "Vận hành", en: "Operator" },
    },
    items: [
      {
        group: "project",
        q: { vi: "The Sailing Quy Nhơn gồm những gì?", en: "What does The Sailing Quy Nhon include?" },
        a: {
          vi: "Dự án gồm hai tòa tháp — The Maestro và The Sailing — theo thông tin tham khảo hiện có. Quy mô chi tiết đang được Base Land xác minh cùng chủ đầu tư.",
          en: "The project comprises two towers — The Maestro and The Sailing — per currently available reference information. Detailed scale is being verified by Base Land with the developer.",
        },
      },
      {
        group: "project",
        q: { vi: "Ai đang phân phối dự án?", en: "Who is marketing the project?" },
        a: {
          vi: "Base Land Quy Nhơn là đơn vị tư vấn và hỗ trợ khách hàng tìm hiểu dự án.",
          en: "Base Land Quy Nhon is the advisory team supporting clients interested in the project.",
        },
      },
      {
        group: "location",
        q: { vi: "Dự án nằm ở đâu?", en: "Where is the project located?" },
        a: {
          vi: "Tại giao lộ ba tuyến đường Lê Duẩn, Vũ Bảo và Nguyễn Tư, trung tâm Quy Nhơn.",
          en: "At the intersection of Lê Duẩn, Vũ Bảo and Nguyễn Tư streets, central Quy Nhon.",
        },
      },
      {
        group: "legal",
        q: { vi: "Dự án đã có sổ hồng chưa?", en: "Does the project have title deeds yet?" },
        a: {
          vi: "Thông tin pháp lý hiện chưa được xác nhận chính thức. Liên hệ Base Land để nhận hồ sơ pháp lý khi có cập nhật.",
          en: "Legal information is not yet officially confirmed. Contact Base Land to receive legal documents as they're updated.",
        },
      },
      {
        group: "payment",
        q: { vi: "Giá bán hiện tại là bao nhiêu?", en: "What is the current price?" },
        a: {
          vi: "Chưa có bảng giá chính thức được duyệt. Đăng ký để nhận bảng giá ngay khi được công bố.",
          en: "No official price list has been approved yet. Register to receive pricing as soon as it's released.",
        },
      },
      {
        group: "handover",
        q: { vi: "Khi nào dự án bàn giao?", en: "When will the project be handed over?" },
        a: {
          vi: "Mốc bàn giao đang được xác minh — Base Land chưa sử dụng bất kỳ mốc thời gian nào cho tới khi có xác nhận chính thức từ chủ đầu tư.",
          en: "The handover date is still being verified — Base Land does not use any date until the developer officially confirms it.",
        },
      },
      {
        group: "operator",
        q: { vi: "Đơn vị nào vận hành dự án?", en: "Which operator runs the project?" },
        a: {
          vi: "Thông tin về đơn vị vận hành hiện chưa được xác nhận chính thức. Xem mục minh bạch dữ liệu để biết chi tiết.",
          en: "Operator information is not yet officially confirmed. See the data transparency section for details.",
        },
      },
    ],
  },

  legal: {
    body: {
      vi: "The Sailing Quy Nhơn được Base Land Quy Nhơn tư vấn và hỗ trợ khách hàng — đội ngũ tại địa phương, minh bạch về những gì đã xác nhận và những gì đang chờ xác nhận.",
      en: "The Sailing Quy Nhon is advised and supported by Base Land Quy Nhon — a local team, transparent about what's confirmed and what's still pending.",
    },
    points: [
      {
        label: { vi: "Tư vấn tại Quy Nhơn", en: "Advisors based in Quy Nhon" },
        desc: { vi: "Đội ngũ làm việc trực tiếp tại thành phố, đi thực địa cùng khách hàng.", en: "A team working directly in the city, visiting the site together with clients." },
      },
      {
        label: { vi: "Thông tin minh bạch", en: "Transparent information" },
        desc: {
          vi: "Chỉ công bố dữ liệu đã được xác nhận từ tài liệu chính thức — số liệu tham khảo luôn được ghi rõ nguồn.",
          en: "Only data confirmed by official documentation is disclosed as fact — reference figures are always clearly sourced.",
        },
      },
      {
        label: { vi: "Đồng hành dài hạn", en: "Long-term support" },
        desc: { vi: "Hỗ trợ xuyên suốt từ tìm hiểu đến khi hoàn tất và bàn giao.", en: "Support throughout, from initial research to completion and handover." },
      },
    ],
  },

  cta: {
    eyebrow: { vi: "Liên hệ", en: "Contact" },
    headline: { vi: "Đăng ký nhận thông tin The Sailing Quy Nhơn", en: "Register for The Sailing Quy Nhon updates" },
    headlineMaxWidth: { vi: "20ch", en: "30ch" },
    body: {
      vi: "Chuyên viên Base Land Quy Nhơn sẽ liên hệ và gửi tài liệu, bảng giá ngay khi có xác nhận chính thức từ chủ đầu tư.",
      en: "A Base Land Quy Nhon advisor will contact you and share documents and pricing as soon as the developer officially confirms them.",
    },
    callNowLabel: { vi: "Gọi ngay", en: "Call now" },
    leadSource: "the-sailing",
  },
};
