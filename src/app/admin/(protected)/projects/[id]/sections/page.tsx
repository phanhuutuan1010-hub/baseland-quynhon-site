import { notFound } from "next/navigation";
import { requireRole } from "@/lib/server/auth";
import { prisma } from "@/lib/server/db";
import { PROJECT_SECTION_LABELS, PROJECT_SECTION_ORDER } from "@/lib/server/validation/projectLabels";
import { NAMED_TABLE_KEYS, type EditableProjectSectionKey } from "@/lib/server/validation/project";
import { SectionListClient } from "./SectionListClient";

export const metadata = { title: "Nội dung dự án" };

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
  const presentGenericTypes = new Set(project.projectSections.map((s) => s.type));
  const namedTablePresence: Record<string, boolean> = {
    residences: !!project.residences,
    floorPlans: !!project.floorPlans,
    amenities: !!project.amenities,
    gallery: !!project.gallery,
    documents: !!project.documents,
  };

  const rows = PROJECT_SECTION_ORDER.map((key: EditableProjectSectionKey) => {
    const hasContent = (NAMED_TABLE_KEYS as readonly string[]).includes(key)
      ? namedTablePresence[key]
      : presentGenericTypes.has(KEY_TO_SECTION_TYPE[key] as never);
    return {
      key,
      label: PROJECT_SECTION_LABELS[key],
      hasContent,
      enabled: sectionFlags[key] !== false,
    };
  });

  return (
    <div className="flex flex-col gap-6">
      <p className="m-0 font-body text-sm text-[var(--color-text-muted)]">
        Ẩn/hiện và chỉnh nội dung từng section. Thứ tự hiển thị trên trang public luôn cố định (không đổi được ở đây) —
        chỉ nội dung và trạng thái ẩn/hiện là chỉnh được.
      </p>
      <SectionListClient projectId={project.id} initial={rows} canEdit={user.role === "ADMIN"} />
    </div>
  );
}
