"use client";

import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/lib/i18n";
import type { SiteChromeData } from "@/lib/siteChrome";

export function Footer({ data }: { data: SiteChromeData }) {
  const { pick } = useLang();

  return (
    <footer className="bg-[var(--color-charcoal)] px-5 pt-12 pb-8 sm:px-8 sm:pt-16 md:px-12 md:pt-20">
      <div className="mx-auto flex max-w-[1440px] flex-wrap justify-between gap-10 border-b border-[var(--color-border-on-dark)] pb-8">
        <div className="max-w-80">
          <div className="mb-5 flex items-center gap-3">
            <Image src={data.logoUrl || "/images/brand/icon-baseland.png"} alt="Base Land" width={54} height={24} className="h-6 w-auto" />
            <span className="font-ui text-[13px] font-semibold tracking-[0.1em] text-[var(--color-warm-white)] uppercase">
              Quy Nhơn
            </span>
          </div>
          {pick(data.contactAddress) && (
            <p className="m-0 font-body text-sm leading-[1.7] text-[var(--color-sand)] opacity-80">
              {pick(data.contactAddress)}
            </p>
          )}
        </div>
        {(data.contactPhone || data.contactEmail) && (
          <div className="flex flex-col gap-2.5 font-body text-sm text-[var(--color-sand)]">
            {data.contactPhone && (
              <a href={data.contactPhoneHref} className="text-[var(--color-sand)] no-underline">
                {data.contactPhone}
              </a>
            )}
            {data.contactEmail && (
              <a href={data.contactEmailHref} className="text-[var(--color-sand)] no-underline">
                {data.contactEmail}
              </a>
            )}
          </div>
        )}
        <div className="flex flex-col gap-2.5 font-ui text-[13px] tracking-[0.04em] uppercase">
          {data.navLinks.map((link) => {
            const label = pick(link.label);
            if (!label) return null;
            return (
              <Link key={link.href} href={link.href} className="text-[var(--color-sand)] no-underline opacity-75">
                {label}
              </Link>
            );
          })}
        </div>
      </div>
      <p className="mx-auto mt-5 flex max-w-[1440px] flex-wrap items-center gap-1.5 font-body text-[13px] text-[var(--color-sand)] opacity-55">
        {pick(data.footerCopyright)}
        {pick(data.footerCopyright) && <span aria-hidden>·</span>}
        <a href="https://zalo.me/0906051010" target="_blank" rel="noopener noreferrer" className="text-[var(--color-sand)] no-underline hover:opacity-80">
          Dev by Tuấn
        </a>
      </p>
    </footer>
  );
}
