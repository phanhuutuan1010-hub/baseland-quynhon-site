"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/server/db";
import { requireRole } from "@/lib/server/auth";
import { logActivity } from "@/lib/server/activityLog";

// Section keys whose content carries price/legal/progress-adjacent facts —
// always logged with old/new values, regardless of which specific field
// inside them changed (see mục 10's Price/Legal/Ownership/Handover/
// Progress/Operator/Developer requirement).
const SENSITIVE_SECTION_KEYS = new Set(["investment", "verification", "legal"]);
import {
  createProjectSchema,
  projectOverviewSchema,
  genericSectionContentSchema,
  verificationContentSchema,
  NAMED_TABLE_KEYS,
  type EditableProjectSectionKey,
  type NamedTableKey,
} from "@/lib/server/validation/project";
import type { ProjectSectionType, ProjectPublishStatus } from "@prisma/client";

type ActionResult = { error?: string };

const KEY_TO_SECTION_TYPE: Record<string, ProjectSectionType> = {
  intro: "INTRO",
  stats: "STATS",
  towers: "TOWERS",
  location: "LOCATION",
  masterplan: "MASTERPLAN",
  architecture: "ARCHITECTURE",
  materialStory: "MATERIAL_STORY",
  lifestyle: "LIFESTYLE",
  education: "EDUCATION",
  views: "VIEWS",
  investment: "INVESTMENT",
  legal: "LEGAL",
  faq: "FAQ",
  verification: "VERIFICATION",
  videoDuo: "VIDEO_DUO",
  news: "NEWS_TEASER",
};

function isNamedTableKey(key: string): key is NamedTableKey {
  return (NAMED_TABLE_KEYS as readonly string[]).includes(key);
}

async function revalidateProject(projectId: string) {
  const project = await prisma.project.findUnique({ where: { id: projectId }, select: { slug: true } });
  if (project) revalidatePath(`/projects/${project.slug}`);
  revalidatePath("/admin/projects");
  // Admin's Next.js Router Cache can otherwise show a stale snapshot of the
  // editor after navigating away and back — revalidate every admin route
  // for this project too, not just the public page.
  revalidatePath(`/admin/projects/${projectId}`, "layout");
}

export async function createProject(input: unknown): Promise<ActionResult & { id?: string }> {
  const user = await requireRole("ADMIN");
  const parsed = createProjectSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" };

  const existing = await prisma.project.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) return { error: "Slug đã tồn tại, vui lòng chọn slug khác." };

  const d = parsed.data;
  const project = await prisma.project.create({
    data: {
      slug: d.slug,
      name: d.name,
      category: { vi: d.categoryVi, en: d.categoryEn },
      statusLabel: { vi: d.statusLabelVi, en: d.statusLabelEn },
      sections: {},
      hero: {
        eyebrow: { vi: d.name, en: d.name },
        addressLine: { vi: "", en: "" },
        subhead: { vi: "", en: "" },
        ctaExploreLabel: { vi: "Khám phá dự án", en: "Explore project" },
        ctaExploreHref: "#lead",
        ctaConsultLabel: { vi: "Nhận tư vấn", en: "Get in Touch" },
        ctaConsultHref: "#lead",
      },
      cta: {
        eyebrow: { vi: "Liên hệ", en: "Contact" },
        headline: { vi: `Tìm hiểu về ${d.name}`, en: `Learn about ${d.name}` },
        body: { vi: "", en: "" },
        callNowLabel: { vi: "Gọi ngay", en: "Call now" },
        leadSource: d.slug,
      },
      publishStatus: "DRAFT",
    },
  });

  await logActivity({ userId: user.id, action: "project.create", entityType: "Project", entityId: project.id });
  revalidatePath("/admin/projects");
  return { id: project.id };
}

export async function updateProjectOverview(projectId: string, input: unknown): Promise<ActionResult> {
  const user = await requireRole("ADMIN");
  const parsed = projectOverviewSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" };
  const d = parsed.data;

  const before = await prisma.project.findUnique({ where: { id: projectId } });
  if (!before) return { error: "Không tìm thấy dự án" };

  await prisma.project.update({
    where: { id: projectId },
    data: {
      name: d.name,
      category: { vi: d.categoryVi, en: d.categoryEn },
      statusLabel: { vi: d.statusLabelVi, en: d.statusLabelEn },
      theme: d.theme || null,
      verificationRequired: d.verificationRequired,
      hero: {
        eyebrow: { vi: d.heroEyebrowVi, en: d.heroEyebrowEn },
        addressLine: { vi: d.heroAddressLineVi, en: d.heroAddressLineEn },
        subhead: { vi: d.heroSubheadVi, en: d.heroSubheadEn },
        ctaExploreLabel: { vi: d.heroCtaExploreLabelVi, en: d.heroCtaExploreLabelEn },
        ctaExploreHref: d.heroCtaExploreHref,
        ctaConsultLabel: { vi: d.heroCtaConsultLabelVi, en: d.heroCtaConsultLabelEn },
        ctaConsultHref: d.heroCtaConsultHref,
        ...(d.heroImageSrc ? { image: { src: d.heroImageSrc, alt: { vi: d.name, en: d.name } } } : {}),
      },
      cta: {
        eyebrow: { vi: d.ctaEyebrowVi, en: d.ctaEyebrowEn },
        headline: { vi: d.ctaHeadlineVi, en: d.ctaHeadlineEn },
        body: { vi: d.ctaBodyVi, en: d.ctaBodyEn },
        callNowLabel: { vi: d.ctaCallNowLabelVi, en: d.ctaCallNowLabelEn },
        leadSource: d.ctaLeadSource,
      },
      seoTitle: d.seoTitle || null,
      seoDescription: d.seoDescription || null,
      seoOgImageUrl: d.seoOgImageUrl || null,
    },
  });

  await logActivity({
    userId: user.id,
    action: "project.overview.update",
    entityType: "Project",
    entityId: projectId,
    field: "verificationRequired",
    oldValue: before.verificationRequired,
    newValue: d.verificationRequired,
  });
  await revalidateProject(projectId);
  return {};
}

export async function toggleProjectSectionEnabled(
  projectId: string,
  key: EditableProjectSectionKey,
  enabled: boolean,
): Promise<ActionResult> {
  const user = await requireRole("ADMIN");
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) return { error: "Không tìm thấy dự án" };

  const sections = (project.sections as Record<string, boolean>) ?? {};
  await prisma.project.update({ where: { id: projectId }, data: { sections: { ...sections, [key]: enabled } } });

  await logActivity({ userId: user.id, action: "project.section.toggle", entityType: "Project", entityId: projectId, field: key });
  await revalidateProject(projectId);
  return {};
}

export async function updateProjectSectionContent(
  projectId: string,
  key: EditableProjectSectionKey,
  content: unknown,
): Promise<ActionResult> {
  const user = await requireRole("ADMIN");
  const schema = key === "verification" ? verificationContentSchema : genericSectionContentSchema;
  const parsed = schema.safeParse(content);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" };

  const logField = SENSITIVE_SECTION_KEYS.has(key) ? key : undefined;
  const oldRow = isNamedTableKey(key)
    ? await getNamedTableRow(key, projectId)
    : await prisma.projectSection.findUnique({ where: { projectId_type: { projectId, type: KEY_TO_SECTION_TYPE[key] } } });

  const contentJson = parsed.data as object;
  if (isNamedTableKey(key)) {
    await upsertNamedTable(key, projectId, contentJson);
  } else {
    const type = KEY_TO_SECTION_TYPE[key];
    await prisma.projectSection.upsert({
      where: { projectId_type: { projectId, type } },
      update: { content: contentJson },
      create: { projectId, type, content: contentJson },
    });
  }

  await logActivity({
    userId: user.id,
    action: "project.section.update",
    entityType: "Project",
    entityId: projectId,
    field: logField,
    ...(logField ? { oldValue: oldRow?.content ?? null, newValue: parsed.data } : {}),
  });
  await revalidateProject(projectId);
  return {};
}

function getNamedTableRow(key: NamedTableKey, projectId: string) {
  switch (key) {
    case "residences":
      return prisma.projectResidences.findUnique({ where: { projectId } });
    case "floorPlans":
      return prisma.projectFloorPlans.findUnique({ where: { projectId } });
    case "amenities":
      return prisma.projectAmenities.findUnique({ where: { projectId } });
    case "gallery":
      return prisma.projectGallery.findUnique({ where: { projectId } });
    case "documents":
      return prisma.projectDocuments.findUnique({ where: { projectId } });
  }
}

function upsertNamedTable(key: NamedTableKey, projectId: string, content: object) {
  const args = { where: { projectId }, update: { content }, create: { projectId, content } };
  switch (key) {
    case "residences":
      return prisma.projectResidences.upsert(args);
    case "floorPlans":
      return prisma.projectFloorPlans.upsert(args);
    case "amenities":
      return prisma.projectAmenities.upsert(args);
    case "gallery":
      return prisma.projectGallery.upsert(args);
    case "documents":
      return prisma.projectDocuments.upsert(args);
  }
}

export async function setProjectPublishStatus(projectId: string, status: ProjectPublishStatus): Promise<ActionResult> {
  const user = await requireRole("ADMIN");
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) return { error: "Không tìm thấy dự án" };

  await prisma.project.update({
    where: { id: projectId },
    data: {
      publishStatus: status,
      publishedAt: status === "PUBLISHED" && !project.publishedAt ? new Date() : project.publishedAt,
    },
  });

  await logActivity({
    userId: user.id,
    action: "project.publishStatus.update",
    entityType: "Project",
    entityId: projectId,
    field: "publishStatus",
    oldValue: project.publishStatus,
    newValue: status,
  });
  await revalidateProject(projectId);
  return {};
}

export async function deleteProject(projectId: string): Promise<ActionResult> {
  const user = await requireRole("ADMIN");
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) return { error: "Không tìm thấy dự án" };

  await prisma.project.delete({ where: { id: projectId } });
  await logActivity({ userId: user.id, action: "project.delete", entityType: "Project", entityId: projectId });
  revalidatePath("/admin/projects");
  revalidatePath(`/projects/${project.slug}`);
  redirect("/admin/projects");
}
