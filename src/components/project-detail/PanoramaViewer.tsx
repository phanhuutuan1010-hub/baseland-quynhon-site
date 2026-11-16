"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useLang } from "@/lib/i18n";
import { LeadModal } from "@/components/LeadModal";
import { trackEvent } from "@/lib/analytics";
import type { ProjectLeadQualifier, ProjectPanorama } from "@/lib/project-detail/types";
import { launchTime } from "./LaunchCountdown";
import { ZoomLightbox } from "./ZoomLightbox";

const DRIFT_MS = 8000;
const DAY_MS = 86_400_000;

/** Shown when enabled and an image is set. */
export function hasPanorama(p?: ProjectPanorama): p is ProjectPanorama {
  return !!p?.enabled && !!p.image?.src?.trim();
}

// "Is the opening day over?" — re-checked every minute; the prerendered
// HTML always shows the line (server snapshot) and the browser hides it.
const subscribeMinute = (cb: () => void) => {
  const t = window.setInterval(cb, 60_000);
  return () => window.clearInterval(t);
};

/**
 * Wide flat panorama (not a 360° sphere) — e.g. the show apartment's
 * living room. Phones/tablets (<1024px): 60vh tall, swiped sideways, a thin
 * progress bar below, a "swipe" hint until the first swipe; it opens at the
 * right edge (the front door) and drifts slowly to the left once (~8s),
 * stopping at the first touch (no drift with prefers-reduced-motion).
 * Desktop: the whole image, edge to edge; a click opens it full screen
 * (largest file, drag + zoom). Hotspots sit at x/y % of the image and show
 * a short label on tap. One CTA below → lead form.
 */
export function PanoramaViewer({
  data,
  projectSlug,
  qualifiers,
}: {
  data: ProjectPanorama;
  projectSlug: string;
  qualifiers?: ProjectLeadQualifier[];
}) {
  const { pick, lang } = useLang();
  const scrollRef = useRef<HTMLDivElement>(null);
  const userTouched = useRef(false);
  const driftRaf = useRef(0);
  const [progress, setProgress] = useState({ start: 1, size: 1 });
  const [hint, setHint] = useState(true);
  const [activeSpot, setActiveSpot] = useState<number | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const closeForm = useCallback(() => setFormOpen(false), []);
  const closeFull = useCallback(() => setFullscreen(false), []);

  const img = data.image;
  const meta = img as { width?: number; height?: number };
  const ratio = meta.width && meta.height ? meta.width / meta.height : 2.7;

  const openingEnd = launchTime(data.openingDate);
  const openingOver = useSyncExternalStore(
    subscribeMinute,
    () => openingEnd != null && Date.now() >= openingEnd + DAY_MS,
    () => false,
  );

  const measure = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress({ start: max > 0 ? el.scrollLeft / el.scrollWidth : 0, size: max > 0 ? el.clientWidth / el.scrollWidth : 1 });
  }, []);

  const stopDrift = useCallback(() => {
    if (driftRaf.current) cancelAnimationFrame(driftRaf.current);
    driftRaf.current = 0;
  }, []);

  // Start at the right edge (front door); first view → analytics + drift.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollLeft = el.scrollWidth;
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    let seen = false;
    const io = new IntersectionObserver(
      (entries) => {
        if (seen || !entries.some((e) => e.isIntersecting)) return;
        seen = true;
        io.disconnect();
        trackEvent("panorama_view", { project: projectSlug, language: lang });
        const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
        const from = el.scrollLeft;
        if (reduced || userTouched.current || from <= 0) return;
        const t0 = performance.now();
        const step = (now: number) => {
          const p = Math.min(1, (now - t0) / DRIFT_MS);
          const eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
          el.scrollLeft = from * (1 - eased);
          driftRaf.current = p < 1 ? requestAnimationFrame(step) : 0;
        };
        driftRaf.current = requestAnimationFrame(step);
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => {
      ro.disconnect();
      io.disconnect();
      stopDrift();
    };
    // Set up once per mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onUserTouch() {
    userTouched.current = true;
    stopDrift();
  }

  function onScroll() {
    measure();
    if (userTouched.current && hint) setHint(false);
  }

  function openFullscreen() {
    trackEvent("panorama_fullscreen", { project: projectSlug, language: lang });
    setFullscreen(true);
  }

  function onImageClick() {
    // Desktop: click = full screen. Phones: the image is for swiping.
    if (window.matchMedia("(min-width: 1024px)").matches) openFullscreen();
  }

  function toggleSpot(i: number) {
    setActiveSpot((cur) => (cur === i ? null : i));
    if (activeSpot !== i) trackEvent("panorama_hotspot_click", { project: projectSlug, hotspot: i + 1, label: data.hotspots[i]?.label.vi ?? "", language: lang });
  }

  const srcSet = [img.src && `${img.src} 2700w`, img.srcLarge && `${img.srcLarge} 3600w`].filter(Boolean).join(", ");
  const opening =
    openingEnd != null && !openingOver && pick(data.openingLabel)
      ? `${pick(data.openingLabel)} ${data.openingDate.split("-").reverse().join("/")}`
      : "";

  return (
    <div>
      {pick(data.title) && (
        <h3 className="m-0 mb-5 font-display text-[length:var(--fs-h3)] leading-[1.35] font-normal text-[var(--color-charcoal)]">{pick(data.title)}</h3>
      )}

      {/* Edge to edge on every screen. */}
      <div className="relative mx-[calc(50%-50vw)] w-screen">
        <div
          ref={scrollRef}
          onScroll={onScroll}
          onPointerDown={onUserTouch}
          onTouchStart={onUserTouch}
          onWheel={onUserTouch}
          className="no-scrollbar h-[60vh] overflow-x-auto overflow-y-hidden overscroll-x-contain bg-[var(--color-sand)] lg:h-auto lg:overflow-visible"
        >
          <div className="relative h-full lg:h-auto lg:w-full" style={{ aspectRatio: `${ratio}` }}>
            {/* Plain <img>: the files are already sized (2700/3600/5500px)
                and the optimizer would cap the larger ones. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.src}
              srcSet={srcSet || undefined}
              sizes="(min-width: 1024px) 100vw, 162vh"
              alt={pick(img.alt) || pick(data.title)}
              loading="lazy"
              decoding="async"
              draggable={false}
              onClick={onImageClick}
              className="absolute inset-0 h-full w-full object-cover select-none lg:cursor-zoom-in"
            />
            {data.hotspots.map((h, i) => {
              const open = activeSpot === i;
              const align = h.x > 70 ? "right-0" : h.x < 30 ? "left-0" : "left-1/2 -translate-x-1/2";
              return (
                <div key={i} className="absolute z-[1]" style={{ left: `${h.x}%`, top: `${h.y}%` }}>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSpot(i);
                    }}
                    aria-expanded={open}
                    aria-label={pick(h.label)}
                    className="relative -mt-5 -ml-5 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-none bg-transparent p-0"
                  >
                    <span aria-hidden className="absolute h-7 w-7 animate-[panorama-pulse_2.4s_ease-out_infinite] rounded-full bg-[rgba(255,255,255,0.55)]" />
                    <span aria-hidden className="relative h-3.5 w-3.5 rounded-full border-2 border-white bg-[var(--project-accent)] shadow-[0_0_0_1px_rgba(0,0,0,0.15)]" />
                  </button>
                  {open && (
                    <span
                      role="status"
                      className={`absolute bottom-7 w-max max-w-[min(260px,70vw)] rounded-xs bg-[var(--color-warm-white)] px-3 py-2 font-ui text-xs leading-[1.4] font-bold text-[var(--color-charcoal)] shadow-[var(--shadow-md)] ${align}`}
                    >
                      {pick(h.label)}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {hint && (
          <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center lg:hidden">
            <span className="rounded-full bg-[rgba(38,34,32,0.6)] px-4 py-2 font-ui text-xs font-bold tracking-[0.04em] text-white backdrop-blur-sm">
              ← {pick({ vi: "Vuốt để xem toàn cảnh", en: "Swipe to see the whole room" })} →
            </span>
          </div>
        )}

        <button
          type="button"
          onClick={openFullscreen}
          aria-label={pick({ vi: "Xem toàn màn hình", en: "View full screen" })}
          className="absolute top-3 right-3 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[rgba(255,255,255,0.6)] bg-[rgba(38,34,32,0.5)] text-white backdrop-blur-sm lg:top-5 lg:right-5"
        >
          <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2">
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
          </svg>
        </button>
      </div>

      {/* Phones: how far along the room you are. */}
      <div className="mt-3 h-1 overflow-hidden rounded-full bg-[rgba(38,34,32,0.12)] lg:hidden" aria-hidden>
        <div className="h-full rounded-full bg-[var(--project-accent)]" style={{ width: `${progress.size * 100}%`, marginLeft: `${progress.start * 100}%` }} />
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-5">
        {pick(data.caption) && <p className="m-0 max-w-150 min-w-60 flex-1 font-body text-[13px] leading-[var(--lh-body)] text-[var(--color-deep-earth)] italic">{pick(data.caption)}</p>}
        {pick(data.ctaLabel) && (
          <div className="flex flex-col items-start gap-2 sm:items-end">
            <button
              type="button"
              onClick={() => {
                trackEvent("panorama_cta_click", { project: projectSlug, language: lang });
                setFormOpen(true);
              }}
              className="inline-flex min-h-12 cursor-pointer items-center rounded-xs border border-[var(--project-primary)] bg-[var(--project-primary)] px-8 py-4 text-center font-ui text-[13px] font-bold tracking-[0.08em] text-[var(--project-primary-foreground)] uppercase hover:bg-[var(--project-primary-dark)]"
            >
              {pick(data.ctaLabel)}
            </button>
            {opening && <span className="font-body text-[13px] text-[var(--color-text-muted)]">{opening}</span>}
          </div>
        )}
      </div>

      {fullscreen && (
        <ZoomLightbox
          src={img.srcFull || img.srcLarge || img.src}
          unoptimized
          alt={pick(img.alt) || pick(data.title)}
          caption={pick(data.caption)}
          width={5500}
          height={Math.round(5500 / ratio)}
          onClose={closeFull}
        />
      )}

      <LeadModal
        open={formOpen}
        onClose={closeForm}
        source={data.leadSource || `${projectSlug}-panorama`}
        project={projectSlug}
        qualifiers={qualifiers}
        contextNote={data.title}
      />
    </div>
  );
}
