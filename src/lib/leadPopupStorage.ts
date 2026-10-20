// localStorage/sessionStorage helpers for the lead pop-up — every access
// is wrapped: storage can throw (private mode, blocked site data) and the
// pop-up must still work (it just can't remember being closed).
export function storageGet(store: "local" | "session", key: string): string | null {
  try {
    return (store === "local" ? localStorage : sessionStorage).getItem(key);
  } catch {
    return null;
  }
}

export function storageSet(store: "local" | "session", key: string, value: string) {
  try {
    (store === "local" ? localStorage : sessionStorage).setItem(key, value);
  } catch {}
}

export const popupKeys = (slug: string) => ({
  dismissedUntil: `lead_popup_${slug}_dismissed_until`,
  submitted: `lead_popup_${slug}_submitted`,
  shownThisSession: `lead_popup_${slug}_shown`,
});
