// Switches /projects/qterra to the compact layout (21/10/2026): shorter
// page, merged sections, one CTA per section. Only patches the fields it
// names — images and everything else already in the DB (incl. prod-only
// uploads) are kept. Sections are hidden, never deleted. Re-running is safe.
//
//   npx tsx prisma/updates/2026-10-21-qterra-compact.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, type Prisma, type ProjectSectionType } from "@prisma/client";

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

const L = (vi: string, en: string) => ({ vi, en });
type Loc = { vi: string; en: string };
type Obj = Record<string, unknown>;

/** Hidden in the compact layout. gallery/floorPlans/salesPhases/legal are
 * still read by their host section (see CompactProjectPage). */
const HIDE = ["intro", "stats", "views", "materialStory", "lifestyle", "verification", "gallery", "floorPlans", "salesPhases", "legal"];

const reasons = [
  {
    kicker: L("Thương hiệu", "Brand"),
    title: L("Courtyard by Marriott", "Courtyard by Marriott"),
    desc: L("Tháp khách sạn 5 sao thương hiệu Marriott ngay trong dự án.", "A five-star Marriott-branded hotel tower within the project."),
  },
  {
    kicker: L("Vận hành", "Operator"),
    title: L("CBRE vận hành", "Operated by CBRE"),
    desc: L("Tháp căn hộ khách sạn do CBRE quản lý và vận hành.", "The hotel-apartment tower is managed and run by CBRE."),
  },
  {
    kicker: L("Nội thất", "Interiors"),
    title: L("Nội thất RED Design", "RED Design interiors"),
    desc: L("RED Design Group thiết kế, bàn giao 100% nội thất rời.", "Designed by RED Design Group, handed over 100% furnished."),
  },
  {
    kicker: L("Vị trí", "Location"),
    title: L("Trung tâm Quy Nhơn", "Central Quy Nhon"),
    desc: L("01 Ngô Mây, đối diện Quảng trường, cách biển 50m.", "01 Ngo May, facing the square, 50m from the beach."),
  },
];

const AMENITY_DESC: Record<string, Loc> = {
  "qterra-amen-arrival": L("Sảnh lễ tân, lounge và khối thương mại mở ra đường Ngô Mây.", "Reception, lounge and retail opening onto Ngo May street."),
  "qterra-amen-wellness": L("Gym, yoga, thư viện và khu trẻ em trên cùng một tầng.", "Gym, yoga, a library and kids' space on one floor."),
  "qterra-amen-water": L("Hồ bơi vô cực, Onsen và pool bar nhìn ra thành phố biển.", "Infinity pool, Onsen and pool bar over the coastal city."),
  "qterra-amen-sky": L("Vườn trên tầng 39, nhìn trọn thành phố và biển.", "A garden on floor 39 overlooking the city and the sea."),
};

const BEACH = L("Cách 50m · 3–5 phút đi bộ", "50m away · 3–5 min walk");

function patchLocation(c: Obj): Obj {
  type Stop = { tier: Loc; landmarks: Loc[] };
  let journey = (c.journey as Stop[] | undefined) ?? [];
  // 4 time tiers → 3: the last two (20–40 / 40–50 min) become "20–50 phút".
  if (journey.length === 4) {
    journey = [journey[0], journey[1], { tier: L("20–50 phút", "20–50 min"), landmarks: [...journey[2].landmarks, ...journey[3].landmarks] }];
  }
  journey = journey.map((stop) => ({
    ...stop,
    landmarks: stop.landmarks.map((l) =>
      /biển/i.test(l.vi) && !l.vi.includes("50m") ? L(`${l.vi} · cách 50m, 3–5 phút đi bộ`, `${l.en} · 50m, a 3–5 min walk`) : l,
    ),
  }));
  // Old "~1 phút / ~2 phút đi bộ" distances (source: qterra.vn gives 50m,
  // 3–5 min walk to the beach; the square is right opposite).
  const benefits = ((c.benefits as Obj[] | undefined) ?? []).map((b) => {
    const name = (b.name as Loc).vi;
    if (/biển/i.test(name)) return { ...b, distance: BEACH };
    if (/quảng trường/i.test(name)) return { ...b, distance: L("Đối diện dự án", "Right opposite") };
    return b;
  });
  return {
    ...c,
    body: L(
      "Đối diện Quảng trường Nguyễn Tất Thành, biển cách 50m — 3–5 phút đi bộ.",
      "Facing Nguyen Tat Thanh Square, with the beach 50m away — a 3–5 minute walk.",
    ),
    journey,
    benefits,
    navLabel: L("Vị trí", "Location"),
    actionLabel: L("Gọi ngay", "Call now"),
    actionHref: "call",
  };
}

async function patchSection(projectId: string, type: ProjectSectionType, fn: (c: Obj) => Obj) {
  const row = await prisma.projectSection.findUnique({ where: { projectId_type: { projectId, type } } });
  if (!row) return console.warn(`  (skip ${type}: no content)`);
  await prisma.projectSection.update({ where: { id: row.id }, data: { content: fn(row.content as Obj) as Prisma.InputJsonValue } });
}

async function main() {
  const project = await prisma.project.findUniqueOrThrow({
    where: { slug: "qterra" },
    include: { residences: true, amenities: true, documents: true },
  });
  const id = project.id;

  const sections = { ...(project.sections as Obj) };
  for (const key of HIDE) sections[key] = false;
  const hero = project.hero as Obj;
  const cta = project.cta as Obj;
  await prisma.project.update({
    where: { id },
    data: {
      sections: sections as Prisma.InputJsonValue,
      hero: {
        ...hero,
        layout: "compact",
        badge: L("Đang nhận booking", "Now taking bookings"),
        facts: L(
          "39 tầng · 864 căn · 50m tới biển · từ 55tr/m² (dự kiến)",
          "39 floors · 864 units · 50m to the beach · from VND 55M/m² (indicative)",
        ),
        ctaConsultLabel: L("Nhận bảng giá", "Get the price list"),
        ctaConsultHref: "#lead",
      } as Prisma.InputJsonValue,
      cta: {
        ...cta,
        headline: L("Nhận bảng giá & [[tư vấn chọn căn]]", "Get the price list & [[unit advice]]"),
        body: L(
          "Chuyên viên Base Land Quy Nhơn gửi bảng giá, mặt bằng và tư vấn căn phù hợp.",
          "A Base Land Quy Nhon advisor sends the price list, floor plans and unit advice.",
        ),
      } as Prisma.InputJsonValue,
    },
  });

  await patchSection(id, "TOWERS", (c) => ({
    ...c,
    eyebrow: L("Vì sao Q'Terra", "Why Q'Terra"),
    headline: L("Bốn lý do chọn [[Q'Terra]]", "Four reasons to [[choose Q'Terra]]"),
    navLabel: L("Tổng quan", "Overview"),
    reasons,
    actionLabel: L("Nhận bảng giá", "Get the price list"),
    actionHref: "#lead",
  }));
  await patchSection(id, "LOCATION", patchLocation);
  await patchSection(id, "ARCHITECTURE", (c) => ({
    ...c,
    body: L(
      "Đường nét ngang của ban công, chiều sâu ô cửa, mảng tường bắt nắng chiều. Công trình được cảm nhận trước khi được đọc bằng thông số.",
      "The line of a balcony, the depth of a window, a wall catching the afternoon light. The building is felt before it's read in numbers.",
    ),
  }));
  await patchSection(id, "VIRTUAL_TOUR", (c) => ({
    ...c,
    body: L(
      "Xem phối cảnh và các hướng nhìn biển, quảng trường, thành phố ngay trên màn hình.",
      "See the project and its sea, square and city outlooks on screen.",
    ),
    ctaLabel: L("Tư vấn căn này", "Advise me on this unit"),
  }));
  await patchSection(id, "VIDEO_DUO", (c) => ({
    ...c,
    headline: L("Điều nên biết [[trước khi chọn căn]]", "What to know [[before you choose]]"),
  }));
  await patchSection(id, "INVESTMENT", (c) => ({
    ...c,
    eyebrow: L("Giá & lộ trình", "Price & timeline"),
    headline: L("Giá dự kiến và [[lộ trình mở bán]]", "Indicative prices and [[launch timeline]]"),
    navLabel: L("Giá", "Pricing"),
    pricingCtaLabel: L("Giữ suất booking", "Hold a booking slot"),
    pricingCtaHref: "#lead",
  }));

  if (project.residences) {
    const c = project.residences.content as Obj;
    await prisma.projectResidences.update({
      where: { projectId: id },
      data: {
        content: {
          ...c,
          navLabel: L("Căn hộ", "Residences"),
          unitCtaLabel: L("Tư vấn căn này", "Advise me on this unit"),
          unitCtaHref: "#lead",
        } as Prisma.InputJsonValue,
      },
    });
  }
  if (project.amenities) {
    const c = project.amenities.content as Obj & { chapters: Obj[] };
    await prisma.projectAmenities.update({
      where: { projectId: id },
      data: {
        content: {
          ...c,
          navLabel: L("Tiện ích", "Amenities"),
          actionLabel: L("Nhận bảng giá", "Get the price list"),
          actionHref: "#lead",
          chapters: c.chapters.map((ch) => (AMENITY_DESC[ch.slotId as string] ? { ...ch, desc: AMENITY_DESC[ch.slotId as string] } : ch)),
        } as Prisma.InputJsonValue,
      },
    });
  }
  if (project.documents) {
    const c = project.documents.content as Obj;
    await prisma.projectDocuments.update({
      where: { projectId: id },
      data: {
        content: {
          ...c,
          eyebrow: L("Kiểm chứng & Base Land", "Verify & Base Land"),
          headline: L("Kiểm chứng thông tin [[trước khi quyết định]]", "Check the facts [[before you decide]]"),
          actionLabel: L("Gọi ngay", "Call now"),
          actionHref: "call",
        } as Prisma.InputJsonValue,
      },
    });
  }

  console.log("Q'Terra compact layout applied.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
