// "Xem thực địa qua video Zalo" pop-up for /projects/qterra (13/11/2026) —
// written into the Admin CMS row (Dự án → Nội dung → Pop-up video call
// thực địa) and switched on. The old lead pop-up ("Popup thu lead") is
// switched off for Q'Terra (agreed 13/11) — one pop-up per session, and
// the old one would always come first. Re-running is safe; an existing row keeps
// whatever was edited in Admin (only created when missing).
//
//   npx tsx prisma/updates/2026-11-13-qterra-video-call-popup.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { VIDEO_CALL_POPUP_DEFAULT } from "../../src/lib/server/validation/projectSectionDefaults";

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

async function main() {
  const project = await prisma.project.findUniqueOrThrow({ where: { slug: "qterra" } });
  await prisma.project.update({
    where: { id: project.id },
    data: { sections: { ...(project.sections as object), leadPopup: false, videoCallPopup: true } },
  });
  await prisma.projectSection.upsert({
    where: { projectId_type: { projectId: project.id, type: "VIDEO_CALL_POPUP" } },
    update: {},
    create: { projectId: project.id, type: "VIDEO_CALL_POPUP", content: VIDEO_CALL_POPUP_DEFAULT },
  });
  // 13/11: consent checkbox dropped — remove its two fields from the stored
  // row so Admin no longer shows them.
  const row = await prisma.projectSection.findUniqueOrThrow({
    where: { projectId_type: { projectId: project.id, type: "VIDEO_CALL_POPUP" } },
  });
  const { consentLabel: _l, consentError: _e, ...content } = row.content as Record<string, unknown>;
  void _l;
  void _e;
  await prisma.projectSection.update({ where: { id: row.id }, data: { content: content as object } });
  console.log("Q'Terra video-call popup saved.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
