import "server-only";

import { cache } from "react";
import { prisma } from "@/lib/server/db";
import type { Localized } from "@/lib/i18n";

export type NewsArticleData = {
  slug: string;
  category: { key: string; label: Localized<string> };
  date: string;
  title: Localized<string>;
  excerpt: Localized<string>;
  contentHtml: Localized<string>;
  featuredImageUrl: string | null;
  tags: string[];
  relatedProjects: { name: string; href: string }[];
  seo: { title?: string; description?: string };
};

function toArticleData(row: {
  slug: string;
  titleVi: string;
  titleEn: string;
  excerptVi: string;
  excerptEn: string;
  contentVi: string;
  contentEn: string;
  featuredImageUrl: string | null;
  tags: string[];
  seoTitle: string | null;
  seoDescription: string | null;
  publishedAt: Date | null;
  createdAt: Date;
  category: { key: string; labelVi: string; labelEn: string };
  relatedProjects: { project: { name: string; slug: string } }[];
}): NewsArticleData {
  return {
    slug: row.slug,
    category: { key: row.category.key, label: { vi: row.category.labelVi, en: row.category.labelEn } },
    date: (row.publishedAt ?? row.createdAt).toISOString().slice(0, 10),
    title: { vi: row.titleVi, en: row.titleEn },
    excerpt: { vi: row.excerptVi, en: row.excerptEn },
    contentHtml: { vi: row.contentVi, en: row.contentEn },
    featuredImageUrl: row.featuredImageUrl,
    tags: row.tags,
    relatedProjects: row.relatedProjects.map((rp) => ({ name: rp.project.name, href: `/projects/${rp.project.slug}` })),
    seo: { title: row.seoTitle ?? undefined, description: row.seoDescription ?? undefined },
  };
}

const ARTICLE_INCLUDE = {
  category: true,
  relatedProjects: { include: { project: { select: { name: true, slug: true } } } },
} as const;

export const getPublishedArticles = cache(async (): Promise<NewsArticleData[]> => {
  const rows = await prisma.news.findMany({
    where: { status: "PUBLISHED" },
    include: ARTICLE_INCLUDE,
    orderBy: { publishedAt: "desc" },
  });
  return rows.map(toArticleData);
});

export const getPublishedArticleBySlug = cache(async (slug: string): Promise<NewsArticleData | null> => {
  const row = await prisma.news.findFirst({ where: { slug, status: "PUBLISHED" }, include: ARTICLE_INCLUDE });
  return row ? toArticleData(row) : null;
});

export async function getPublishedArticleSlugs(): Promise<string[]> {
  const rows = await prisma.news.findMany({ where: { status: "PUBLISHED" }, select: { slug: true } });
  return rows.map((r) => r.slug);
}

export const getCategories = cache(async () => {
  return prisma.category.findMany({ orderBy: { order: "asc" } });
});

// Same category first, then most recent others, excluding the current
// article — capped at `max`. Operates on the already-fetched (and
// per-request cached) published list rather than a fresh query.
export function getRelatedArticles(current: NewsArticleData, all: NewsArticleData[], max = 3): NewsArticleData[] {
  const others = all.filter((a) => a.slug !== current.slug);
  const sameCategory = others.filter((a) => a.category.key === current.category.key);
  const rest = others.filter((a) => a.category.key !== current.category.key);
  return [...sameCategory, ...rest].slice(0, max);
}
