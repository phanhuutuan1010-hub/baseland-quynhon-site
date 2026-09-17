"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useLang } from "@/lib/i18n";
import type { SiteChromeData } from "@/lib/siteChrome";

export function Nav({ data }: { data: SiteChromeData }) {
  const [solid, setSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { lang, setLang, pick } = useLang();
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const textColor = solid ? "text-[var(--color-charcoal)]" : "text-[var(--color-warm-white)]";

  return (
    <>
      <nav
        className={`fixed inset-x-0 top-0 z-[100] flex items-center justify-between px-5 py-4 transition-colors duration-[480ms] sm:px-8 md:px-12 ${
          solid
            ? "border-b border-[var(--color-border)] bg-[var(--color-warm-white)]"
            : "border-b border-transparent bg-transparent"
        }`}
        style={{ transitionTimingFunction: "var(--ease-editorial)" }}
      >
        <Link href="/" className="flex items-center gap-3 no-underline">
          <Image src="/images/brand/icon-baseland.png" alt="Base Land Quy Nhơn — về trang chủ" width={54} height={24} className="h-6 w-auto" priority />
          <span className={`font-ui text-[13px] font-semibold tracking-[0.1em] uppercase whitespace-nowrap ${textColor}`}>
            Quy Nhơn
          </span>
        </Link>

        <div className="hidden items-center gap-5 lg:flex">
          {data.navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`font-ui text-xs font-semibold tracking-[0.07em] uppercase no-underline transition-opacity hover:text-[var(--color-brand-green)] hover:opacity-100 ${textColor}`}
                style={{ opacity: active ? 1 : 0.85 }}
              >
                {pick(link.label)}
              </Link>
            );
          })}
          <div
            className="flex shrink-0 items-center overflow-hidden rounded-full border"
            style={{ borderColor: solid ? "var(--color-border)" : "rgba(250,245,238,0.4)" }}
          >
            <LangButton active={lang === "vi"} onClick={() => setLang("vi")} label="VI" ariaLabel="Tiếng Việt" light={!solid} />
            <LangButton active={lang === "en"} onClick={() => setLang("en")} label="EN" ariaLabel="English" light={!solid} />
          </div>
          <Link
            href="/contact"
            className="shrink-0 rounded-xs border border-[var(--color-brand-green)] bg-[var(--color-brand-green)] px-[22px] py-[11px] font-ui text-xs font-bold whitespace-nowrap tracking-[0.06em] text-[var(--color-warm-white)] uppercase no-underline transition-colors hover:border-[var(--color-brand-green-dark)] hover:bg-[var(--color-brand-green-dark)]"
          >
            {pick(data.navCtaLabel)}
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={pick({ vi: "Mở menu", en: "Open menu" })}
          className="flex flex-col gap-[5px] border-none bg-transparent p-2 lg:hidden"
        >
          <span className="block h-[2px] w-6" style={{ background: solid ? "var(--color-charcoal)" : "var(--color-warm-white)" }} />
          <span className="block h-[2px] w-6" style={{ background: solid ? "var(--color-charcoal)" : "var(--color-warm-white)" }} />
        </button>
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 z-[200] flex flex-col overflow-y-auto bg-[var(--color-deep-earth)] px-5 py-6 sm:px-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center overflow-hidden rounded-full border border-[rgba(250,245,238,0.3)]">
              <LangButton active={lang === "vi"} onClick={() => setLang("vi")} label="VI" ariaLabel="Tiếng Việt" light />
              <LangButton active={lang === "en"} onClick={() => setLang("en")} label="EN" ariaLabel="English" light />
            </div>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label={pick({ vi: "Đóng menu", en: "Close menu" })}
              className="border-none bg-transparent text-3xl leading-none text-[var(--color-warm-white)]"
            >
              ×
            </button>
          </div>
          <div className="mt-12 flex flex-col gap-6">
            {data.navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-display text-[28px] text-[var(--color-warm-white)] no-underline"
              >
                {pick(link.label)}
              </Link>
            ))}
          </div>
          <div className="mt-12 flex flex-col gap-2.5 font-body text-[15px] text-[var(--color-sand)]">
            <a href={data.contactPhoneHref} className="text-[var(--color-sand)] no-underline">
              {data.contactPhone}
            </a>
            <a href={data.contactEmailHref} className="text-[var(--color-sand)] no-underline">
              {data.contactEmail}
            </a>
          </div>
        </div>
      )}
    </>
  );
}

function LangButton({
  active,
  onClick,
  label,
  ariaLabel,
  light,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  ariaLabel: string;
  /** Inactive-state text color context: `true` when the button sits over a
   * transparent/dark backdrop (needs light text), `false`/omitted when it
   * sits on a solid light surface (needs dark text). Deliberately never
   * falls through to `color: inherit` — that silently inherited the page's
   * default body text color (charcoal) regardless of what was actually
   * behind the button, which went invisible (~1.2:1 contrast) whenever the
   * transparent desktop nav sat over a dark hero. */
  light?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className="cursor-pointer border-none px-3 py-[7px] font-ui text-[11px] font-bold tracking-[0.06em]"
      style={{
        background: active ? "var(--color-brand-green)" : "transparent",
        color: active ? "var(--color-warm-white)" : light ? "var(--color-warm-white)" : "var(--color-charcoal)",
      }}
    >
      {label}
    </button>
  );
}
