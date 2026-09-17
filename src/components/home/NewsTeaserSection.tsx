"use client";

import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { Reveal } from "@/components/Reveal";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { formatArticleDate } from "@/lib/content/news";
import type { HomeNewsTeaserContent } from "@/lib/content/home";
import type { NewsArticleData } from "@/lib/server/mappers/news";

export function NewsTeaserSection({
  content,
  latestArticles,
}: {
  content: HomeNewsTeaserContent;
  latestArticles: NewsArticleData[];
}) {
  const { lang, pick } = useLang();
  const t = pick(content);

  return (
    <section className="bg-[var(--color-warm-white)] px-5 py-16 sm:px-8 sm:py-20 md:px-12 md:py-28">
      <Reveal className="mx-auto max-w-[1440px]">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-5">
          <div>
            <div className="mb-5 font-ui text-[length:var(--fs-label)] tracking-[var(--ls-label)] text-[var(--color-terracotta-accessible)] uppercase">
              {t.kicker}
            </div>
            <h2 className="m-0 font-display text-[length:var(--fs-h2)] leading-[var(--lh-heading)] font-normal text-[var(--color-charcoal)]">
              {t.title}
            </h2>
          </div>
          <Link
            href="/news"
            className="font-ui text-xs font-bold tracking-[0.06em] whitespace-nowrap text-[var(--color-brand-green)] uppercase no-underline hover:text-[var(--color-brand-green-dark)]"
          >
            {t.viewAll} →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {latestArticles.map((article) => (
            <Link key={article.slug} href={`/news/${article.slug}`} className="no-underline">
              <div className="mb-5 aspect-16/10 overflow-hidden">
                {article.featuredImageUrl ? (
                  <Image src={article.featuredImageUrl} alt={pick(article.title)} width={800} height={500} className="h-full w-full object-cover" />
                ) : (
                  <ImagePlaceholder label={pick({ vi: "Ảnh minh hoạ tin tức", en: "News illustration photo" })} />
                )}
              </div>
              <div className="mb-2.5 font-ui text-xs tracking-[0.04em] text-[var(--color-text-muted)]">
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
