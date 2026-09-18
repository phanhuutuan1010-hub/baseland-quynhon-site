"use client";

import { useEffect, useRef, useState } from "react";
import { useLang } from "@/lib/i18n";
import type { Localized } from "@/lib/i18n";
import { Reveal } from "@/components/Reveal";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { LeadModal } from "@/components/LeadModal";
import { useViewportPlayback } from "@/lib/useViewportPlayback";
import { trackEvent } from "@/lib/analytics";
import { CONTACT_PHONE, CONTACT_PHONE_HREF } from "@/lib/content/nav";
import type {
  ProjectVideoDuo as ProjectVideoDuoData,
  ProjectVideoItem,
  ProjectAdvisor,
} from "@/lib/project-detail/types";

const DEFAULT_CTA_LABEL: Localized<string> = {
  vi: "Liên hệ ngay với TVBH",
  en: "Talk to a Sales Advisor",
};
const CONTENT_TYPE_LABEL: Record<
  ProjectVideoItem["contentType"],
  Localized<string>
> = {
  "project-update": { vi: "Cập nhật dự án", en: "Project Update" },
  "product-guide": { vi: "Tư vấn chọn căn", en: "Product Guide" },
  location: { vi: "Vị trí", en: "Location" },
  lifestyle: { vi: "Lifestyle", en: "Lifestyle" },
  amenities: { vi: "Tiện ích", en: "Amenities" },
  faq: { vi: "Hỏi đáp", en: "FAQ" },
  "sales-insight": { vi: "Góc nhìn tư vấn", en: "Sales Insight" },
};

/** Resolves which advisor a video's CTA should use: its own override, then
 * the section's primary (video 0) / secondary (video 1+) advisor, then
 * `null` — meaning "fall back to the branch contact" (mục 3). No project
 * currently configures a real advisor (see ProjectAdvisor's doc comment). */
function resolveAdvisor(
  video: ProjectVideoItem,
  index: number,
  data: ProjectVideoDuoData,
): ProjectAdvisor | null {
  if (video.advisor?.enabled) return video.advisor;
  const sectionFallback =
    index === 0
      ? data.primaryAdvisor
      : (data.secondaryAdvisor ?? data.primaryAdvisor);
  if (sectionFallback?.enabled) return sectionFallback;
  return null;
}

export function ProjectVideoDuo({
  id,
  data,
  projectSlug,
}: {
  id: string;
  data: ProjectVideoDuoData;
  projectSlug: string;
}) {
  const { pick } = useLang();
  const items = [...data.items]
    .filter((v) => v.enabled)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  // Empty state (mục 9): no enabled videos → hide the section entirely,
  // never render empty cards.
  if (items.length === 0) return null;

  const singleItem = items.length === 1;

  return (
    <section
      id={id}
      className="bg-[var(--project-background)] px-5 py-16 sm:px-8 sm:py-20 md:px-12 md:py-28"
    >
      <Reveal className="mx-auto max-w-[1440px]">
        <div className="mb-10 max-w-170 md:mb-14">
          <div className="mb-5 font-ui text-[length:var(--fs-label)] tracking-[var(--ls-label)] text-[var(--project-accent)] uppercase">
            {pick(data.eyebrow)}
          </div>
          <h2 className="m-0 mb-5 font-display text-[length:var(--fs-h1)] leading-[var(--lh-heading)] font-normal text-[var(--color-charcoal)]">
            {pick(data.headline)}
          </h2>
          {data.body && (
            <p className="m-0 font-body text-[length:var(--fs-body-lg)] leading-[var(--lh-body)] text-[var(--project-muted)]">
              {pick(data.body)}
            </p>
          )}
        </div>

        <div
          className={
            singleItem
              ? "mx-auto grid max-w-95 grid-cols-1"
              : "grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 md:gap-9"
          }
        >
          {items.map((video, i) => (
            <VideoStoryCard
              key={video.key}
              video={video}
              index={i}
              projectSlug={projectSlug}
              advisor={resolveAdvisor(video, i, data)}
              /* Subtle editorial offset (mục 2) — the second card sits a
                 touch lower on desktop, never more than a small nudge. */
              offsetClassName={!singleItem && i === 1 ? "md:mt-9" : undefined}
              revealDelayMs={i * 120}
            />
          ))}
        </div>
      </Reveal>
    </section>
  );
}

function VideoStoryCard({
  video,
  index,
  projectSlug,
  advisor,
  offsetClassName,
  revealDelayMs,
}: {
  video: ProjectVideoItem;
  index: number;
  projectSlug: string;
  advisor: ProjectAdvisor | null;
  offsetClassName?: string;
  revealDelayMs: number;
}) {
  const { pick, lang } = useLang();
  const { ref: viewportRef, inView } = useViewportPlayback<HTMLDivElement>(0.5);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [userPaused, setUserPaused] = useState(false);
  // Ground truth for the play/pause icon — separate from `userPaused`
  // (which only tracks the user's own intent, for shouldPlay below).
  // Autoplay-on-scroll can be silently blocked by the browser (common for
  // first-time visitors even when muted), which used to leave the icon
  // stuck showing "⏸" as if playing while the video never actually
  // started — nothing invited the visitor to tap it. Driving the icon from
  // the video element's real onPlay/onPause events instead means it always
  // shows "▶" whenever playback truly isn't happening, autoplay-blocked or
  // not.
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const impressionTracked = useRef(false);

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced) setReducedMotion(true);
  }, []);

  useEffect(() => {
    if (inView && !impressionTracked.current) {
      impressionTracked.current = true;
      trackEvent("project_video_impression", {
        project: projectSlug,
        video: video.topicSlug,
        position: index,
        language: lang,
      });
    }
  }, [inView, projectSlug, video.topicSlug, index, lang]);

  const shouldPlay =
    inView && !reducedMotion && !userPaused && !!video.videoUrl;

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (shouldPlay) {
      el.play().catch(() => {
        // Autoplay can be blocked by the browser even when muted (rare,
        // e.g. data-saver mode) — fail silently into the paused/poster
        // state rather than throwing, since the user can still hit play.
      });
    } else {
      el.pause();
    }
  }, [shouldPlay]);

  const contentTypeLabel = pick(CONTENT_TYPE_LABEL[video.contentType]);
  const ctaLabel = pick(video.ctaLabel ?? DEFAULT_CTA_LABEL);
  const callPhone = advisor?.phone ?? CONTACT_PHONE;
  const callHref = advisor?.phoneHref ?? CONTACT_PHONE_HREF;
  const leadSource = `project-video/${projectSlug}/${video.topicSlug}`;

  function handleCtaClick() {
    trackEvent("project_video_cta_click", {
      project: projectSlug,
      video: video.topicSlug,
      position: index,
      language: lang,
    });
    setModalOpen(true);
  }

  function handleCallClick() {
    trackEvent("project_video_call_click", {
      project: projectSlug,
      video: video.topicSlug,
      position: index,
      language: lang,
    });
  }

  function togglePlay() {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) {
      // A real click carries user activation, so this play() succeeds even
      // when the earlier autoplay-on-scroll attempt was blocked — must set
      // userPaused false too, or the [shouldPlay] effect above (still
      // seeing userPaused from before this click) immediately re-pauses
      // what the user just started playing.
      setUserPaused(false);
      el.play().catch(() => {});
      trackEvent("project_video_play", {
        project: projectSlug,
        video: video.topicSlug,
        position: index,
        language: lang,
      });
    } else {
      setUserPaused(true);
      el.pause();
      trackEvent("project_video_pause", {
        project: projectSlug,
        video: video.topicSlug,
        position: index,
        language: lang,
      });
    }
  }

  return (
    <>
      <Reveal delayMs={revealDelayMs} className={offsetClassName}>
        <div className="mb-4">
          <div className="mb-1.5 font-ui text-[11px] font-bold tracking-[0.1em] text-[var(--project-accent)] uppercase">
            {contentTypeLabel}
          </div>
          <h3 className="m-0 mb-1.5 font-display text-[clamp(1.15rem,2vw,1.5rem)] leading-[1.3] font-normal text-[var(--color-charcoal)]">
            {pick(video.title)}
          </h3>
          <p className="m-0 font-body text-sm leading-[var(--lh-body)] text-[var(--project-muted)]">
            {pick(video.description)}
          </p>
        </div>

        <div
          ref={viewportRef}
          className="relative aspect-9/16 h-auto w-full max-w-[26.75rem] overflow-hidden rounded-[16px] bg-[var(--project-dark)]"
        >
          {video.videoUrl ? (
            <>
              <video
                ref={videoRef}
                src={video.videoUrl}
                poster={video.posterUrl}
                muted={muted}
                loop
                playsInline
                preload="none"
                aria-label={pick(video.title)}
                className="h-full w-full object-cover"
                onTimeUpdate={(e) => {
                  const el = e.currentTarget;
                  if (el.duration) setProgress(el.currentTime / el.duration);
                }}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() =>
                  trackEvent("project_video_complete", {
                    project: projectSlug,
                    video: video.topicSlug,
                    position: index,
                    language: lang,
                  })
                }
              />
              {/* Progress bar — micro-detail, project-accent colored (mục 3). */}
              <div className="absolute inset-x-3 bottom-3 h-[3px] overflow-hidden rounded-full bg-[rgba(250,245,238,0.25)]">
                <div
                  className="h-full bg-[var(--project-accent)]"
                  style={{ width: `${Math.round(progress * 100)}%` }}
                />
              </div>
              {/* Minimal controls — play/pause + mute, bottom-right, dark
                translucent chip (mục 3: no heavy glassmorphism). */}
              <div className="absolute right-3 bottom-6 flex gap-2">
                <button
                  type="button"
                  onClick={togglePlay}
                  aria-label={pick(
                    isPlaying
                      ? { vi: "Tạm dừng video", en: "Pause video" }
                      : { vi: "Phát video", en: "Play video" },
                  )}
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-none bg-[rgba(23,19,15,0.55)] text-[var(--color-warm-white)] backdrop-blur-sm"
                >
                  {isPlaying ? "❚❚" : "▶"}
                </button>
                <button
                  type="button"
                  onClick={() => setMuted((m) => !m)}
                  aria-label={pick(
                    muted
                      ? { vi: "Bật tiếng", en: "Unmute" }
                      : { vi: "Tắt tiếng", en: "Mute" },
                  )}
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-none bg-[rgba(23,19,15,0.55)] text-[var(--color-warm-white)] backdrop-blur-sm"
                >
                  {muted ? "🔇" : "🔊"}
                </button>
              </div>
            </>
          ) : (
            <ImagePlaceholder
              label={pick({
                vi: `${pick(video.title)} — video đang được sản xuất`,
                en: `${pick(video.title)} — video in production`,
              })}
              tone="dark"
              className="rounded-none border-none"
            />
          )}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={handleCtaClick}
            className="inline-flex items-center rounded-xs border border-[var(--project-primary)] bg-[var(--project-primary)] px-7 py-3.5 font-ui text-[13px] font-bold tracking-[0.08em] text-[var(--project-primary-foreground)] uppercase hover:bg-[var(--project-primary-dark)]"
          >
            {ctaLabel}
          </button>
          <a
            href={callHref}
            onClick={handleCallClick}
            className="inline-flex items-center gap-1.5 font-ui text-[13px] font-bold tracking-[0.05em] text-[var(--color-charcoal)] uppercase no-underline hover:text-[var(--project-primary)]"
          >
            {pick({ vi: "Gọi ngay", en: "Call now" })} · {callPhone}
          </a>
        </div>
      </Reveal>

      <LeadModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        source={leadSource}
        prefillNeed={video.prefillNeed}
        contextNote={{
          vi: `Bạn đang hỏi về: “${pick(video.title)}”. Tư vấn viên sẽ liên hệ ngay khi nhận được yêu cầu.`,
          en: `You're asking about: “${pick(video.title)}”. A sales advisor will reach out as soon as your request is received.`,
        }}
      />
    </>
  );
}
