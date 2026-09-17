import { notFound } from "next/navigation";
import { requireRole } from "@/lib/server/auth";
import { prisma } from "@/lib/server/db";
import { ProjectEditorHeader } from "./ProjectEditorHeader";

export default async function ProjectEditorLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const user = await requireRole("ADMIN", "SALES");
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) notFound();

  return (
    <div className="flex flex-col gap-6">
      <ProjectEditorHeader
        projectId={project.id}
        name={project.name}
        slug={project.slug}
        publishStatus={project.publishStatus}
        canEdit={user.role === "ADMIN"}
      />
      {children}
    </div>
  );
}
