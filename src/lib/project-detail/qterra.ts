import type { ProjectDetailData } from "./types";

/**
 * Q'Terra Quy Nhơn — flagship / reference implementation of the Project
 * Detail Template. Migrated verbatim from the original one-off
 * `lib/content/qterra.ts` + `app/projects/qterra/page.tsx` (Claude Design
 * handoff output) into the shared schema — no content was reworded, no
 * section was dropped. `category` and `status` are new fields the schema
 * requires that the original page never rendered explicitly; both are
 * inferred from context already used elsewhere on the site (an apartment
 * project, "in progress" like every other Base Land Quy Nhơn project) —
 * flag if a different value is more accurate.
 */
export const QTERRA_PROJECT: ProjectDetailData = {
  slug: "qterra",
  name: "Q'TERRA",
  category: { vi: "Căn hộ", en: "Apartments" },
  status: { vi: "Đang triển khai", en: "In Progress" },
  sections: {
    intro: true,
    stats: true,
    location: true,
    gallery: true,
    architecture: true,
    materialStory: true,
    lifestyle: true,
    amenities: true,
    views: true,
    residences: true,
    videoDuo: true,
    floorPlans: true,
    investment: true,
    legal: true,
    documents: true,
  },

  hero: {
    eyebrow: { vi: "Dự án do Base Land phân phối", en: "Marketed by Base Land" },
    addressLine: { vi: "01 Ngô Mây · Quy Nhơn", en: "01 Ngô Mây · Quy Nhơn" },
    subhead: {
      vi: "864 căn hộ giữa trung tâm thành phố biển — nơi đất, đá, nắng và biển gặp nhau trong một công trình.",
      en: "864 residences at the heart of a coastal city — where earth, stone, sun and sea meet in a single address.",
    },
    ctaExploreLabel: { vi: "Khám phá Q'Terra", en: "Explore Q'Terra" },
    ctaExploreHref: "#statement",
    ctaConsultLabel: { vi: "Nhận tư vấn", en: "Request consultation" },
    ctaConsultHref: "#lead",
    navLabel: "Q'Terra",
    image: {
      src: "/images/qterra/qterra-facade.jpg",
      alt: { vi: "Phối cảnh dự án Q'Terra Quy Nhơn", en: "Q'Terra Quy Nhon rendering" },
    },
  },

  intro: {
    eyebrow: { vi: "Tuyên ngôn dự án", en: "Project statement" },
    headline: {
      vi: "Một vị trí sống giữa trung tâm Quy Nhơn — nơi nhịp phố, bờ biển và ánh nắng miền đất võ cùng thuộc về một địa chỉ.",
      en: "A residence at the center of Quy Nhon — where the rhythm of the city, the coastline and the light of this land belong to one address.",
    },
    body: {
      vi: "Q'Terra không đặt ở vùng ven. Dự án nằm tại 01 Ngô Mây — điểm mà thành phố đã hình thành sẵn: trường học, chợ, quán cà phê, con đường ra biển đi bộ vài phút.",
      en: "Q'Terra is not on the outskirts. The project stands at 01 Ngo May, where the city is already in place — schools, markets, cafés, and a walk to the sea of only a few minutes.",
    },
  },

  stats: {
    items: [
      {
        value: "01",
        label: { vi: "Ngô Mây", en: "Ngo May" },
        note: { vi: "Địa chỉ dự án, trung tâm thành phố Quy Nhơn.", en: "The project's address, at the center of Quy Nhon." },
      },
      {
        value: "864",
        label: { vi: "Căn hộ", en: "Residences" },
        note: {
          vi: "Quy mô toàn dự án theo thông tin đã xác nhận.",
          en: "Total project scale, based on confirmed information.",
        },
        animated: true,
      },
      {
        value: "39",
        label: { vi: "Tầng căn hộ", en: "Residential floors" },
        note: {
          vi: "Theo bộ mặt bằng tầng chính thức: tầng 3–39, cùng tiện ích tầng 1, 2, 21 và tầng thượng.",
          en: "Per the official floor plans: floors 3–39, plus amenity floors 1, 2, 21 and the rooftop.",
        },
      },
    ],
  },

  location: {
    eyebrow: { vi: "Vị trí", en: "Location" },
    headline: { vi: "Thành phố bắt đầu ngay trước cửa", en: "The city begins right at your door" },
    body: {
      vi: "Từ 01 Ngô Mây, mọi điểm đến sôi động nhất Quy Nhơn không nằm trong bán kính di chuyển — mà ngay trước cửa: quảng trường Nguyễn Tất Thành, nơi diễn ra bắn pháo hoa và những sự kiện lớn nhất thành phố, cùng bờ biển, trung tâm hành chính, phố ăn uống và hệ thống khách sạn.",
      en: "From 01 Ngo May, Quy Nhon's most vibrant destinations aren't a drive away — they're at your doorstep: Nguyen Tat Thanh Square, home to the city's fireworks and largest events, along with the beach, the administrative center, dining streets and hotels.",
    },
    mapPlaceholderLabel: { vi: "Bản đồ vị trí 01 Ngô Mây", en: "Location map — 01 Ngo May" },
    benefits: [
      { name: { vi: "Bờ biển Quy Nhơn", en: "Quy Nhon beach" }, distance: { vi: "~3 phút đi bộ", en: "~3-minute walk" } },
      {
        name: { vi: "Quảng trường Nguyễn Tất Thành", en: "Nguyen Tat Thanh Square" },
        distance: { vi: "~2 phút đi bộ", en: "~2-minute walk" },
      },
    ],
  },

  gallery: {
    intro: {
      vi: "Từ Q'Terra, bạn dễ dàng di chuyển đến những nơi đẹp nhất ở Quy Nhơn: Kỳ Co, Eo Gió, Làng Chài Nhơn Lý, Ghềnh Ráng…",
      en: "From Q'Terra, Quy Nhon's most beautiful places are all within easy reach: Ky Co, Eo Gio, Nhon Ly fishing village, Ghenh Rang…",
    },
    items: [
      {
        key: "kyco",
        name: { vi: "Kỳ Co", en: "Kỳ Co" },
        src: "/images/qterra/destinations/ky-co.jpg",
        desc: {
          vi: "Đi dọc bờ biển ngắm nhìn dáng núi hình lưỡi liềm ôm trọn làn nước xanh.",
          en: "Walk the shoreline beneath a crescent of mountains cradling turquoise water.",
        },
      },
      {
        key: "tam-thien-dong",
        name: { vi: "Tam Thiên Động", en: "Tam Thiên Động" },
        src: "/images/qterra/destinations/tam-thien-dong.jpg",
        desc: {
          vi: "Săn khoảnh khắc hang đá ẩn mình lộ diện khi thuỷ triều rút vào mùa hè.",
          en: "Catch the hidden sea cave as it reveals itself when the tide recedes each summer.",
        },
      },
      {
        key: "eo-gio",
        name: { vi: "Eo Gió", en: "Eo Gió" },
        src: "/images/qterra/destinations/eo-gio.jpg",
        desc: {
          vi: "Lắng nghe tiếng gió luồn qua khe đá trong khoảng lặng giữa hai nhịp sóng vỗ.",
          en: "Listen to the wind thread through the rock cliffs in the pause between two waves.",
        },
      },
      {
        key: "ghenh-rang",
        name: { vi: "Ghềnh Ráng", en: "Ghềnh Ráng" },
        src: "/images/qterra/destinations/ghenh-rang.jpg",
        desc: {
          vi: "Chạm tay vào những phiến đá trứng nhẵn mịn được sóng biển mài dũa.",
          en: "Touch the smooth, egg-shaped boulders polished over years by the sea.",
        },
      },
      {
        key: "con-chim",
        name: { vi: "Cồn Chim", en: "Cồn Chim" },
        src: "/images/qterra/destinations/con-chim.jpg",
        desc: {
          vi: "Trải nghiệm nhịp sống vùng đầm lầy qua việc bắt hải sản và nghe chuyện rừng ngập mặn.",
          en: "Experience wetland life firsthand — catching seafood and hearing the mangrove forest's story.",
        },
      },
      {
        key: "lang-chai-nhon-ly",
        name: { vi: "Làng Chài Nhơn Lý", en: "Làng Chài Nhơn Lý" },
        src: "/images/qterra/destinations/lang-chai.jpg",
        desc: {
          vi: "Khám phá những con hẻm quanh co của làng bích họa và cảm nhận nếp sống bình dị ven biển.",
          en: "Wander the winding lanes of this mural village and feel the simplicity of coastal life.",
        },
      },
    ],
  },

  architecture: {
    eyebrow: { vi: "Kiến trúc", en: "Architecture" },
    headline: { vi: "Khối kiến trúc đọc được ánh nắng", en: "A form shaped to read the light" },
    body: {
      vi: "Đường nét ngang của ban công, chiều sâu của ô cửa, mảng tường bắt nắng chiều — công trình được cảm nhận trước khi được đọc bằng thông số.",
      en: "The horizontal line of a balcony, the depth of a window reveal, a wall that catches the afternoon light — the building is felt before it's read in numbers.",
    },
    placeholderLabel: { vi: "Kiến trúc Q'Terra, ảnh lớn full màn hình", en: "Q'Terra architecture — full-bleed photo" },
    tone: "charcoal",
  },

  materialStory: {
    kicker: { vi: "Terracotta", en: "Terracotta" },
    headline: { vi: "Đất · Đá · Biển · Ánh sáng", en: "Earth · Stone · Sea · Light" },
    body: {
      vi: "Terracotta ở Q'Terra không phải một lớp trang trí. Đó là sắc của đất miền Trung sau cơn mưa, của đá granit ven biển lúc chiều tàn, của nắng đọng trên bề mặt vật liệu.",
      en: "Terracotta at Q'Terra is not a decorative finish. It's the color of central Vietnam's earth after rain, of granite along the shoreline at dusk, of sunlight held on the surface of a material.",
    },
    swatches: [
      { name: { vi: "Đất", en: "Earth" }, hex: "var(--project-accent)", ink: "var(--color-warm-white)" },
      // ink is #000000 (not a themed token) on purpose: Clay's luminance is
      // nearly equidistant between black and white, so pure white only
      // reaches 4.20:1 here — below WCAG AA's 4.5:1 — while pure black
      // reaches 4.61:1. No other color in the palette clears 4.5:1 against
      // this specific swatch chip's background.
      { name: { vi: "Đá", en: "Stone" }, hex: "var(--color-clay)", ink: "#000000" },
      { name: { vi: "Cát", en: "Sand" }, hex: "var(--color-limestone)", ink: "var(--color-charcoal)" },
      { name: { vi: "Biển", en: "Sea" }, hex: "var(--color-ocean-blue)", ink: "var(--color-warm-white)" },
    ],
    galleryImages: [
      { label: { vi: "bề mặt vật liệu / nắng", en: "material surface / sunlight" } },
      { label: { vi: "chi tiết kiến trúc", en: "architectural detail" } },
      { label: { vi: "đá / bờ biển Quy Nhơn", en: "stone / Quy Nhơn shoreline" } },
    ],
  },

  lifestyle: {
    eyebrow: { vi: "Một ngày ở Q'Terra", en: "A day at Q'Terra" },
    headline: {
      vi: "Sống ở đây là một nhịp, không phải một danh mục",
      en: "Living here is a rhythm, not a checklist",
    },
    chapters: [
      {
        slotId: "qterra-day-morning",
        time: "05:00",
        label: "Morning",
        statement: {
          vi: "Nắng đầu ngày đổ xuống mặt tường, biển còn yên.",
          en: "The day's first light falls across the wall while the sea stays still.",
        },
      },
      {
        slotId: "qterra-day-pool",
        time: "06:00",
        label: "Pool",
        statement: { vi: "Vài vòng bơi trước khi thành phố thức dậy hẳn.", en: "A few laps before the city fully wakes." },
      },
      {
        slotId: "qterra-day-coffee",
        time: "07:00",
        label: "Coffee",
        statement: {
          vi: "Cà phê dưới chân toà, đúng nhịp quán quen của Quy Nhơn.",
          en: "Coffee at the foot of the tower, right on Quy Nhon's familiar rhythm.",
        },
      },
      {
        slotId: "qterra-day-city",
        time: "08:00 – 17:00",
        label: "City",
        statement: {
          vi: "Mọi việc trong ngày nằm trong bán kính đi bộ.",
          en: "Everything the day needs sits within walking distance.",
        },
      },
      {
        slotId: "qterra-day-sunset",
        time: "18:00",
        label: "Sunset",
        statement: {
          vi: "Ánh chiều chuyển màu vật liệu sang sắc đất.",
          en: "The evening light turns the material's surface to the color of earth.",
        },
      },
      {
        slotId: "qterra-day-dining",
        time: "19:30",
        label: "Dining",
        statement: {
          vi: "Bữa tối gần nhà, không cần rời trung tâm.",
          en: "Dinner close to home, with no need to leave the center.",
        },
      },
      {
        slotId: "qterra-day-night",
        time: "22:00",
        label: "Night",
        statement: {
          vi: "Thành phố lặng dần, chỉ còn tiếng biển phía xa.",
          en: "The city settles into quiet, leaving only the sound of the sea.",
        },
      },
    ],
  },

  amenities: {
    eyebrow: { vi: "Tiện ích", en: "Amenities" },
    headline: { vi: "Bốn không gian, bốn cách sử dụng một ngày", en: "Four spaces, four ways to use a day" },
    chapters: [
      {
        slotId: "qterra-amen-arrival",
        kicker: "Tầng 1 · Arrival",
        title: { vi: "Sảnh đón và mặt phố dịch vụ", en: "Arrival hall and street-level retail" },
        desc: {
          vi: "Lớp tiếp xúc đầu tiên giữa toà nhà và thành phố: sảnh lễ tân, lounge và khối thương mại mở ra đường Ngô Mây.",
          en: "The building's first point of contact with the city: a reception lobby, lounge and retail podium opening onto Ngo May street.",
        },
        items: [
          { vi: "Sảnh lễ tân", en: "Reception lobby" },
          { vi: "Sảnh lounge", en: "Lounge" },
          { vi: "Sảnh thang máy", en: "Elevator lobby" },
          { vi: "Thương mại & dịch vụ", en: "Retail & services" },
        ],
        direction: "row",
      },
      {
        slotId: "qterra-amen-wellness",
        kicker: "Tầng 2 · Wellness",
        title: { vi: "Giữ nhịp cơ thể và trí óc", en: "A rhythm for body and mind" },
        desc: {
          vi: "Một tầng dành cho vận động và tĩnh lặng, cùng không gian riêng cho gia đình và trẻ em.",
          en: "A floor set aside for movement and stillness, with dedicated space for families and children.",
        },
        items: [
          { vi: "Gym", en: "Gym" },
          { vi: "Pilates", en: "Pilates" },
          { vi: "Yoga", en: "Yoga" },
          { vi: "Thư viện", en: "Library" },
          { vi: "Không gian gia đình & trẻ em", en: "Family & children's space" },
        ],
        direction: "row-reverse",
      },
      {
        slotId: "qterra-amen-water",
        kicker: "Tầng 21 · Water",
        title: { vi: "Tầng của nước và ánh nắng", en: "A floor of water and light" },
        desc: {
          vi: "Hồ bơi vô cực, khu ngâm nóng Onsen và bar hồ bơi — tầng tiện ích trung tâm nhìn ra thành phố biển.",
          en: "An infinity pool, an Onsen hot-spring area and a pool bar — the central amenity floor overlooking the coastal city.",
        },
        items: [
          { vi: "Hồ bơi vô cực", en: "Infinity pool" },
          { vi: "Onsen", en: "Onsen" },
          { vi: "Phòng xông hơi", en: "Sauna" },
          { vi: "Hồ bơi trẻ em", en: "Kids' pool" },
          { vi: "Bar hồ bơi", en: "Pool bar" },
          { vi: "Khu BBQ", en: "BBQ area" },
          { vi: "Khu vui chơi trẻ em", en: "Kids' play area" },
        ],
        direction: "row",
      },
      {
        slotId: "qterra-amen-sky",
        kicker: "Tầng thượng · Sky",
        title: { vi: "Lớp trên cùng của một ngày", en: "The top layer of a day" },
        desc: {
          vi: "Vườn cảnh quan, lối dạo bộ trên cao và bar tầng thượng — nơi kết thúc một ngày ở Quy Nhơn.",
          en: "A landscaped garden, an elevated walking path and a rooftop bar — where a day in Quy Nhon comes to a close.",
        },
        items: [
          { vi: "Vườn cảnh quan trên cao", en: "Elevated garden" },
          { vi: "Bar tầng thượng", en: "Rooftop bar" },
          { vi: "Vườn thư giãn", en: "Relaxation garden" },
          { vi: "Không gian cộng đồng", en: "Community space" },
          { vi: "Lối dạo bộ trên cao", en: "Elevated walking path" },
        ],
        direction: "row-reverse",
      },
    ],
  },

  views: {
    headline: { vi: "Biển, nhìn từ trong nhà", en: "The sea, seen from home" },
    body: {
      vi: "Hướng view từng căn sẽ được xác nhận cùng dữ liệu căn hộ",
      en: "Unit-specific views will be confirmed together with the apartment data",
    },
    placeholderLabel: { vi: "Biển Quy Nhơn, full-bleed ngang", en: "Quy Nhon sea — full-bleed photo" },
    tone: "ocean-blue",
  },

  residences: {
    eyebrow: { vi: "Căn hộ", en: "Residences" },
    headline: { vi: "Sáu cấu hình căn hộ điển hình", en: "Six typical residence layouts" },
    body: {
      vi: "Chọn một loại căn để xem diện tích tim tường (NFA) và thông thuỷ (NSA) theo bộ mặt bằng căn hộ điển hình của dự án.",
      en: "Select a unit type to view its net floor area (NFA) and net saleable area (NSA), based on the project's typical floor plan set.",
    },
    unitTypeAria: { vi: "Loại căn hộ", en: "Unit type" },
    nfaLabel: { vi: "Diện tích tim tường · NFA", en: "Net Floor Area · NFA" },
    nsaLabel: { vi: "Diện tích thông thuỷ · NSA", en: "Net Saleable Area · NSA" },
    unitCtaLabel: { vi: "Nhận tư vấn căn này", en: "Inquire about this unit" },
    unitCtaHref: "#lead",
    unitCtaFloorplanLabel: { vi: "Xem mặt bằng tầng", en: "View floor plans" },
    unitCtaFloorplanHref: "#floorplans",
    footnote: {
      vi: "Nguồn: bộ mặt bằng căn hộ điển hình Q'Terra. Thông tin và hình ảnh trong tài liệu bán hàng mang tính tương đối, các cam kết chính thức được quy định tại Hợp đồng mua bán.",
      en: "Source: Q'Terra's typical unit floor plan set. Information and images in sales materials are indicative; official commitments are set out in the Sale and Purchase Agreement.",
    },
    items: [
      {
        key: "studio",
        name: { vi: "Studio", en: "Studio" },
        tag: { vi: "Mẫu có đối xứng", en: "Mirrored layout" },
        nfa: "35.90 – 41.80 m²",
        nsa: "32.10 – 37.90 m²",
        desc: {
          vi: "Cấu hình gọn nhất của dự án, phù hợp người ở độc thân hoặc khai thác cho thuê ngắn hạn tại trung tâm thành phố.",
          en: "The project's most compact layout, suited to single occupants or short-term rental in the city center.",
        },
      },
      {
        key: "studio-f",
        name: { vi: "Studio F", en: "Studio F" },
        tag: { vi: "Mẫu có đối xứng", en: "Mirrored layout" },
        nfa: "35.90 – 36.20 m²",
        nsa: "32.10 – 32.60 m²",
        desc: {
          vi: "Biến thể Studio với bố cục mặt bằng riêng, giữ nguyên tinh thần tối giản và tối ưu diện tích sử dụng.",
          en: "A Studio variant with its own floor layout, keeping the same minimal spirit and optimized use of space.",
        },
      },
      {
        key: "studio-fplus",
        name: { vi: "Studio F+", en: "Studio F+" },
        tag: { vi: "Mẫu có đối xứng", en: "Mirrored layout" },
        nfa: "35.90 m²",
        nsa: "32.30 – 32.60 m²",
        desc: {
          vi: "Phiên bản mở rộng của Studio F, chênh lệch chủ yếu ở phần diện tích thông thuỷ.",
          en: "An expanded version of Studio F, differing mainly in net saleable area.",
        },
      },
      {
        key: "1br",
        name: { vi: "1 phòng ngủ", en: "1 Bedroom" },
        tag: { vi: "Một phòng ngủ tách biệt", en: "Separate bedroom layout" },
        nfa: "56.40 m²",
        nsa: "52.70 m²",
        desc: {
          vi: "Phòng ngủ tách khỏi khu sinh hoạt chung — lựa chọn cho cặp đôi hoặc gia đình nhỏ sống tại trung tâm.",
          en: "A bedroom separated from the living area — a choice for couples or small families living in the center.",
        },
      },
      {
        key: "2br",
        name: { vi: "2 phòng ngủ", en: "2 Bedroom" },
        tag: { vi: "Mẫu có đối xứng", en: "Mirrored layout" },
        nfa: "60.60 – 62.80 m²",
        nsa: "56.30 – 58.60 m²",
        desc: {
          vi: "Hai phòng ngủ trong diện tích vừa phải, cân bằng giữa nhu cầu ở của gia đình và khả năng khai thác.",
          en: "Two bedrooms in a moderate footprint, balancing family living needs with rental potential.",
        },
      },
      {
        key: "2br-premium",
        name: { vi: "2 phòng ngủ Premium", en: "2 Bedroom Premium" },
        tag: { vi: "Mẫu có đối xứng", en: "Mirrored layout" },
        nfa: "74.90 – 77.50 m²",
        nsa: "66.90 – 69.00 m²",
        desc: {
          vi: "Cấu hình lớn nhất trong bộ mặt bằng điển hình, không gian sinh hoạt chung rộng hơn rõ rệt.",
          en: "The largest layout in the typical unit set, with a noticeably larger shared living area.",
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
        title: { vi: "Q'Terra đang xây đến đâu?", en: "How far along is Q'Terra?" },
        description: {
          vi: "Cập nhật thực tế công trường và tiến độ thi công tại 01 Ngô Mây.",
          en: "A real look at the construction site and progress at 01 Ngo May.",
        },
        topicSlug: "construction-progress",
        prefillNeed: "Tìm hiểu dự án",
        enabled: true,
        sortOrder: 1,
      },
      {
        key: "1br-location",
        contentType: "product-guide",
        title: { vi: "Đâu là căn 1PN có vị trí đẹp?", en: "Which 1-Bedroom units have the best position?" },
        description: {
          vi: "So sánh hướng nhìn và vị trí tầng giữa các căn 1 phòng ngủ tại Q'Terra.",
          en: "Comparing views and floor position across Q'Terra's 1-Bedroom units.",
        },
        topicSlug: "1br-location",
        prefillNeed: "Quan tâm Q'Terra",
        enabled: true,
        sortOrder: 2,
      },
    ],
  },

  floorPlans: {
    eyebrow: { vi: "Mặt bằng", en: "Floor Plans" },
    headline: { vi: "Tổng thể, tiện ích và từng tầng căn hộ", en: "Master plan, amenities and residential floors" },
    zoomBtn: { vi: "Phóng to", en: "Zoom in" },
    closeAria: { vi: "Đóng", en: "Close" },
    footnote: {
      vi: "Hình ảnh mặt bằng mang tính tương đối, có thể được điều chỉnh theo quyết định của Chủ đầu tư tại từng thời điểm.",
      en: "Floor plan images are indicative and may be adjusted at the developer's discretion.",
    },
    ctaLabel: { vi: "Nhận mặt bằng chi tiết →", en: "Request detailed floor plans →" },
    ctaHref: "#lead",
    groupLabels: {
      master: { vi: "Tổng thể", en: "Master Plan" },
      amenities: { vi: "Tiện ích", en: "Amenities" },
      floors: { vi: "Mặt bằng tầng", en: "Residential Floors" },
    },
    items: [
      {
        key: "tong-the",
        group: "master",
        name: { vi: "Mặt bằng tổng thể", en: "Master Plan" },
        src: "/images/qterra/floorplans/site-masterplan.jpg",
        alt: { vi: "Mặt bằng tổng thể Q'Terra tại 01 Ngô Mây, Quy Nhơn", en: "Q'Terra master plan at 01 Ngo May, Quy Nhon" },
        caption: {
          vi: "Vị trí toà nhà tại giao lộ Ngô Mây – An Dương Vương – Xuân Diệu, đối diện công viên Thiếu Nhi và bãi biển Quy Nhơn.",
          en: "The building sits at the intersection of Ngo May, An Duong Vuong and Xuan Dieu, facing Thieu Nhi Park and Quy Nhon beach.",
        },
      },
      {
        key: "ti-1",
        group: "amenities",
        name: { vi: "Tầng 1", en: "Floor 1" },
        src: "/images/qterra/floorplans/amenity-floor-1.jpg",
        alt: { vi: "Mặt bằng tiện ích tầng 1", en: "Floor 1 amenity plan" },
        caption: {
          vi: "Tầng 1: sảnh lễ tân, sảnh lounge, sảnh thang máy và không gian thương mại – dịch vụ.",
          en: "Floor 1: reception lobby, lounge, elevator lobby and retail & services space.",
        },
      },
      {
        key: "ti-2",
        group: "amenities",
        name: { vi: "Tầng 2", en: "Floor 2" },
        src: "/images/qterra/floorplans/amenity-floor-2.jpg",
        alt: { vi: "Mặt bằng tiện ích tầng 2", en: "Floor 2 amenity plan" },
        caption: {
          vi: "Tầng 2: gym, pilates, yoga, thư viện, không gian gia đình & trẻ em và khu thương mại – dịch vụ.",
          en: "Floor 2: gym, pilates, yoga, library, family & children's space and retail & services.",
        },
      },
      {
        key: "ti-21",
        group: "amenities",
        name: { vi: "Tầng 21", en: "Floor 21" },
        src: "/images/qterra/floorplans/amenity-floor-21.jpg",
        alt: { vi: "Mặt bằng tiện ích tầng 21", en: "Floor 21 amenity plan" },
        caption: {
          vi: "Tầng 21: khu ngâm nóng Onsen, phòng xông hơi, hồ bơi vô cực, hồ bơi trẻ em, bar hồ bơi, khu vui chơi trẻ em và khu BBQ.",
          en: "Floor 21: Onsen hot-spring area, sauna, infinity pool, kids' pool, pool bar, kids' play area and BBQ area.",
        },
      },
      {
        key: "ti-tt",
        group: "amenities",
        name: { vi: "Tầng thượng", en: "Rooftop" },
        src: "/images/qterra/floorplans/amenity-rooftop.jpg",
        alt: { vi: "Mặt bằng tiện ích tầng thượng", en: "Rooftop amenity plan" },
        caption: {
          vi: "Tầng thượng: vườn cảnh quan trên cao, bar tầng thượng, vườn thư giãn, không gian cộng đồng và lối dạo bộ trên cao.",
          en: "Rooftop: elevated garden, rooftop bar, relaxation garden, community space and elevated walking path.",
        },
      },
      {
        key: "f-3-20",
        group: "floors",
        name: { vi: "Tầng 3–11 & 12a–20", en: "Floors 3–11 & 12a–20" },
        src: "/images/qterra/floorplans/floor-3-20.jpg",
        alt: { vi: "Mặt bằng tầng 3-11 và 12a-20", en: "Floor plan for floors 3-11 and 12a-20" },
        caption: { vi: "Mặt bằng tầng căn hộ điển hình khối thấp – trung.", en: "Typical residential floor plan for the low- to mid-rise block." },
      },
      {
        key: "f-12",
        group: "floors",
        name: { vi: "Tầng 12", en: "Floor 12" },
        src: "/images/qterra/floorplans/floor-12.jpg",
        alt: { vi: "Mặt bằng tầng 12", en: "Floor 12 plan" },
        caption: { vi: "Mặt bằng tầng 12.", en: "Floor 12 plan." },
      },
      {
        key: "f-22-39",
        group: "floors",
        name: { vi: "Tầng 22–30 & 32–39", en: "Floors 22–30 & 32–39" },
        src: "/images/qterra/floorplans/floor-22-39.jpg",
        alt: { vi: "Mặt bằng tầng 22-30 và 32-39", en: "Floor plan for floors 22-30 and 32-39" },
        caption: { vi: "Mặt bằng tầng căn hộ điển hình khối cao.", en: "Typical residential floor plan for the high-rise block." },
      },
      {
        key: "f-31",
        group: "floors",
        name: { vi: "Tầng 31", en: "Floor 31" },
        src: "/images/qterra/floorplans/floor-31.jpg",
        alt: { vi: "Mặt bằng tầng 31", en: "Floor 31 plan" },
        caption: { vi: "Mặt bằng tầng 31.", en: "Floor 31 plan." },
      },
    ],
  },

  investment: {
    eyebrow: { vi: "Giá trị & đầu tư", en: "Value & Investment" },
    navLabel: { vi: "Đầu tư", en: "Investment" },
    headline: { vi: "Vì sao tài sản này đáng cân nhắc", en: "Why this asset is worth considering" },
    headlineMaxWidth: { vi: "18ch", en: "26ch" },
    points: [
      {
        num: "01",
        title: { vi: "Vị trí trung tâm đã hình thành", en: "An already-established central location" },
        desc: {
          vi: "01 Ngô Mây nằm trong phần thành phố đã có sẵn hạ tầng, dân cư và dịch vụ — không phụ thuộc vào kỳ vọng phát triển tương lai.",
          en: "01 Ngo May sits within a part of the city that already has infrastructure, residents and services in place — it does not depend on future development promises.",
        },
      },
      {
        num: "02",
        title: { vi: "Sản phẩm căn hộ trung tâm", en: "A central residential product" },
        desc: {
          vi: "Quy mô 864 căn hộ tại khu vực trung tâm, phù hợp cả nhu cầu ở và khai thác cho thuê.",
          en: "864 residences in the central area, suited to both owner-occupiers and rental investors.",
        },
      },
      {
        num: "03",
        title: { vi: "Nhu cầu lưu trú của thành phố biển", en: "A coastal city's steady demand for stays" },
        desc: {
          vi: "Quy Nhơn duy trì lượng khách du lịch và nhu cầu lưu trú ổn định theo mùa.",
          en: "Quy Nhon maintains steady seasonal tourist arrivals and accommodation demand.",
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
    pricingTitle: { vi: "Bảng giá & chính sách bán hàng", en: "Pricing & sales policy" },
    pricingBody: {
      vi: "Chỉ phát hành theo thông tin chính thức từ đơn vị phát triển dự án. Base Land Quy Nhơn gửi bảng giá mới nhất tới khách hàng khi có cập nhật.",
      en: "Released only from official information provided by the project developer. Base Land Quy Nhon shares the latest pricing with clients as updates become available.",
    },
    pricingCtaLabel: { vi: "Nhận bảng giá mới nhất", en: "Request latest pricing" },
    pricingCtaHref: "#lead",
  },

  documents: {
    eyebrow: { vi: "Thông tin dự án", en: "Project Information" },
    headline: { vi: "Kiểm chứng thông tin trước khi quyết định", en: "Verify the information before you decide" },
    ctaLabel: { vi: "Nhận tài liệu →", en: "Request documents →" },
    ctaHref: "#lead",
    items: [
      { name: { vi: "Brochure dự án", en: "Project brochure" }, note: { vi: "Tổng quan Q'Terra, vị trí và tiện ích", en: "Overview of Q'Terra, location and amenities" } },
      {
        name: { vi: "Mặt bằng tầng & loại căn", en: "Floor plans & unit types" },
        note: {
          vi: "Bộ mặt bằng tổng thể, tiện ích, mặt bằng tầng và căn hộ điển hình",
          en: "Master plan, amenity floors, residential floors and typical unit layouts",
        },
      },
      {
        name: { vi: "Thông tin pháp lý", en: "Legal information" },
        note: { vi: "Chỉ cung cấp tài liệu được phép công bố", en: "Only documents cleared for disclosure are provided" },
      },
      {
        name: { vi: "Project presentation", en: "Project presentation" },
        note: { vi: "Bản trình bày dành cho khách hàng quan tâm", en: "A presentation for interested clients" },
      },
    ],
  },

  legal: {
    body: {
      vi: "Q'Terra được phân phối bởi Base Land Quy Nhơn — đơn vị tư vấn tại chính thành phố này, làm việc với dữ liệu đã xác minh.",
      en: "Q'Terra is marketed by Base Land Quy Nhon — an advisory team based in this city, working from verified data.",
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
          vi: "Chỉ công bố dữ liệu đã được xác nhận từ tài liệu chính thức.",
          en: "Only data confirmed by official documentation is disclosed.",
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
    headline: { vi: "Đăng ký tư vấn dự án Q'Terra Quy Nhơn", en: "Register for consultation on Q'Terra Quy Nhon" },
    headlineMaxWidth: { vi: "20ch", en: "30ch" },
    body: {
      vi: "Chuyên viên Base Land Quy Nhơn sẽ liên hệ, gửi tài liệu và thông tin căn hộ ngay khi được phát hành chính thức.",
      en: "A Base Land Quy Nhon advisor will contact you and share documents and unit information as soon as they are officially released.",
    },
    callNowLabel: { vi: "Gọi ngay", en: "Call now" },
    leadSource: "qterra",
  },
};
