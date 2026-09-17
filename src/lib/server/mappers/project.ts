import "server-only";

import { cache } from "react";
import type { ProjectSectionType, ProjectPublishStatus } from "@prisma/client";
import { prisma } from "@/lib/server/db";
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
};

export const PROJECT_INCLUDE = {
  projectSections: true,
  residences: true,
  floorPlans: true,
  amenities: true,
  gallery: true,
  documents: true,
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
  return assembleProjectDetailData(row);
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
