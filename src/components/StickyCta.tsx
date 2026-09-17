"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n";
import type { SiteChromeData } from "@/lib/siteChrome";

/** Fixed call/request-consultation bar — floating pill pair on desktop, a
 * two-up bottom bar on mobile. Mirrors the design bundle's ct-sticky-desktop
 * / ct-sticky-mobile treatment, applied site-wide rather than only on Contact. */
export function StickyCta({ data }: { data: SiteChromeData }) {
  const { pick } = useLang();

  return (
    <>
      <div className="fixed right-5 bottom-7 z-[90] hidden gap-2.5 sm:right-10 md:flex">
        <a
          href={data.contactPhoneHref}
          className="inline-flex items-center rounded-full border border-[var(--color-border)] bg-[var(--color-warm-white)] px-[22px] py-[13px] font-ui text-xs font-bold whitespace-nowrap text-[var(--color-charcoal)] uppercase no-underline shadow-[var(--shadow-md)] transition-colors hover:border-[var(--color-terracotta)]"
        >
          {data.contactPhone}
        </a>
        <Link
          href="/contact"
          className="inline-flex items-center rounded-full border border-[var(--color-brand-green)] bg-[var(--color-brand-green)] px-6 py-[13px] font-ui text-xs font-bold whitespace-nowrap text-[var(--color-warm-white)] uppercase no-underline shadow-[var(--shadow-md)] transition-colors hover:bg-[var(--color-brand-green-dark)]"
        >
          {pick(data.navCtaLabel)}
        </Link>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-[90] grid grid-cols-2 border-t border-[rgba(250,245,238,0.18)] bg-[var(--color-deep-earth)] pb-[env(safe-area-inset-bottom,0px)] md:hidden">
        <a
          href={data.contactPhoneHref}
          className="flex items-center justify-center border-r border-[rgba(250,245,238,0.2)] px-3 py-4 font-ui text-[13px] font-bold tracking-[0.07em] text-[var(--color-warm-white)] uppercase no-underline"
        >
          {pick({ vi: "Gọi ngay", en: "Call Now" })}
        </a>
        <Link
          href="/contact"
          className="flex items-center justify-center bg-[var(--color-brand-green)] px-3 py-4 font-ui text-[13px] font-bold tracking-[0.07em] text-[var(--color-warm-white)] uppercase no-underline"
        >
          {pick(data.navCtaLabel)}
        </Link>
      </div>
    </>
  );
}
