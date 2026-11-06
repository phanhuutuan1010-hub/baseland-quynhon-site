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
import { focalPosition } from "./imageFrame";

/**
 * "Tham quan ảo 360°" — poster-first: the tour itself (≈6–7 MB of WebGL,
 * images and third-party scripts on the developer's site) only loads when
 * the visitor clicks play. To make that click feel fast:
 *  - section ~1 screen away → a hidden iframe opens the connection to the
 *    tour host (DNS+TCP+TLS done before the click);
 *  - play opens the tour IN this page (desktop: in place; mobile: a
 *    full-screen viewer), because browsers partition cache and connections
 *    per top-level site — a new tab would start cold and waste the warm-up.
 * The play control stays a real link, so `allowEmbed: false` / no-JS just
 * open the tour in a new tab.
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
  // Mobile full-screen viewer (the same tour iframe, fixed over the page).
  const [overlay, setOverlay] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onChange = () => setIsFullscreen(document.fullscreenElement === frameRef.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  // Once the section is about a screen away, open the connection to the
  // tour host from a hidden iframe (its robots.txt, a few KB). It has to be
  // an iframe: Chrome keys sockets/cache by (page site, frame site), so a
  // <link rel=preconnect> from this page lands in a different bucket and the
  // tour iframe would still connect from scratch (measured).
  const [warmSrc, setWarmSrc] = useState("");
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || !data.tourUrl || !data.allowEmbed) return;
    let origin = "";
    try {
      origin = new URL(data.tourUrl).origin;
    } catch {
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        setWarmSrc(`${origin}/robots.txt`);
      },
      { rootMargin: "100% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [data.tourUrl, data.allowEmbed]);

  // Mobile viewer: lock page scroll; close button / Esc / Android back close
  // it. The tour adds its own history entries inside the iframe (shared
  // with this page's history), so closing must NOT go through
  // history.back() — that would just step the tour back and reload it.
  // Instead: the button closes directly, and our own "viewer open" entry is
  // re-pushed on top whenever the tour adds one, so Back closes in one press.
  useEffect(() => {
    if (!overlay) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    let ourLength = 0;
    let closedByBack = false;
    const pushOurs = () => {
      history.pushState({ blTour: true }, "");
      ourLength = history.length;
    };
    pushOurs();
    // Index of the page's own entry (the one before the viewer opened).
    const pageIndex = history.length - 2;
    const watch = window.setInterval(() => {
      if (history.length > ourLength) pushOurs();
    }, 400);
    const onPop = () => {
      closedByBack = true;
      setOverlay(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOverlay(false);
    };
    window.addEventListener("popstate", onPop);
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearInterval(watch);
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("popstate", onPop);
      window.removeEventListener("keydown", onKey);
      // Once the iframe is gone, jump back over every entry added while the
      // viewer was open (ours + the tour's), so the next Back leaves the
      // page as if the tour had never been opened.
      window.setTimeout(() => {
        const current = history.length - 1 - (closedByBack ? 1 : 0);
        const steps = current - pageIndex;
        if (steps > 0) history.go(-steps);
      }, 0);
    };
  }, [overlay]);

  const posterSrc = data.poster.src || fallbackImage;
  const leadSource = data.leadSource || `${projectSlug}-360`;

  function handlePlay(e: React.MouseEvent<HTMLAnchorElement>) {
    const desktop = window.matchMedia("(min-width: 768px) and (hover: hover)").matches;
    const mode = !data.allowEmbed ? "new_tab" : desktop ? "embed" : "overlay";
    trackEvent("project_360_open", { project: projectSlug, mode, source: "section", language: lang });
    if (mode === "new_tab") return;
    e.preventDefault();
    if (mode === "embed") setEmbedded(true);
    else setOverlay(true);
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
      ref={sectionRef}
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
                style={{ objectPosition: data.poster.src ? focalPosition(data.poster) : undefined }}
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

      {warmSrc && <iframe src={warmSrc} hidden aria-hidden="true" tabIndex={-1} title="" className="hidden" />}

      {overlay && (
        <TourOverlay
          url={data.tourUrl}
          title={pick(data.eyebrow)}
          closeLabel={pick({ vi: "Đóng", en: "Close" })}
          newTabLabel={pick(data.newTabLabel)}
          loadingLabel={pick({ vi: "Đang tải tour 360°…", en: "Loading the 360° tour…" })}
          onClose={() => setOverlay(false)}
        />
      )}

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

/** Mobile full-screen 360° viewer: the tour iframe over the whole screen,
 * with close + "open in new tab". Sized with 100dvh, not the Fullscreen API
 * (iPhone Safari doesn't support element fullscreen for iframes). */
function TourOverlay({
  url,
  title,
  closeLabel,
  newTabLabel,
  loadingLabel,
  onClose,
}: {
  url: string;
  title: string;
  closeLabel: string;
  newTabLabel: string;
  loadingLabel: string;
  onClose: () => void;
}) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div role="dialog" aria-modal="true" aria-label={title} className="fixed inset-0 z-[200] flex h-dvh flex-col bg-[var(--color-charcoal)]">
      <div className="flex flex-none items-center justify-between gap-3 px-3 pt-[calc(0.5rem+env(safe-area-inset-top,0px))] pb-2">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-ui text-[12px] font-bold tracking-[0.08em] text-[var(--color-warm-white)] uppercase no-underline"
        >
          {newTabLabel} ↗
        </a>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-full border border-[rgba(250,247,242,0.5)] bg-transparent px-4 font-ui text-[12px] font-bold tracking-[0.08em] text-[var(--color-warm-white)] uppercase"
        >
          <span aria-hidden>✕</span>
          {closeLabel}
        </button>
      </div>
      <div className="relative min-h-0 flex-1 pb-[env(safe-area-inset-bottom,0px)]">
        {!loaded && (
          <div role="status" className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <span className="h-10 w-10 animate-spin rounded-full border-2 border-[rgba(250,247,242,0.3)] border-t-[var(--color-warm-white)]" />
            <span className="font-ui text-xs font-bold tracking-[0.1em] text-[var(--color-warm-white)] uppercase">{loadingLabel}</span>
          </div>
        )}
        <iframe
          src={url}
          title={title}
          allow="fullscreen; gyroscope; accelerometer; magnetometer; xr-spatial-tracking"
          allowFullScreen
          onLoad={() => setLoaded(true)}
          className={`absolute inset-0 h-full w-full border-0 transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
        />
      </div>
    </div>
  );
}
