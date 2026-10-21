import { notFound } from "next/navigation";
import { requireRole } from "@/lib/server/auth";
import { prisma } from "@/lib/server/db";
import { PROJECT_SECTION_LABELS, PROJECT_SECTION_ORDER } from "@/lib/server/validation/projectLabels";
import type { EditableProjectSectionKey } from "@/lib/server/validation/project";
import { SectionListClient } from "./SectionListClient";

export const metadata = { title: "Nội dung dự án" };

/** Sections shown inside another one on the standard layout (nested in the list). */
const MERGED_INTO: Partial<Record<EditableProjectSectionKey, EditableProjectSectionKey>> = {
  gallery: "location",
  floorPlans: "residences",
  salesPhases: "investment",
  legal: "documents",
};

/** Not rendered by the standard layout (stats only feeds the hero line). */
const NOT_IN_STANDARD_LAYOUT = new Set<EditableProjectSectionKey>(["intro", "materialStory", "lifestyle", "views"]);

/** Section types that don't apply to a project's product type — left out of
 * its list so editors only see what the page can show. */
const SECTIONS_NOT_FOR_PROJECT: Record<string, EditableProjectSectionKey[]> = {
  "simona-heights": ["education", "masterplan", "verification"],
  "the-sailing": ["education", "masterplan"],
  "phu-gia-royal-park": ["towers", "verification"],
};

/** Per-language fill state of a section: "ok" when every text that is
 * filled in one language is filled in this one too, "missing" otherwise,
 * "empty" when the section has no text at all. */
function langStatus(content: unknown): { vi: "ok" | "missing" | "empty"; en: "ok" | "missing" | "empty" } {
  let any = false;
  let viMissing = false;
  let enMissing = false;
  const visit = (v: unknown) => {
    if (Array.isArray(v)) return v.forEach(visit);
    if (!v || typeof v !== "object") return;
    const o = v as Record<string, unknown>;
    const keys = Object.keys(o);
    if (keys.length === 2 && typeof o.vi === "string" && typeof o.en === "string") {
      const vi = o.vi.trim();
      const en = o.en.trim();
      if (vi || en) any = true;
      if (en && !vi) viMissing = true;
      if (vi && !en) enMissing = true;
      return;
    }
    Object.values(o).forEach(visit);
  };
  visit(content);
  if (!any) return { vi: "empty", en: "empty" };
  return { vi: viMissing ? "missing" : "ok", en: enMissing ? "missing" : "ok" };
}

const KEY_TO_SECTION_TYPE: Record<string, string> = {
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

export default async function ProjectSectionsPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireRole("ADMIN", "SALES");
  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id },
    include: { projectSections: true, residences: true, floorPlans: true, amenities: true, gallery: true, documents: true },
  });
  if (!project) notFound();

  const sectionFlags = (project.sections as Record<string, boolean>) ?? {};
  const contentByKey: Record<string, unknown> = {
    residences: project.residences?.content,
    floorPlans: project.floorPlans?.content,
    amenities: project.amenities?.content,
    gallery: project.gallery?.content,
    documents: project.documents?.content,
  };
  for (const section of project.projectSections) {
    const key = Object.keys(KEY_TO_SECTION_TYPE).find((k) => KEY_TO_SECTION_TYPE[k] === section.type);
    if (key) contentByKey[key] = section.content;
  }
  const hiddenForProject = new Set(SECTIONS_NOT_FOR_PROJECT[project.slug] ?? []);

  const rows = PROJECT_SECTION_ORDER.filter((key) => !hiddenForProject.has(key)).map((key: EditableProjectSectionKey) => {
    const content = contentByKey[key];
    return {
      key,
      label: PROJECT_SECTION_LABELS[key],
      hasContent: content != null,
      enabled: sectionFlags[key] !== false,
      parent: MERGED_INTO[key] ? PROJECT_SECTION_LABELS[MERGED_INTO[key]] : undefined,
      unused: NOT_IN_STANDARD_LAYOUT.has(key),
      lang: content != null ? langStatus(content) : undefined,
    };
  });

  return (
    <div className="flex flex-col gap-6">
      <p className="m-0 font-body text-sm text-[var(--color-text-muted)]">
        Xếp theo thứ tự hiển thị trên trang. Mục lồng bên dưới được hiển thị bên trong mục cha.
      </p>
      <SectionListClient projectId={project.id} initial={rows} canEdit={user.role === "ADMIN"} />
    </div>
  );
}
