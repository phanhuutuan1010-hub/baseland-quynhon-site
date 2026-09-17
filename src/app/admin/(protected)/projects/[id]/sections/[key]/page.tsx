import { notFound } from "next/navigation";
import { requireRole } from "@/lib/server/auth";
import { prisma } from "@/lib/server/db";
import { projectSectionKeys, NAMED_TABLE_KEYS, type EditableProjectSectionKey, type NamedTableKey } from "@/lib/server/validation/project";
import { PROJECT_SECTION_LABELS } from "@/lib/server/validation/projectLabels";
import { PROJECT_SECTION_DEFAULTS } from "@/lib/server/validation/projectSectionDefaults";
import { SectionEditClient } from "./SectionEditClient";
import type { ProjectSectionType } from "@prisma/client";

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

async function getNamedTableContent(key: NamedTableKey, projectId: string) {
  switch (key) {
    case "residences":
      return (await prisma.projectResidences.findUnique({ where: { projectId } }))?.content;
    case "floorPlans":
      return (await prisma.projectFloorPlans.findUnique({ where: { projectId } }))?.content;
    case "amenities":
      return (await prisma.projectAmenities.findUnique({ where: { projectId } }))?.content;
    case "gallery":
      return (await prisma.projectGallery.findUnique({ where: { projectId } }))?.content;
    case "documents":
      return (await prisma.projectDocuments.findUnique({ where: { projectId } }))?.content;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string; key: string }> }) {
  const { key } = await params;
  const label = PROJECT_SECTION_LABELS[key as EditableProjectSectionKey] ?? "Section";
  return { title: label };
}

export default async function ProjectSectionEditPage({ params }: { params: Promise<{ id: string; key: string }> }) {
  const user = await requireRole("ADMIN", "SALES");
  const { id, key: rawKey } = await params;

  if (!(projectSectionKeys as readonly string[]).includes(rawKey)) notFound();
  const key = rawKey as EditableProjectSectionKey;

  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) notFound();

  const existingContent = isNamedTableKey(key)
    ? await getNamedTableContent(key, id)
    : (await prisma.projectSection.findUnique({ where: { projectId_type: { projectId: id, type: KEY_TO_SECTION_TYPE[key] } } }))?.content;

  // Shallow-merged with defaults rather than used as-is: real content saved
  // before an optional top-level field (e.g. location.mapImage) existed in
  // PROJECT_SECTION_DEFAULTS is missing that key entirely — and this form
  // only edits keys already present in the object, never invents new ones
  // — so without the merge, that field would silently never be editable.
  const initial = {
    ...(PROJECT_SECTION_DEFAULTS[key] as Record<string, unknown>),
    ...((existingContent ?? {}) as Record<string, unknown>),
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="m-0 font-ui text-lg font-bold text-[var(--color-charcoal)]">{PROJECT_SECTION_LABELS[key]}</h2>
      <div className="rounded-sm border border-[var(--color-border)] bg-[var(--color-warm-white)]">
        {user.role === "ADMIN" ? (
          <SectionEditClient projectId={id} sectionKey={key} initial={initial} />
        ) : (
          <pre className="overflow-auto p-6 font-body text-xs whitespace-pre-wrap text-[var(--color-charcoal)]">
            {JSON.stringify(initial, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}
