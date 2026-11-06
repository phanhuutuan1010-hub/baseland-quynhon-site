"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { useSiteContact } from "@/components/SiteContact";
import type { ProjectSectionAction } from "@/lib/project-detail/types";

/**
 * The one phone number for project pages — Settings hotline, or the ?ref=
 * person's number (see SiteContact). Every "Gọi ngay" link on a project
 * page reads it from here, so the header menu, CTA block, mobile bar and
 * section buttons can never show different numbers.
 */
export function useProjectContact() {
  return useSiteContact();
}

/** `tel:` links must not contain spaces ("tel:+84968 876 941" fails on
 * some phones). */
export function cleanTelHref(href: string) {
  return href.startsWith("tel:") ? href.replace(/[\s.()-]/g, "") : href;
}

const btn = {
  primary:
    "inline-flex min-h-12 items-center justify-center rounded-xs border border-[var(--project-primary)] bg-[var(--project-primary)] px-7 py-3.5 font-ui text-[13px] font-bold tracking-[0.08em] text-[var(--project-primary-foreground)] uppercase no-underline hover:bg-[var(--project-primary-dark)]",
  outline:
    "inline-flex min-h-12 items-center justify-center rounded-xs border border-[var(--project-accent)] bg-transparent px-7 py-3.5 font-ui text-[13px] font-bold tracking-[0.08em] text-[var(--color-charcoal)] uppercase no-underline hover:bg-[rgba(var(--project-accent-rgb),0.15)]",
  light:
    "inline-flex min-h-12 items-center justify-center rounded-xs border border-[var(--color-warm-white)] bg-[var(--color-warm-white)] px-7 py-3.5 font-ui text-[13px] font-bold tracking-[0.08em] text-[var(--color-charcoal)] uppercase no-underline hover:border-[var(--project-accent-light)] hover:bg-[var(--project-accent-light)]",
} as const;

const SHOW = {
  "md-up": "hidden md:block",
  "md-down": "md:hidden",
  "lg-up": "hidden lg:block",
  "lg-down": "lg:hidden",
} as const;

/** One section CTA (compact layout). `actionHref: "call"` dials the
 * hotline; renders nothing when the label is empty. `show` limits it to
 * one side of a breakpoint (a section places its CTA beside the heading on
 * desktop and full-width under the content on mobile). */
export function SectionAction({
  data,
  variant = "primary",
  show,
  className = "",
}: {
  data: ProjectSectionAction;
  variant?: keyof typeof btn;
  show?: keyof typeof SHOW;
  className?: string;
}) {
  const action = <SectionActionLink data={data} variant={variant} className={className} />;
  return show ? <div className={SHOW[show]}>{action}</div> : action;
}

function SectionActionLink({
  data,
  variant,
  className,
}: {
  data: ProjectSectionAction;
  variant: keyof typeof btn;
  className: string;
}) {
  const { pick } = useLang();
  const { phone, phoneHref } = useProjectContact();
  const label = data.actionLabel ? pick(data.actionLabel) : "";
  if (!label) return null;

  if (data.actionHref === "call") {
    return (
      <a href={cleanTelHref(phoneHref)} data-track="click_call" className={`${btn[variant]} ${className}`}>
        {label} · {phone}
      </a>
    );
  }
  return (
    <Link href={data.actionHref || "#lead"} className={`${btn[variant]} ${className}`}>
      {label}
    </Link>
  );
}
