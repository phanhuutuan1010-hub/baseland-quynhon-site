import { notFound } from "next/navigation";
import { requireRole } from "@/lib/server/auth";
import { prisma } from "@/lib/server/db";
import { NewsEditorHeader } from "./NewsEditorHeader";
import { NewsEditForm } from "./NewsEditForm";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const news = await prisma.news.findUnique({ where: { id } });
  return { title: news?.titleVi ?? "Bài viết" };
}

export default async function NewsEditPage({ params }: { params: Promise<{ id: string }> }) {
  await requireRole("ADMIN");
  const { id } = await params;

  const [news, categories, projects] = await Promise.all([
    prisma.news.findUnique({ where: { id }, include: { relatedProjects: true } }),
    prisma.category.findMany({ orderBy: { order: "asc" } }),
    prisma.project.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);
  if (!news) notFound();

  return (
    <div className="flex flex-col gap-6">
      <NewsEditorHeader newsId={news.id} title={news.titleVi} slug={news.slug} status={news.status} />
      <div className="rounded-sm border border-[var(--color-border)] bg-[var(--color-warm-white)]">
        <NewsEditForm
          newsId={news.id}
          initial={{
            slug: news.slug,
            titleVi: news.titleVi,
            titleEn: news.titleEn,
            excerptVi: news.excerptVi,
            excerptEn: news.excerptEn,
            contentVi: news.contentVi,
            contentEn: news.contentEn,
            categoryId: news.categoryId,
            featuredImageUrl: news.featuredImageUrl ?? "",
            tags: news.tags,
            relatedProjectIds: news.relatedProjects.map((rp) => rp.projectId),
            seoTitle: news.seoTitle ?? "",
            seoDescription: news.seoDescription ?? "",
          }}
          categories={categories.map((c) => ({ id: c.id, labelVi: c.labelVi }))}
          projects={projects}
        />
      </div>
    </div>
  );
}
