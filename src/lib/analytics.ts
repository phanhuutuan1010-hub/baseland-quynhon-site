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

/** Tracks `project_360_open` when an outbound link points at the project's
 * 360° tour (Trust/Documents link lists) — no-op for any other link. */
export function trackTourLinkClick(href: string, tourUrl: string | undefined, project: string, source: string, language: string) {
  if (!tourUrl || normalizeUrl(href) !== normalizeUrl(tourUrl)) return;
  trackEvent("project_360_open", { project, mode: "new_tab", source, language });
}

export function trackEvent(name: string, payload: Record<string, string | number | boolean> = {}) {
  if (typeof window === "undefined") return;
  const w = window as unknown as { dataLayer?: Record<string, unknown>[] };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event: name, ...payload });
  if (process.env.NODE_ENV !== "production") {
    console.debug(`[analytics] ${name}`, payload);
  }
}
