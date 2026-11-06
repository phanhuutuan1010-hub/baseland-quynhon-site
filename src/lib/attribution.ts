/**
 * Visitor attribution, browser-only: the `?ref=` code (which sales person
 * shared the link) and `utm_*` params (which ad brought the visitor). Both
 * are kept in localStorage for 30 days so a visitor who comes back later
 * still sees the same phone number and their lead is still attributed.
 * - ref: the latest ?ref= wins (the person who last shared the link).
 * - utm: FIRST touch — stored once, never overwritten while it is valid, so
 *   the ad that first brought the visitor keeps the credit. A lead form
 *   still sends the current URL's utm when it has one, else the stored one.
 * Every storage access is wrapped — private mode / blocked storage just
 * means attribution lasts for this page view only.
 */
const REF_KEY = "bl_ref";
const UTM_KEY = "bl_utm";
const TTL_MS = 30 * 86_400_000;
const UTM_PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_content"] as const;

export type Utm = Partial<Record<(typeof UTM_PARAMS)[number], string>>;
export type Attribution = { ref: string; utm: Utm };

type Stored<T> = { value: T; expires: number };

// In-memory copy too, for when localStorage is unavailable.
let memory: Attribution & { firstUtm?: Utm } = { ref: "", utm: {} };

function read<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const stored = JSON.parse(raw) as Stored<T>;
    if (!stored || typeof stored.expires !== "number" || stored.expires < Date.now()) {
      localStorage.removeItem(key);
      return null;
    }
    return stored.value;
  } catch {
    return null;
  }
}

function write<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify({ value, expires: Date.now() + TTL_MS } satisfies Stored<T>));
  } catch {}
}

/** Ref codes are short slugs ("phuoc", "tuan-01"); anything else is ignored. */
export function normalizeRef(raw: string | null | undefined) {
  const v = (raw ?? "").trim().toLowerCase();
  return /^[a-z0-9_-]{1,40}$/.test(v) ? v : "";
}

/** Reads ?ref= / utm_* from the current URL, stores them (ref: replaces;
 * utm: only when nothing is stored yet), then returns the attribution for
 * a lead: current URL's utm if any, else the stored first-touch utm. */
export function captureAttribution(): Attribution {
  if (typeof window === "undefined") return memory;
  const params = new URLSearchParams(window.location.search);

  const urlRef = normalizeRef(params.get("ref"));
  if (urlRef) write(REF_KEY, urlRef);

  const urlUtm: Utm = {};
  for (const key of UTM_PARAMS) {
    const v = params.get(key)?.trim();
    if (v) urlUtm[key] = v.slice(0, 100);
  }
  const hasUrlUtm = Object.keys(urlUtm).length > 0;
  const storedUtm = read<Utm>(UTM_KEY);
  if (hasUrlUtm && !storedUtm) write(UTM_KEY, urlUtm);

  memory = {
    ref: urlRef || read<string>(REF_KEY) || memory.ref,
    utm: hasUrlUtm ? urlUtm : storedUtm || memory.utm,
    firstUtm: storedUtm || memory.firstUtm || (hasUrlUtm ? urlUtm : undefined),
  };
  return { ref: memory.ref, utm: memory.utm };
}

/** First-touch utm_source / utm_content for Pixel event params ("" when
 * none) — splits FB vs Zalo visitors in Events Manager. */
export function pixelUtmParams() {
  captureAttribution();
  const utm = memory.firstUtm ?? memory.utm;
  return { utm_source: utm.utm_source ?? "", utm_content: utm.utm_content ?? "" };
}

/** Attribution to send with a lead form (hidden fields). */
export function getAttribution(): Attribution {
  return captureAttribution();
}
