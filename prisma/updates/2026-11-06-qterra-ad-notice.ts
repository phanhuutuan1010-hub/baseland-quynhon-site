// Dải thông báo cho khách từ quảng cáo (utm_source) — Q'Terra.
// Sửa sau trong Admin → Dự án → Q'Terra → Nội dung → Giai đoạn bán hàng.
//   npx tsx prisma/updates/2026-11-06-qterra-ad-notice.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

async function main() {
  const project = await prisma.project.findUniqueOrThrow({ where: { slug: "qterra" } });
  const where = { projectId_type: { projectId: project.id, type: "SALES_PHASES" as const } };
  const row = await prisma.projectSection.findUniqueOrThrow({ where });
  await prisma.projectSection.update({
    where,
    data: {
      content: {
        ...(row.content as object),
        adNoticeText: {
          vi: "Mở bán dự kiến 12/11/2026 · Căn hộ mẫu tại KS Anya, 03 Nguyễn Trung Tín",
          en: "Expected launch 12/11/2026 · Show apartment at Anya Hotel, 03 Nguyen Trung Tin",
        },
        adNoticeCtaLabel: { vi: "Gọi đặt lịch xem", en: "Call to book a viewing" },
      },
    },
  });
  console.log("Q'Terra ad notice set.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
