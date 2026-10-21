// Q'Terra lead form (21/10/2026): region = 3 short chips, label "Khu vực";
// the "Thời điểm dự kiến" field is dropped. Old Lead rows keep their data.
// Re-running is safe.
//
//   npx tsx prisma/updates/2026-10-21-qterra-lead-qualifiers.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, type Prisma } from "@prisma/client";

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });
const L = (vi: string, en: string) => ({ vi, en });
type Qualifier = { key: string; label: unknown; options: unknown[] };

async function main() {
  const project = await prisma.project.findUniqueOrThrow({ where: { slug: "qterra" } });
  const cta = project.cta as Record<string, unknown> & { qualifiers?: Qualifier[] };
  const qualifiers = (cta.qualifiers ?? [])
    .filter((q) => q.key !== "timeframe")
    .map((q) =>
      q.key === "region"
        ? { ...q, label: L("Khu vực", "Region"), options: [L("Quy Nhơn", "Quy Nhon"), L("Gia Lai – Pleiku", "Gia Lai – Pleiku"), L("Khác", "Other")] }
        : q,
    );
  await prisma.project.update({ where: { id: project.id }, data: { cta: { ...cta, qualifiers } as Prisma.InputJsonValue } });
  console.log("Q'Terra lead qualifiers updated:", qualifiers.map((q) => q.key).join(", "));
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
