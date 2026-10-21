// Shorter destinations heading on /projects/qterra (21/10/2026). Re-running is safe.
//
//   npx tsx prisma/updates/2026-10-21-qterra-destinations-title.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, type Prisma } from "@prisma/client";

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

async function main() {
  const project = await prisma.project.findUniqueOrThrow({ where: { slug: "qterra" }, include: { gallery: true } });
  if (!project.gallery) return console.log("No gallery — nothing to do.");
  const content = project.gallery.content as Record<string, unknown>;
  await prisma.projectGallery.update({
    where: { projectId: project.id },
    data: {
      content: {
        ...content,
        //   keeps each place name on one line when the heading wraps.
        intro: {
          vi: "Từ Q'Terra đến [[Kỳ Co, Eo Gió, Nhơn Lý]]",
          en: "From Q'Terra to [[Ky Co, Eo Gio, Nhon Ly]]",
        },
      } as Prisma.InputJsonValue,
    },
  });
  console.log("Q'Terra destinations heading updated.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
