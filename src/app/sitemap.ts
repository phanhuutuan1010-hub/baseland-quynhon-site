import type { MetadataRoute } from "next";
import { getPublishedProjectSlugs } from "@/lib/server/mappers/project";
import { getPublishedArticles } from "@/lib/server/mappers/news";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

// Only published content is listed — draft/archived projects and draft
// news are intentionally excluded so the sitemap never advertises a URL
// that 404s or is meant to stay unlisted.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projectSlugs, articles] = await Promise.all([getPublishedProjectSlugs(), getPublishedArticles()]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/projects`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/news`, changeFrequency: "daily", priority: 0.7 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/contact`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const projectRoutes: MetadataRoute.Sitemap = projectSlugs.map((slug) => ({
    url: `${SITE_URL}/projects/${slug}`,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  const newsRoutes: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${SITE_URL}/news/${article.slug}`,
    lastModified: article.date,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...projectRoutes, ...newsRoutes];
}
