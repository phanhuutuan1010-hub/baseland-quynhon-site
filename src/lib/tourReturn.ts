/**
 * "Welcome back" after an external 360° tour: opening the developer's tour
 * (new tab) marks this session; when the visitor comes back to the page,
 * TourReturnPrompt shows its card once per session. sessionStorage only —
 * a fresh visit starts clean. Every access is wrapped (private mode etc.).
 */
const openedKey = (slug: string) => `bl_tour_opened:${slug}`;
const shownKey = (slug: string) => `bl_tour_return_shown:${slug}`;

export function markTourOpened(slug: string) {
  try {
    sessionStorage.setItem(openedKey(slug), String(Date.now()));
  } catch {}
}

/** True once per session: the tour was opened and the card not yet shown. */
export function shouldShowTourReturn(slug: string): boolean {
  try {
    return !!sessionStorage.getItem(openedKey(slug)) && !sessionStorage.getItem(shownKey(slug));
  } catch {
    return false;
  }
}

export function markTourReturnShown(slug: string) {
  try {
    sessionStorage.setItem(shownKey(slug), "1");
  } catch {}
}
