import { QTERRA_LAUNCH } from "@/lib/content/qterraLaunch";

/**
 * "Giai đoạn mở bán" — server component (không "use client", không animation
 * reveal để CLS=0). Rendered by (site)/projects/[slug]/page.tsx and passed
 * into ProjectPage as a slot, so it stays server-rendered even though
 * ProjectPage itself is a client component.
 */
export function QterraLaunchSection() {
  const c = QTERRA_LAUNCH;
  const s = c.section;
  const steps = [
    {
      title: s.steps.register.title,
      body: s.steps.register.body,
      badge: c.BOOKING_ENABLED ? s.steps.register.badgeOpen : s.steps.register.badgeClosed,
    },
    { title: s.steps.launch.title, body: c.OPEN_DATE_TEXT + s.steps.launch.bodySuffix },
    { title: s.steps.inventory.title, body: s.steps.inventory.body },
  ];

  return (
    <section
      id="launch-phases"
      aria-labelledby="launch-phases-title"
      className="bg-[var(--project-surface)] px-5 py-16 sm:px-8 sm:py-20 md:px-12 md:py-24"
    >
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-10 max-w-[720px] md:mb-14">
          <div className="mb-5 font-ui text-[length:var(--fs-label)] tracking-[var(--ls-label)] text-[var(--project-accent-dark)] uppercase">
            {s.eyebrow}
          </div>
          <h2
            id="launch-phases-title"
            className="m-0 mb-5 font-display text-[length:var(--fs-h1)] leading-[var(--lh-heading)] font-normal text-[var(--color-charcoal)]"
          >
            {s.title}
          </h2>
          <p className="m-0 font-body text-[length:var(--fs-body-lg)] leading-[var(--lh-body)] text-[var(--color-text-muted)]">
            {s.description}
          </p>
        </div>

        <ol className="m-0 grid list-none grid-cols-1 gap-0 p-0 md:grid-cols-3 md:gap-8">
          {steps.map((step, i) => (
            <li key={step.title} className="relative flex gap-5 pb-9 last:pb-0 md:flex-col md:gap-0 md:pb-0">
              {/* Vertical connector on mobile, horizontal on desktop */}
              {i < steps.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute top-11 bottom-0 left-[21px] w-px bg-[var(--project-border)] md:top-[21px] md:right-[-2rem] md:bottom-auto md:left-11 md:h-px md:w-auto"
                />
              )}
              <span className="relative z-[1] flex h-11 w-11 flex-none items-center justify-center rounded-full border border-[var(--project-primary)] bg-[var(--color-warm-white)] font-ui text-sm font-bold text-[var(--project-primary-text)] md:mb-6">
                {i + 1}
              </span>
              <div className="min-w-0 pt-2 md:pt-0">
                <h3 className="m-0 mb-3 font-display text-[length:var(--fs-h3)] leading-[var(--lh-heading)] font-normal text-[var(--color-charcoal)]">
                  {step.title}
                </h3>
                <p className="m-0 font-body text-base leading-[var(--lh-body)] text-[var(--color-text-muted)]">
                  {step.body}
                </p>
                {step.badge && (
                  <span className="mt-4 inline-block rounded-full border border-[rgba(var(--project-primary-rgb),0.35)] bg-[var(--color-warm-white)] px-3.5 py-1.5 font-ui text-xs font-bold tracking-[0.04em] text-[var(--project-primary-text)]">
                    {step.badge}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ol>

        <p className="mt-10 mb-0 font-body text-sm text-[var(--color-text-muted)] md:mt-14">{s.note}</p>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href="#lead"
            className="inline-flex min-h-11 items-center rounded-xs border border-[var(--project-primary)] bg-[var(--project-primary)] px-7 py-3.5 font-ui text-[13px] font-bold tracking-[0.08em] text-[var(--project-primary-foreground)] uppercase no-underline hover:bg-[var(--project-primary-dark)]"
          >
            {s.ctaLead}
          </a>
          <a
            href={c.hotlineHref}
            data-track="click_call"
            className="inline-flex min-h-11 items-center rounded-xs border border-[var(--project-primary)] bg-transparent px-7 py-3.5 font-ui text-[13px] font-bold tracking-[0.08em] text-[var(--project-primary-text)] uppercase no-underline hover:bg-[rgba(var(--project-primary-rgb),0.08)]"
          >
            {s.ctaCall} · {c.hotlineDisplay}
          </a>
        </div>
      </div>
    </section>
  );
}
