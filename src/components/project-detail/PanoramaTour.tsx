"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useLang } from "@/lib/i18n";
import { Reveal } from "@/components/Reveal";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { LeadModal } from "@/components/LeadModal";
import { Accent } from "@/components/Accent";
import { trackEvent } from "@/lib/analytics";
import { loadPannellum, requestMotionPermission, type PannellumViewer } from "@/lib/pannellum";
import type { ProjectLeadQualifier, ProjectTourScene, ProjectVirtualTour } from "@/lib/project-detail/types";
import { tourScenes } from "@/lib/project-detail/types";
import { focalPosition } from "./imageFrame";

/**
 * Self-hosted multi-scene 360° tour (Pannellum). Poster + "Bắt đầu tham
 * quan" first; the viewer script, its stylesheet and the 360° images load
 * only after that click. Scene thumbnails below, hotspots move between
 * scenes, gentle auto-rotate (off with prefers-reduced-motion), fullscreen
 * (native, or a fixed overlay where the Fullscreen API is missing — iPhone),
 * and on touch devices an opt-in gyroscope button (iOS asks permission on
 * that tap). CTA under the tour opens the lead form with source
 * "<slug>-360".
 */
const secondaryBtn =
  "inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xs border border-[var(--project-accent)] bg-transparent px-5 py-3 font-ui text-xs font-bold tracking-[0.08em] text-[var(--color-charcoal)] uppercase hover:bg-[rgba(var(--project-accent-rgb),0.15)]";
const overlayBtn =
  "inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-full border border-[rgba(250,247,242,0.55)] bg-[rgba(20,20,20,0.45)] px-4 font-ui text-[11px] font-bold tracking-[0.08em] text-[var(--color-warm-white)] uppercase backdrop-blur-sm";

type Props = {
  id: string;
  compact?: boolean;
  data: ProjectVirtualTour;
  projectSlug: string;
  fallbackImage?: string;
  qualifiers?: ProjectLeadQualifier[];
};

export function PanoramaTour({ id, compact, data, projectSlug, fallbackImage, qualifiers }: Props) {
  const { pick, lang } = useLang();
  const scenes = tourScenes(data);
  const [started, setStarted] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [activeId, setActiveId] = useState(scenes[0]?.id ?? "");
  const [fullscreen, setFullscreen] = useState<"" | "native" | "overlay">("");
  const [gyroCapable, setGyroCapable] = useState(false);
  const [gyroOn, setGyroOn] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);
  const viewerBoxRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<PannellumViewer | null>(null);
  // Start options captured at click time (scene + reduced motion).
  const startRef = useRef({ sceneId: scenes[0]?.id ?? "", reduced: false });

  const sceneName = (s?: ProjectTourScene) => (s ? pick(s.name) || s.id : "");
  const byId = (sid: string) => scenes.find((s) => s.id === sid);

  // Build the viewer once the visitor has asked for it.
  useEffect(() => {
    if (!started) return;
    let cancelled = false;
    let viewer: PannellumViewer | null = null;
    const { sceneId, reduced } = startRef.current;
    loadPannellum()
      .then((pannellum) => {
        const box = viewerBoxRef.current;
        if (cancelled || !box) return;
        const sceneConfig: Record<string, unknown> = {};
        for (const s of scenes) {
          sceneConfig[s.id] = {
            type: "equirectangular",
            panorama: s.src,
            yaw: s.yaw ?? 0,
            pitch: s.pitch ?? 0,
            hfov: s.hfov || 100,
            hotSpots: (s.hotspots ?? [])
              .filter((h) => byId(h.target))
              .map((h) => ({
                pitch: h.pitch,
                yaw: h.yaw,
                type: "scene",
                sceneId: h.target,
                text: pick(h.label) || sceneName(byId(h.target)),
              })),
          };
        }
        viewer = pannellum.viewer(box, {
          default: {
            firstScene: sceneId,
            sceneFadeDuration: 600,
            autoLoad: true,
            autoRotate: reduced ? false : -2,
            autoRotateInactivityDelay: 6000,
            showFullscreenCtrl: false,
            showZoomCtrl: true,
            // Wheel over the frame keeps scrolling the page unless fullscreen.
            mouseZoom: "fullscreenonly",
            orientationOnByDefault: false,
            compass: false,
            strings: {
              loadingLabel: pick({ vi: "Đang tải…", en: "Loading…" }),
              genericWebGLError: pick({ vi: "Trình duyệt không hỗ trợ WebGL.", en: "Your browser doesn't support WebGL." }),
              iOS8WebGLError: pick({ vi: "Trình duyệt không hỗ trợ WebGL.", en: "Your browser doesn't support WebGL." }),
              fileAccessError: pick({ vi: "Không tải được ảnh 360°.", en: "The 360° image could not be loaded." }),
              malformedURLError: pick({ vi: "Đường dẫn ảnh 360° không hợp lệ.", en: "Invalid 360° image URL." }),
              textureSizeError: pick({ vi: "Ảnh 360° quá lớn cho thiết bị này.", en: "This 360° image is too large for this device." }),
            },
          },
          scenes: sceneConfig,
        });
        viewerRef.current = viewer;
        viewer.on("load", () => {
          setLoaded(true);
          const current = viewer?.getScene() ?? "";
          setActiveId(current);
          trackEvent("tour_scene_view", { project: projectSlug, scene: current, language: lang });
        });
        viewer.on("error", () => setFailed(true));
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
      viewerRef.current = null;
      try {
        viewer?.destroy();
      } catch {
        /* already torn down */
      }
    };
    // Built once per start; scene data doesn't change while the page is open.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started]);

  // Native fullscreen state (Esc / system UI can leave it).
  useEffect(() => {
    const onChange = () => {
      const fsEl = document.fullscreenElement ?? (document as unknown as { webkitFullscreenElement?: Element }).webkitFullscreenElement;
      setFullscreen((prev) => (fsEl === frameRef.current ? "native" : prev === "native" ? "" : prev));
    };
    document.addEventListener("fullscreenchange", onChange);
    document.addEventListener("webkitfullscreenchange", onChange);
    return () => {
      document.removeEventListener("fullscreenchange", onChange);
      document.removeEventListener("webkitfullscreenchange", onChange);
    };
  }, []);

  // Overlay "fullscreen" (no Fullscreen API): lock page scroll, Esc closes.
  useEffect(() => {
    if (fullscreen !== "overlay") return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFullscreen("");
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [fullscreen]);

  // The canvas has to be told its box changed size.
  useEffect(() => {
    const raf = requestAnimationFrame(() => viewerRef.current?.resize());
    return () => cancelAnimationFrame(raf);
  }, [fullscreen]);

  function start(sceneId: string, source: string) {
    startRef.current = {
      sceneId,
      reduced: window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false,
    };
    setGyroCapable(window.matchMedia?.("(pointer: coarse)").matches === true && "DeviceOrientationEvent" in window);
    setActiveId(sceneId);
    setStarted(true);
    trackEvent("tour_open", { project: projectSlug, scenes: scenes.length, source, language: lang });
  }

  function goTo(sceneId: string) {
    if (!started) return start(sceneId, "thumbnail");
    if (sceneId === activeId) return;
    const s = byId(sceneId);
    viewerRef.current?.loadScene(sceneId, s?.pitch ?? 0, s?.yaw ?? 0, s?.hfov || 100);
  }

  function toggleFullscreen() {
    if (fullscreen === "native") {
      void (document.exitFullscreen?.() ?? (document as unknown as { webkitExitFullscreen?: () => void }).webkitExitFullscreen?.());
      return;
    }
    if (fullscreen === "overlay") return setFullscreen("");
    const el = frameRef.current as (HTMLDivElement & { webkitRequestFullscreen?: () => void }) | null;
    if (!el) return;
    if (el.requestFullscreen) {
      // Some embedded/in-app browsers resolve the request without actually
      // going fullscreen — fall back to the overlay then too.
      el.requestFullscreen()
        .then(() => window.setTimeout(() => !document.fullscreenElement && setFullscreen("overlay"), 300))
        .catch(() => setFullscreen("overlay"));
    } else if (el.webkitRequestFullscreen) {
      el.webkitRequestFullscreen();
    } else {
      setFullscreen("overlay");
    }
  }

  async function toggleGyro() {
    const viewer = viewerRef.current;
    if (!viewer) return;
    if (gyroOn) {
      viewer.stopOrientation();
      setGyroOn(false);
      return;
    }
    if (!(await requestMotionPermission())) return;
    viewer.stopAutoRotate();
    viewer.startOrientation();
    setGyroOn(true);
  }

  function handleCta() {
    trackEvent("tour_cta_click", { project: projectSlug, scene: activeId, language: lang });
    setModalOpen(true);
  }

  const posterSrc = data.poster?.src || fallbackImage;
  const leadSource = data.leadSource || `${projectSlug}-360`;
  const isFull = fullscreen !== "";
  const fullscreenLabel = isFull ? pick({ vi: "Thoát toàn màn hình", en: "Exit full screen" }) : pick(data.fullscreenLabel);
  const gyroLabel = gyroOn ? pick({ vi: "Tắt con quay", en: "Gyroscope off" }) : pick({ vi: "Con quay hồi chuyển", en: "Gyroscope" });

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

        <div
          ref={frameRef}
          className={`bl-pano overflow-hidden bg-[var(--color-charcoal)] ${
            fullscreen === "overlay"
              ? "fixed inset-0 z-[200] h-dvh w-full"
              : `relative w-full border border-[var(--color-border)] ${fullscreen === "native" ? "h-full" : compact ? "aspect-16/10 md:aspect-[21/9]" : "aspect-4/3 md:aspect-16/9"}`
          }`}
        >
          {(!started || !loaded) &&
            (posterSrc ? (
              <Image
                src={posterSrc}
                alt={pick(data.poster?.alt ?? { vi: "", en: "" }) || pick(data.eyebrow)}
                fill
                sizes="(min-width: 1440px) 1344px, 100vw"
                className={`object-cover transition-[filter] duration-500 ${started ? "blur-sm" : ""}`}
                style={{ objectPosition: data.poster?.src ? focalPosition(data.poster) : undefined }}
              />
            ) : (
              <ImagePlaceholder label={pick(data.eyebrow)} tone="dark" className="rounded-none border-none" />
            ))}
          {(!started || !loaded) && <div aria-hidden className="absolute inset-0 bg-[rgba(38,34,32,0.35)]" />}

          {started && <div ref={viewerBoxRef} className="absolute inset-0" />}

          {!started && (
            <button
              type="button"
              onClick={() => start(activeId || scenes[0].id, "section")}
              className="group absolute inset-0 flex cursor-pointer flex-col items-center justify-center gap-4 border-none bg-transparent"
            >
              <span className="flex h-18 w-18 items-center justify-center rounded-full border border-[rgba(250,247,242,0.8)] bg-[rgba(38,34,32,0.45)] backdrop-blur-sm transition-transform duration-300 group-hover:scale-110 md:h-22 md:w-22">
                <svg aria-hidden viewBox="0 0 24 24" className="ml-1 h-7 w-7 fill-[var(--color-warm-white)]">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
              <span className="rounded-xs bg-[var(--project-primary)] px-6 py-3 text-center font-ui text-[13px] font-bold tracking-[0.08em] text-[var(--project-primary-foreground)] uppercase">
                {pick(data.playLabel)}
              </span>
            </button>
          )}

          {started && !loaded && !failed && (
            <div role="status" className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-4">
              <span className="h-10 w-10 animate-spin rounded-full border-2 border-[rgba(250,247,242,0.3)] border-t-[var(--color-warm-white)]" />
              <span className="font-ui text-xs font-bold tracking-[0.1em] text-[var(--color-warm-white)] uppercase">
                {pick({ vi: "Đang tải tour 360°…", en: "Loading the 360° tour…" })}
              </span>
            </div>
          )}
          {failed && !loaded && (
            <div role="alert" className="absolute inset-0 flex items-center justify-center p-6 text-center font-body text-sm text-[var(--color-warm-white)]">
              {pick({ vi: "Không tải được tour 360° trên thiết bị này.", en: "The 360° tour couldn't load on this device." })}
            </div>
          )}

          {/* In fullscreen the controls below the frame are out of view. */}
          {started && isFull && (
            <div className="absolute inset-x-0 top-0 z-[3] flex flex-wrap items-start justify-between gap-2 p-3 pt-[calc(0.75rem+env(safe-area-inset-top,0px))]">
              {/* pl clears Pannellum's zoom buttons in the top-left corner */}
              <div className="flex flex-wrap gap-2 pl-10">
                {scenes.length > 1 &&
                  scenes.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => goTo(s.id)}
                      aria-pressed={s.id === activeId}
                      className={`${overlayBtn} ${s.id === activeId ? "border-[var(--color-warm-white)] bg-[rgba(250,247,242,0.92)] text-[var(--color-charcoal)]" : ""}`}
                    >
                      {sceneName(s)}
                    </button>
                  ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {gyroCapable && (
                  <button type="button" onClick={toggleGyro} aria-pressed={gyroOn} className={overlayBtn}>
                    {gyroLabel}
                  </button>
                )}
                <button type="button" onClick={toggleFullscreen} className={overlayBtn}>
                  <span aria-hidden>✕</span> {fullscreenLabel}
                </button>
              </div>
            </div>
          )}
        </div>

        {scenes.length > 1 && (
          <div className="mt-4 flex flex-wrap gap-2.5" role="group" aria-label={pick({ vi: "Các cảnh 360°", en: "360° scenes" })}>
            {scenes.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => goTo(s.id)}
                aria-pressed={s.id === activeId}
                className={`flex cursor-pointer items-center gap-3 rounded-xs border bg-[var(--color-warm-white)] p-1.5 pr-4 text-left transition-colors ${
                  s.id === activeId && started ? "border-[var(--project-accent)] ring-1 ring-[var(--project-accent)]" : "border-[var(--color-border)] hover:border-[var(--project-accent)]"
                }`}
              >
                <span className="relative block h-12 w-20 flex-none overflow-hidden rounded-[2px] bg-[var(--color-sand)]">
                  <Image src={s.src} alt="" fill sizes="80px" className="object-cover" />
                </span>
                <span className="font-ui text-xs font-bold tracking-[0.06em] text-[var(--color-charcoal)] uppercase">{sceneName(s)}</span>
              </button>
            ))}
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-between gap-5">
          <div className="flex min-w-60 flex-1 flex-col gap-4">
            {started && (
              <div className="flex flex-wrap gap-2.5">
                <button type="button" onClick={toggleFullscreen} className={secondaryBtn}>
                  {fullscreenLabel}
                </button>
                {gyroCapable && (
                  <button type="button" onClick={toggleGyro} aria-pressed={gyroOn} className={secondaryBtn}>
                    {gyroLabel}
                  </button>
                )}
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
