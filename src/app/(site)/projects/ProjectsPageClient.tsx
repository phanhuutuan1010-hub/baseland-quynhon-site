"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/lib/i18n";
import {
  PROJECTS_CONTENT,
  type ProjectArea,
  type ProjectPurpose,
  type ProjectStatus,
  type ProjectType,
} from "@/lib/content/projects";
import { Reveal } from "@/components/Reveal";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { LeadFormFull } from "@/components/LeadFormFull";

type Filters = {
  area: ProjectArea | "all";
  type: ProjectType | "all";
  purpose: ProjectPurpose | "all";
  status: ProjectStatus | "all";
};

const DEFAULT_FILTERS: Filters = { area: "all", type: "all", purpose: "all", status: "all" };

/** Card grid spans that mirror the design bundle's getSpan() rhythm: a wide
 * card, a tall card, then a full-width banner card, repeating every 3. */
function cardSpan(i: number): { colClass: string; aspect: string } {
  const m = i % 3;
  if (m === 0) return { colClass: "col-span-12 md:col-span-7", aspect: "aspect-4/3" };
  if (m === 1) return { colClass: "col-span-12 md:col-span-5", aspect: "aspect-3/4" };
  return { colClass: "col-span-12", aspect: "aspect-21/8" };
}

const selectClass =
  "cursor-pointer rounded-xs border border-[var(--color-border)] bg-[var(--color-warm-white)] px-3.5 py-2.5 font-ui text-xs font-semibold tracking-[0.02em] text-[var(--color-charcoal)]";

export function ProjectsPageClient() {
  const { lang, pick } = useLang();
  const t = pick(PROJECTS_CONTENT);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

  const filtered = useMemo(
    () =>
      t.projects.filter(
        (p) =>
          (filters.area === "all" || p.area === filters.area) &&
          (filters.type === "all" || p.type === filters.type) &&
          (filters.purpose === "all" || p.purpose.includes(filters.purpose)) &&
          (filters.status === "all" || p.status === filters.status),
      ),
    [t.projects, filters],
  );

  const hasActiveFilters =
    filters.area !== "all" || filters.type !== "all" || filters.purpose !== "all" || filters.status !== "all";

  const resultsLabel =
    lang === "vi"
      ? `${filtered.length} ${t.filters.resultsPlural}`
      : `${filtered.length} ${filtered.length === 1 ? t.filters.resultsSingular : t.filters.resultsPlural}`;

  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  return (
    <div className="relative w-full">
      {/* Hero */}
      <section className="relative h-[clamp(380px,52vh,560px)] w-full overflow-hidden">
        <div className="absolute inset-0">
          <ImagePlaceholder
            label={pick({ vi: "Ảnh biển/thành phố Quy Nhơn", en: "Photo of the sea/city of Quy Nhon" })}
            tone="dark"
            className="rounded-none border-none"
          />
        </div>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(38,34,32,0.55) 0%, rgba(38,34,32,0.25) 45%, rgba(38,34,32,0.78) 100%)",
          }}
        />
        <div className="relative z-[2] mx-auto flex h-full max-w-[1440px] flex-col justify-end px-5 pb-10 sm:px-8 sm:pb-14 md:px-12 md:pb-16">
          <div className="mb-4 font-ui text-[length:var(--fs-label)] tracking-[var(--ls-label)] text-[var(--color-terracotta-light)] uppercase">
            {t.hero.eyebrow}
          </div>
          <h1 className="m-0 mb-4 font-display text-[length:clamp(2.25rem,6vw,4.25rem)] leading-[1.08] font-normal text-[var(--color-warm-white)]">
            {t.hero.headline}
          </h1>
          <p className="m-0 max-w-150 font-body text-[length:var(--fs-body-lg)] leading-[var(--lh-body)] text-[var(--color-sand)]">
            {t.hero.sub}
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b border-[var(--color-border)] bg-[var(--color-warm-white)] px-5 py-5 sm:px-8 md:px-12">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3.5">
            <select
              value={filters.area}
              onChange={(e) => setFilters((f) => ({ ...f, area: e.target.value as Filters["area"] }))}
              className={selectClass}
            >
              {t.filters.areaOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <select
              value={filters.type}
              onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value as Filters["type"] }))}
              className={selectClass}
            >
              {t.filters.typeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <select
              value={filters.purpose}
              onChange={(e) => setFilters((f) => ({ ...f, purpose: e.target.value as Filters["purpose"] }))}
              className={selectClass}
            >
              {t.filters.purposeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <select
              value={filters.status}
              onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value as Filters["status"] }))}
              className={selectClass}
            >
              {t.filters.statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="cursor-pointer border-none bg-transparent px-1 py-2 font-ui text-xs font-bold tracking-[0.05em] text-[var(--color-brand-green)] uppercase"
              >
                {t.filters.resetBtn}
              </button>
            )}
          </div>
          <div className="font-ui text-xs tracking-[0.04em] whitespace-nowrap text-[var(--color-text-muted)]">
            {resultsLabel}
          </div>
        </div>
      </section>

      {/* Featured project — Q'Terra */}
      <section id="featured" className="bg-[var(--color-deep-earth)] px-5 py-16 sm:px-8 sm:py-20 md:px-12 md:py-28">
        <Reveal className="mx-auto flex max-w-[1440px] flex-wrap items-stretch gap-10 md:gap-20">
          <div className="aspect-4/3 min-w-[280px] flex-1 basis-115 border border-[var(--color-sand)] box-border">
            <Image
              src="/images/qterra/qterra-facade.jpg"
              alt="Phối cảnh Q'Terra Quy Nhơn"
              width={800}
              height={600}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex min-w-[280px] flex-1 basis-95 flex-col justify-center">
            <div className="mb-4.5 font-ui text-[length:var(--fs-label)] tracking-[var(--ls-label)] text-[var(--color-terracotta-light)] uppercase">
              {t.featured.kicker}
            </div>
            <h2 className="m-0 mb-5 font-display text-[length:var(--fs-h1)] leading-[var(--lh-heading)] font-normal text-[var(--color-warm-white)]">
              {t.featured.name}
            </h2>
            <p className="m-0 mb-8 max-w-115 font-body text-[length:var(--fs-body-lg)] leading-[var(--lh-body)] text-[var(--color-sand)]">
              {t.featured.teaser}
            </p>
            <div className="mb-8 flex flex-wrap gap-9">
              <div>
                <div className="mb-1.5 font-ui text-[11px] tracking-[0.08em] text-[var(--color-terracotta-light)] uppercase">
                  {t.featured.locationLabel}
                </div>
                <div className="font-body text-base text-[var(--color-warm-white)]">{t.featured.location}</div>
              </div>
              <div>
                <div className="mb-1.5 font-ui text-[11px] tracking-[0.08em] text-[var(--color-terracotta-light)] uppercase">
                  {t.featured.scaleLabel}
                </div>
                <div className="font-body text-base text-[var(--color-warm-white)]">{t.featured.scale}</div>
              </div>
              <div>
                <div className="mb-1.5 font-ui text-[11px] tracking-[0.08em] text-[var(--color-terracotta-light)] uppercase">
                  {t.featured.statusLabel}
                </div>
                <div className="font-body text-base text-[var(--color-warm-white)]">{t.featured.status}</div>
              </div>
            </div>
            <Link
              href="/projects/qterra"
              className="inline-flex w-fit items-center gap-2.5 rounded-xs border border-[var(--color-brand-green)] bg-[var(--color-brand-green)] px-8 py-4 font-ui text-[13px] font-semibold tracking-[0.08em] text-[var(--color-warm-white)] uppercase no-underline hover:bg-[var(--color-brand-green-dark)]"
            >
              {t.featured.cta}
            </Link>
          </div>
        </Reveal>
      </section>

      {/* Project grid */}
      <section id="grid" className="bg-[var(--color-warm-white)] px-5 py-16 sm:px-8 sm:py-20 md:px-12 md:py-28">
        <Reveal className="mx-auto max-w-[1440px]">
          <div className="mb-4 font-ui text-[length:var(--fs-label)] tracking-[var(--ls-label)] text-[var(--color-terracotta-accessible)] uppercase">
            {t.grid.kicker}
          </div>
          <h2 className="m-0 mb-11 font-display text-[length:var(--fs-h2)] leading-[var(--lh-heading)] font-normal text-[var(--color-charcoal)]">
            {t.grid.title}
          </h2>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-12 gap-6 sm:gap-8">
              {filtered.map((p, i) => {
                const span = cardSpan(i);
                return (
                  <Link
                    key={p.key}
                    href={`/projects/${p.slug}`}
                    className={`group flex flex-col no-underline ${span.colClass}`}
                  >
                    <div className={`relative mb-4.5 overflow-hidden ${span.aspect}`}>
                      <ImagePlaceholder
                        label={`${p.slotId}.jpg`}
                        className="transition-transform duration-300 ease-out group-hover:scale-105"
                      />
                      {/* Overlay mờ + content reveal khi hover (desktop) — thẻ
                          vẫn tap được bình thường trên mobile vì không có gì
                          bị ẩn mặc định, chỉ thêm hiệu ứng khi hover có thật. */}
                      <div className="pointer-events-none absolute inset-0 bg-[var(--color-charcoal)] opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-10" />
                      <div className="absolute top-3.5 left-3.5 rounded-full bg-[var(--color-warm-white)] px-3.5 py-1.5 font-ui text-[11px] font-bold tracking-[0.05em] text-[var(--color-deep-earth)] uppercase">
                        {p.statusLabel}
                      </div>
                    </div>
                    <div className="mb-2 font-ui text-[11px] font-bold tracking-[0.07em] text-[var(--color-deep-earth)] uppercase">
                      {p.typeLabel}
                    </div>
                    <h3 className="m-0 mb-1.5 font-display text-xl font-normal text-[var(--color-charcoal)] transition-colors duration-300 group-hover:text-[var(--color-brand-green)]">
                      {p.name}
                    </h3>
                    <div className="mb-3 font-body text-sm text-[var(--color-text-muted)]">{p.location}</div>
                    <p className="m-0 mb-3.5 max-w-120 font-body text-sm leading-[var(--lh-body)] text-[var(--color-text-muted)]">
                      {p.blurb}
                    </p>
                    <span className="inline-block w-fit font-ui text-xs font-bold tracking-[0.06em] text-[var(--color-brand-green)] uppercase transition-transform duration-300 ease-out group-hover:translate-x-1">
                      {t.grid.cardCta}
                    </span>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="rounded-sm border border-dashed border-[var(--color-border)] px-5 py-20 text-center">
              <p className="m-0 mb-5 font-body text-[17px] text-[var(--color-text-muted)]">{t.grid.emptyMsg}</p>
              <button
                type="button"
                onClick={resetFilters}
                className="cursor-pointer rounded-xs border border-[var(--color-brand-green)] bg-transparent px-7 py-3.5 font-ui text-xs font-bold tracking-[0.06em] text-[var(--color-brand-green)] uppercase"
              >
                {t.grid.emptyReset}
              </button>
            </div>
          )}
        </Reveal>
      </section>

      {/* Where we build */}
      <section className="bg-[var(--color-sand)] px-5 py-16 sm:px-8 sm:py-20 md:px-12 md:py-28">
        <Reveal className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-8 md:gap-22">
          <div className="min-w-[280px] flex-1 basis-95">
            <div className="mb-5 font-ui text-[length:var(--fs-label)] tracking-[var(--ls-label)] text-[var(--color-terracotta-accessible)] uppercase">
              {t.location.kicker}
            </div>
            <h2 className="m-0 mb-6 font-display text-[length:var(--fs-h2)] leading-[var(--lh-heading)] font-normal text-[var(--color-charcoal)]">
              {t.location.title}
            </h2>
            <p className="m-0 max-w-120 font-body text-[length:var(--fs-body-lg)] leading-[var(--lh-body)] text-[var(--color-text-muted)]">
              {t.location.body}
            </p>
          </div>
          <div className="flex min-w-70 flex-1 basis-90 flex-col">
            {t.location.coverageItems.map((c) => (
              <div
                key={c.n}
                className="flex items-baseline gap-5 border-t border-[rgba(193,99,60,0.35)] py-4.5"
              >
                <div className="flex-none basis-8 font-display text-xl text-[var(--color-terracotta-accessible)]">{c.n}</div>
                <div>
                  <div className="mb-1 font-body text-base font-semibold text-[var(--color-charcoal)]">{c.name}</div>
                  <div className="font-body text-sm text-[var(--color-text-muted)]">{c.location}</div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Lead CTA */}
      <section
        id="lead"
        className="px-5 py-16 sm:px-8 sm:py-20 md:px-12 md:py-28"
        style={{ background: "linear-gradient(135deg, var(--color-clay) 0%, var(--color-deep-earth) 100%)" }}
      >
        <Reveal className="mx-auto max-w-[1440px] rounded-sm bg-[var(--color-warm-white)] p-7 sm:p-11 md:max-w-160">
          <LeadFormFull source="projects" />
        </Reveal>
      </section>
    </div>
  );
}
