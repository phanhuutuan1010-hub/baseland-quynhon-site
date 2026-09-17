import type { Metadata } from "next";
import { getPublishedArticles, getCategories } from "@/lib/server/mappers/news";
import { NewsPageClient } from "./NewsPageClient";

export const metadata: Metadata = {
  title: "Quy Nhơn Real Estate & Lifestyle Insights — Base Land Quy Nhơn",
  description: "Cập nhật tin tức, xu hướng và phân tích thị trường bất động sản Quy Nhơn từ Base Land.",
  alternates: { canonical: "/news" },
};

export default async function NewsPage() {
  const [articles, categoryRows] = await Promise.all([getPublishedArticles(), getCategories()]);
  const categories = categoryRows.map((c) => ({ key: c.key, label: { vi: c.labelVi, en: c.labelEn } }));

  return <NewsPageClient articles={articles} categories={categories} />;
}
