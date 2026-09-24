"use client";

import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { ARTICLE_PAGE_COPY, NEWS_LEAD_COPY, formatArticleDate } from "@/lib/content/news";
import { CONTACT_EMAIL, CONTACT_EMAIL_HREF, CONTACT_PHONE, CONTACT_PHONE_HREF } from "@/lib/content/nav";
import { Reveal } from "@/components/Reveal";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { LeadFormFull } from "@/components/LeadFormFull";
import type { NewsArticleData } from "@/lib/server/mappers/news";

// Rich-text body styling — matches the site's existing paragraph rhythm
// (font-body, text-body-lg, generous line-height) without pulling in the
// Tailwind typography plugin for ~6 tag styles.
const PROSE_CLASSES =
  "[&_h2]:font-display [&_h2]:text-[length:var(--fs-h2)] [&_h2]:leading-[var(--lh-heading)] [&_h2]:text-[var(--color-charcoal)] [&_h2]:mt-10 [&_h2]:mb-5 " +
  "[&_h3]:font-display [&_h3]:text-[length:var(--fs-h3)] [&_h3]:leading-[var(--lh-heading)] [&_h3]:text-[var(--color-charcoal)] [&_h3]:mt-8 [&_h3]:mb-4 " +
  "[&_p]:font-body [&_p]:text-[length:var(--fs-body-lg)] [&_p]:leading-[var(--lh-body)] [&_p]:text-[var(--color-text-muted)] [&_p]:mb-7 " +
  "[&_a]:text-[var(--color-brand-green)] [&_a]:underline " +
  "[&_strong]:text-[var(--color-charcoal)] [&_strong]:font-semibold " +
  "[&_blockquote]:border-l-2 [&_blockquote]:border-[var(--color-terracotta)] [&_blockquote]:pl-6 [&_blockquote]:my-7 [&_blockquote]:font-display [&_blockquote]:text-xl [&_blockquote]:text-[var(--color-charcoal)] " +
  "[&_ul]:mb-7 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:mb-7 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:font-body [&_li]:text-[length:var(--fs-body-lg)] [&_li]:leading-[var(--lh-body)] [&_li]:text-[var(--color-text-muted)] [&_li]:mb-2 " +
  "[&_img]:my-8 [&_img]:w-full [&_img]:rounded-sm";

/**
 * Renders a single news article. A client component (needs useLang/pick for
 * bilingual copy) — the server-side [slug]/page.tsx resolves the route
 * param and hands it a fully-typed, DB-backed article + related list.
 */
export function ArticleView({ article, relatedArticles }: { article: NewsArticleData; relatedArticles: NewsArticleData[] }) {
  const { lang, pick } = useLang();

  return (
    <div className="relative w-full">
      {/* Hero image */}
      <section className="relative h-[clamp(320px,52vh,540px)] w-full overflow-hidden">
        {article.featuredImageUrl ? (
          <Image src={article.featuredImageUrl} alt={pick(article.title)} fill sizes="100vw" className="object-cover" priority />
        ) : (
          <ImagePlaceholder label={`${article.slug}.jpg`} tone="dark" className="rounded-none border-none" />
        )}
      </section>

      {/* Title & meta */}
      <section className="bg-[var(--color-warm-white)] px-5 pt-10 pb-2 sm:px-8 sm:pt-14 md:px-12 md:pt-16">
        <Reveal className="mx-auto max-w-205">
          <Link
            href="/news"
            className="font-ui text-xs font-bold tracking-[0.06em] text-[var(--color-brand-green)] uppercase no-underline"
          >
            ← {pick(ARTICLE_PAGE_COPY.backToInsights)}
          </Link>
          <div className="mt-7 mb-4 font-ui text-[11px] font-bold tracking-[0.08em] text-[var(--color-deep-earth)] uppercase">
            {pick(article.category.label)}
          </div>
          <h1 className="m-0 mb-6 font-display text-[length:var(--fs-h1)] leading-[var(--lh-heading)] font-normal text-[var(--color-charcoal)]">
            {pick(article.title)}
          </h1>
          <div className="flex flex-wrap items-center gap-4 border-b border-[var(--color-border)] pb-8 font-body text-sm text-[var(--color-text-muted)]">
            <span>{pick(ARTICLE_PAGE_COPY.authorName)}</span>
            <span className="opacity-50">·</span>
            <span>{formatArticleDate(article.date, lang)}</span>
          </div>
        </Reveal>
      </section>

      {/* Body */}
      <section className="bg-[var(--color-warm-white)] px-5 pt-10 pb-14 sm:px-8 sm:pb-20 md:px-12 md:pb-22">
        <div className="mx-auto max-w-205">
          <p className="m-0 mb-7 font-body text-[length:var(--fs-body-lg)] leading-[var(--lh-body)] text-[var(--color-charcoal)]">
            {pick(article.excerpt)}
          </p>
          <div className={PROSE_CLASSES} dangerouslySetInnerHTML={{ __html: pick(article.contentHtml) }} />
        </div>
      </section>

      {/* Related projects */}
      {article.relatedProjects.length > 0 && (
        <section className="bg-[var(--color-deep-earth)] px-5 py-14 sm:px-8 sm:py-18 md:px-12 md:py-20">
          <div className="mx-auto flex max-w-205 flex-col gap-10">
            {article.relatedProjects.map((relatedProject) => (
              <div key={relatedProject.href}>
                <div className="mb-5 font-ui text-[11px] font-bold tracking-[0.08em] text-[var(--color-terracotta-light)] uppercase">
                  {pick(ARTICLE_PAGE_COPY.relatedProjectKicker)}
                </div>
                <Link href={relatedProject.href} className="group flex flex-wrap items-center gap-7 no-underline">
                  <div className="aspect-4/3 w-full max-w-70 flex-none overflow-hidden">
                    <div className="h-full w-full transition-transform duration-[480ms] ease-[var(--ease-editorial)] group-hover:scale-[1.045]">
                      <ImagePlaceholder label={`${relatedProject.name}.jpg`} tone="dark" />
                    </div>
                  </div>
                  <div className="min-w-60 flex-1">
                    <h2 className="m-0 mb-2 font-display text-2xl font-normal text-[var(--color-warm-white)]">
                      {relatedProject.name}
                    </h2>
                    <span className="font-ui text-xs font-bold tracking-[0.06em] text-[var(--color-terracotta-light)] uppercase">
                      {pick(ARTICLE_PAGE_COPY.viewProject)} →
                    </span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related articles */}
      {relatedArticles.length > 0 && (
        <section className="bg-[var(--color-sand)] px-5 py-16 sm:px-8 sm:py-20 md:px-12 md:py-24">
          <Reveal className="mx-auto max-w-[1440px]">
            <h2 className="m-0 mb-8 font-ui text-[13px] font-bold tracking-[0.08em] text-[var(--color-terracotta-accessible)] uppercase">
              {pick(ARTICLE_PAGE_COPY.relatedArticlesKicker)}
            </h2>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {relatedArticles.map((a) => (
                <Link key={a.slug} href={`/news/${a.slug}`} className="group flex flex-col no-underline">
                  <div className="mb-4 aspect-4/3 overflow-hidden">
                    <div className="h-full w-full transition-transform duration-[480ms] ease-[var(--ease-editorial)] group-hover:scale-[1.045]">
                      {a.featuredImageUrl ? (
                        <Image src={a.featuredImageUrl} alt={pick(a.title)} width={800} height={600} className="h-full w-full object-cover" />
                      ) : (
                        <ImagePlaceholder label={`${a.slug}.jpg`} />
                      )}
                    </div>
                  </div>
                  <div className="mb-2 font-ui text-[11px] font-bold tracking-[0.07em] text-[var(--color-deep-earth)] uppercase">
                    {pick(a.category.label)} · {formatArticleDate(a.date, lang)}
                  </div>
                  <h3 className="m-0 font-display text-lg leading-[1.3] font-normal text-[var(--color-charcoal)]">
                    {pick(a.title)}
                  </h3>
                </Link>
              ))}
            </div>
          </Reveal>
        </section>
      )}

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
