"use client";

import Image from "next/image";
import { useLang } from "@/lib/i18n";
import { Reveal } from "@/components/Reveal";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { useInView } from "@/lib/useInView";
import type { ProjectPhotoStatement as ProjectPhotoStatementData } from "@/lib/project-detail/types";

const TONE_BG: Record<NonNullable<ProjectPhotoStatementData["tone"]>, string> = {
  charcoal: "var(--color-charcoal)",
  "ocean-blue": "var(--color-ocean-blue)",
};

/**
 * Full-bleed photo + statement section — shared by the "architecture" and
 * "views" section types (the two full-bleed photo moments in a project
 * story). `variant` controls layout only:
 *  - "architecture": taller (92vh), eyebrow+headline pinned top,
 *    body pinned bottom-right (justify-between).
 *  - "views": shorter (min(88vh,760px)), headline+sub both stacked at the
 *    bottom (justify-end), no eyebrow — matches Q'Terra's "Sea" section.
 *
 * Image motion (Q'Terra brief mục 10/18, Simona mục 17): a slow, precise
 * scale settle on scroll-into-view — "architecture" settles vertically
 * (a slight downward drift into place, echoing a vertical reveal),
 * "views" settles with a light horizontal drift. Both ~1.1s, CSS
 * transform/opacity only, and both skip straight to the resting state
 * under prefers-reduced-motion (useInView starts `true` there).
 */
export function ProjectPhotoStatement({
  id,
  data,
  variant,
}: {
  id?: string;
  data: ProjectPhotoStatementData;
  variant: "architecture" | "views";
}) {
  const { pick } = useLang();
  const tone = data.tone ?? "charcoal";
  const { ref: imageRef, inView } = useInView<HTMLDivElement>(0.1);

  const gradient =
    variant === "architecture"
      ? "linear-gradient(180deg, rgba(38,34,32,0.55) 0%, rgba(38,34,32,0.15) 45%, rgba(38,34,32,0.75) 100%)"
      : "linear-gradient(180deg, rgba(38,34,32,0.25) 0%, rgba(38,34,32,0.05) 50%, rgba(38,34,32,0.55) 100%)";

  const restTransform = variant === "architecture" ? "scale(1) translateY(0)" : "scale(1) translateX(0)";
  const startTransform = variant === "architecture" ? "scale(1.08) translateY(-16px)" : "scale(1.08) translateX(16px)";

  return (
    <section
      id={id}
      className={`relative w-full overflow-hidden ${variant === "architecture" ? "h-[92vh] min-h-[560px]" : "h-[min(88vh,760px)]"}`}
      style={{ background: TONE_BG[tone] }}
    >
      <div
        ref={imageRef}
        className="absolute inset-0"
        style={{
          transform: inView ? restTransform : startTransform,
          transition: "transform 1100ms var(--ease-editorial)",
        }}
      >
        {data.image ? (
          <Image src={data.image.src} alt={pick(data.image.alt)} fill className="object-cover" />
        ) : (
          <ImagePlaceholder
            label={pick(data.placeholderLabel ?? data.headline)}
            tone="dark"
            className="rounded-none border-none"
          />
        )}
      </div>
      <div className="absolute inset-0 pointer-events-none" style={{ background: gradient }} />

      {variant === "architecture" ? (
        <Reveal className="relative z-[2] mx-auto flex h-full max-w-[1440px] flex-col justify-between px-5 pt-22 pb-12 sm:px-8 md:px-12 md:pt-30 md:pb-16">
          <div>
            {data.eyebrow && (
              <div className="mb-5 font-ui text-[length:var(--fs-label)] tracking-[var(--ls-label)] text-[var(--project-accent-light)] uppercase">
                {pick(data.eyebrow)}
              </div>
            )}
            <h2 className="m-0 font-display text-[clamp(2.25rem,6vw,4.5rem)] leading-[1.1] font-normal text-[var(--color-warm-white)]">
              {pick(data.headline)}
            </h2>
          </div>
          <p className="m-0 max-w-[480px] self-end font-body text-[length:var(--fs-body-lg)] leading-[var(--lh-body)] text-[var(--color-sand)]">
            {pick(data.body)}
          </p>
        </Reveal>
      ) : (
        <Reveal className="relative z-[2] mx-auto flex h-full max-w-[1440px] flex-col justify-end px-5 py-12 sm:px-8 md:px-12 md:py-16">
          <h2 className="m-0 mb-5 max-w-[16ch] font-display text-[clamp(2rem,6.5vw,5rem)] leading-[1.05] font-normal text-[var(--color-warm-white)]">
            {pick(data.headline)}
          </h2>
          <p className="m-0 font-ui text-[13px] font-semibold tracking-[0.14em] text-[var(--color-sand)] uppercase">
            {pick(data.body)}
          </p>
        </Reveal>
      )}
    </section>
  );
}
