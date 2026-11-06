// Mã ref QA: /projects/qterra?ref=test phải hiện 0900 000 000 thay cho hotline.
// XOÁ SAU KHI QA: Admin → Cài đặt → Liên hệ → bảng ?ref= → dòng "test" → Xoá → Lưu.
//   npx tsx prisma/updates/2026-11-06-ref-test.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

const TEST_ROW = { ref: "test", name: "TEST — xoá sau khi QA", phone: "0900000000", zalo: "" };

async function main() {
  const settings = await prisma.settings.findUniqueOrThrow({ where: { id: 1 } });
  const rows = Array.isArray(settings.refContacts) ? (settings.refContacts as { ref?: string }[]) : [];
  const next = [...rows.filter((r) => r?.ref !== "test"), TEST_ROW];
  await prisma.settings.update({ where: { id: 1 }, data: { refContacts: next } });
  console.log(`ref "test" set (${next.length} row(s) total).`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
