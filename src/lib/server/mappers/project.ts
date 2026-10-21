import "server-only";

import { cache } from "react";
import type { ProjectSectionType, ProjectPublishStatus } from "@prisma/client";
import { prisma } from "@/lib/server/db";
import { attachImageMeta } from "@/lib/server/imageMeta";
import type { ProjectDetailData, ProjectSectionKey, ProjectVerification } from "@/lib/project-detail/types";

const SECTION_TYPE_TO_KEY: Record<ProjectSectionType, ProjectSectionKey> = {
  INTRO: "intro",
  STATS: "stats",
  TOWERS: "towers",
  LOCATION: "location",
  MASTERPLAN: "masterplan",
  ARCHITECTURE: "architecture",
  MATERIAL_STORY: "materialStory",
  LIFESTYLE: "lifestyle",
  EDUCATION: "education",
  VIEWS: "views",
  INVESTMENT: "investment",
  LEGAL: "legal",
  FAQ: "faq",
  VERIFICATION: "verification",
  VIDEO_DUO: "videoDuo",
  NEWS_TEASER: "news",
  SALES_PHASES: "salesPhases",
  VIRTUAL_TOUR: "virtualTour",
  LEAD_POPUP: "leadPopup",
};

export const PROJECT_INCLUDE = {
  projectSections: true,
  residences: true,
  floorPlans: true,
  amenities: true,
  gallery: true,
  documents: true,
  // News linked to the project in Admin (Tin tức → Dự án liên quan).
  relatedNews: {
    where: { news: { status: "PUBLISHED" } },
    include: { news: { select: { slug: true, titleVi: true, titleEn: true, featuredImageUrl: true, publishedAt: true, createdAt: true } } },
  },
} as const;

type ProjectRow = NonNullable<Awaited<ReturnType<typeof prisma.project.findFirst<{ include: typeof PROJECT_INCLUDE }>>>>;

function assembleProjectDetailData(row: ProjectRow): ProjectDetailData {
  const data = {
    slug: row.slug,
    name: row.name,
    category: row.category,
    status: row.statusLabel,
    theme: row.theme ?? undefined,
    sections: row.sections,
    hero: row.hero,
    cta: row.cta,
    seo:
      row.seoTitle || row.seoDescription || row.seoOgImageUrl
        ? { title: row.seoTitle ?? undefined, description: row.seoDescription ?? undefined, ogImageUrl: row.seoOgImageUrl ?? undefined }
        : undefined,
  } as ProjectDetailData;

  for (const section of row.projectSections) {
    const key = SECTION_TYPE_TO_KEY[section.type];
    (data as unknown as Record<string, unknown>)[key] = section.content;
  }
  if (row.residences) data.residences = row.residences.content as ProjectDetailData["residences"];
  if (row.floorPlans) data.floorPlans = row.floorPlans.content as ProjectDetailData["floorPlans"];
  if (row.amenities) data.amenities = row.amenities.content as ProjectDetailData["amenities"];
  if (row.gallery) data.gallery = row.gallery.content as ProjectDetailData["gallery"];
  if (row.documents) data.documents = row.documents.content as ProjectDetailData["documents"];
  // Only articles with a photo — the teaser never shows a grey box.
  data.relatedArticles = row.relatedNews
    .map((r) => r.news)
    .filter((n) => !!n.featuredImageUrl)
    .sort((a, b) => +(b.publishedAt ?? b.createdAt) - +(a.publishedAt ?? a.createdAt))
    .slice(0, 3)
    .map((n) => ({
      slug: n.slug,
      title: { vi: n.titleVi, en: n.titleEn },
      date: (n.publishedAt ?? n.createdAt).toISOString().slice(0, 10),
      image: n.featuredImageUrl!,
    }));

  // "chỉ VERIFIED mới public nếu bật kiểm tra" (mục 5/9) — off by default,
  // matching the site's existing convention of showing hedge-labeled
  // unverified facts rather than hiding them (see the-sailing.ts).
  if (row.verificationRequired && data.verification) {
    const verification = data.verification as ProjectVerification;
    data.verification = { ...verification, items: verification.items.filter((item) => item.verified) };
  }

  return data;
}

export const getPublishedProjectBySlug = cache(async (slug: string): Promise<ProjectDetailData | null> => {
  const row = await prisma.project.findFirst({
    where: { slug, publishStatus: "PUBLISHED" },
    include: PROJECT_INCLUDE,
  });
  if (!row) return null;
  return attachImageMeta(assembleProjectDetailData(row));
});

export const getPublishedProjects = cache(async (): Promise<ProjectDetailData[]> => {
  const rows = await prisma.project.findMany({
    where: { publishStatus: "PUBLISHED" },
    include: PROJECT_INCLUDE,
    orderBy: { createdAt: "asc" },
  });
  return rows.map(assembleProjectDetailData);
});

export const getPublishedProjectSlugs = cache(async (): Promise<string[]> => {
  const rows = await prisma.project.findMany({ where: { publishStatus: "PUBLISHED" }, select: { slug: true } });
  return rows.map((r) => r.slug);
});

// Admin-facing — any publish status, includes drafts/archived.
export async function getProjectForAdmin(id: string) {
  return prisma.project.findUnique({ where: { id }, include: PROJECT_INCLUDE });
}

export async function listProjectsForAdmin() {
  return prisma.project.findMany({ orderBy: { createdAt: "asc" } });
}

export type { ProjectPublishStatus };

export type ProjectCardImage = {
  src: string;
  alt: { vi: string; en: string };
  focalX?: number;
  focalY?: number;
  /** true = the dedicated 4:3 card image; false = hero-image fallback. */
  isCard?: boolean;
};

/** Published projects' hero images by slug — the /projects listing cards
 * use them (Admin → Dự án → Tổng quan → Ảnh hero), so there is no
 * separate card image to keep in sync. */
export const getProjectCardImages = cache(async (): Promise<Record<string, ProjectCardImage>> => {
  const rows = await prisma.project.findMany({ where: { publishStatus: "PUBLISHED" }, select: { slug: true, hero: true } });
  const images: Record<string, ProjectCardImage> = {};
  for (const r of rows) {
    // The 4:3 card image (Overview → Ảnh đại diện) wins; else the hero image.
    const hero = r.hero as { image?: ProjectCardImage; cardImage?: ProjectCardImage } | null;
    const img = hero?.cardImage?.src ? hero.cardImage : hero?.image;
    if (img?.src) images[r.slug] = { ...img, isCard: img === hero?.cardImage };
  }
  return attachImageMeta(images);
});

/** Hero photo of the /projects listing (Admin → Cài đặt → Chung). */
export const getProjectsPageHeroImage = cache(async (): Promise<ProjectCardImage | null> => {
  const settings = await prisma.settings.findUnique({ where: { id: 1 }, select: { projectsHeroImageUrl: true } });
  const src = settings?.projectsHeroImageUrl;
  if (!src) return null;
  return attachImageMeta({ src, alt: { vi: "Biển và thành phố Quy Nhơn", en: "Quy Nhon's sea and city" } } as ProjectCardImage);
});
