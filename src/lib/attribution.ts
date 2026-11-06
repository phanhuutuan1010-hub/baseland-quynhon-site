/**
 * Visitor attribution, browser-only: the `?ref=` code (which sales person
 * shared the link) and `utm_*` params (which ad brought the visitor). Both
 * are kept in localStorage for 30 days so a visitor who comes back later
 * still sees the same phone number and their lead is still attributed.
 * Every storage access is wrapped — private mode / blocked storage just
 * means attribution lasts for this page view only.
 */
const REF_KEY = "bl_ref";
const UTM_KEY = "bl_utm";
const TTL_MS = 30 * 86_400_000;
const UTM_PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;

export type Utm = Partial<Record<(typeof UTM_PARAMS)[number], string>>;
export type Attribution = { ref: string; utm: Utm };

type Stored<T> = { value: T; expires: number };

let memory: Attribution = { ref: "", utm: {} };

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

/** Reads ?ref= / utm_* from the current URL (a new value replaces the stored
 * one and restarts the 30 days), then returns the effective attribution. */
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
  if (Object.keys(urlUtm).length) write(UTM_KEY, urlUtm);

  memory = {
    ref: urlRef || read<string>(REF_KEY) || memory.ref,
    utm: Object.keys(urlUtm).length ? urlUtm : read<Utm>(UTM_KEY) || memory.utm,
  };
  return memory;
}

/** Attribution to send with a lead form (hidden fields). */
export function getAttribution(): Attribution {
  return captureAttribution();
}
