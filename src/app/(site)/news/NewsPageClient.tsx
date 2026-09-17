"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/lib/i18n";
import type { Localized } from "@/lib/i18n";
import { CATEGORY_ALL_LABEL, NEWS_LEAD_COPY, NEWS_PAGE_COPY, formatArticleDate } from "@/lib/content/news";
import { CONTACT_EMAIL, CONTACT_EMAIL_HREF, CONTACT_PHONE, CONTACT_PHONE_HREF } from "@/lib/content/nav";
import { Reveal } from "@/components/Reveal";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { LeadFormFull } from "@/components/LeadFormFull";
import type { NewsArticleData } from "@/lib/server/mappers/news";

const PAGE_SIZE = 6;

function ArticleThumb({ article }: { article: NewsArticleData }) {
  const { pick } = useLang();
  return article.featuredImageUrl ? (
    <Image src={article.featuredImageUrl} alt={pick(article.title)} width={800} height={600} className="h-full w-full object-cover" />
  ) : (
    <ImagePlaceholder label={`${article.slug}.jpg`} />
  );
}

function ArticleCard({ article, categoryLabel }: { article: NewsArticleData; categoryLabel: string }) {
  const { lang, pick } = useLang();

  return (
    <Link href={`/news/${article.slug}`} className="group flex flex-col no-underline">
      <div className="mb-4.5 aspect-4/3 overflow-hidden">
        <div className="h-full w-full transition-transform duration-[480ms] ease-[var(--ease-editorial)] group-hover:scale-[1.045]">
          <ArticleThumb article={article} />
        </div>
      </div>
      <div className="mb-2.5 font-ui text-[11px] font-bold tracking-[0.07em] text-[var(--color-deep-earth)] uppercase">
        {categoryLabel} · {formatArticleDate(article.date, lang)}
      </div>
      <h3 className="m-0 mb-2 font-display text-xl leading-[1.3] font-normal text-[var(--color-charcoal)]">
        {pick(article.title)}
      </h3>
      <p className="m-0 font-body text-sm leading-[var(--lh-body)] text-[var(--color-text-muted)]">
        {pick(article.excerpt)}
      </p>
    </Link>
  );
}

export function NewsPageClient({
  articles,
  categories,
}: {
  articles: NewsArticleData[];
  categories: { key: string; label: Localized<string> }[];
}) {
  const { lang, pick } = useLang();
  const [activeCategory, setActiveCategory] = useState<"all" | string>("all");
  const [page, setPage] = useState(1);

  const categoryLabel = (key: string) => pick(categories.find((c) => c.key === key)?.label ?? { vi: key, en: key });

  const heroArticle = articles[0];
  const featuredArticles = articles.slice(1, 3);
  const restArticles = articles.slice(3);

  const filteredRaw = useMemo(
    () => (activeCategory === "all" ? restArticles : restArticles.filter((a) => a.category.key === activeCategory)),
    [activeCategory, restArticles],
  );
  const totalPages = Math.max(1, Math.ceil(filteredRaw.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filteredRaw.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function selectCategory(key: "all" | string) {
    setActiveCategory(key);
    setPage(1);
  }

  if (!heroArticle) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-5 py-30">
        <p className="m-0 font-body text-base text-[var(--color-text-muted)]">{pick(NEWS_PAGE_COPY.emptyMsg)}</p>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {/* Header */}
      <section className="bg-[var(--color-warm-white)] px-5 pt-30 pb-10 sm:px-8 sm:pt-38 md:px-12 md:pt-42">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-4 font-ui text-[length:var(--fs-label)] tracking-[var(--ls-label)] text-[var(--color-terracotta-accessible)] uppercase">
            {pick(NEWS_PAGE_COPY.pageEyebrow)}
          </div>
          <h1 className="m-0 font-display text-[length:var(--fs-h1)] leading-[var(--lh-heading)] font-normal text-[var(--color-charcoal)]">
            {pick(NEWS_PAGE_COPY.pageTitle)}
          </h1>
        </div>
      </section>

      {/* Hero article */}
      <section className="bg-[var(--color-warm-white)] px-5 pt-6 pb-14 sm:px-8 sm:pb-20 md:px-12 md:pb-24">
        <Reveal className="mx-auto max-w-[1440px]">
          <Link
            href={`/news/${heroArticle.slug}`}
            className="group flex flex-wrap items-center gap-8 no-underline sm:gap-12 md:gap-16"
          >
            <div className="aspect-16/11 min-w-70 flex-1 basis-115 overflow-hidden">
              <div className="h-full w-full transition-transform duration-[480ms] ease-[var(--ease-editorial)] group-hover:scale-[1.045]">
                <ArticleThumb article={heroArticle} />
              </div>
            </div>
            <div className="min-w-70 flex-1 basis-90">
              <div className="mb-4 font-ui text-[11px] font-bold tracking-[0.08em] text-[var(--color-deep-earth)] uppercase">
                {categoryLabel(heroArticle.category.key)} · {formatArticleDate(heroArticle.date, lang)}
              </div>
              <h2 className="m-0 mb-5 font-display text-[length:var(--fs-h1)] leading-[var(--lh-heading)] font-normal text-[var(--color-charcoal)]">
                {pick(heroArticle.title)}
              </h2>
              <p className="m-0 mb-6 max-w-110 font-body text-[length:var(--fs-body-lg)] leading-[var(--lh-body)] text-[var(--color-text-muted)]">
                {pick(heroArticle.excerpt)}
              </p>
              <span className="font-ui text-xs font-bold tracking-[0.06em] text-[var(--color-brand-green)] uppercase">
                {pick(NEWS_PAGE_COPY.readMore)} →
              </span>
            </div>
          </Link>
        </Reveal>
      </section>

      {/* Featured */}
      {featuredArticles.length > 0 && (
        <section className="bg-[var(--color-sand)] px-5 py-16 sm:px-8 sm:py-20 md:px-12 md:py-24">
          <Reveal className="mx-auto max-w-[1440px]">
            <h2 className="m-0 mb-8 font-ui text-[13px] font-bold tracking-[0.08em] text-[var(--color-terracotta-accessible)] uppercase">
              {pick(NEWS_PAGE_COPY.featuredKicker)}
            </h2>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {featuredArticles.map((article) => (
                <ArticleCard key={article.slug} article={article} categoryLabel={categoryLabel(article.category.key)} />
              ))}
            </div>
          </Reveal>
        </section>
      )}

      {/* Latest insights (filterable + paginated) */}
      <section id="insights" className="bg-[var(--color-warm-white)] px-5 py-16 sm:px-8 sm:py-20 md:px-12 md:py-24">
        <Reveal className="mx-auto max-w-[1440px]">
          <h2 className="m-0 mb-8 font-display text-[length:var(--fs-h2)] leading-[var(--lh-heading)] font-normal text-[var(--color-charcoal)]">
            {pick(NEWS_PAGE_COPY.latestTitle)}
          </h2>

          <div className="no-scrollbar mb-11 flex gap-3 overflow-x-auto pb-1">
            {[{ key: "all" as const, label: CATEGORY_ALL_LABEL }, ...categories].map((cat) => {
              const active = activeCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => selectCategory(cat.key)}
                  className="cursor-pointer rounded-full border px-4.5 py-2.5 font-ui text-xs font-bold tracking-[0.06em] whitespace-nowrap uppercase"
                  style={{
                    borderColor: active ? "var(--color-brand-green)" : "var(--color-border)",
                    background: active ? "var(--color-brand-green)" : "transparent",
                    color: active ? "var(--color-warm-white)" : "var(--color-charcoal)",
                  }}
                >
                  {pick(cat.label)}
                </button>
              );
            })}
          </div>

          {pageItems.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {pageItems.map((article) => (
                  <ArticleCard key={article.slug} article={article} categoryLabel={categoryLabel(article.category.key)} />
                ))}
              </div>
              {totalPages > 1 && (
                <div className="mt-14 flex items-center justify-center gap-5">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage <= 1}
                    className="h-10 w-10 rounded-full border border-[var(--color-border)] bg-transparent text-base text-[var(--color-charcoal)] disabled:opacity-40"
                  >
                    ←
                  </button>
                  <span className="font-ui text-xs tracking-[0.06em] text-[var(--color-text-muted)]">
                    {lang === "vi" ? `Trang ${currentPage}/${totalPages}` : `Page ${currentPage} of ${totalPages}`}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage >= totalPages}
                    className="h-10 w-10 rounded-full border border-[var(--color-border)] bg-transparent text-base text-[var(--color-charcoal)] disabled:opacity-40"
                  >
                    →
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="rounded-sm border border-dashed border-[var(--color-border)] px-5 py-16 text-center">
              <p className="m-0 font-body text-base text-[var(--color-text-muted)]">{pick(NEWS_PAGE_COPY.emptyMsg)}</p>
            </div>
          )}
        </Reveal>
      </section>

      {/* Project CTA */}
      <section className="bg-[var(--color-deep-earth)] px-5 py-16 sm:px-8 sm:py-20 md:px-12 md:py-24">
        <Reveal className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-10 md:gap-16">
          <div className="min-w-70 flex-1 basis-95">
            <h2 className="m-0 mb-4 font-display text-[length:var(--fs-h2)] leading-[var(--lh-heading)] font-normal text-[var(--color-warm-white)]">
              {pick(NEWS_PAGE_COPY.projectCtaTitle)}
            </h2>
            <p className="m-0 max-w-120 font-body text-[length:var(--fs-body-lg)] leading-[var(--lh-body)] text-[var(--color-sand)]">
              {pick(NEWS_PAGE_COPY.projectCtaBody)}
            </p>
          </div>
          <Link
            href="/projects"
            className="inline-flex flex-none items-center rounded-xs border border-[var(--color-brand-green)] bg-[var(--color-brand-green)] px-8 py-4 font-ui text-[13px] font-semibold tracking-[0.08em] text-[var(--color-warm-white)] uppercase no-underline hover:bg-[var(--color-brand-green-dark)]"
          >
            {pick(NEWS_PAGE_COPY.projectCtaBtn)}
          </Link>
        </Reveal>
      </section>

      {/* Lead CTA */}
      <section
        id="lead"
        className="px-5 py-16 sm:px-8 sm:py-20 md:px-12 md:py-28"
        style={{ background: "linear-gradient(135deg, var(--color-clay) 0%, var(--color-deep-earth) 100%)" }}
      >
        <Reveal className="mx-auto flex max-w-[1440px] flex-wrap gap-10 md:gap-20">
          <div className="min-w-[280px] flex-1 basis-95">
            <h2 className="m-0 mb-6 font-display text-[length:var(--fs-h1)] leading-[var(--lh-heading)] font-normal text-[var(--color-warm-white)]">
              {pick(NEWS_LEAD_COPY.ctaTitle)}
            </h2>
            <p className="m-0 mb-10 max-w-110 font-body text-[length:var(--fs-body-lg)] leading-[var(--lh-body)] text-[var(--color-sand)]">
              {pick(NEWS_LEAD_COPY.ctaSub)}
            </p>
            <div className="mb-9 flex flex-col gap-3.5 font-body text-[17px]">
              <a href={CONTACT_PHONE_HREF} className="text-[var(--color-warm-white)] no-underline">
                {CONTACT_PHONE}
              </a>
              <a href={CONTACT_EMAIL_HREF} className="text-[var(--color-warm-white)] no-underline">
                {CONTACT_EMAIL}
              </a>
            </div>
            <a
              href={CONTACT_PHONE_HREF}
              className="inline-flex items-center rounded-xs border border-[var(--color-terracotta-light)] bg-transparent px-8 py-4 font-ui text-[13px] font-bold tracking-[0.08em] text-[var(--color-warm-white)] uppercase no-underline hover:bg-[rgba(193,99,60,0.15)]"
            >
              {pick({ vi: `Gọi ngay ${CONTACT_PHONE}`, en: `Call now ${CONTACT_PHONE}` })}
            </a>
          </div>
          <div className="min-w-[280px] flex-1 basis-95 rounded-sm bg-[var(--color-warm-white)] p-7 sm:p-11">
            <LeadFormFull source="news" />
          </div>
        </Reveal>
      </section>
    </div>
  );
}
