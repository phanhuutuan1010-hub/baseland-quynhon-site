// Cyra Estero — data side of the 16/11/2026 UI pass. Patch-only: each step
// touches just the fields it names (hotspots and any text edited in Admin
// are kept). Re-running is safe.
//
//   npx tsx prisma/updates/2026-11-16-cyra-ui-polish.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, type Prisma } from "@prisma/client";

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });
const L = (vi: string, en: string) => ({ vi, en });
const json = (v: unknown) => v as Prisma.InputJsonValue;
type Obj = Record<string, unknown>;

/** Show-apartment strip: the living-room panorama now has its own viewer
 * above, and no two neighbours share a caption. Order by file name. */
const SHOW_FLAT_ORDER = [
  "mau-phong-khach-1",
  "mau-ban-an",
  "mau-phong-khach-2",
  "mau-bep",
  "mau-pn-master-1",
  "mau-pn-tre-em-1",
  "mau-pn-master-2",
  "mau-pn-tre-em-2",
  "mau-pn",
  "mau-pn-tre-em-3",
  "mau-lo-gia-1",
  "mau-khu-giat",
  "mau-lo-gia-2",
  "mau-wc",
];

export const CYRA_ARCHITECTURE_FACTS = [
  { value: "18", label: L("tầng nổi", "floors") },
  { value: "2", label: L("tầng hầm", "basements") },
  { value: "210", label: L("căn hộ", "apartments") },
  { value: "8", label: L("shophouse", "shophouses") },
  { value: "14", label: L("căn/tầng", "units per floor") },
];

/** Hero photo: the strip of sky holding the developer's printed logo (top
 * ~15%) stays out of frame, and the tower sits right of the text block. */
export const CYRA_HERO_FRAME = { imageTrim: { top: 14.8, right: 0, bottom: 0, left: 0 }, imageFocus: { x: 60, y: 35 } };

export const CYRA_AMENITIES_ACTION = {
  actionLabel: L("Đặt lịch tham quan nhà mẫu", "Book a show apartment visit"),
  actionHref: "form", // lead form in place, source "cyra-estero-tien-ich"
};

async function main() {
  const project = await prisma.project.findUniqueOrThrow({
    where: { slug: "cyra-estero" },
    include: { residences: true, amenities: true, projectSections: true },
  });
  const projectId = project.id;

  // 1. Hero frame (replaces the earlier zoom-based imageCrop).
  const hero: Obj = { ...(project.hero as Obj), ...CYRA_HERO_FRAME };
  delete hero.imageCrop;
  await prisma.project.update({ where: { id: projectId }, data: { hero: json(hero) } });

  // 2. Show-apartment strip.
  if (project.residences) {
    const content = project.residences.content as Obj & { showFlat?: { photos?: { src: string }[] } };
    const photos = content.showFlat?.photos ?? [];
    // Blob URLs end "cyra-<name>-<random>.webp" — match the exact name
    // ("mau-pn" must not catch "mau-pn-master-1").
    const pickPhoto = (key: string) => photos.find((p) => new RegExp(`cyra-${key}-[A-Za-z0-9]+\\.webp$`).test(decodeURIComponent(p.src)));
    const ordered = SHOW_FLAT_ORDER.map(pickPhoto).filter((p): p is { src: string } => !!p);
    // Photos added in Admin (not in the list) stay, after the ordered ones;
    // only the living-room panorama is dropped.
    const rest = photos.filter((p) => !ordered.includes(p) && !decodeURIComponent(p.src).includes("cyra-mau-phong-khach-toan-canh"));
    await prisma.projectResidences.update({
      where: { projectId },
      data: { content: json({ ...content, showFlat: { ...content.showFlat, photos: [...ordered, ...rest] } }) },
    });
    console.log(`  showFlat: ${photos.length} → ${ordered.length + rest.length} ảnh`);
  }

  // 3. Amenities CTA.
  if (project.amenities) {
    await prisma.projectAmenities.update({
      where: { projectId },
      data: { content: json({ ...(project.amenities.content as Obj), ...CYRA_AMENITIES_ACTION }) },
    });
  }

  // 4. Architecture key figures.
  const architecture = project.projectSections.find((s) => s.type === "ARCHITECTURE");
  if (architecture) {
    await prisma.projectSection.update({
      where: { id: architecture.id },
      data: { content: json({ ...(architecture.content as Obj), facts: CYRA_ARCHITECTURE_FACTS }) },
    });
  }

  console.log(`${new URL(process.env.DATABASE_URL!).hostname.split(".")[0]}: Cyra Estero UI polish đã áp dụng.`);
}

if (process.argv[1]?.includes("2026-11-16-cyra-ui-polish")) {
  main()
    .catch((err) => {
      console.error(err);
      process.exit(1);
    })
    .finally(() => prisma.$disconnect());
}
