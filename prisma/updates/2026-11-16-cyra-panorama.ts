// Cyra Estero: show-apartment living-room panorama (16/11/2026), shown in
// "Chọn căn" right before "Bên trong căn hộ mẫu". Images were uploaded with
//   node upload-photos.js --dev|--prod --dir <folder with cyra-panorama-phong-khach-{2700,3600,5500}.webp>
// Patch-only: writes residences.panorama, keeps everything else. Re-running
// rewrites the panorama (hotspots edited in Admin would be reset).
//
//   npx tsx prisma/updates/2026-11-16-cyra-panorama.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, type Prisma } from "@prisma/client";

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });
const L = (vi: string, en: string) => ({ vi, en });

export async function cyraPanorama(db: PrismaClient) {
  const files = ["2700", "3600", "5500"].map((w) => `cyra-panorama-phong-khach-${w}.webp`);
  const media = await db.media.findMany({ where: { filename: { in: files } }, orderBy: { createdAt: "asc" } });
  const url = (f: string) => media.find((m) => m.filename === f)?.url ?? "";
  const [src, srcLarge, srcFull] = files.map(url);
  if (!src) throw new Error("Chưa upload ảnh panorama (cyra-panorama-phong-khach-2700.webp).");
  return {
    enabled: true,
    title: L("Bước vào căn hộ mẫu", "Step inside the show apartment"),
    caption: L(
      "Phối cảnh minh họa. Nội thất và đồ trang trí mang tính tham khảo.",
      "Illustrative rendering. Furniture and decor are for reference only.",
    ),
    image: {
      src,
      srcLarge,
      srcFull,
      alt: L(
        "Phòng khách, bàn ăn và tủ khu cửa vào căn hộ mẫu Cyra Estero — phối cảnh minh họa",
        "Living room, dining area and entry storage of the Cyra Estero show apartment — illustrative rendering",
      ),
    },
    hotspots: [
      { label: L("Lô gia cửa kính lớn", "Logia with large glass doors"), x: 5, y: 45 },
      { label: L("Phòng khách", "Living room"), x: 30, y: 68 },
      { label: L("Bàn ăn 4 chỗ", "4-seat dining area"), x: 59, y: 70 },
      {
        label: L("Tủ đa năng khu cửa vào (tủ giày, gương, kệ trưng bày)", "Entry storage wall (shoe cabinet, mirror, display shelves)"),
        x: 78,
        y: 55,
      },
    ],
    ctaLabel: L("Đặt lịch tham quan nhà mẫu", "Book a show apartment visit"),
    leadSource: "cyra-panorama",
    openingDate: "2026-11-22",
    openingLabel: L("Nhà mẫu dự kiến khai trương", "Show apartment expected to open"),
  };
}

async function main() {
  const project = await prisma.project.findUniqueOrThrow({ where: { slug: "cyra-estero" }, include: { residences: true } });
  if (!project.residences) throw new Error("Cyra Estero chưa có mục Chọn căn.");
  const content = { ...(project.residences.content as Record<string, unknown>), panorama: await cyraPanorama(prisma) };
  await prisma.projectResidences.update({ where: { projectId: project.id }, data: { content: content as Prisma.InputJsonValue } });
  console.log(`${new URL(process.env.DATABASE_URL!).hostname.split(".")[0]}: Cyra Estero panorama đã cập nhật.`);
}

if (process.argv[1]?.includes("2026-11-16-cyra-panorama")) {
  main()
    .catch((err) => {
      console.error(err);
      process.exit(1);
    })
    .finally(() => prisma.$disconnect());
}
