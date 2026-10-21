"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/server/db";
import { requireRole } from "@/lib/server/auth";
import { logActivity, activityLogWrite } from "@/lib/server/activityLog";

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
import type { Prisma, ProjectSectionType, ProjectPublishStatus } from "@prisma/client";
import { PROJECT_SECTION_DEFAULTS, leadPopupTemplate } from "@/lib/server/validation/projectSectionDefaults";

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
  salesPhases: "SALES_PHASES",
  virtualTour: "VIRTUAL_TOUR",
  leadPopup: "LEAD_POPUP",
};

function isNamedTableKey(key: string): key is NamedTableKey {
  return (NAMED_TABLE_KEYS as readonly string[]).includes(key);
}

async function revalidateProject(projectId: string) {
  const project = await prisma.project.findUnique({ where: { id: projectId }, select: { slug: true } });
  revalidateProjectPaths(projectId, project?.slug);
}

function revalidateProjectPaths(projectId: string, slug: string | undefined) {
  if (slug) revalidatePath(`/projects/${slug}`);
  // The /projects listing shows each project's hero image.
  revalidatePath("/projects");
  revalidatePath("/admin/projects");
  // Admin's Next.js Router Cache can otherwise show a stale snapshot of the
  // editor after navigating away and back — revalidate every admin route
  // for this project too, not just the public page.
  revalidatePath(`/admin/projects/${projectId}`, "layout");
}

/** Sections every new project gets (empty, hidden) — the standard
 * Q'Terra layout's slots, in page order. */
const STANDARD_GENERIC_SECTIONS: EditableProjectSectionKey[] = [
  "stats",
  "towers",
  "location",
  "architecture",
  "virtualTour",
  "videoDuo",
  "investment",
  "legal",
  "leadPopup",
];
const STANDARD_TABLE_SECTIONS: EditableProjectSectionKey[] = ["residences", "floorPlans", "amenities", "gallery", "documents"];

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
      // Standard layout: every template section exists from the start,
      // switched off until it is filled in (see STANDARD_SECTIONS below).
      sections: Object.fromEntries([...STANDARD_GENERIC_SECTIONS, ...STANDARD_TABLE_SECTIONS].map((k) => [k, false])),
      hero: {
        layout: "compact",
        eyebrow: { vi: d.name, en: d.name },
        addressLine: { vi: "", en: "" },
        subhead: { vi: "", en: "" },
        ctaExploreLabel: { vi: "Khám phá dự án", en: "Explore project" },
        ctaExploreHref: "#lead",
        ctaConsultLabel: { vi: "Nhận bảng giá", en: "Get the price list" },
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

  const content = (key: EditableProjectSectionKey) =>
    (key === "leadPopup" ? leadPopupTemplate(d.name) : PROJECT_SECTION_DEFAULTS[key]) as Prisma.InputJsonValue;
  await prisma.$transaction([
    prisma.projectSection.createMany({
      data: STANDARD_GENERIC_SECTIONS.map((key) => ({ projectId: project.id, type: KEY_TO_SECTION_TYPE[key], content: content(key) })),
    }),
    prisma.projectResidences.create({ data: { projectId: project.id, content: content("residences") } }),
    prisma.projectFloorPlans.create({ data: { projectId: project.id, content: content("floorPlans") } }),
    prisma.projectAmenities.create({ data: { projectId: project.id, content: content("amenities") } }),
    prisma.projectGallery.create({ data: { projectId: project.id, content: content("gallery") } }),
    prisma.projectDocuments.create({ data: { projectId: project.id, content: content("documents") } }),
  ]);

  await logActivity({ userId: user.id, action: "project.create", entityType: "Project", entityId: project.id });
  revalidatePath("/admin/projects");
  return { id: project.id };
}

/** Overview form's chip groups → cta.qualifiers. One option per line,
 * "VI | EN" (EN optional); a group with no options is left out. */
function parseQualifiers(groups: { key: "region" | "purpose"; labelVi: string; labelEn: string; optionsText: string }[]) {
  return groups
    .map((g) => ({
      key: g.key,
      label: { vi: g.labelVi, en: g.labelEn || g.labelVi },
      options: g.optionsText
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
          const [vi, en] = line.split("|").map((x) => x.trim());
          return { vi, en: en || vi };
        }),
    }))
    .filter((g) => g.options.length > 0);
}

export async function updateProjectOverview(projectId: string, input: unknown): Promise<ActionResult> {
  const user = await requireRole("ADMIN");
  const parsed = projectOverviewSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" };
  const d = parsed.data;

  const before = await prisma.project.findUnique({ where: { id: projectId } });
  if (!before) return { error: "Không tìm thấy dự án" };
  // The Overview form only covers part of hero/cta — keep the fields it
  // doesn't show (hero.navLabel/placeholderLabel, cta.qualifiers,
  // headlineMaxWidth…) instead of dropping them on every save. The hero
  // image is the exception: it is form-controlled, so blank = removed.
  const { image: prevHeroImage, ...prevHero } = (before.hero ?? {}) as Record<string, unknown> & {
    image?: { src?: string; alt?: { vi: string; en: string } };
  };
  const prevCta = (before.cta ?? {}) as Record<string, unknown>;

  await prisma.project.update({
    where: { id: projectId },
    data: {
      name: d.name,
      category: { vi: d.categoryVi, en: d.categoryEn },
      statusLabel: { vi: d.statusLabelVi, en: d.statusLabelEn },
      theme: d.theme || null,
      verificationRequired: d.verificationRequired,
      hero: {
        ...(prevHero as object),
        eyebrow: { vi: d.heroEyebrowVi, en: d.heroEyebrowEn },
        addressLine: { vi: d.heroAddressLineVi, en: d.heroAddressLineEn },
        subhead: { vi: d.heroSubheadVi, en: d.heroSubheadEn },
        ctaExploreLabel: { vi: d.heroCtaExploreLabelVi, en: d.heroCtaExploreLabelEn },
        ctaExploreHref: d.heroCtaExploreHref,
        ctaConsultLabel: { vi: d.heroCtaConsultLabelVi, en: d.heroCtaConsultLabelEn },
        ctaConsultHref: d.heroCtaConsultHref,
        layout: d.heroLayout,
        badge: { vi: d.heroBadgeVi, en: d.heroBadgeEn },
        facts: { vi: d.heroFactsVi, en: d.heroFactsEn },
        // Keep a hand-written alt text when the image itself is unchanged.
        ...(d.heroImageSrc
          ? {
              image: {
                src: d.heroImageSrc,
                alt: prevHeroImage?.src === d.heroImageSrc && prevHeroImage.alt ? prevHeroImage.alt : { vi: d.name, en: d.name },
              },
            }
          : {}),
      },
      cta: {
        ...(prevCta as object),
        eyebrow: { vi: d.ctaEyebrowVi, en: d.ctaEyebrowEn },
        headline: { vi: d.ctaHeadlineVi, en: d.ctaHeadlineEn },
        body: { vi: d.ctaBodyVi, en: d.ctaBodyEn },
        callNowLabel: { vi: d.ctaCallNowLabelVi, en: d.ctaCallNowLabelEn },
        leadSource: d.ctaLeadSource,
        ...(d.qualifiers ? { qualifiers: parseQualifiers(d.qualifiers) } : {}),
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
  // Old content is only needed for the audit trail of sensitive sections —
  // skip the extra read for every other section.
  const oldRow = !logField
    ? null
    : isNamedTableKey(key)
      ? await getNamedTableRow(key, projectId)
      : await prisma.projectSection.findUnique({ where: { projectId_type: { projectId, type: KEY_TO_SECTION_TYPE[key] } } });

  const contentJson = parsed.data as object;
  const write = isNamedTableKey(key)
    ? upsertNamedTable(key, projectId, contentJson)
    : prisma.projectSection.upsert({
        where: { projectId_type: { projectId, type: KEY_TO_SECTION_TYPE[key] } },
        update: { content: contentJson },
        create: { projectId, type: KEY_TO_SECTION_TYPE[key], content: contentJson },
      });

  const [, project] = await Promise.all([
    prisma.$transaction([
      write,
      activityLogWrite({
        userId: user.id,
        action: "project.section.update",
        entityType: "Project",
        entityId: projectId,
        field: logField,
        ...(logField ? { oldValue: oldRow?.content ?? null, newValue: parsed.data } : {}),
      }),
    ]),
    prisma.project.findUnique({ where: { id: projectId }, select: { slug: true } }),
  ]);
  revalidateProjectPaths(projectId, project?.slug);
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
  revalidatePath("/projects");
  redirect("/admin/projects");
}
