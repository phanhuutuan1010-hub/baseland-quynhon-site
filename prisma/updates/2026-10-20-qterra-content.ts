// One-off content update for /projects/qterra (20/10/2026) — writes straight
// into the same DB rows the Admin CMS edits, so everything below stays
// editable from /admin/projects afterwards. Re-running is safe (upserts).
// Sales Phases (launch date/timeline) is deliberately NOT touched.
//
//   npx tsx prisma/updates/2026-10-20-qterra-content.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, type Prisma, type ProjectSectionType } from "@prisma/client";

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

const L = (vi: string, en: string) => ({ vi, en });
const SOURCE = "qterra.vn";
const UPDATED = "20/10/2026";
const verified = (label: [string, string], note: [string, string]) => ({
  label: L(...label),
  note: L(...note),
  source: SOURCE,
  verified: true,
  lastUpdated: UPDATED,
});

const stats = {
  items: [
    {
      value: "39",
      label: L("Tầng · tháp đôi", "Floors · twin towers"),
      note: L("Hai tháp cao 39 tầng tại giao lộ trung tâm 01 Ngô Mây.", "Two 39-storey towers on a central intersection at 01 Ngo May."),
    },
    {
      value: "864",
      animated: true,
      label: L("Căn hộ", "Residences"),
      note: L("Tổng số căn hộ của dự án.", "Total number of apartments in the project."),
    },
    {
      value: "50m",
      label: L("Đến biển", "To the beach"),
      note: L("Khoảng 3–5 phút đi bộ ra bãi biển Quy Nhơn.", "About a 3–5 minute walk to Quy Nhon beach."),
    },
    {
      value: "4",
      label: L("Tầng tiện ích", "Amenity floors"),
      note: L("Tầng trệt, tầng 2, tầng 21 và tầng 39.", "Ground floor, floors 2, 21 and 39."),
    },
  ],
};

const towers = {
  eyebrow: L("Hai tháp", "Two Towers"),
  headline: L("Một địa chỉ, [[hai cách lưu trú]]", "One address, [[two ways to stay]]"),
  navLabel: L("Hai tháp", "Towers"),
  towers: [
    {
      key: "courtyard",
      name: L("Courtyard by Marriott", "Courtyard by Marriott"),
      subtitle: L("Tháp khách sạn 5 sao", "5-star hotel tower"),
      description: L(
        "Một tháp dành cho khách sạn mang thương hiệu Courtyard by Marriott, vận hành theo tiêu chuẩn 5 sao — đón khách lưu trú ngay giữa trung tâm thành phố biển.",
        "One tower is given to a Courtyard by Marriott hotel, run to five-star standards — bringing guests right into the center of the coastal city.",
      ),
      characteristics: [L("Khách sạn 5 sao", "5-star hotel"), L("Thương hiệu Marriott", "Marriott brand")],
      image: { src: "", alt: L("", "") },
      placeholderLabel: L("Tháp khách sạn Courtyard by Marriott — ảnh phối cảnh", "Courtyard by Marriott hotel tower — rendering"),
    },
    {
      key: "qterra-residences",
      name: L("Q'Terra", "Q'Terra"),
      subtitle: L("Tháp căn hộ khách sạn", "Hotel-apartment tower"),
      description: L(
        "Tháp căn hộ khách sạn do CBRE vận hành. Nội thất do RED Design Group thiết kế, bàn giao đủ 100% nội thất rời — có thể sử dụng ngay khi nhận nhà.",
        "The hotel-apartment tower is operated by CBRE. Interiors are designed by RED Design Group and handed over with 100% loose furniture — ready to use from day one.",
      ),
      characteristics: [
        L("Vận hành: CBRE", "Operated by CBRE"),
        L("Nội thất: RED Design Group", "Interiors: RED Design Group"),
        L("Bàn giao 100% nội thất rời", "100% loose furniture included"),
      ],
      image: { src: "", alt: L("", "") },
      placeholderLabel: L("Tháp căn hộ khách sạn Q'Terra — ảnh phối cảnh", "Q'Terra hotel-apartment tower — rendering"),
      ctaLabel: L("Nhận tư vấn căn hộ", "Ask about the apartments"),
      ctaHref: "#lead",
    },
  ],
};

const location = {
  eyebrow: L("Vị trí", "Location"),
  headline: L("Thành phố bắt đầu [[ngay trước cửa]]", "The city starts [[at your door]]"),
  body: L(
    "Q'Terra nằm ở giao điểm bốn tuyến Ngô Mây, An Dương Vương, Xuân Diệu và Diên Hồng, đối diện Quảng trường Nguyễn Tất Thành. Thời gian di chuyển dưới đây mang tính tham khảo.",
    "Q'Terra sits where four streets meet — Ngo May, An Duong Vuong, Xuan Dieu and Dien Hong — facing Nguyen Tat Thanh Square. Travel times below are indicative.",
  ),
  // mapImage / benefits deliberately not set: keep whatever images the
  // admin already uploaded (the journey timeline replaces the benefits grid).
  journey: [
    {
      tier: L("1–5 phút", "1–5 min"),
      landmarks: [
        L("Quảng trường Nguyễn Tất Thành", "Nguyen Tat Thanh Square"),
        L("Bãi biển Quy Nhơn", "Quy Nhon beach"),
        L("Ga Quy Nhơn", "Quy Nhon railway station"),
      ],
    },
    {
      tier: L("5–15 phút", "5–15 min"),
      landmarks: [
        L("Tháp Đôi", "Thap Doi Cham towers"),
        L("Bãi Trứng", "Bai Trung beach"),
        L("Ghềnh Ráng", "Ghenh Rang"),
        L("Nhà lưu niệm Hàn Mặc Tử", "Han Mac Tu memorial house"),
      ],
    },
    {
      tier: L("20–40 phút", "20–40 min"),
      landmarks: [
        L("Eo Gió", "Eo Gio"),
        L("Kỳ Co", "Ky Co"),
        L("Nhơn Lý", "Nhon Ly"),
        L("Cù Lao Xanh", "Cu Lao Xanh island"),
        L("Tháp Bánh Ít", "Banh It towers"),
      ],
    },
    {
      tier: L("40–50 phút", "40–50 min"),
      landmarks: [L("Sân bay Phù Cát", "Phu Cat Airport")],
    },
  ],
};

const verification = {
  eyebrow: L("Thông tin đã xác nhận", "Verified facts"),
  headline: L("Các thông tin chính và [[nguồn gốc]]", "The key facts and [[where they come from]]"),
  body: L(
    "Base Land Quy Nhơn đối chiếu các thông tin dưới đây với công bố chính thức của chủ đầu tư trước khi đưa lên trang.",
    "Base Land Quy Nhon checks the facts below against the developer's official announcements before publishing them here.",
  ),
  items: [
    verified(
      ["Chủ đầu tư", "Developer"],
      [
        "Công ty Cổ phần Đầu tư Bất động sản Ngô Mây · Mã số ĐKKD 4101553978.",
        "Ngo May Real Estate Investment JSC · Business registration no. 4101553978.",
      ],
    ),
    verified(["Quy mô", "Scale"], ["Tháp đôi 39 tầng, 864 căn hộ, 4 tầng tiện ích.", "Twin 39-storey towers, 864 apartments, 4 amenity floors."]),
    verified(
      ["Vị trí", "Location"],
      [
        "Giao điểm Ngô Mây – An Dương Vương – Xuân Diệu – Diên Hồng, đối diện Quảng trường Nguyễn Tất Thành, cách biển khoảng 50m.",
        "At the junction of Ngo May, An Duong Vuong, Xuan Dieu and Dien Hong, facing Nguyen Tat Thanh Square, about 50m from the sea.",
      ],
    ),
    verified(
      ["Thương hiệu & vận hành", "Brand & operator"],
      [
        "Tháp khách sạn 5 sao Courtyard by Marriott; tháp căn hộ khách sạn Q'Terra do CBRE vận hành.",
        "A 5-star Courtyard by Marriott hotel tower; the Q'Terra hotel-apartment tower is operated by CBRE.",
      ],
    ),
    verified(
      ["Nội thất", "Interiors"],
      ["Thiết kế bởi RED Design Group, bàn giao 100% nội thất rời.", "Designed by RED Design Group, handed over with 100% loose furniture."],
    ),
    verified(
      ["Cơ cấu căn hộ", "Unit mix"],
      [
        "Studio 32–38 m² (~67% quỹ căn), 1PN 52,7 m² (2 căn), 2PN 72,1–77,6 m² (142 căn), 2PN góc 75–77 m² (144 căn); 24 căn mỗi tầng điển hình.",
        "Studio 32–38 m² (~67% of units), 1BR 52.7 m² (2 units), 2BR 72.1–77.6 m² (142 units), 2BR corner 75–77 m² (144 units); 24 units per typical floor.",
      ],
    ),
    verified(
      ["Giá & thanh toán (dự kiến)", "Pricing & payment (indicative)"],
      [
        "Từ 55 triệu/m², booking 50 triệu, 3 phương thức thanh toán — dự kiến, áp dụng theo từng đợt mở bán.",
        "From VND 55 million/m², VND 50 million booking, 3 payment plans — indicative, applied per sales release.",
      ],
    ),
    verified(
      ["Phân phối", "Distribution"],
      ["Base Land là đối tác phân phối chính thức của dự án.", "Base Land is an official distribution partner of the project."],
    ),
  ],
};

const legal = {
  body: L(
    "Base Land Quy Nhơn tư vấn Q'Terra [[ngay tại thành phố]], dựa trên dữ liệu đã xác minh.",
    "Base Land Quy Nhon advises on Q'Terra [[right here in the city]], using verified data.",
  ),
  points: [
    {
      label: L("Đối tác phân phối chính thức", "Official distribution partner"),
      desc: L("Base Land là đối tác phân phối chính thức của Q'Terra, có tên trên qterra.vn.", "Base Land is an official distribution partner of Q'Terra, listed on qterra.vn."),
    },
    {
      label: L("Tư vấn tại Quy Nhơn", "Advisors based in Quy Nhon"),
      desc: L("Đội ngũ làm việc trực tiếp tại thành phố, đi thực địa cùng khách hàng.", "A team working directly in the city, visiting the site together with clients."),
    },
    {
      label: L("Thông tin minh bạch", "Transparent information"),
      desc: L("Chỉ công bố dữ liệu đã được xác nhận từ tài liệu chính thức.", "Only data confirmed by official documentation is disclosed."),
    },
    {
      label: L("Đồng hành dài hạn", "Long-term support"),
      desc: L("Hỗ trợ xuyên suốt từ tìm hiểu đến khi hoàn tất và bàn giao.", "Support throughout, from initial research to completion and handover."),
    },
  ],
  links: [
    { label: L("Website chủ đầu tư", "Developer website"), href: "https://qterra.vn" },
    { label: L("Tham quan 360°", "360° tour"), href: "https://360.qterra.vn" },
    { label: L("Hồ sơ pháp lý", "Legal documents"), href: "https://phaply.qterra.vn" },
  ],
};

const step = (milestone: [string, string], desc: [string, string]) => ({ milestone: L(...milestone), desc: L(...desc) });
const BOOKING = step(["T", "T"], ["Đặt chỗ (booking) 50 triệu", "Booking: VND 50 million"]);

const investmentPatch = {
  pricingBody: L(
    "Bảng giá chi tiết từng căn được gửi tới khách hàng khi chủ đầu tư công bố cho từng đợt mở bán.",
    "The detailed price list for each unit is sent to clients once the developer releases it for each sales phase.",
  ),
  priceFacts: [
    { label: L("Giá từ (dự kiến)", "From (indicative)"), value: L("55 triệu/m²", "VND 55M/m²") },
    { label: L("Căn nhỏ nhất", "Smallest unit"), value: L("~1,79 tỷ", "~VND 1.79B") },
    { label: L("Booking", "Booking"), value: L("50 triệu", "VND 50M") },
  ],
  paymentTitle: L("Phương thức thanh toán dự kiến", "Indicative payment plans"),
  paymentPlans: [
    {
      key: "pt1-loan-70",
      name: L("PT1 · Vay 70%", "Plan 1 · 70% loan"),
      summary: L("Ngân hàng cho vay đến 70%, lãi suất 8% trong 24 tháng.", "Bank financing up to 70%, at 8% interest for 24 months."),
      steps: [
        BOOKING,
        step(["T+7", "T+7"], ["Khách thanh toán 15%", "You pay 15%"]),
        step(["T+37", "T+37"], ["Ngân hàng giải ngân 35%", "Bank disburses 35%"]),
        step(["T+277", "T+277"], ["Khách thanh toán 5% · ngân hàng giải ngân 10%", "You pay 5% · bank disburses 10%"]),
        step(
          ["T+547", "T+547"],
          ["Bàn giao: khách thanh toán 10% + kinh phí bảo trì · ngân hàng giải ngân 20%", "Handover: you pay 10% + maintenance fund · bank disburses 20%"],
        ),
        step(["Nhận sổ", "Title deed"], ["Ngân hàng giải ngân 5%", "Bank disburses 5%"]),
      ],
    },
    {
      key: "pt2-standard",
      name: L("PT2 · Tiêu chuẩn", "Plan 2 · Standard"),
      summary: L("Thanh toán theo tiến độ, bình quân 3,75% mỗi tháng.", "Pay in stages, averaging 3.75% per month."),
      steps: [
        BOOKING,
        step(["T+7", "T+7"], ["Thanh toán 10%", "Pay 10%"]),
        step(["Hằng tháng", "Monthly"], ["Bình quân 3,75%/tháng", "Around 3.75% per month"]),
        step(["T+547", "T+547"], ["Bàn giao: thanh toán 25% + kinh phí bảo trì", "Handover: pay 25% + maintenance fund"]),
      ],
    },
    {
      key: "pt3-fast-70",
      name: L("PT3 · Nhanh 70%", "Plan 3 · 70% early"),
      summary: L("Thanh toán 70% trong 37 ngày đầu.", "70% paid within the first 37 days."),
      steps: [
        BOOKING,
        step(["T+7", "T+7"], ["Thanh toán 10%", "Pay 10%"]),
        step(["T+37", "T+37"], ["Thanh toán 60%", "Pay 60%"]),
        step(["T+547", "T+547"], ["Bàn giao: thanh toán 25% + kinh phí bảo trì", "Handover: pay 25% + maintenance fund"]),
        step(["Nhận sổ", "Title deed"], ["Thanh toán 5%", "Pay 5%"]),
      ],
    },
  ],
  paymentNote: L(
    "Giá và phương thức thanh toán là dự kiến, áp dụng theo từng đợt mở bán. T là ngày đặt chỗ, T+7 là 7 ngày sau đó. Điều khoản chính thức theo hợp đồng mua bán và chính sách của chủ đầu tư tại thời điểm giao dịch.",
    "Prices and payment plans are indicative and applied per sales release. T is the booking date; T+7 is 7 days later. Binding terms follow the sale and purchase agreement and the developer's policy at the time of the transaction.",
  ),
};

const unitMix = [
  {
    key: "studio",
    name: L("Studio (C1/C2/C3)", "Studio (C1/C2/C3)"),
    tag: L("Ba mẫu C1 · C2 · C3", "Three layouts: C1 · C2 · C3"),
    area: "32 – 38 m²",
    share: L("~67% quỹ căn", "~67% of units"),
    desc: L(
      "Cấu hình gọn nhất của dự án, phù hợp người ở độc thân hoặc khai thác cho thuê ngắn hạn tại trung tâm thành phố.",
      "The project's most compact layout, suited to single occupants or short-term rental in the city center.",
    ),
  },
  {
    key: "1br",
    name: L("1 phòng ngủ", "1 Bedroom"),
    tag: L("Số lượng giới hạn", "Limited number"),
    area: "52.7 m²",
    share: L("2 căn", "2 units"),
    desc: L(
      "Phòng ngủ tách khỏi khu sinh hoạt chung — lựa chọn cho cặp đôi hoặc gia đình nhỏ sống tại trung tâm.",
      "A bedroom separated from the living area — a choice for couples or small families living in the center.",
    ),
  },
  {
    key: "2br",
    name: L("2 phòng ngủ", "2 Bedroom"),
    tag: L("Căn tiêu chuẩn", "Standard layout"),
    area: "72.1 – 77.6 m²",
    share: L("142 căn", "142 units"),
    desc: L(
      "Hai phòng ngủ trong diện tích vừa phải, cân bằng giữa nhu cầu ở của gia đình và khả năng khai thác.",
      "Two bedrooms in a moderate footprint, balancing family living needs with rental potential.",
    ),
  },
  {
    key: "2br-corner",
    name: L("2 phòng ngủ góc", "2 Bedroom Corner"),
    tag: L("Vị trí góc tầng", "Corner position"),
    area: "75 – 77 m²",
    share: L("144 căn", "144 units"),
    desc: L(
      "Căn hai phòng ngủ ở vị trí góc tầng, có thêm mặt tiếp xúc với ánh sáng tự nhiên.",
      "A two-bedroom unit on the corner of the floor, with an extra side open to natural light.",
    ),
  },
].map((u) => ({ ...u, nfa: "", nsa: "", floorPlanImage: { src: "", alt: L("", "") } }));

// New unit key → old key whose uploaded floor-plan image carries over.
// "2PN Premium" (74.9–77.5 m²) matches the new "2PN góc" (75–77 m²).
const UNIT_IMAGE_FROM: Record<string, string> = { "2br-corner": "2br-premium" };

const residencesPatch = {
  body: L(
    "Chọn một loại căn để xem diện tích và tỷ trọng trong quỹ căn của dự án.",
    "Select a unit type to see its area and its share of the project's units.",
  ),
  items: unitMix,
  areaLabel: L("Diện tích", "Area"),
  shareLabel: L("Quỹ căn", "Share of units"),
  tableTitle: L("Cơ cấu căn hộ", "Unit mix"),
  typicalFloor: {
    title: L("Mặt bằng tầng điển hình", "Typical floor"),
    body: L("24 căn mỗi tầng, bố trí theo bốn hướng nhìn.", "24 units per floor, arranged across four outlooks."),
    orientations: [
      L("Hướng quảng trường biển", "Seaside square view"),
      L("Hướng biển", "Sea view"),
      L("Hướng Ghềnh Ráng – Tiên Sa", "Ghenh Rang – Tien Sa view"),
      L("Hướng thành phố", "City view"),
    ],
  },
  footnote: L(
    "Diện tích và cơ cấu căn mang tính tham khảo; các cam kết chính thức được quy định tại Hợp đồng mua bán.",
    "Areas and unit mix are indicative; official commitments are set out in the Sale and Purchase Agreement.",
  ),
};

const amenitiesPatch = {
  chapters: [
    {
      slotId: "qterra-amen-arrival",
      kicker: "G · Grand Lobby",
      title: L("Grand Lobby — sảnh đón giữa phố", "Grand Lobby — an arrival hall on the street"),
      desc: L(
        "Lớp tiếp xúc đầu tiên giữa toà nhà và thành phố: sảnh lễ tân, lounge và khối thương mại mở ra đường Ngô Mây.",
        "The building's first point of contact with the city: a reception lobby, lounge and retail podium opening onto Ngo May street.",
      ),
      items: [L("Grand Lobby", "Grand Lobby"), L("Sảnh lounge", "Lounge"), L("Sảnh thang máy", "Elevator lobby"), L("Thương mại & dịch vụ", "Retail & services")],
      direction: "row",
      image: { src: "", alt: L("", "") },
    },
    {
      slotId: "qterra-amen-wellness",
      kicker: "F2 · Generations",
      title: L("Tầng kết nối đa thế hệ", "A floor for every generation"),
      desc: L(
        "Không gian để các thế hệ trong gia đình cùng vận động, đọc sách và vui chơi trong cùng một tầng.",
        "Space for every generation of the family to exercise, read and play on the same floor.",
      ),
      items: [L("Gym", "Gym"), L("Pilates", "Pilates"), L("Yoga", "Yoga"), L("Thư viện", "Library"), L("Không gian gia đình & trẻ em", "Family & children's space")],
      direction: "row-reverse",
      image: { src: "", alt: L("", "") },
    },
    {
      slotId: "qterra-amen-water",
      kicker: "F21 · Water",
      title: L("Tầng của nước và ánh nắng", "A floor of water and light"),
      desc: L(
        "Hồ bơi vô cực, khu ngâm nóng Onsen và bar hồ bơi — tầng tiện ích trung tâm nhìn ra thành phố biển.",
        "An infinity pool, an Onsen hot-spring area and a pool bar — the central amenity floor overlooking the coastal city.",
      ),
      items: [
        L("Hồ bơi vô cực", "Infinity pool"),
        L("Onsen", "Onsen"),
        L("Sauna", "Sauna"),
        L("Khu BBQ", "BBQ area"),
        L("Kidzone", "Kidzone"),
        L("Pool bar", "Pool bar"),
      ],
      direction: "row",
      image: { src: "", alt: L("", "") },
    },
    {
      slotId: "qterra-amen-sky",
      kicker: "F39 · Sky Garden",
      title: L("Sky Garden — lớp trên cùng của một ngày", "Sky Garden — the top layer of a day"),
      desc: L(
        "Khu vườn trên tầng 39, nhìn trọn thành phố và biển khi một ngày ở Quy Nhơn khép lại.",
        "A garden on the 39th floor, taking in the city and the sea as a day in Quy Nhon draws to a close.",
      ),
      items: [L("Sky Garden", "Sky Garden"), L("Tầm nhìn thành phố & biển", "City & sea views")],
      direction: "row-reverse",
      image: { src: "", alt: L("", "") },
    },
  ],
};

const qualifiers = [
  {
    key: "region",
    label: L("Bạn đang ở khu vực nào?", "Where are you based?"),
    options: [
      L("Quy Nhơn", "Quy Nhon"),
      L("Gia Lai – Pleiku", "Gia Lai – Pleiku"),
      L("Bình Định khác", "Elsewhere in Binh Dinh"),
      L("Tây Nguyên khác", "Elsewhere in the Central Highlands"),
      L("Tỉnh khác", "Another province"),
    ],
  },
  {
    key: "purpose",
    label: L("Nhu cầu", "Purpose"),
    options: [
      L("Đầu tư cho thuê", "Rental investment"),
      L("Second home", "Second home"),
      L("Mua ở / nghỉ dưỡng", "To live in / holiday home"),
      L("Cần tư vấn", "I need advice"),
    ],
  },
  {
    key: "timeframe",
    label: L("Thời điểm dự kiến", "Timing"),
    options: [
      L("Sẵn tài chính", "Funds ready"),
      L("Chờ bảng giá", "Waiting for the price list"),
      L("3–6 tháng", "In 3–6 months"),
      L("Mới tham khảo", "Just browsing"),
    ],
  },
];

async function upsertSection(projectId: string, type: ProjectSectionType, content: object) {
  await prisma.projectSection.upsert({
    where: { projectId_type: { projectId, type } },
    update: { content: content as Prisma.InputJsonValue },
    create: { projectId, type, content: content as Prisma.InputJsonValue },
  });
}

async function main() {
  const project = await prisma.project.findUniqueOrThrow({
    where: { slug: "qterra" },
    include: { projectSections: true, residences: true, amenities: true, floorPlans: true },
  });
  const sectionContent = (type: ProjectSectionType) =>
    (project.projectSections.find((s) => s.type === type)?.content ?? {}) as Record<string, unknown>;

  await prisma.project.update({
    where: { id: project.id },
    data: {
      sections: { ...(project.sections as object), towers: true, verification: true },
      cta: { ...(project.cta as object), qualifiers },
    },
  });

  await upsertSection(project.id, "STATS", stats);
  await upsertSection(project.id, "TOWERS", towers);
  await upsertSection(project.id, "LOCATION", { ...sectionContent("LOCATION"), ...location });

  // Keep images already uploaded through Admin (production has real ones):
  // floor-plan images by unit key, amenity photos by slotId.
  type Img = { src: string; alt: unknown } | undefined;
  const prevUnits = ((project.residences?.content as { items?: { key: string; floorPlanImage?: Img }[] })?.items ?? []);
  const prevUnitImage = (key: string) => prevUnits.find((u) => u.key === (UNIT_IMAGE_FROM[key] ?? key))?.floorPlanImage;
  residencesPatch.items = residencesPatch.items.map((u) => ({ ...u, floorPlanImage: prevUnitImage(u.key)?.src ? (prevUnitImage(u.key) as typeof u.floorPlanImage) : u.floorPlanImage }));
  const prevChapters = ((project.amenities?.content as { chapters?: { slotId: string; image?: Img }[] })?.chapters ?? []);
  amenitiesPatch.chapters = amenitiesPatch.chapters.map((c) => {
    const img = prevChapters.find((p) => p.slotId === c.slotId)?.image;
    return img?.src ? { ...c, image: img as typeof c.image } : c;
  });
  await upsertSection(project.id, "VERIFICATION", verification);
  await upsertSection(project.id, "LEGAL", legal);
  await upsertSection(project.id, "INVESTMENT", { ...sectionContent("INVESTMENT"), ...investmentPatch });

  await prisma.projectResidences.update({
    where: { projectId: project.id },
    data: { content: { ...(project.residences?.content as object), ...residencesPatch } },
  });
  await prisma.projectAmenities.update({
    where: { projectId: project.id },
    data: { content: { ...(project.amenities?.content as object), ...amenitiesPatch } },
  });

  // Master-plan caption: align with the confirmed 4-street location.
  const floorPlans = project.floorPlans?.content as { items: { key: string; caption: unknown }[] } | undefined;
  if (floorPlans) {
    const items = floorPlans.items.map((item) =>
      item.key === "tong-the"
        ? {
            ...item,
            caption: L(
              "Toà nhà tại giao điểm Ngô Mây – An Dương Vương – Xuân Diệu – Diên Hồng, đối diện Quảng trường Nguyễn Tất Thành và bãi biển Quy Nhơn.",
              "The building sits where Ngo May, An Duong Vuong, Xuan Dieu and Dien Hong meet, facing Nguyen Tat Thanh Square and Quy Nhon beach.",
            ),
          }
        : item,
    );
    await prisma.projectFloorPlans.update({ where: { projectId: project.id }, data: { content: { ...floorPlans, items } as Prisma.InputJsonValue } });
  }

  console.log("Q'Terra content updated.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
