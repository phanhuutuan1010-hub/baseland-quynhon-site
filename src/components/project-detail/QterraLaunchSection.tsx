import Image from "next/image";
import { QTERRA_LAUNCH } from "@/lib/content/qterraLaunch";

/**
 * "Giai đoạn mở bán" — server component (không "use client", không animation
 * reveal để CLS=0). Rendered by (site)/projects/[slug]/page.tsx and passed
 * into ProjectPage as a slot, so it stays server-rendered even though
 * ProjectPage itself is a client component. `bgImage` is a project photo
 * used as a faint, decorative backdrop (fill + fixed section size → no CLS).
 */
export function QterraLaunchSection({ bgImage }: { bgImage?: string }) {
  const c = QTERRA_LAUNCH;
  const s = c.section;
  const steps = [
    { title: s.steps.register.title, body: s.steps.register.body },
    { title: s.steps.launch.title, body: c.OPEN_DATE_TEXT + s.steps.launch.bodySuffix, tag: s.stepTag },
    { title: s.steps.inventory.title, body: s.steps.inventory.body },
  ];

  return (
    <section
      id="launch-phases"
      aria-labelledby="launch-phases-title"
      className="relative isolate overflow-hidden bg-[var(--project-dark-alt)] px-5 py-18 sm:px-8 sm:py-22 md:px-12 md:py-28"
    >
      {bgImage && (
        <Image src={bgImage} alt="" fill sizes="100vw" className="-z-20 object-cover opacity-40" aria-hidden="true" />
      )}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 85% 10%, rgba(var(--project-accent-rgb),0.45) 0%, transparent 60%), linear-gradient(180deg, rgba(20,16,14,0.62) 0%, rgba(20,16,14,0.9) 100%)",
        }}
      />

      <div className="mx-auto max-w-[1440px]">
        {/* Header: title + big launch date */}
        <div className="mb-12 grid grid-cols-1 items-end gap-10 md:mb-18 md:grid-cols-[1.25fr_1fr] md:gap-16">
          <div>
            <div className="mb-5 flex items-center gap-3 font-ui text-[length:var(--fs-label)] tracking-[var(--ls-label)] text-[var(--project-accent-light)] uppercase">
              <span aria-hidden="true" className="h-px w-10 bg-[var(--project-accent-light)]" />
              {s.eyebrow}
            </div>
            <h2
              id="launch-phases-title"
              className="m-0 mb-6 font-display text-[clamp(2.5rem,6vw,4.75rem)] leading-[1.02] font-normal text-[var(--color-warm-white)]"
            >
              {s.title}
            </h2>
            <p className="m-0 max-w-[560px] font-body text-[length:var(--fs-body-lg)] leading-[var(--lh-body)] text-[var(--color-sand)]">
              {s.description}
            </p>
          </div>

          <div className="relative rounded-sm border border-[rgba(250,245,238,0.18)] bg-[rgba(250,245,238,0.06)] p-6 backdrop-blur-sm sm:p-8">
            <span
              aria-hidden="true"
              className="absolute top-0 left-6 h-[3px] w-16 bg-[var(--project-accent-light)] sm:left-8"
            />
            <div className="mb-3 font-ui text-xs font-bold tracking-[0.14em] text-[var(--project-accent-light)] uppercase">
              {s.dateLabel}
            </div>
            <div className="font-display text-[clamp(3rem,8vw,5.5rem)] leading-none text-[var(--color-warm-white)] tabular-nums">
              {c.OPEN_DATE}
            </div>
            <p className="m-0 mt-4 font-body text-sm text-[rgba(233,220,199,0.75)]">{s.dateCaption}</p>
          </div>
        </div>

        {/* Steps */}
        <ol className="m-0 grid list-none grid-cols-1 gap-4 p-0 md:grid-cols-3 md:gap-6">
          {steps.map((step, i) => {
            const highlight = !!step.tag;
            return (
              <li
                key={step.title}
                className={`relative flex flex-col rounded-sm border p-6 transition-colors sm:p-8 ${
                  highlight
                    ? "border-[var(--project-accent-light)] bg-[rgba(250,245,238,0.1)]"
                    : "border-[rgba(250,245,238,0.14)] bg-[rgba(250,245,238,0.04)] hover:border-[rgba(250,245,238,0.3)]"
                }`}
              >
                <div className="mb-6 flex items-center justify-between gap-3">
                  <span
                    className={`relative z-[1] flex h-12 w-12 items-center justify-center rounded-full font-ui text-sm font-bold ${
                      highlight
                        ? "bg-[var(--project-accent-light)] text-[var(--project-dark-alt)]"
                        : "border border-[rgba(250,245,238,0.35)] bg-[var(--project-dark-alt)] text-[var(--color-warm-white)]"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {step.tag && (
                    <span className="rounded-full bg-[rgba(250,245,238,0.12)] px-3 py-1 font-ui text-[11px] font-bold tracking-[0.1em] text-[var(--project-accent-light)] uppercase">
                      {step.tag}
                    </span>
                  )}
                </div>
                <h3 className="m-0 mb-3 font-display text-[clamp(1.5rem,2.4vw,2rem)] leading-[var(--lh-heading)] font-normal text-[var(--color-warm-white)]">
                  {step.title}
                </h3>
                <p className="m-0 font-body text-[15px] leading-[var(--lh-body)] text-[rgba(233,220,199,0.85)]">
                  {step.body}
                </p>
              </li>
            );
          })}
        </ol>

        {/* CTAs */}
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap md:mt-14">
          <a
            href="#lead"
            className="inline-flex min-h-12 items-center justify-center rounded-xs border border-[var(--color-warm-white)] bg-[var(--color-warm-white)] px-8 py-4 font-ui text-[13px] font-bold tracking-[0.08em] text-[var(--color-charcoal)] uppercase no-underline transition-colors hover:border-[var(--project-accent-light)] hover:bg-[var(--project-accent-light)]"
          >
            {s.ctaLead} →
          </a>
          <a
            href={c.hotlineHref}
            data-track="click_call"
            className="inline-flex min-h-12 items-center justify-center rounded-xs border border-[rgba(250,245,238,0.45)] bg-transparent px-8 py-4 font-ui text-[13px] font-bold tracking-[0.08em] text-[var(--color-warm-white)] uppercase no-underline transition-colors hover:border-[var(--color-warm-white)] hover:bg-[rgba(250,245,238,0.08)]"
          >
            {s.ctaCall} · {c.hotlineDisplay}
          </a>
          {c.ZALO_URL && (
            <a
              href={c.ZALO_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-track="click_zalo"
              className="inline-flex min-h-12 items-center justify-center rounded-xs border border-[rgba(250,245,238,0.45)] bg-transparent px-8 py-4 font-ui text-[13px] font-bold tracking-[0.08em] text-[var(--color-warm-white)] uppercase no-underline transition-colors hover:border-[var(--color-warm-white)] hover:bg-[rgba(250,245,238,0.08)]"
            >
              {s.ctaZalo}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
