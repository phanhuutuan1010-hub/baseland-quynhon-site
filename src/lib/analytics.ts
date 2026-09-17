/**
 * Thin, swappable analytics hook — no analytics vendor is wired into the
 * site yet, so this pushes to `window.dataLayer` (the de-facto standard
 * queue GTM/GA4 and most tag managers already read from), which means
 * wiring a real vendor later is a script-tag addition, not a call-site
 * change. Never pass PII (name/phone/email) in `payload` — only
 * identifiers like project/video/position/language (see call sites in
 * ProjectVideoDuo).
 */
export function trackEvent(name: string, payload: Record<string, string | number | boolean> = {}) {
  if (typeof window === "undefined") return;
  const w = window as unknown as { dataLayer?: Record<string, unknown>[] };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event: name, ...payload });
  if (process.env.NODE_ENV !== "production") {
    console.debug(`[analytics] ${name}`, payload);
  }
}
