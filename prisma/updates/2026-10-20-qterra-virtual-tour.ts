// Adds the "Tham quan ảo 360°" section + developer/360/legal links in
// Documents to /projects/qterra (20/10/2026). Writes into the Admin CMS rows;
// re-running is safe.
//
//   npx tsx prisma/updates/2026-10-20-qterra-virtual-tour.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, type Prisma } from "@prisma/client";

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

const L = (vi: string, en: string) => ({ vi, en });
const TOUR_URL = "https://360.qterra.vn/";

const virtualTour = {
  eyebrow: L("Tham quan ảo 360°", "360° Virtual Tour"),
  headline: L("Đi một vòng Q'Terra [[trước khi đến]]", "Walk around Q'Terra [[before you visit]]"),
  body: L(
    "Xem phối cảnh dự án và các hướng nhìn ra biển, quảng trường, thành phố ngay trên màn hình — rồi hỏi chúng tôi về căn bạn thích.",
    "See the project and its outlooks over the sea, the square and the city on screen — then ask us about the unit you like.",
  ),
  tourUrl: TOUR_URL,
  allowEmbed: true,
  poster: { src: "", alt: L("Phối cảnh Q'Terra — tour 360°", "Q'Terra rendering — 360° tour") },
  playLabel: L("Tham quan 360°", "Take the 360° tour"),
  fullscreenLabel: L("Toàn màn hình", "Full screen"),
  newTabLabel: L("Mở tab mới", "New tab"),
  heroCtaLabel: L("Tham quan 360°", "360° tour"),
  ctaLabel: L("Nhận tư vấn căn bạn vừa xem", "Ask about the unit you just viewed"),
  ctaNote: L(
    "Bạn vừa xem tour 360°. Cho chúng tôi biết căn hoặc hướng bạn quan tâm để chuyên viên tư vấn đúng căn.",
    "You just viewed the 360° tour. Tell us which unit or outlook caught your eye so an advisor can help with that exact unit.",
  ),
  leadSource: "qterra-360",
  note: L(
    "Tour 360° do chủ đầu tư cung cấp tại 360.qterra.vn. Hình ảnh phối cảnh mang tính minh hoạ.",
    "The 360° tour is provided by the developer at 360.qterra.vn. Renderings are for illustration.",
  ),
  navLabel: L("Tour 360°", "360° tour"),
};

type DocItem = { name: { vi: string; en: string }; note: unknown; fileUrl?: string; linkLabel?: unknown };

async function main() {
  const project = await prisma.project.findUniqueOrThrow({ where: { slug: "qterra" }, include: { documents: true } });

  await prisma.project.update({
    where: { id: project.id },
    data: { sections: { ...(project.sections as object), virtualTour: true } },
  });
  await prisma.projectSection.upsert({
    where: { projectId_type: { projectId: project.id, type: "VIRTUAL_TOUR" } },
    update: { content: virtualTour },
    create: { projectId: project.id, type: "VIRTUAL_TOUR", content: virtualTour },
  });

  const docs = project.documents?.content as { items: DocItem[] } | undefined;
  if (docs) {
    const isLegal = (d: DocItem) => d.name.vi === "Thông tin pháp lý";
    const extra: DocItem[] = [
      {
        name: L("Tham quan 360°", "360° tour"),
        note: L("Tour ảo của dự án do chủ đầu tư cung cấp", "The developer's virtual tour of the project"),
        fileUrl: TOUR_URL,
        linkLabel: L("Mở tour 360° ↗", "Open 360° tour ↗"),
      },
      {
        name: L("Website chủ đầu tư", "Developer website"),
        note: L("Thông tin chính thức tại qterra.vn", "Official information at qterra.vn"),
        fileUrl: "https://qterra.vn",
        linkLabel: L("Xem website ↗", "Visit website ↗"),
      },
    ];
    const kept = docs.items.filter((d) => !extra.some((e) => e.fileUrl === d.fileUrl));
    const items = kept.flatMap((d) =>
      isLegal(d)
        ? [
            {
              ...d,
              note: L("Hồ sơ pháp lý dự án do chủ đầu tư công bố", "Project legal documents published by the developer"),
              fileUrl: "https://phaply.qterra.vn",
              linkLabel: L("Xem hồ sơ pháp lý ↗", "View legal documents ↗"),
            },
            ...extra,
          ]
        : [d],
    );
    await prisma.projectDocuments.update({
      where: { projectId: project.id },
      data: { content: { ...docs, items } as Prisma.InputJsonValue },
    });
  }

  console.log("Q'Terra virtual tour added.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
