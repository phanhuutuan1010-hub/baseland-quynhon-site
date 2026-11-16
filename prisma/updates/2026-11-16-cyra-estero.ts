// Creates /projects/cyra-estero (16/11/2026) in the Admin CMS tables, on the
// standard (Q'Terra) layout with the "cyra" theme, and adds the project to
// the Homepage "Thêm lựa chọn" cards. Images are matched by file name in the
// Media Library (uploaded with `node upload-photos.js --dir …`); a missing
// image just leaves its field out.
//
// Data source: developer documents dated 11/11/2026 + cyraestero.vn. Base
// Land's own hotline/email come from Settings (never the developer's number).
//
//   npx tsx prisma/updates/2026-11-16-cyra-estero.ts              (refuses if the project exists)
//   npx tsx prisma/updates/2026-11-16-cyra-estero.ts --overwrite  (rewrites its content)
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, type Prisma, type ProjectSectionType } from "@prisma/client";
import { cyraPanorama } from "./2026-11-16-cyra-panorama";

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

const SLUG = "cyra-estero";
const L = (vi: string, en: string) => ({ vi, en });
const ILLUSTRATIVE = L("Hình ảnh minh họa", "Illustrative image");

type Img = { src: string; alt: { vi: string; en: string } };
let urls: Record<string, string> = {};
const missing = new Set<string>();

function img(file: string, altVi: string, altEn: string): Img | undefined {
  const src = urls[`cyra-${file}.webp`];
  if (!src) {
    missing.add(file);
    return undefined;
  }
  return { src, alt: L(altVi, altEn) };
}

function photo(file: string, captionVi: string, captionEn: string) {
  const i = img(file, `${captionVi} — căn hộ mẫu Cyra Estero (hình ảnh minh họa)`, `${captionEn} — Cyra Estero show apartment (illustrative)`);
  return i ? { src: i.src, alt: i.alt, caption: L(captionVi, captionEn) } : undefined;
}

const defined = <T,>(xs: (T | undefined)[]) => xs.filter((x): x is T => x !== undefined);

function build() {
  const hero = {
    eyebrow: L("Dự án do Base Land phân phối", "Distributed by Base Land"),
    badge: L("Dự án mới bên sông Hà Thanh", "New on the Ha Thanh River"),
    addressLine: L(
      "Huỳnh Tấn Phát – Lê Trọng Tấn – Hoàng Văn Thái · giáp sông Hà Thanh",
      "Huynh Tan Phat – Le Trong Tan – Hoang Van Thai · on the Ha Thanh River",
    ),
    subhead: L("Sống bên [[sông Hà Thanh]] — 210 căn hộ cho gia đình trẻ ở thực.", "Life by the [[Ha Thanh River]] — 210 homes for young families."),
    facts: L("18 tầng · 210 căn hộ · 8 shophouse · 100% căn có lô gia", "18 floors · 210 apartments · 8 shophouses · a loggia in every unit"),
    ctaExploreLabel: L("Khám phá dự án", "Explore"),
    ctaExploreHref: "#ly-do",
    ctaConsultLabel: L("Nhận bảng giá khi mở bán", "Get prices at launch"),
    ctaConsultHref: "#lead",
    // The original rendering (developer logo kept). On desktop the photo is
    // zoomed slightly around its right side so the logo printed in its
    // top-left sky moves out from under the site header.
    image: img("hero-thap-hoang-hon", "Phối cảnh tháp Cyra Estero bên sông Hà Thanh lúc hoàng hôn — hình ảnh minh họa", "Cyra Estero tower on the Ha Thanh River at sunset — illustrative rendering"),
    imageCrop: { scale: 1.15, originX: 1, originY: 0 },
    imageNote: ILLUSTRATIVE,
    cardImage: img("hero-thap-hoang-hon-4x3", "Phối cảnh Cyra Estero Quy Nhơn — hình ảnh minh họa", "Cyra Estero Quy Nhon rendering — illustrative"),
    navLabel: "Cyra Estero",
    layout: "compact",
  };

  const cta = {
    eyebrow: L("Liên hệ", "Contact"),
    headline: L("Nhận bảng giá & [[tư vấn chọn căn]]", "Get prices & [[unit advice]]"),
    body: L(
      "Chuyên viên Base Land Quy Nhơn gửi bảng giá ngay khi mở bán, kèm mặt bằng và tư vấn căn hợp với nhu cầu của bạn.",
      "A Base Land Quy Nhon advisor sends you the price list as soon as sales open, with floor plans and advice on the unit that fits you.",
    ),
    callNowLabel: L("Gọi ngay", "Call now"),
    benefitsTitle: L("Bạn sẽ nhận được", "You'll receive"),
    benefits: [
      L("Bảng giá & chính sách khi mở bán", "Price list & sales terms at launch"),
      L("Mặt bằng tầng & layout từng loại căn", "Floor plans & every unit layout"),
      L("Tư vấn chọn căn phù hợp", "Advice on the right unit"),
    ],
    leadSource: SLUG,
    qualifiers: [
      { key: "region", label: L("Khu vực", "Region"), options: [L("Quy Nhơn", "Quy Nhon"), L("Gia Lai – Pleiku", "Gia Lai – Pleiku"), L("Khác", "Other")] },
      {
        key: "purpose",
        label: L("Nhu cầu", "Looking for"),
        options: [
          L("Studio", "Studio"),
          L("1PN+1", "1BR+1"),
          L("2PN", "2BR"),
          L("2PN+1", "2BR+1"),
          L("3PN", "3BR"),
          L("Shophouse", "Shophouse"),
          L("Cần tư vấn", "Need advice"),
        ],
      },
    ],
  };

  const towers = {
    eyebrow: L("Vì sao Cyra Estero", "Why Cyra Estero"),
    headline: L("Bốn lý do để [[ở thực]] bên sông", "Four reasons to [[really live]] by the river"),
    navLabel: L("Tổng quan", "Overview"),
    towers: [],
    reasons: [
      {
        kicker: L("Vị trí", "Location"),
        title: L("Giáp sông Hà Thanh", "On the Ha Thanh River"),
        desc: L(
          "Nút giao Huỳnh Tấn Phát – Lê Trọng Tấn – Hoàng Văn Thái, ngay cạnh cầu.",
          "At the Huynh Tan Phat – Le Trong Tan – Hoang Van Thai junction, right by the bridge.",
        ),
      },
      {
        kicker: L("Căn hộ", "Homes"),
        title: L("100% căn có lô gia", "A loggia in every unit"),
        desc: L("210 căn hộ, 14 căn mỗi tầng, từ Studio đến 3 phòng ngủ.", "210 apartments, 14 per floor, from studios to three bedrooms."),
      },
      {
        kicker: L("Tiện ích", "Amenities"),
        title: L("25+ tiện ích", "25+ amenities"),
        desc: L(
          "Quảng trường Ánh Dương, nhà trẻ, hồ bơi tầng 3, đường dạo bộ ven sông.",
          "Anh Duong Square, a nursery, a level-3 pool and a riverside walk.",
        ),
      },
      {
        kicker: L("Đối tác", "Partners"),
        // Non-breaking spaces keep each partner name on one line.
        title: L("CNT\u00a0Group · GK\u00a0Archi · Decofi", "CNT\u00a0Group · GK\u00a0Archi · Decofi"),
        desc: L(
          "Chủ đầu tư CNT Group, thiết kế GK Archi, tổng thầu Decofi. Ngân hàng: Vietcombank, BIDV.",
          "Developer CNT Group, design by GK Archi, main contractor Decofi. Banks: Vietcombank, BIDV.",
        ),
      },
    ],
    actionLabel: L("Nhận bảng giá khi mở bán", "Get prices at launch"),
    actionHref: "#lead",
  };

  const location = {
    eyebrow: L("Vị trí", "Location"),
    headline: L("Bên sông Hà Thanh, [[cạnh cầu]]", "On the Ha Thanh River, [[by the bridge]]"),
    body: L(
      "Nút giao Huỳnh Tấn Phát – Lê Trọng Tấn – Hoàng Văn Thái. Trường đại học, chợ và bệnh viện trong 5–10 phút.",
      "At the Huynh Tan Phat – Le Trong Tan – Hoang Van Thai junction. A university, a market and a hospital within 5–10 minutes.",
    ),
    navLabel: L("Vị trí", "Location"),
    mapImage: img("so-do-vi-tri", "Sơ đồ vị trí và kết nối của Cyra Estero Quy Nhơn", "Cyra Estero Quy Nhon location and connections map"),
    mapPlaceholderLabel: L("Sơ đồ vị trí Cyra Estero", "Cyra Estero location map"),
    journey: [
      {
        tier: L("5–10 phút", "5–10 min"),
        landmarks: [
          L("ĐH FPT", "FPT University"),
          L("Chợ Dinh", "Dinh Market"),
          L("Quảng trường Nguyễn Tất Thành", "Nguyen Tat Thanh Square"),
          L("Sân vận động", "The stadium"),
          L("BV Đa khoa TT Gia Lai", "Gia Lai General Hospital"),
        ],
      },
      {
        tier: L("10–20 phút", "10–20 min"),
        landmarks: [
          L("GO! Quy Nhơn", "GO! Quy Nhon"),
          L("MM Mega Market", "MM Mega Market"),
          L("ĐH Quy Nhơn", "Quy Nhon University"),
          L("iSchool", "iSchool"),
          L("ĐH Quang Trung", "Quang Trung University"),
        ],
      },
      {
        tier: L("20–35 phút", "20–35 min"),
        landmarks: [L("Kỳ Co – Eo Gió", "Ky Co – Eo Gio"), L("Nhơn Lý", "Nhon Ly"), L("FLC Zoo Safari", "FLC Zoo Safari"), L("Sân bay Phù Cát", "Phu Cat Airport")],
      },
    ],
    benefits: [],
    actionLabel: L("Gọi ngay", "Call now"),
    actionHref: "call",
  };

  const architecture = {
    eyebrow: L("Kiến trúc", "Architecture"),
    headline: L("Tòa tháp 18 tầng [[bên sông]]", "An 18-storey tower [[by the river]]"),
    body: L(
      "18 tầng nổi, 2 tầng hầm, khối đế 8 shophouse. Thiết kế GK Archi, tổng thầu Decofi, giám sát Liên danh Trường Thịnh – Phương Nam. Hình ảnh minh họa.",
      "18 floors above ground, 2 basements and 8 podium shophouses. Designed by GK Archi, built by Decofi, supervised by the Truong Thinh – Phuong Nam joint venture. Illustrative image.",
    ),
    image: img("phoi-canh-toan-canh", "Phối cảnh toàn cảnh Cyra Estero bên sông Hà Thanh — hình ảnh minh họa", "Aerial view of Cyra Estero on the Ha Thanh River — illustrative rendering"),
    navLabel: L("Kiến trúc", "Architecture"),
  };

  const unit = (
    key: string,
    name: [string, string],
    need: [string, string],
    color: string,
    desc: [string, string],
    variants: { key: string; code: string; nfa: string; nsa: string; file: string }[],
  ) => {
    const v = variants.map((x) => ({
      key: x.key,
      name: L(x.code, x.code),
      nfa: `${x.nfa} m²`,
      nsa: `${x.nsa} m²`,
      floorPlanImage: img(x.file, `Layout căn ${x.code} (${name[0]}) — hình ảnh minh họa`, `${x.code} (${name[1]}) layout — illustrative`),
    }));
    const single = v.length === 1 ? v[0] : undefined;
    return {
      key,
      name: L(...name),
      tag: L(...need),
      color,
      nfa: single?.nfa ?? "",
      nsa: single?.nsa ?? "",
      desc: L(...desc),
      ...(single?.floorPlanImage ? { floorPlanImage: single.floorPlanImage } : {}),
      variants: v.length > 1 ? v : [],
    };
  };

  const showFlatPhotos = defined([
    photo("mau-phong-khach-toan-canh", "Phòng khách", "Living room"),
    photo("mau-phong-khach-1", "Phòng khách", "Living room"),
    photo("mau-phong-khach-2", "Phòng khách", "Living room"),
    photo("mau-ban-an", "Phòng khách & bàn ăn", "Living & dining"),
    photo("mau-bep", "Bếp", "Kitchen"),
    photo("mau-pn-master-1", "Phòng ngủ master", "Master bedroom"),
    photo("mau-pn-master-2", "Phòng ngủ master", "Master bedroom"),
    photo("mau-pn", "Phòng ngủ", "Bedroom"),
    photo("mau-pn-tre-em-1", "Phòng ngủ trẻ em", "Kids' bedroom"),
    photo("mau-pn-tre-em-2", "Phòng ngủ trẻ em", "Kids' bedroom"),
    photo("mau-pn-tre-em-3", "Phòng ngủ trẻ em", "Kids' bedroom"),
    photo("mau-lo-gia-1", "Lô gia", "Loggia"),
    photo("mau-lo-gia-2", "Lô gia", "Loggia"),
    photo("mau-khu-giat", "Khu giặt", "Laundry"),
    photo("mau-wc", "Phòng tắm", "Bathroom"),
  ]);

  const residences = {
    eyebrow: L("Căn hộ", "Residences"),
    headline: L("Chọn căn theo [[nhu cầu]]", "Choose by [[how you live]]"),
    body: L(
      "Chọn nhu cầu của bạn để xem mẫu căn, diện tích thông thủy và tim tường.",
      "Pick what you need to see the matching layout with its net and gross areas.",
    ),
    navLabel: L("Căn hộ", "Residences"),
    unitTypeAria: L("Loại căn hộ", "Unit type"),
    nfaLabel: L("Diện tích thông thủy", "Net area"),
    nsaLabel: L("Diện tích tim tường", "Gross area"),
    unitCtaLabel: L("Tư vấn căn này", "Ask about this unit"),
    unitCtaHref: "#lead",
    unitCtaFloorplanLabel: L("Xem mặt bằng tầng", "View floor plans"),
    unitCtaFloorplanHref: "#lead",
    footnote: L(
      "Diện tích theo tài liệu chủ đầu tư (11/11/2026), mang tính tham khảo; số liệu chính thức theo hợp đồng mua bán. Layout và ảnh căn hộ mẫu là hình ảnh minh họa.",
      "Areas per the developer's documents (11/11/2026), for reference only; the sale contract governs. Layouts and show-apartment photos are illustrative.",
    ),
    typicalFloor: {
      title: L("Mặt bằng tầng điển hình", "Typical floor"),
      body: L("14 căn mỗi tầng, 100% căn có lô gia.", "14 units per floor, every one with a loggia."),
      orientations: [],
    },
    items: [
      unit("studio", ["Studio", "Studio"], ["Nhà đầu tư, thích sự tiện dụng", "Investors who like it practical"], "#5fae4f", [
        "Mẫu ST.01: không gian gọn, đủ tiện nghi, dễ sử dụng và dễ quản lý.",
        "Layout ST.01: compact, fully equipped, easy to live in and to manage.",
      ], [{ key: "st01", code: "ST.01", nfa: "32,19", nsa: "36,00", file: "layout-st01-studio" }]),
      unit("1pn1", ["1PN+1", "1BR+1"], ["Gu sáng tạo, khởi nghiệp", "Creatives and start-up founders"], "#e2b232", [
        "Hai mẫu A.02 và A.06: một phòng ngủ cùng một phòng linh hoạt để làm việc hoặc sáng tạo.",
        "Two layouts, A.02 and A.06: one bedroom plus a flexible room for work or making things.",
      ], [
        { key: "a02", code: "A.02", nfa: "46,84", nsa: "53,19", file: "layout-a02-1pn1" },
        { key: "a06", code: "A.06", nfa: "48,16", nsa: "56,62", file: "layout-a06-1pn1" },
      ]),
      unit("2pn", ["2PN", "2BR"], ["Gia đình có con nhỏ", "Families with young children"], "#e07a98", [
        "Mẫu B.03: hai phòng ngủ cho gia đình nhỏ.",
        "Layout B.03: two bedrooms for a young family.",
      ], [{ key: "b03", code: "B.03", nfa: "56,74", nsa: "62,03", file: "layout-b03-2pn" }]),
      unit("2pn1", ["2PN+1", "2BR+1"], ["Cần thêm phòng làm việc", "Need a home office"], "#3f86c4", [
        "Mẫu C.02: hai phòng ngủ cùng một phòng đa năng làm phòng làm việc.",
        "Layout C.02: two bedrooms plus a flexible room for a home office.",
      ], [{ key: "c02", code: "C.02", nfa: "73,13", nsa: "80,87", file: "layout-c02-2pn1" }]),
      unit("3pn", ["3PN", "3BR"], ["Gia đình đa thế hệ", "Multi-generation families"], "#3f86c4", [
        "Mẫu C.01: ba phòng ngủ cho gia đình nhiều thế hệ.",
        "Layout C.01: three bedrooms for a multi-generation family.",
      ], [{ key: "c01", code: "C.01", nfa: "73,14", nsa: "80,87", file: "layout-c01-3pn" }]),
    ],
    showFlat: { title: L("Bên trong căn hộ mẫu", "Inside the show apartment"), note: ILLUSTRATIVE, photos: showFlatPhotos },
  };

  const plan = (key: string, group: string, file: string, name: [string, string], caption: [string, string]) => {
    const i = img(file, `${caption[0]} — Cyra Estero`, `${caption[1]} — Cyra Estero`);
    return i ? { key, group, name: L(...name), src: i.src, alt: i.alt, caption: L(...caption) } : undefined;
  };

  const floorPlans = {
    eyebrow: L("Mặt bằng", "Floor plans"),
    headline: L("Mặt bằng tầng, tiện ích và [[vị trí]]", "Floors, amenities and [[location]]"),
    zoomBtn: L("Phóng to", "Zoom"),
    closeAria: L("Đóng", "Close"),
    footnote: L(
      "Mặt bằng mang tính tham khảo, có thể điều chỉnh theo quyết định của chủ đầu tư. Hình ảnh minh họa.",
      "Plans are for reference and may be adjusted by the developer. Illustrative images.",
    ),
    ctaLabel: L("Nhận mặt bằng chi tiết →", "Get detailed plans →"),
    ctaHref: "#lead",
    // Postgres jsonb orders keys by length, so these ids (5 < 7 < 8 chars)
    // keep the chip groups in this order: floors, amenities, location.
    groupLabels: { floor: L("Tầng căn hộ", "Apartment floors"), amenity: L("Tiện ích", "Amenities"), location: L("Vị trí", "Location") },
    items: defined([
      // The source image is captioned "5A"; the floor is 3A (developer's note).
      plan("f-3a", "floor", "mb-tang-3a-5-6-12a", ["Tầng 3A · 5 · 6 · 12A", "Floors 3A · 5 · 6 · 12A"], [
        "Mặt bằng tầng 3A, 5, 6 và 12A.",
        "Floor plan of floors 3A, 5, 6 and 12A.",
      ]),
      plan("f-7-12", "floor", "mb-tang-7-12", ["Tầng 7 – 12", "Floors 7 – 12"], ["Mặt bằng tầng 7 đến 12.", "Floor plan of floors 7 to 12."]),
      plan("f-14-18", "floor", "mb-tang-14-18", ["Tầng 14 – 18", "Floors 14 – 18"], ["Mặt bằng tầng 14 đến 18.", "Floor plan of floors 14 to 18."]),
      plan("ti-tret", "amenity", "mb-tien-ich-tang-tret", ["Tầng trệt", "Ground floor"], [
        "Tiện ích tầng trệt: 25 tiện ích trong nhà và ngoài trời.",
        "Ground-floor amenities: 25 indoor and outdoor amenities.",
      ]),
      plan("ti-3", "amenity", "mb-tien-ich-tang-3", ["Tầng 3", "Level 3"], [
        "Tiện ích tầng 3: hồ bơi Ánh Dương, gym, xông hơi khô, phòng sinh hoạt cộng đồng.",
        "Level-3 amenities: Anh Duong pool, gym, dry sauna, community room.",
      ]),
      plan("ti-thuong", "amenity", "mb-tien-ich-tang-thuong", ["Tầng thượng", "Rooftop"], [
        "Tiện ích tầng thượng: khu thể thao, yoga, cà phê ngoài trời, vườn dạo bộ, kính thiên văn.",
        "Rooftop amenities: sports area, yoga, outdoor café, walking garden, telescope.",
      ]),
      plan("vi-tri", "location", "so-do-vi-tri", ["Sơ đồ vị trí", "Location map"], [
        "Sơ đồ vị trí và kết nối của dự án.",
        "Location and connections map.",
      ]),
    ]),
  };

  const chapter = (
    slotId: string,
    kicker: string,
    title: [string, string],
    desc: [string, string],
    items: [string, string][],
    planFile: string,
    planAlt: [string, string],
  ) => ({
    slotId,
    kicker,
    title: L(...title),
    desc: L(...desc),
    items: items.map((x) => L(...x)),
    direction: "row",
    ...(img(planFile, ...planAlt) ? { planImage: img(planFile, ...planAlt) } : {}),
  });

  const amenitiesGallery = defined([
    (() => {
      const i = img("quang-truong-anh-duong", "Quảng trường Ánh Dương — hình ảnh minh họa", "Anh Duong Square — illustrative");
      return i && { ...i, caption: L("Quảng trường Ánh Dương", "Anh Duong Square") };
    })(),
    (() => {
      const i = img("duong-dao-bo-ven-song", "Đường dạo bộ ven sông Hà Thanh — hình ảnh minh họa", "Ha Thanh riverside walk — illustrative");
      return i && { ...i, caption: L("Đường dạo bộ ven sông", "Riverside walk") };
    })(),
    (() => {
      const i = img("tien-ich-ven-song", "Tiện ích ven sông của Cyra Estero — hình ảnh minh họa", "Cyra Estero riverside amenities — illustrative");
      return i && { ...i, caption: L("Tiện ích ven sông", "Riverside amenities") };
    })(),
    (() => {
      const i = img("shophouse-khoi-de", "Shophouse khối đế Cyra Estero — hình ảnh minh họa", "Cyra Estero podium shophouses — illustrative");
      return i && { ...i, caption: L("Shophouse khối đế", "Podium shophouses") };
    })(),
  ]);

  const amenities = {
    eyebrow: L("Tiện ích", "Amenities"),
    headline: L("25+ tiện ích, [[từ bờ\u00a0sông lên sân\u00a0thượng]]", "25+ amenities, [[from riverbank to rooftop]]"),
    navLabel: L("Tiện ích", "Amenities"),
    actionLabel: L("Nhận bảng giá khi mở bán", "Get prices at launch"),
    actionHref: "#lead",
    planButtonLabel: L("Xem mặt bằng", "View plan"),
    chapters: [
      chapter(
        "cyra-amen-ground",
        "Tầng trệt · 25 tiện ích",
        ["Quảng trường Ánh Dương & bờ sông", "Anh Duong Square & the riverbank"],
        ["Tiện ích trong nhà và ngoài trời ở khối đế, mở ra sông Hà Thanh.", "Indoor and outdoor amenities at the podium, opening onto the Ha Thanh River."],
        [
          ["Nhà trẻ", "Nursery"],
          ["Shophouse", "Shophouses"],
          ["Sảnh đón", "Lobby"],
          ["Quảng trường Ánh Dương", "Anh Duong Square"],
          ["Khu vui chơi thiếu nhi", "Kids' playground"],
          ["Thể thao ngoài trời", "Outdoor sports"],
          ["Góc đọc sách", "Reading corner"],
          ["Vườn thảo dược", "Herb garden"],
          ["BBQ ven sông", "Riverside BBQ"],
          ["Đường dạo bộ ven sông", "Riverside walk"],
          ["Trạm sạc EV", "EV charging"],
        ],
        "mb-tien-ich-tang-tret",
        ["Mặt bằng tiện ích tầng trệt Cyra Estero", "Cyra Estero ground-floor amenity plan"],
      ),
      chapter(
        "cyra-amen-level3",
        "Tầng 3",
        ["Hồ bơi Ánh Dương", "Anh Duong pool"],
        ["Tầng tiện ích chung để bơi, tập luyện và gặp gỡ hàng xóm.", "A shared level to swim, train and meet the neighbours."],
        [
          ["Hồ bơi Ánh Dương", "Anh Duong pool"],
          ["Gym", "Gym"],
          ["Xông hơi khô", "Dry sauna"],
          ["Phòng sinh hoạt cộng đồng", "Community room"],
        ],
        "mb-tien-ich-tang-3",
        ["Mặt bằng tiện ích tầng 3 Cyra Estero", "Cyra Estero level-3 amenity plan"],
      ),
      chapter(
        "cyra-amen-rooftop",
        "Tầng thượng",
        ["Sân thượng xanh", "Green rooftop"],
        ["Thể thao, yoga và cà phê ngoài trời trên tầng cao nhất.", "Sports, yoga and an outdoor café on the top floor."],
        [
          ["Khu thể thao", "Sports area"],
          ["Yoga", "Yoga"],
          ["Cà phê ngoài trời", "Outdoor café"],
          ["Vườn dạo bộ", "Walking garden"],
          ["Kính thiên văn", "Telescope"],
        ],
        "mb-tien-ich-tang-thuong",
        ["Mặt bằng tiện ích tầng thượng Cyra Estero", "Cyra Estero rooftop amenity plan"],
      ),
    ],
    gallery: { title: L("Không gian ven sông", "By the river"), note: ILLUSTRATIVE, photos: amenitiesGallery },
  };

  const investment = {
    eyebrow: L("Giá & lộ trình", "Price & timeline"),
    headline: L("Bảng giá công\u00a0bố [[khi mở bán]]", "Prices announced [[at launch]]"),
    navLabel: L("Giá", "Pricing"),
    points: [],
    pricingTitle: L("Bảng giá & chính sách bán hàng", "Price list & sales policy"),
    pricingBody: L(
      "Giá và chính sách bán hàng do chủ đầu tư công bố khi mở bán. Để lại số điện thoại để nhận bảng giá ngay khi có.",
      "Prices and sales terms are announced by the developer at launch. Leave your number to get the price list as soon as it's out.",
    ),
    pricingCtaLabel: L("Nhận bảng giá khi mở bán", "Get prices at launch"),
    pricingCtaHref: "#lead",
    noPriceCtaLabel: L("Nhận bảng giá khi mở bán", "Get prices at launch"),
    priceFacts: [],
    paymentPlans: [],
    countdownTo: "2026-12-19",
    countdownLabel: L("Dự kiến mở bán", "Expected launch"),
    milestones: [
      { date: "22/11/2026", title: L("Khai trương nhà mẫu (dự kiến)", "Show apartment opens (expected)") },
      { date: "19/12/2026", title: L("Mở bán giai đoạn 1 (dự kiến)", "Phase 1 launch (expected)") },
    ],
  };

  const legal = {
    body: L(
      "Base Land Quy Nhơn là [[đại lý phân phối F1]] của Cyra Estero, có tên trên cyraestero.vn.",
      "Base Land Quy Nhon is an [[F1 distributor]] of Cyra Estero, listed on cyraestero.vn.",
    ),
    points: [
      { label: L("Đại lý phân phối F1", "F1 distributor"), desc: L("Có tên trên website chủ đầu tư cyraestero.vn.", "Listed on the developer's site, cyraestero.vn.") },
      { label: L("Tư vấn tại Quy Nhơn", "Advice in Quy Nhon"), desc: L("Đội ngũ đi thực địa và xem nhà mẫu cùng khách.", "Our team visits the site and show apartment with you.") },
      { label: L("Thông tin minh bạch", "Transparent information"), desc: L("Chỉ công bố dữ liệu từ tài liệu chính thức.", "Only data from official documents.") },
      { label: L("Đồng hành dài hạn", "Long-term support"), desc: L("Từ chọn căn đến khi nhận nhà.", "From choosing a unit to handover.") },
    ],
    links: [{ label: L("Website chủ đầu tư", "Developer website"), href: "https://cyraestero.vn" }],
  };

  const documents = {
    eyebrow: L("Kiểm chứng & Base Land", "Verify & Base Land"),
    headline: L("Pháp lý dự án [[trước khi quyết định]]", "Project legal status [[before you decide]]"),
    ctaLabel: L("Nhận hồ sơ →", "Request →"),
    ctaHref: "#lead",
    actionLabel: L("Nhận hồ sơ pháp lý", "Get the legal file"),
    actionHref: "#lead",
    items: [
      { name: L("Chủ trương đầu tư", "Investment policy approval"), note: L("Quyết định 3939/QĐ-UBND, 25/10/2023", "Decision 3939/QĐ-UBND, 25/10/2023") },
      { name: L("Quy hoạch", "Detailed planning"), note: L("Quyết định 3609/QĐ-UBND, 29/09/2023", "Decision 3609/QĐ-UBND, 29/09/2023") },
      { name: L("Giao đất", "Land allocation"), note: L("Quyết định 3658/QĐ-UBND, 20/10/2024", "Decision 3658/QĐ-UBND, 20/10/2024") },
      { name: L("Giấy chứng nhận đăng ký đầu tư", "Investment registration certificate"), note: L("Cấp ngày 28/10/2024", "Issued 28/10/2024") },
      { name: L("Giấy chứng nhận quyền sử dụng đất", "Land use right certificate"), note: L("", "") },
      {
        name: L("Website chủ đầu tư", "Developer website"),
        note: L("Thông tin chính thức tại cyraestero.vn", "Official information at cyraestero.vn"),
        fileUrl: "https://cyraestero.vn",
        linkLabel: L("Xem website ↗", "Visit site ↗"),
      },
    ],
  };

  const virtualTour = {
    eyebrow: L("Tham quan ảo 360°", "360° Virtual Tour"),
    headline: L("Đi một vòng [[căn hộ mẫu]]", "Walk through the [[show apartment]]"),
    body: L(
      "Xem căn hộ mẫu và không gian dự án ở góc nhìn 360°, rồi hỏi chúng tôi về căn bạn thích.",
      "See the show apartment and the project in 360°, then ask us about the unit you like.",
    ),
    tourUrl: "",
    allowEmbed: true,
    poster: { src: "", alt: L("", "") },
    playLabel: L("Bắt đầu tham quan", "Start the tour"),
    fullscreenLabel: L("Toàn màn hình", "Full screen"),
    newTabLabel: L("Mở tab mới", "New tab"),
    heroCtaLabel: L("Tham quan 360°", "360° tour"),
    ctaLabel: L("Tư vấn căn này", "Ask about this unit"),
    ctaNote: L(
      "Bạn vừa xem tour 360°. Cho chúng tôi biết loại căn bạn quan tâm để chuyên viên tư vấn đúng căn.",
      "You just viewed the 360° tour. Tell us which unit type you like so an advisor can help with that exact unit.",
    ),
    leadSource: "",
    note: L("Hình ảnh minh họa.", "Illustrative images."),
    navLabel: L("Tour 360°", "360° tour"),
    scenes: [],
  };

  const leadPopup = {
    title: L("Nhận bảng giá Cyra Estero khi mở bán", "Get Cyra Estero prices at launch"),
    subtitle: L("210 căn hộ bên sông Hà Thanh · tư vấn bởi Base Land Quy Nhơn", "210 apartments on the Ha Thanh River · advice from Base Land Quy Nhon"),
    benefits: [
      L("Bảng giá & chính sách khi mở bán", "Price list & sales terms at launch"),
      L("Mặt bằng 14 căn/tầng & layout từng loại căn", "Plans of the 14-unit floors & every layout"),
      L("Tư vấn chọn căn & tài chính miễn phí", "Free advice on units & financing"),
    ],
    phoneLabel: L("Số điện thoại / Zalo", "Phone / Zalo"),
    phonePlaceholder: L("VD: 0901 234 567", "e.g. 0901 234 567"),
    phoneError: L("Số điện thoại chưa đúng (VD: 0901 234 567).", "Please enter a valid Vietnamese phone number."),
    nameLabel: L("Họ tên (không bắt buộc)", "Name (optional)"),
    submitLabel: L("Nhận bảng giá khi mở bán", "Get prices at launch"),
    submittingLabel: L("Đang gửi…", "Sending…"),
    privacyNote: L("Bảo mật thông tin · Không spam ·", "Your details stay private · No spam ·"),
    privacyLinkLabel: L("Chính sách bảo mật", "Privacy policy"),
    successMessage: L(
      "Đã nhận thông tin. Chuyên viên Base Land Quy Nhơn sẽ liên hệ sớm nhất.",
      "Thank you — a Base Land Quy Nhon advisor will contact you as soon as possible.",
    ),
    errorMessage: L(
      "Chưa gửi được, có thể do mạng. Thông tin bạn nhập vẫn còn — vui lòng thử lại hoặc gọi hotline.",
      "We couldn't send that, possibly a connection issue. Your details are still here — please try again or call our hotline.",
    ),
    callLabel: L("Gọi ngay", "Call now"),
    zaloLabel: L("Nhắn Zalo", "Message on Zalo"),
    zaloUrl: "https://zalo.me/0373910109",
    closeLabel: L("Đóng", "Close"),
    delaySeconds: 35,
    scrollPercent: 50,
    dismissDays: 7,
    leadSource: `${SLUG}-popup`,
    fallbackName: "Khách để lại SĐT (popup Cyra Estero)",
  };

  return keepTogether({ hero, cta, towers, location, architecture, residences, floorPlans, amenities, investment, legal, documents, virtualTour, leadPopup });
}

// Names that must never break across lines ("Hà / Thanh") get a
// non-breaking space everywhere in the page copy.
const UNBREAKABLE = ["Hà Thanh", "Ha Thanh", "Ánh Dương", "Anh Duong", "ở thực", "Cyra Estero", "Tấn Phát", "Tan Phat"];
function keepTogether<T>(v: T): T {
  if (typeof v === "string") return UNBREAKABLE.reduce((s, w) => s.split(w).join(w.replace(/ /g, "\u00a0")), v as string) as T;
  if (Array.isArray(v)) return v.map(keepTogether) as T;
  if (v && typeof v === "object") {
    return Object.fromEntries(
      Object.entries(v).map(([k, x]) => [k, k === "src" || k === "href" || k === "fileUrl" || k === "leadSource" || k === "options" ? x : keepTogether(x)]),
    ) as T;
  }
  return v;
}

const SECTIONS = {
  towers: true,
  location: true,
  architecture: true,
  residences: true,
  floorPlans: false, // shown from "Xem mặt bằng tầng" in Chọn căn
  virtualTour: true, // hides itself until a scene has a 360° image
  amenities: true,
  investment: true,
  documents: true,
  legal: false, // read by "Kiểm chứng & Base Land"
  leadPopup: true,
};

const HOME_ITEM = {
  vi: {
    cta: "Xem dự án",
    href: `/projects/${SLUG}`,
    name: "Cyra Estero Quy Nhơn",
    blurb: "210 căn hộ bên sông Hà Thanh, cho gia đình trẻ sống thật mỗi ngày.",
    slotId: "local-project-cyra",
    status: "Sắp mở bán",
    location: "Huỳnh Tấn Phát · sông Hà Thanh",
  },
  en: {
    cta: "View project",
    href: `/projects/${SLUG}`,
    name: "Cyra Estero Quy Nhon",
    blurb: "210 riverside apartments on the Ha Thanh, made for young families' everyday life.",
    slotId: "local-project-cyra",
    status: "Launching soon",
    location: "Huynh Tan Phat · Ha Thanh River",
  },
};

async function main() {
  const overwrite = process.argv.includes("--overwrite");
  const host = new URL(process.env.DATABASE_URL!).hostname.split(".")[0];
  console.log(`DB: ${host}`);

  const media = await prisma.media.findMany({ where: { filename: { startsWith: "cyra-" } }, select: { filename: true, url: true }, orderBy: { createdAt: "asc" } });
  urls = Object.fromEntries(media.map((m) => [m.filename, m.url]));
  console.log(`Ảnh Cyra trong Media Library: ${media.length}`);

  const c = build();
  // Living-room panorama (separate script; kept when this one re-runs).
  const panorama = await cyraPanorama(prisma).catch(() => undefined);
  if (panorama) Object.assign(c.residences, { panorama });
  const existing = await prisma.project.findUnique({ where: { slug: SLUG } });
  if (existing && !overwrite) {
    console.log("Dự án đã tồn tại — chạy lại với --overwrite để ghi đè nội dung.");
    return;
  }

  const base = {
    name: "CYRA ESTERO QUY NHƠN",
    category: L("Căn hộ", "Apartments"),
    statusLabel: L("Sắp mở bán", "Launching soon"),
    theme: "cyra",
    sections: SECTIONS,
    hero: c.hero as unknown as Prisma.InputJsonValue,
    cta: c.cta as unknown as Prisma.InputJsonValue,
    publishStatus: "PUBLISHED" as const,
    seoTitle: "Cyra Estero Quy Nhơn | Căn hộ bên sông Hà Thanh",
    seoDescription:
      "Cyra Estero Quy Nhơn: 210 căn hộ, 18 tầng bên sông Hà Thanh, 100% căn có lô gia. Xem mặt bằng, căn hộ mẫu, tiện ích và nhận bảng giá khi mở bán.",
  };
  const project = await prisma.project.upsert({
    where: { slug: SLUG },
    update: base,
    create: { slug: SLUG, ...base, publishedAt: new Date() },
  });

  const sectionRows: [ProjectSectionType, unknown][] = [
    ["TOWERS", c.towers],
    ["LOCATION", c.location],
    ["ARCHITECTURE", c.architecture],
    ["INVESTMENT", c.investment],
    ["LEGAL", c.legal],
    ["VIRTUAL_TOUR", c.virtualTour],
    ["LEAD_POPUP", c.leadPopup],
  ];
  for (const [type, content] of sectionRows) {
    const json = content as Prisma.InputJsonValue;
    await prisma.projectSection.upsert({
      where: { projectId_type: { projectId: project.id, type } },
      update: { content: json },
      create: { projectId: project.id, type, content: json },
    });
  }
  const named = { projectId: project.id };
  const j = (v: unknown) => v as Prisma.InputJsonValue;
  await prisma.projectResidences.upsert({ where: named, update: { content: j(c.residences) }, create: { ...named, content: j(c.residences) } });
  await prisma.projectFloorPlans.upsert({ where: named, update: { content: j(c.floorPlans) }, create: { ...named, content: j(c.floorPlans) } });
  await prisma.projectAmenities.upsert({ where: named, update: { content: j(c.amenities) }, create: { ...named, content: j(c.amenities) } });
  await prisma.projectDocuments.upsert({ where: named, update: { content: j(c.documents) }, create: { ...named, content: j(c.documents) } });

  // Homepage "Thêm lựa chọn": Cyra Estero first.
  const teaser = await prisma.homepageSection.findUnique({ where: { type: "PROJECTS_TEASER" } });
  if (teaser) {
    type Item = Record<string, unknown> & { href?: string };
    const content = teaser.content as { vi: { items: Item[] }; en: { items: Item[] } };
    const cardSrc = (c.hero.cardImage ?? c.hero.image)?.src ?? "";
    for (const lang of ["vi", "en"] as const) {
      const items = content[lang].items.filter((it) => it.href !== HOME_ITEM[lang].href);
      content[lang].items = [{ ...HOME_ITEM[lang], imageSrc: cardSrc }, ...items];
    }
    await prisma.homepageSection.update({ where: { type: "PROJECTS_TEASER" }, data: { content: content as unknown as Prisma.InputJsonValue } });
  }

  console.log(`${existing ? "Đã cập nhật" : "Đã tạo"} /projects/${SLUG} (${project.id}).`);
  console.log(missing.size ? `Không tìm thấy ảnh: ${[...missing].join(", ")}` : "Đã gán đủ ảnh.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
