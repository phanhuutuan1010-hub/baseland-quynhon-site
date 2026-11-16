"use client";

import Image from "next/image";
import { useLang } from "@/lib/i18n";
import { Reveal } from "@/components/Reveal";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { useInView } from "@/lib/useInView";
import type { ProjectPhotoStatement as ProjectPhotoStatementData } from "@/lib/project-detail/types";
import { Accent } from "@/components/Accent";
import { focalPosition } from "./imageFrame";

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
export function ProjectPhotoStatement(props: {
  id?: string;
  data: ProjectPhotoStatementData;
  /** "compact": one framed photo beside the headline + two sentences
   * (compact layout) instead of a full-bleed screen. */
  variant: "architecture" | "views" | "compact";
}) {
  if (props.variant === "compact") return <CompactPhotoStatement id={props.id} data={props.data} />;
  return <FullBleedPhotoStatement {...props} variant={props.variant} />;
}

function FullBleedPhotoStatement({
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
        {data.image?.src ? (
          <Image src={data.image.src} alt={pick(data.image.alt)} fill sizes="100vw" className="object-cover" style={{ objectPosition: focalPosition(data.image) }} />
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
              <Accent text={pick(data.headline)} onDark />
            </h2>
          </div>
          <p className="m-0 max-w-[480px] self-end font-body text-[length:var(--fs-body-lg)] leading-[var(--lh-body)] text-[var(--color-sand)]">
            <Accent text={pick(data.body)} onDark />
          </p>
        </Reveal>
      ) : (
        <Reveal className="relative z-[2] mx-auto flex h-full max-w-[1440px] flex-col justify-end px-5 py-12 sm:px-8 md:px-12 md:py-16">
          <h2 className="m-0 mb-5 max-w-[16ch] font-display text-[clamp(2rem,6.5vw,5rem)] leading-[1.05] font-normal text-[var(--color-warm-white)]">
            <Accent text={pick(data.headline)} onDark />
          </h2>
          <p className="m-0 font-ui text-[13px] font-semibold tracking-[0.14em] text-[var(--color-sand)] uppercase">
            <Accent text={pick(data.body)} onDark />
          </p>
        </Reveal>
      )}
    </section>
  );
}

/** Frame ratio of the compact photo: the image's own when it is landscape
 * (≥ 1.2), else 16:10. */
function compactFrame(img: object): string {
  const m = img as { width?: number; height?: number };
  return m.width && m.height && m.width / m.height >= 1.2 ? `${m.width} / ${m.height}` : "16 / 10";
}

function CompactPhotoStatement({ id, data }: { id?: string; data: ProjectPhotoStatementData }) {
  const { pick } = useLang();
  const facts = (data.facts ?? []).filter((f) => f.value?.trim());
  return (
    <section id={id} className="bg-[var(--color-warm-white)] px-5 py-14 sm:px-8 sm:py-16 md:px-12 md:py-20">
      <Reveal
        className={`mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-8 md:gap-14 ${data.image?.src ? "md:grid-cols-[1.35fr_1fr]" : ""}`}
      >
        {/* No photo yet → text only (no grey placeholder). */}
        {data.image?.src && (
          // Landscape photos keep their own ratio — nothing is cropped (a
          // logo or caption printed in the picture stays whole). Portrait /
          // square ones would tower over the text, so those keep the 16:10
          // frame, cropped around the focal point.
          <div
            className="relative overflow-hidden"
            style={{ aspectRatio: compactFrame(data.image), background: TONE_BG[data.tone ?? "charcoal"] }}
          >
            <Image src={data.image.src} alt={pick(data.image.alt)} fill sizes="(min-width: 768px) 58vw, 100vw" className="object-cover" style={{ objectPosition: focalPosition(data.image) }} />
          </div>
        )}
        <div>
          {data.eyebrow && (
            <div className="mb-4 font-ui text-[length:var(--fs-label)] tracking-[var(--ls-label)] text-[var(--project-accent-dark)] uppercase">
              {pick(data.eyebrow)}
            </div>
          )}
          <h2 className="m-0 mb-4 font-display text-[length:var(--fs-h2)] leading-[var(--lh-heading)] font-normal text-[var(--color-charcoal)]">
            <Accent text={pick(data.headline)} />
          </h2>
          <p className="m-0 max-w-120 font-body text-[length:var(--fs-body)] leading-[var(--lh-body)] text-[var(--color-text-muted)]">
            <Accent text={pick(data.body)} />
          </p>
          {facts.length > 0 && (
            <dl className="m-0 mt-7 flex max-w-120 flex-wrap gap-x-7 gap-y-5 border-t border-[rgba(var(--project-accent-rgb),0.35)] pt-6">
              {facts.map((f, i) => (
                <div key={i} className="flex min-w-16 flex-col-reverse">
                  <dt className="mt-1 font-ui text-[11px] leading-[1.4] font-bold tracking-[0.1em] text-[var(--color-text-muted)] uppercase">{pick(f.label)}</dt>
                  <dd className="m-0 font-display text-[clamp(1.5rem,2.4vw,2rem)] leading-none text-[var(--color-charcoal)] tabular-nums">{f.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </Reveal>
    </section>
  );
}
