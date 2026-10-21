"use client";

import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { Reveal } from "@/components/Reveal";
import { formatArticleDate } from "@/lib/content/news";
import type { ProjectNewsTeaser as ProjectNewsTeaserData, ProjectRelatedArticle } from "@/lib/project-detail/types";

/** Up to 3 news articles linked to the project in Admin (Tin tức → Dự án
 * liên quan) that have a photo, linking to /news/[slug]. The section's own
 * eyebrow/headline come from its content; with no such article it renders
 * nothing (no grey placeholder cards). */
export function ProjectNewsTeaser({
  id,
  data,
  articles,
}: {
  id: string;
  data: ProjectNewsTeaserData;
  articles: ProjectRelatedArticle[];
}) {
  const { lang, pick } = useLang();
  if (!articles.length) return null;

  return (
    <section id={id} className="bg-[var(--project-background)] px-5 py-14 sm:px-8 sm:py-16 md:px-12 md:py-20">
      <Reveal className="mx-auto max-w-[1440px]">
        <div className="mb-8 md:mb-12">
          <div className="mb-4 font-ui text-[length:var(--fs-label)] tracking-[var(--ls-label)] text-[var(--project-accent)] uppercase">
            {pick(data.eyebrow)}
          </div>
          <h2 className="m-0 font-display text-[length:var(--fs-h2)] leading-[var(--lh-heading)] font-normal text-[var(--color-charcoal)]">
            {pick(data.headline)}
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <Link key={article.slug} href={`/news/${article.slug}`} className="no-underline">
              <div className="relative mb-4 aspect-16/10 overflow-hidden">
                <Image src={article.image} alt={pick(article.title)} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
              </div>
              <div className="mb-2 font-ui text-xs tracking-[0.04em] text-[var(--project-muted)]">{formatArticleDate(article.date, lang)}</div>
              <h3 className="m-0 font-body text-[17px] leading-[1.4] font-semibold text-[var(--color-charcoal)]">{pick(article.title)}</h3>
            </Link>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
