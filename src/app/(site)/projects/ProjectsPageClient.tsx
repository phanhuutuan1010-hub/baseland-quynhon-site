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
import type { ProjectCardImage } from "@/lib/server/mappers/project";
import { focalPosition } from "@/components/project-detail/imageFrame";
import { LeadFormFull } from "@/components/LeadFormFull";

type Filters = {
  area: ProjectArea | "all";
  type: ProjectType | "all";
  purpose: ProjectPurpose | "all";
  status: ProjectStatus | "all";
};

const DEFAULT_FILTERS: Filters = { area: "all", type: "all", purpose: "all", status: "all" };

/** The project shown in the "Nổi bật" block above the grid — not repeated in it. */
const FEATURED_SLUG = "qterra";

/** The four dropdown filters only come back once the list is long enough
 * to need them; until then three type chips are enough. */
const DROPDOWNS_FROM = 9;

const TYPE_CHIPS: { value: "all" | "apartment" | "townhouse"; label: { vi: string; en: string } }[] = [
  { value: "all", label: { vi: "Tất cả", en: "All" } },
  { value: "apartment", label: { vi: "Căn hộ", en: "Apartments" } },
  { value: "townhouse", label: { vi: "Nhà phố & Shophouse", en: "Townhouses & Shophouses" } },
];

/** Chip "Căn hộ" also covers condotels (both are apartment-type units). */
function matchesType(type: ProjectType, filter: Filters["type"]) {
  if (filter === "all") return true;
  if (filter === "apartment") return type === "apartment" || type === "condotel";
  return type === filter;
}

const selectClass =
  "cursor-pointer rounded-xs border border-[var(--color-border)] bg-[var(--color-warm-white)] px-3.5 py-2.5 font-ui text-xs font-semibold tracking-[0.02em] text-[var(--color-charcoal)]";

export function ProjectsPageClient({
  images,
  heroImage,
}: {
  images: Record<string, ProjectCardImage>;
  /** Admin → Cài đặt → Chung → Ảnh đầu trang Dự án. */
  heroImage: ProjectCardImage | null;
}) {
  const { lang, pick } = useLang();
  const t = pick(PROJECTS_CONTENT);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

  const filtered = useMemo(
    () =>
      t.projects.filter(
        (p) =>
          p.slug !== FEATURED_SLUG &&
          (filters.area === "all" || p.area === filters.area) &&
          matchesType(p.type, filters.type) &&
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
  const showDropdowns = t.projects.length >= DROPDOWNS_FROM;
  const featuredImage = images[FEATURED_SLUG];

  return (
    <div className="relative w-full">
      {/* Hero */}
      <section className="relative flex min-h-[clamp(420px,56vh,580px)] w-full overflow-hidden">
        <div className="absolute inset-0">
          {heroImage ? (
            <Image
              src={heroImage.src}
              alt={pick(heroImage.alt)}
              fill
              priority
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: focalPosition(heroImage) }}
            />
          ) : (
            // No image set yet: a plain dark backdrop — a placeholder label
            // here sat right on top of the eyebrow/headline.
            <div className="h-full w-full bg-[var(--color-deep-earth)]" />
          )}
        </div>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(38,34,32,0.55) 0%, rgba(38,34,32,0.25) 45%, rgba(38,34,32,0.78) 100%)",
          }}
        />
        {/* pt clears the fixed site nav so the eyebrow never sits under it. */}
        <div className="relative z-[2] mx-auto flex w-full max-w-[1440px] flex-col justify-end px-5 pt-28 pb-10 sm:px-8 sm:pb-14 md:px-12 md:pt-32 md:pb-16">
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
          <div className="flex flex-wrap items-center gap-2.5">
            <div role="group" aria-label={pick({ vi: "Loại hình", en: "Type" })} className="flex flex-wrap gap-2">
              {TYPE_CHIPS.map((c) => {
                const active = filters.type === c.value;
                return (
                  <button
                    key={c.value}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setFilters((f) => ({ ...f, type: c.value }))}
                    className={`cursor-pointer rounded-full border px-4 py-2 font-ui text-xs font-bold tracking-[0.05em] uppercase transition-colors ${
                      active
                        ? "border-[var(--color-brand-green)] bg-[var(--color-brand-green)] text-[var(--color-warm-white)]"
                        : "border-[var(--color-border)] bg-[var(--color-warm-white)] text-[var(--color-charcoal)] hover:border-[var(--color-brand-green)]"
                    }`}
                  >
                    {pick(c.label)}
                  </button>
                );
              })}
            </div>
            {showDropdowns && (
              <>
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
              </>
            )}
            {showDropdowns && hasActiveFilters && (
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
              src={featuredImage?.src ?? "/images/qterra/qterra-facade.jpg"}
              alt={featuredImage ? pick(featuredImage.alt) || t.featured.name : "Phối cảnh Q'Terra Quy Nhơn"}
              width={1600}
              height={1200}
              sizes="(min-width: 768px) 50vw, 100vw"
              className="h-full w-full object-cover"
              style={{ objectPosition: featuredImage ? focalPosition(featuredImage) : undefined }}
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
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-3">
              {filtered.map((p) => {
                return (
                  <Link key={p.key} href={`/projects/${p.slug}`} className="group flex flex-col no-underline">
                    {/* Card photo: the project's 4:3 card image (Admin → Dự án →
                        Tổng quan → Ảnh đại diện), else its hero image. */}
                    <div className="relative mb-4.5 aspect-4/3 overflow-hidden">
                      {images[p.slug] ? (
                        <Image
                          src={images[p.slug].src}
                          alt={pick(images[p.slug].alt) || p.name}
                          fill
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                          style={{ objectPosition: focalPosition(images[p.slug]) }}
                        />
                      ) : (
                        <ImagePlaceholder
                          label={`${p.slotId}.jpg`}
                          className="transition-transform duration-300 ease-out group-hover:scale-105"
                        />
                      )}
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
