/**
 * Layout rules for project images (see CLAUDE.md "Quy tắc layout bắt
 * buộc"). The mapper attaches `width/height/focalX/focalY` to every image
 * it can resolve (lib/server/imageMeta.ts); these helpers read them.
 */
type Meta = { width?: unknown; height?: unknown; focalX?: unknown; focalY?: unknown };
type WithMeta = object | null | undefined;

/** `aspect-ratio` from the image's real size; `fallback` (e.g. "4 / 3")
 * only while the size is unknown. Use for posters, maps, plans. */
export function frameRatio(img: WithMeta, fallback: string): string {
  const m = (img ?? {}) as Meta;
  const w = Number(m.width);
  const h = Number(m.height);
  return w > 0 && h > 0 ? `${w} / ${h}` : fallback;
}

/** `object-position` for an `object-cover` (background) photo, anchored on
 * the Media focal point (centre by default). */
export function focalPosition(img: WithMeta): string {
  const m = (img ?? {}) as Meta;
  const x = Number(m.focalX ?? 0.5);
  const y = Number(m.focalY ?? 0.5);
  return `${Math.round(x * 100)}% ${Math.round(y * 100)}%`;
}
