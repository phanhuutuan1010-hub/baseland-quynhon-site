import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getPublishedArticles, getCategories } from "@/lib/server/mappers/news";
import { NewsPageClient } from "./NewsPageClient";

export const metadata: Metadata = buildMetadata({
  title: "Thị trường bất động sản Quy Nhơn | Base Land",
  description:
    "Góc nhìn về bất động sản, dự án, thị trường và nhịp sống tại Quy Nhơn.",
  path: "/news",
});

export default async function NewsPage() {
  const [articles, categoryRows] = await Promise.all([getPublishedArticles(), getCategories()]);
  const categories = categoryRows.map((c) => ({ key: c.key, label: { vi: c.labelVi, en: c.labelEn } }));

  return <NewsPageClient articles={articles} categories={categories} />;
}
