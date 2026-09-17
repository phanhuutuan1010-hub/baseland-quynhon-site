import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublishedArticleBySlug, getPublishedArticles, getRelatedArticles } from "@/lib/server/mappers/news";
import { ArticleView } from "@/components/ArticleView";
import { toJsonLdString } from "@/lib/jsonLd";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPublishedArticleBySlug(slug);
  if (!article) return {};

  const title = article.seo.title || `${article.title.vi} — Base Land Quy Nhơn`;
  const description = article.seo.description || article.excerpt.vi;

  return {
    title,
    description,
    alternates: { canonical: `/news/${slug}` },
    openGraph: {
      title,
      description,
      type: "article",
      images: article.featuredImageUrl ? [{ url: article.featuredImageUrl }] : undefined,
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getPublishedArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const allArticles = await getPublishedArticles();
  const relatedArticles = getRelatedArticles(article, allArticles);

  const articleUrl = `${SITE_URL}/news/${slug}`;
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title.vi,
    description: article.excerpt.vi,
    ...(article.featuredImageUrl ? { image: [article.featuredImageUrl] } : {}),
    datePublished: article.date,
    dateModified: article.date,
    author: { "@type": "Organization", name: "Base Land Quy Nhơn" },
    publisher: {
      "@type": "Organization",
      name: "Base Land Quy Nhơn",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/images/brand/icon-baseland.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": articleUrl },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Base Land Quy Nhơn", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Tin tức", item: `${SITE_URL}/news` },
      { "@type": "ListItem", position: 3, name: article.title.vi, item: articleUrl },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLdString(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLdString(breadcrumbSchema) }} />
      <ArticleView article={article} relatedArticles={relatedArticles} />
    </>
  );
}
