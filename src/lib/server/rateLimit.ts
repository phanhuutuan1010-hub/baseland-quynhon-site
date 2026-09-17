import "server-only";

// Best-effort, in-memory sliding-window limiter for admin mutation endpoints.
// On serverless this map is per-instance (not shared across regions/cold
// starts), so it is defense-in-depth only — the authoritative control for
// login is the DB-backed per-account lockout in src/lib/server/auth.ts,
// which works correctly regardless of how many instances are running.
const hits = new Map<string, number[]>();

export function isRateLimited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const timestamps = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  timestamps.push(now);
  hits.set(key, timestamps);
  return timestamps.length > limit;
}
