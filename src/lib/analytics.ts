import { pixelTrackCustom } from "@/lib/pixel";
import { pixelUtmParams } from "@/lib/attribution";
import { markTourOpened } from "@/lib/tourReturn";

/**
 * Thin, swappable analytics hook — no analytics vendor is wired into the
 * site yet, so this pushes to `window.dataLayer` (the de-facto standard
 * queue GTM/GA4 and most tag managers already read from), which means
 * wiring a real vendor later is a script-tag addition, not a call-site
 * change. Never pass PII (name/phone/email) in `payload` — only
 * identifiers like project/video/position/language (see call sites in
 * ProjectVideoDuo).
 */
const normalizeUrl = (u: string) => u.trim().replace(/\/+$/, "").toLowerCase();

/** Tracks `tour_external_open` when an outbound link points at the
 * project's 360° tour (Trust/Documents link lists) and arms the "welcome
 * back" card — no-op for any other link. */
export function trackTourLinkClick(href: string, tourUrl: string | undefined, project: string, source: string, language: string) {
  if (!tourUrl || normalizeUrl(href) !== normalizeUrl(tourUrl)) return;
  markTourOpened(project);
  trackEvent("tour_external_open", { project, source, language });
}

export function trackEvent(name: string, payload: Record<string, string | number | boolean> = {}) {
  if (typeof window === "undefined") return;
  // Every way of opening a project's 360° tour funnels through here.
  // (tour_external_open = developer's tour in a new tab, tour_open = self-hosted scenes)
  if (name === "tour_external_open" || name === "tour_open") pixelTrackCustom("View360", { project: String(payload.project ?? ""), source: String(payload.source ?? ""), ...pixelUtmParams() });
  const w = window as unknown as { dataLayer?: Record<string, unknown>[] };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event: name, ...payload });
  if (process.env.NODE_ENV !== "production") {
    console.debug(`[analytics] ${name}`, payload);
  }
}
