// Booking 50 triệu -> 30 triệu cho Q'Terra (chỉ thay chuỗi booking).
//   npx tsx prisma/updates/2026-11-05-qterra-booking-30.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, type Prisma } from "@prisma/client";
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });
const swap = (s: string) =>
  s.replaceAll("Đặt chỗ (booking) 50 triệu", "Đặt chỗ (booking) 30 triệu")
   .replaceAll("Booking: VND 50 million", "Booking: VND 30 million")
   .replaceAll("booking 50 triệu", "booking 30 triệu")
   .replaceAll("VND 50 million booking", "VND 30 million booking")
   .replaceAll('"vi":"50 triệu","en":"VND 50M"', '"vi":"30 triệu","en":"VND 30M"')
   .replaceAll('"en":"VND 50M","vi":"50 triệu"', '"en":"VND 30M","vi":"30 triệu"');
async function main() {
  const p = await prisma.project.findUniqueOrThrow({ where: { slug: "qterra" } });
  const secs = await prisma.projectSection.findMany({ where: { projectId: p.id } });
  for (const s of secs) {
    const before = JSON.stringify(s.content);
    const after = swap(before);
    if (after !== before) {
      await prisma.projectSection.update({ where: { id: s.id }, data: { content: JSON.parse(after) as Prisma.InputJsonValue } });
      console.log("updated", s.type);
    }
  }
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
