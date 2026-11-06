/**
 * Meta Pixel calls that are safe anywhere: before the pixel script has
 * loaded they are queued (window.__blPixelQ) and replayed by the init
 * snippet in components/Analytics.tsx; with no pixel configured they are
 * simply never sent. Never pass PII (name/phone/email) here.
 */
type FbqArgs = [string, string, Record<string, string | number>?];
type PixelWindow = Window & { fbq?: (...args: unknown[]) => void; __blPixelQ?: FbqArgs[] | null };

function call(args: FbqArgs) {
  if (typeof window === "undefined") return;
  const w = window as PixelWindow;
  if (w.fbq) w.fbq(...args);
  else if (w.__blPixelQ !== null) (w.__blPixelQ ??= []).push(args);
  if (process.env.NODE_ENV !== "production") console.debug("[pixel]", ...args);
}

/** Standard event: PageView, ViewContent, Contact, Lead… */
export function pixelTrack(event: string, params?: Record<string, string | number>) {
  call(params ? ["track", event, params] : ["track", event]);
}

/** Custom event: ClickZalo, View360… */
export function pixelTrackCustom(event: string, params?: Record<string, string | number>) {
  call(params ? ["trackCustom", event, params] : ["trackCustom", event]);
}
