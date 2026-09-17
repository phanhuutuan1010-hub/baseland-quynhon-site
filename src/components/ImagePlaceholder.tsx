/**
 * Stand-in for a real photo that hasn't been supplied yet. The design
 * bundle used a `<image-slot>` design-tool widget for these; production has
 * no CMS/photo library behind it yet, so this renders an honest "photo
 * needed" placeholder in the site's own palette instead of inventing stock
 * imagery. Swap the `<Image>` in once real photography is available.
 */
export function ImagePlaceholder({
  label,
  className = "",
  shape = "rect",
  tone = "light",
}: {
  label: string;
  className?: string;
  shape?: "rect" | "circle";
  /** 'dark' reads as a moody, unlit photo — use it wherever the placeholder
   * sits under light text (hero backgrounds, dark sections) so copy stays
   * legible instead of washing out against a light placeholder tile. */
  tone?: "light" | "dark";
}) {
  // Text is always full-opacity (WCAG AA 4.5:1) — even full-strength Clay
  // only reaches 3.37:1 against Sand, so the light tone reads in Deep Earth
  // instead; borders stay tinted/reduced since decorative dashed borders
  // aren't subject to the same text-contrast requirement.
  const toneClass =
    tone === "dark"
      ? "border-[var(--color-sand)]/25 bg-[var(--color-deep-earth)] text-[var(--color-sand)]"
      : "border-[var(--color-clay)]/40 bg-[var(--color-sand)] text-[var(--color-deep-earth)]";

  return (
    <div
      className={`flex h-full w-full items-center justify-center border border-dashed p-4 text-center ${toneClass} ${
        shape === "circle" ? "rounded-full" : "rounded-xs"
      } ${className}`}
    >
      <span className="font-ui text-xs leading-snug tracking-[0.04em]">{label}</span>
    </div>
  );
}
