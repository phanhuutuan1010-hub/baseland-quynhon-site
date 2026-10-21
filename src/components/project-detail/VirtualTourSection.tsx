"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useLang } from "@/lib/i18n";
import { Reveal } from "@/components/Reveal";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { LeadModal } from "@/components/LeadModal";
import { trackEvent } from "@/lib/analytics";
import type { ProjectLeadQualifier, ProjectVirtualTour } from "@/lib/project-detail/types";
import { Accent } from "@/components/Accent";

/**
 * "Tham quan ảo 360°" — poster-first: nothing from the tour host loads
 * until the visitor clicks play (the tour is heavy WebGL + third-party
 * scripts, so it must not cost the page anything up front). The play
 * control is a real link to the tour, so mobile / no-embed / no-JS all
 * just open it in a new tab; only desktop with `allowEmbed` intercepts the
 * click and swaps the poster for the iframe in place.
 */
const secondaryBtn =
  "inline-flex cursor-pointer items-center rounded-xs border border-[var(--project-accent)] bg-transparent px-5 py-3 font-ui text-xs font-bold tracking-[0.08em] text-[var(--color-charcoal)] uppercase hover:bg-[rgba(var(--project-accent-rgb),0.15)]";

export function VirtualTourSection({
  id,
  data,
  projectSlug,
  fallbackImage,
  qualifiers,
  compact,
}: {
  id: string;
  /** Compact layout: shorter frame (21:9 on desktop) and less padding. */
  compact?: boolean;
  data: ProjectVirtualTour;
  projectSlug: string;
  fallbackImage?: string;
  qualifiers?: ProjectLeadQualifier[];
}) {
  const { pick, lang } = useLang();
  const [embedded, setEmbedded] = useState(false);
  const [frameLoaded, setFrameLoaded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const onChange = () => setIsFullscreen(document.fullscreenElement === frameRef.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const posterSrc = data.poster.src || fallbackImage;
  const leadSource = data.leadSource || `${projectSlug}-360`;

  function handlePlay(e: React.MouseEvent<HTMLAnchorElement>) {
    const desktop = window.matchMedia("(min-width: 768px) and (hover: hover)").matches;
    const mode = data.allowEmbed && desktop ? "embed" : "new_tab";
    trackEvent("project_360_open", { project: projectSlug, mode, source: "section", language: lang });
    if (mode === "embed") {
      e.preventDefault();
      setEmbedded(true);
    }
  }

  function toggleFullscreen() {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void frameRef.current?.requestFullscreen?.();
  }

  function handleCta() {
    trackEvent("project_360_cta_click", { project: projectSlug, embedded, language: lang });
    setModalOpen(true);
  }

  return (
    <section
      id={id}
      className={`bg-[var(--color-warm-white)] px-5 sm:px-8 md:px-12 ${compact ? "py-14 sm:py-16 md:py-20" : "py-16 sm:py-20 md:py-28"}`}
    >
      <Reveal className="mx-auto max-w-[1440px]">
        <div className={`flex flex-wrap items-end justify-between gap-6 ${compact ? "mb-6 md:mb-8" : "mb-8 md:mb-12"}`}>
          <div className="max-w-180">
            <div className="mb-5 font-ui text-[length:var(--fs-label)] tracking-[var(--ls-label)] text-[var(--project-accent)] uppercase">
              {pick(data.eyebrow)}
            </div>
            {pick(data.headline) && (
              <h2 className={`m-0 mb-4 font-display ${compact ? "text-[length:var(--fs-h2)]" : "text-[length:var(--fs-h1)]"} leading-[var(--lh-heading)] font-normal text-[var(--color-charcoal)]`}>
                <Accent text={pick(data.headline)} />
              </h2>
            )}
            {pick(data.body) && (
              <p className="m-0 font-body text-[length:var(--fs-body-lg)] leading-[var(--lh-body)] text-[var(--color-text-muted)]">
                {pick(data.body)}
              </p>
            )}
          </div>
        </div>

        <div
          ref={frameRef}
          className={`relative w-full overflow-hidden border border-[var(--color-border)] bg-[var(--color-charcoal)] ${
            compact ? "aspect-16/10 md:aspect-[21/9]" : "aspect-4/3 md:aspect-16/9"
          }`}
        >
          {(!embedded || !frameLoaded) &&
            (posterSrc ? (
              <Image
                src={posterSrc}
                alt={pick(data.poster.alt) || pick(data.eyebrow)}
                fill
                sizes="(min-width: 1440px) 1344px, 100vw"
                className={`object-cover transition-[filter] duration-500 ${embedded ? "blur-sm" : ""}`}
              />
            ) : (
              <ImagePlaceholder label={pick(data.eyebrow)} tone="dark" className="rounded-none border-none" />
            ))}
          {(!embedded || !frameLoaded) && <div aria-hidden className="absolute inset-0 bg-[rgba(38,34,32,0.35)]" />}

          {embedded ? (
            <>
              {!frameLoaded && (
                <div role="status" className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                  <span className="h-10 w-10 animate-spin rounded-full border-2 border-[rgba(250,247,242,0.3)] border-t-[var(--color-warm-white)]" />
                  <span className="font-ui text-xs font-bold tracking-[0.1em] text-[var(--color-warm-white)] uppercase">
                    {pick({ vi: "Đang tải tour 360°…", en: "Loading the 360° tour…" })}
                  </span>
                </div>
              )}
              <iframe
                src={data.tourUrl}
                title={pick(data.eyebrow)}
                allow="fullscreen; gyroscope; accelerometer; xr-spatial-tracking"
                allowFullScreen
                onLoad={() => setFrameLoaded(true)}
                className={`absolute inset-0 h-full w-full border-0 transition-opacity duration-500 ${frameLoaded ? "opacity-100" : "opacity-0"}`}
              />
            </>
          ) : (
            <a
              href={data.tourUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handlePlay}
              className="group absolute inset-0 flex flex-col items-center justify-center gap-4 no-underline"
            >
              <span className="flex h-18 w-18 items-center justify-center rounded-full border border-[rgba(250,247,242,0.8)] bg-[rgba(38,34,32,0.45)] backdrop-blur-sm transition-transform duration-300 group-hover:scale-110 md:h-22 md:w-22">
                <svg aria-hidden viewBox="0 0 24 24" className="ml-1 h-7 w-7 fill-[var(--color-warm-white)]">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
              <span className="rounded-xs bg-[var(--project-primary)] px-6 py-3 font-ui text-[13px] font-bold tracking-[0.08em] text-[var(--project-primary-foreground)] uppercase">
                {pick(data.playLabel)}
              </span>
            </a>
          )}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-5">
          <div className="flex min-w-60 flex-1 flex-col gap-4">
            {embedded && (
              <div className="flex flex-wrap gap-2.5">
                <button type="button" onClick={toggleFullscreen} className={secondaryBtn}>
                  {isFullscreen ? pick({ vi: "Thoát toàn màn hình", en: "Exit full screen" }) : pick(data.fullscreenLabel)}
                </button>
                <a href={data.tourUrl} target="_blank" rel="noopener noreferrer" className={`${secondaryBtn} no-underline`}>
                  {pick(data.newTabLabel)} ↗
                </a>
              </div>
            )}
            {pick(data.note) && (
              <p className="m-0 max-w-150 font-body text-[13px] leading-[var(--lh-body)] text-[var(--color-deep-earth)]">{pick(data.note)}</p>
            )}
          </div>
          {pick(data.ctaLabel) && (
            <button
              type="button"
              onClick={handleCta}
              className="inline-flex cursor-pointer items-center rounded-xs border border-[var(--project-primary)] bg-[var(--project-primary)] px-8 py-4 font-ui text-[13px] font-bold tracking-[0.08em] text-[var(--project-primary-foreground)] uppercase hover:bg-[var(--project-primary-dark)]"
            >
              {pick(data.ctaLabel)}
            </button>
          )}
        </div>
      </Reveal>

      <LeadModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        source={leadSource}
        qualifiers={qualifiers}
        contextNote={pick(data.ctaNote) ? data.ctaNote : undefined}
      />
    </section>
  );
}
