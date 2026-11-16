"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import { useLang } from "@/lib/i18n";
import { Reveal } from "@/components/Reveal";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { LeadModal } from "@/components/LeadModal";
import { trackEvent } from "@/lib/analytics";
import { markTourOpened } from "@/lib/tourReturn";
import type { ProjectLeadQualifier, ProjectVirtualTour } from "@/lib/project-detail/types";
import { tourScenes } from "@/lib/project-detail/types";
import { PanoramaTour } from "./PanoramaTour";
import { TourReturnPrompt } from "./TourReturnPrompt";
import { Accent } from "@/components/Accent";
import { focalPosition } from "./imageFrame";

type TourSectionProps = {
  id: string;
  /** Compact layout: shorter frame (21:9 on desktop) and less padding. */
  compact?: boolean;
  data: ProjectVirtualTour;
  projectSlug: string;
  fallbackImage?: string;
  qualifiers?: ProjectLeadQualifier[];
};

/** External tour link (`tourUrl`, e.g. Q'Terra) wins; otherwise the
 * self-hosted Pannellum scenes. */
export function VirtualTourSection(props: TourSectionProps) {
  if (!props.data.tourUrl?.trim() && tourScenes(props.data).length) return <PanoramaTour {...props} />;
  return <ExternalTour {...props} />;
}

/**
 * The developer's own 360° tour (e.g. 360.qterra.vn): poster + what the
 * tour lets you do (`highlights`), opened in a NEW TAB only. The tour site
 * is never framed or preloaded here — it carries third-party trackers, so
 * nothing of it loads on our page until the visitor chooses to go there.
 * Coming back to this tab afterwards shows the TourReturnPrompt card.
 */
function ExternalTour({ id, data, projectSlug, fallbackImage, qualifiers, compact }: TourSectionProps) {
  const { pick, lang } = useLang();
  const [modalOpen, setModalOpen] = useState(false);
  const closeModal = useCallback(() => setModalOpen(false), []);

  const posterSrc = data.poster?.src || fallbackImage;
  const leadSource = data.leadSource || `${projectSlug}-360`;
  const highlights = (data.highlights ?? []).filter((h) => pick(h));

  function handleOpen() {
    markTourOpened(projectSlug);
    trackEvent("tour_external_open", { project: projectSlug, source: "section", language: lang });
  }

  function handleCta() {
    trackEvent("project_360_cta_click", { project: projectSlug, language: lang });
    setModalOpen(true);
  }

  return (
    <section
      id={id}
      className={`bg-[var(--color-warm-white)] px-5 sm:px-8 md:px-12 ${compact ? "py-14 sm:py-16 md:py-20" : "py-16 sm:py-20 md:py-28"}`}
    >
      <Reveal className="mx-auto max-w-[1440px]">
        <div className={`max-w-180 ${compact ? "mb-6 md:mb-8" : "mb-8 md:mb-12"}`}>
          <div className="mb-5 font-ui text-[length:var(--fs-label)] tracking-[var(--ls-label)] text-[var(--project-accent)] uppercase">
            {pick(data.eyebrow)}
          </div>
          {pick(data.headline) && (
            <h2
              className={`m-0 mb-4 font-display ${compact ? "text-[length:var(--fs-h2)]" : "text-[length:var(--fs-h1)]"} leading-[var(--lh-heading)] font-normal text-[var(--color-charcoal)]`}
            >
              <Accent text={pick(data.headline)} />
            </h2>
          )}
          {pick(data.body) && (
            <p className="m-0 font-body text-[length:var(--fs-body-lg)] leading-[var(--lh-body)] text-[var(--color-text-muted)]">{pick(data.body)}</p>
          )}
        </div>

        <a
          href={data.tourUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleOpen}
          className={`group relative block w-full overflow-hidden border border-[var(--color-border)] bg-[var(--color-charcoal)] no-underline ${
            compact ? "aspect-4/3 sm:aspect-16/10 md:aspect-[21/9]" : "aspect-4/3 md:aspect-16/9"
          }`}
        >
          {posterSrc ? (
            <Image
              src={posterSrc}
              alt={pick(data.poster?.alt ?? { vi: "", en: "" }) || pick(data.eyebrow)}
              fill
              sizes="(min-width: 1440px) 1344px, 100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              style={{ objectPosition: data.poster?.src ? focalPosition(data.poster) : undefined }}
            />
          ) : (
            <ImagePlaceholder label={pick(data.eyebrow)} tone="dark" className="rounded-none border-none" />
          )}
          <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgba(38,34,32,0.15)_0%,rgba(38,34,32,0.35)_55%,rgba(38,34,32,0.75)_100%)]" />

          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-4 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full border border-[rgba(250,247,242,0.8)] bg-[rgba(38,34,32,0.45)] backdrop-blur-sm transition-transform duration-300 group-hover:scale-110 md:h-20 md:w-20">
              <svg aria-hidden viewBox="0 0 24 24" className="ml-1 h-7 w-7 fill-[var(--color-warm-white)]">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
            <span className="inline-flex items-center gap-2 rounded-xs bg-[var(--project-primary)] px-6 py-3 font-ui text-[13px] font-bold tracking-[0.08em] text-[var(--project-primary-foreground)] uppercase">
              {pick(data.playLabel)}
              <span aria-hidden>↗</span>
            </span>
            <span className="font-body text-xs text-[rgba(250,245,238,0.85)]">{pick({ vi: "Mở trong tab mới", en: "Opens in a new tab" })}</span>
          </div>

          {/* Desktop: what the tour offers, over the bottom of the image. */}
          {highlights.length > 0 && (
            <ol className="absolute inset-x-0 bottom-0 m-0 hidden list-none grid-cols-4 gap-6 p-6 md:grid lg:p-8">
              {highlights.map((h, i) => (
                <li key={i} className="flex items-baseline gap-2 border-t border-[rgba(250,245,238,0.45)] pt-3">
                  <span className="flex-none font-display text-sm text-[var(--project-accent-light)]">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-ui text-[13px] leading-[1.45] font-bold tracking-[0.04em] text-[var(--color-warm-white)] [text-wrap:balance]">{pick(h)}</span>
                </li>
              ))}
            </ol>
          )}
        </a>

        {/* Phones/tablets: the same highlights under the image (too cramped over it). */}
        {highlights.length > 0 && (
          <ol className="m-0 mt-5 grid list-none grid-cols-2 gap-x-5 gap-y-4 p-0 md:hidden">
            {highlights.map((h, i) => (
              <li key={i} className="flex items-baseline gap-1.5 border-t border-[rgba(var(--project-accent-rgb),0.35)] pt-3">
                <span className="flex-none font-display text-sm text-[var(--project-accent)]">{String(i + 1).padStart(2, "0")}</span>
                <span className="font-ui text-[13px] leading-[1.45] font-bold text-[var(--color-charcoal)] [text-wrap:balance]">{pick(h)}</span>
              </li>
            ))}
          </ol>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-between gap-5">
          {pick(data.note) && (
            <p className="m-0 max-w-150 min-w-60 flex-1 font-body text-[13px] leading-[var(--lh-body)] text-[var(--color-text-muted)]">{pick(data.note)}</p>
          )}
          {pick(data.ctaLabel) && (
            <button
              type="button"
              onClick={handleCta}
              className="inline-flex cursor-pointer items-center rounded-xs border border-[var(--project-primary)] bg-[var(--project-primary)] px-8 py-4 text-center font-ui text-[13px] font-bold tracking-[0.08em] text-[var(--project-primary-foreground)] uppercase hover:bg-[var(--project-primary-dark)]"
            >
              {pick(data.ctaLabel)}
            </button>
          )}
        </div>
      </Reveal>

      {data.returnPrompt && pick(data.returnPrompt.title) && (
        <TourReturnPrompt data={data.returnPrompt} projectSlug={projectSlug} qualifiers={qualifiers} />
      )}

      <LeadModal
        open={modalOpen}
        onClose={closeModal}
        source={leadSource}
        qualifiers={qualifiers}
        contextNote={pick(data.ctaNote) ? data.ctaNote : undefined}
      />
    </section>
  );
}
