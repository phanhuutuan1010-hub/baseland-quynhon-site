"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/server/db";
import { requireRole } from "@/lib/server/auth";
import { logActivity } from "@/lib/server/activityLog";
import { sanitizeArticleHtml } from "@/lib/server/sanitizeHtml";
import { createNewsSchema, updateNewsSchema, categorySchema } from "@/lib/server/validation/news";
import type { NewsStatus } from "@prisma/client";

type ActionResult = { error?: string };

function revalidateNews(slug?: string) {
  revalidatePath("/news");
  revalidatePath("/");
  if (slug) revalidatePath(`/news/${slug}`);
}

export async function createNews(input: unknown): Promise<ActionResult & { id?: string }> {
  const user = await requireRole("ADMIN");
  const parsed = createNewsSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" };

  const existing = await prisma.news.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) return { error: "Slug đã tồn tại, vui lòng chọn slug khác." };

  const news = await prisma.news.create({
    data: {
      slug: parsed.data.slug,
      titleVi: parsed.data.titleVi,
      titleEn: parsed.data.titleEn,
      excerptVi: "",
      excerptEn: "",
      contentVi: "",
      contentEn: "",
      categoryId: parsed.data.categoryId,
      status: "DRAFT",
    },
  });

  await logActivity({ userId: user.id, action: "news.create", entityType: "News", entityId: news.id });
  revalidatePath("/admin/news");
  return { id: news.id };
}

export async function updateNews(id: string, input: unknown): Promise<ActionResult> {
  const user = await requireRole("ADMIN");
  const parsed = updateNewsSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" };
  const d = parsed.data;

  const existing = await prisma.news.findUnique({ where: { id } });
  if (!existing) return { error: "Không tìm thấy bài viết" };
  if (d.slug !== existing.slug) {
    const slugTaken = await prisma.news.findUnique({ where: { slug: d.slug } });
    if (slugTaken) return { error: "Slug đã tồn tại, vui lòng chọn slug khác." };
  }

  await prisma.news.update({
    where: { id },
    data: {
      slug: d.slug,
      titleVi: d.titleVi,
      titleEn: d.titleEn,
      excerptVi: d.excerptVi,
      excerptEn: d.excerptEn,
      contentVi: sanitizeArticleHtml(d.contentVi),
      contentEn: sanitizeArticleHtml(d.contentEn),
      categoryId: d.categoryId,
      featuredImageUrl: d.featuredImageUrl || null,
      tags: d.tags,
      relatedProjects: {
        deleteMany: {},
        create: d.relatedProjectIds.map((projectId) => ({ projectId })),
      },
      seoTitle: d.seoTitle || null,
      seoDescription: d.seoDescription || null,
    },
  });

  await logActivity({ userId: user.id, action: "news.update", entityType: "News", entityId: id });
  revalidateNews(existing.slug);
  if (d.slug !== existing.slug) revalidateNews(d.slug);
  revalidatePath("/admin/news");
  revalidatePath(`/admin/news/${id}`);
  return {};
}

export async function setNewsStatus(id: string, status: NewsStatus): Promise<ActionResult> {
  const user = await requireRole("ADMIN");
  const news = await prisma.news.findUnique({ where: { id } });
  if (!news) return { error: "Không tìm thấy bài viết" };

  await prisma.news.update({
    where: { id },
    data: { status, publishedAt: status === "PUBLISHED" && !news.publishedAt ? new Date() : news.publishedAt },
  });

  await logActivity({
    userId: user.id,
    action: "news.status.update",
    entityType: "News",
    entityId: id,
    field: "status",
    oldValue: news.status,
    newValue: status,
  });
  revalidateNews(news.slug);
  return {};
}

export async function deleteNews(id: string): Promise<ActionResult> {
  const user = await requireRole("ADMIN");
  const news = await prisma.news.findUnique({ where: { id } });
  if (!news) return { error: "Không tìm thấy bài viết" };

  await prisma.news.delete({ where: { id } });
  await logActivity({ userId: user.id, action: "news.delete", entityType: "News", entityId: id });
  revalidateNews(news.slug);
  revalidatePath("/admin/news");
  redirect("/admin/news");
}

export async function createCategory(input: unknown): Promise<ActionResult> {
  const user = await requireRole("ADMIN");
  const parsed = categorySchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" };

  const existing = await prisma.category.findUnique({ where: { key: parsed.data.key } });
  if (existing) return { error: "Key danh mục đã tồn tại." };

  const count = await prisma.category.count();
  const category = await prisma.category.create({ data: { ...parsed.data, order: count } });
  await logActivity({ userId: user.id, action: "category.create", entityType: "Category", entityId: category.id });
  revalidateNews();
  revalidatePath("/admin/news");
  return {};
}

export async function updateCategory(id: string, input: unknown): Promise<ActionResult> {
  const user = await requireRole("ADMIN");
  const parsed = categorySchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" };

  await prisma.category.update({ where: { id }, data: parsed.data });
  await logActivity({ userId: user.id, action: "category.update", entityType: "Category", entityId: id });
  revalidateNews();
  revalidatePath("/admin/news");
  return {};
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  const user = await requireRole("ADMIN");
  const inUse = await prisma.news.count({ where: { categoryId: id } });
  if (inUse > 0) return { error: `Không thể xoá — còn ${inUse} bài viết đang dùng danh mục này.` };

  await prisma.category.delete({ where: { id } });
  await logActivity({ userId: user.id, action: "category.delete", entityType: "Category", entityId: id });
  revalidateNews();
  revalidatePath("/admin/news");
  return {};
}
