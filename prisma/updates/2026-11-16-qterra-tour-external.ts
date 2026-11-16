// Q'Terra "Tham quan ảo 360°" (16/11/2026): the developer's tour now only
// opens in a new tab. Adds the four content labels shown with the poster
// and the "welcome back" card. Patch-only: every other field (poster image,
// texts edited in Admin) is kept. Re-running is safe.
//
//   npx tsx prisma/updates/2026-11-16-qterra-tour-external.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, type Prisma } from "@prisma/client";

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });
const L = (vi: string, en: string) => ({ vi, en });

const highlights = [
  L("Toàn cảnh", "Panoramic view"),
  L("Lọc 864 căn theo view", "Filter all 864 units by view"),
  L("Mặt bằng tầng", "Floor plans"),
  L("Căn điển hình", "Typical units"),
];

const returnPrompt = {
  title: L("Bạn đã chọn được căn ưng ý? Gửi mã căn để nhận báo giá", "Found a unit you like? Send its code to get a quote"),
  ctaLabel: L("Gửi mã căn", "Send unit code"),
  unitLabel: L("Mã căn/tầng quan tâm (không bắt buộc)", "Unit / floor you like (optional)"),
  unitPlaceholder: L("VD: A-1205 hoặc tầng 12", "e.g. A-1205 or floor 12"),
};

async function main() {
  const project = await prisma.project.findUniqueOrThrow({ where: { slug: "qterra" } });
  const where = { projectId_type: { projectId: project.id, type: "VIRTUAL_TOUR" as const } };
  const row = await prisma.projectSection.findUniqueOrThrow({ where });
  const content: Record<string, unknown> = { ...(row.content as Record<string, unknown>), highlights, returnPrompt };
  delete content.allowEmbed; // no longer used: the tour always opens in a new tab
  await prisma.projectSection.update({ where, data: { content: content as Prisma.InputJsonValue } });
  console.log(`${new URL(process.env.DATABASE_URL!).hostname.split(".")[0]}: Q'Terra 360° → highlights + return card.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
