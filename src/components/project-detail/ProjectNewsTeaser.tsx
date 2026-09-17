"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { Reveal } from "@/components/Reveal";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { getArticleBySlug, formatArticleDate } from "@/lib/content/news";
import type { ProjectNewsTeaser as ProjectNewsTeaserData } from "@/lib/project-detail/types";

/** 3–4 article teaser, linking out to the real /news/[slug] route — never a
 * project-specific News page fork. Pulls from the site's own shared
 * ARTICLES data (lib/content/news.ts) by slug. */
export function ProjectNewsTeaser({ id, data }: { id: string; data: ProjectNewsTeaserData }) {
  const { lang, pick } = useLang();
  const articles = data.articleSlugs.map(getArticleBySlug).filter((a) => a != null);
  if (!articles.length) return null;

  return (
    <section id={id} className="bg-[var(--project-background)] px-5 py-16 sm:px-8 sm:py-20 md:px-12 md:py-28">
      <Reveal className="mx-auto max-w-[1440px]">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6 md:mb-14">
          <div>
            <div className="mb-5 font-ui text-[length:var(--fs-label)] tracking-[var(--ls-label)] text-[var(--project-accent)] uppercase">
              {pick(data.eyebrow)}
            </div>
            <h2 className="m-0 font-display text-[length:var(--fs-h2)] leading-[var(--lh-heading)] font-normal text-[var(--color-charcoal)]">
              {pick(data.headline)}
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <Link key={article.slug} href={`/news/${article.slug}`} className="no-underline">
              <div className="mb-4 aspect-16/10">
                <ImagePlaceholder label={pick({ vi: "Ảnh minh hoạ tin tức", en: "News illustration photo" })} />
              </div>
              <div className="mb-2 font-ui text-xs tracking-[0.04em] text-[var(--project-muted)]">
                {formatArticleDate(article.date, lang)}
              </div>
              <h3 className="m-0 font-body text-[17px] leading-[1.4] font-semibold text-[var(--color-charcoal)]">
                {pick(article.title)}
              </h3>
            </Link>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
