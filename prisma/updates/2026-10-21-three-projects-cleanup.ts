// Simona Heights, The Sailing, Phú Gia Royal Park clean-up (21/10/2026).
// Q'Terra is not touched. Patches only the named fields; re-running is safe.
//
//   npx tsx prisma/updates/2026-10-21-three-projects-cleanup.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, type Prisma, type ProjectSectionType } from "@prisma/client";
import { leadPopupTemplate } from "../../src/lib/server/validation/projectSectionDefaults";

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });
const L = (vi: string, en: string) => ({ vi, en });
type Obj = Record<string, unknown>;
type Loc = { vi: string; en: string };

const REGION = { key: "region", label: L("Khu vực", "Region"), options: [L("Quy Nhơn", "Quy Nhon"), L("Gia Lai – Pleiku", "Gia Lai – Pleiku"), L("Khác", "Other")] };
const NEED_ADVICE = L("Cần tư vấn", "I need advice");

/** "Nhu cầu" chips per project (product lines). */
const PURPOSE: Record<string, Loc[]> = {
  "simona-heights": [L("First Heights", "First Heights"), L("Profit Heights", "Profit Heights"), L("Duplex/Pent Heights", "Duplex/Pent Heights"), NEED_ADVICE],
  "the-sailing": [L("The Maestro", "The Maestro"), L("The Sailing", "The Sailing"), NEED_ADVICE],
  "phu-gia-royal-park": [L("Shophouse Tây Sơn", "Tay Son shophouse"), L("Shophouse nội khu", "Inner shophouse"), L("Liền kề", "Townhouse"), NEED_ADVICE],
};

/** "Đang cập nhật"-style copy replaced with neutral wording (VI+EN). */
const TEXT_FIXES: Record<string, Record<string, Loc>> = {
  "phu-gia-royal-park": {
    "gallery.intro": L("Hình ảnh công trường và phối cảnh Phú Gia Royal Park", "Site photos and renderings of Phú Gia Royal Park"),
    "documents.items.3.note": L("Theo thông báo chính thức tại từng đợt mở bán", "Per official announcements at each sales phase"),
  },
  "the-sailing": {
    "gallery.intro": L("Hình ảnh The Sailing Quy Nhơn", "The Sailing Quy Nhon in pictures"),
    "documents.items.1.note": L("Chưa có tài liệu chính thức — đăng ký để nhận sớm nhất", "No official document yet — register to receive it first"),
    "documents.items.4.note": L("Hình ảnh thực tế gửi khi có nguồn xác minh", "Real photos sent once a verified source is available"),
  },
};

function setPath(root: Obj, path: string[], value: unknown) {
  let node: unknown = root;
  for (const k of path.slice(0, -1)) node = (node as Obj | undefined)?.[k];
  if (node && typeof node === "object") (node as Obj)[path[path.length - 1]] = value;
}

async function upsertSection(projectId: string, type: ProjectSectionType, fn: (c: Obj | null) => Obj | null) {
  const row = await prisma.projectSection.findUnique({ where: { projectId_type: { projectId, type } } });
  const next = fn((row?.content as Obj) ?? null);
  if (!next) return;
  await prisma.projectSection.upsert({
    where: { projectId_type: { projectId, type } },
    update: { content: next as Prisma.InputJsonValue },
    create: { projectId, type, content: next as Prisma.InputJsonValue },
  });
}

async function main() {
  for (const slug of Object.keys(PURPOSE)) {
    const p = await prisma.project.findUnique({ where: { slug }, include: { gallery: true, documents: true } });
    if (!p) {
      console.log(`skip ${slug}: not found`);
      continue;
    }
    const sections: Obj = { ...(p.sections as Obj), leadPopup: true };
    const cta = p.cta as Obj;
    const qualifiers = [REGION, { key: "purpose", label: L("Nhu cầu", "Interest"), options: PURPOSE[slug] }];

    // Lead pop-up from the template (kept if it already exists).
    await upsertSection(p.id, "LEAD_POPUP", (c) => c ?? leadPopupTemplate(p.name));

    // Placeholder advisors (seed number) removed → the branch hotline is used.
    await upsertSection(p.id, "VIDEO_DUO", (c) => {
      if (!c) return null;
      const clean = (a: unknown) => {
        const adv = a as Obj | undefined;
        return adv && String(adv.phone ?? "").replace(/\D/g, "") === "0965273179" ? { ...adv, name: "", phone: "", phoneHref: "", enabled: false } : adv;
      };
      return { ...c, primaryAdvisor: clean(c.primaryAdvisor), secondaryAdvisor: clean(c.secondaryAdvisor) };
    });

    // Drop "… sẽ được cập nhật …" placeholder sentences from the Location intro.
    await upsertSection(p.id, "LOCATION", (c) => {
      if (!c) return null;
      const body = c.body as Loc | undefined;
      if (!body) return null;
      const strip = (t: string) =>
        t
          .split(/(?<=[.!?])\s+/)
          .filter((sentence) => !/sẽ được cập nhật|will be updated|to be updated/i.test(sentence))
          .join(" ");
      const next = { vi: strip(body.vi), en: strip(body.en) };
      return next.vi === body.vi && next.en === body.en ? null : { ...c, body: next };
    });

    // The Sailing had linked news but no News section to show it.
    if (slug === "the-sailing") {
      await upsertSection(p.id, "NEWS_TEASER", (c) =>
        c ?? { eyebrow: L("Tin tức", "News"), headline: L("Tin tức về The Sailing", "News about The Sailing"), readMoreLabel: L("Xem thêm", "Read more"), articleSlugs: [] },
      );
      sections.news = true;
    }

    for (const [path, value] of Object.entries(TEXT_FIXES[slug] ?? {})) {
      const [table, ...rest] = path.split(".");
      const row = table === "gallery" ? p.gallery : p.documents;
      if (!row) continue;
      const content = structuredClone(row.content) as Obj;
      // Only replace the old "cập nhật" wording — never other copy.
      const current = rest.reduce<unknown>((node, k) => (node as Obj | undefined)?.[k], content);
      if (!/cập nhật|updat/i.test(JSON.stringify(current ?? ""))) continue;
      setPath(content, rest, value);
      if (table === "gallery") await prisma.projectGallery.update({ where: { projectId: p.id }, data: { content: content as Prisma.InputJsonValue } });
      else await prisma.projectDocuments.update({ where: { projectId: p.id }, data: { content: content as Prisma.InputJsonValue } });
      // refresh the in-memory row for the next fix on the same table
      if (table === "gallery") p.gallery!.content = content as Prisma.JsonValue;
      else p.documents!.content = content as Prisma.JsonValue;
    }

    await prisma.project.update({
      where: { id: p.id },
      data: { sections: sections as Prisma.InputJsonValue, cta: { ...cta, qualifiers } as Prisma.InputJsonValue },
    });
    console.log(`${slug}: done`);
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
