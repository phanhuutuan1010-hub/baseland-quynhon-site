"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useLang } from "@/lib/i18n";
import { CONTACT_EMAIL, CONTACT_EMAIL_HREF, CONTACT_PHONE, CONTACT_PHONE_HREF } from "@/lib/content/nav";
import { getProjectNavItems, type ProjectDetailData } from "@/lib/project-detail/types";

/**
 * Per-project anchor navigation (Q'Terra: Q'Terra / Vị trí / Kiến trúc /
 * Căn hộ / Mặt bằng / Tiện ích / Đầu tư / Liên hệ) — replaces the shared
 * site Nav specifically on `/projects/[slug]` project detail pages (see
 * SiteChrome). The anchor list is derived per-project from
 * getProjectNavItems, so a project with fewer sections gets a
 * proportionally shorter nav with no extra config.
 */
export function ProjectNav({ project }: { project: ProjectDetailData }) {
  const [solid, setSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { lang, setLang, pick } = useLang();
  const navItems = getProjectNavItems(project);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
    <div data-project-theme={project.theme}>
      <nav
        className={`fixed inset-x-0 top-0 z-[100] flex items-center justify-between gap-6 px-5 py-4 transition-colors duration-[480ms] sm:px-8 md:px-12 ${
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

        <div className="hidden min-w-0 items-center gap-3 2xl:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`shrink-0 font-ui text-xs font-semibold tracking-[0.07em] whitespace-nowrap uppercase no-underline opacity-85 transition-opacity hover:text-[var(--project-primary)] hover:opacity-100 ${textColor}`}
            >
              {pick(item.label)}
            </a>
          ))}
          <div
            className="flex shrink-0 items-center overflow-hidden rounded-full border"
            style={{ borderColor: solid ? "var(--color-border)" : "rgba(250,245,238,0.4)" }}
          >
            <LangButton active={lang === "vi"} onClick={() => setLang("vi")} label="VI" ariaLabel="Tiếng Việt" light={!solid} />
            <LangButton active={lang === "en"} onClick={() => setLang("en")} label="EN" ariaLabel="English" light={!solid} />
          </div>
          <a
            href="#lead"
            className="shrink-0 rounded-xs border border-[var(--project-primary)] bg-[var(--project-primary)] px-[22px] py-[11px] font-ui text-xs font-bold whitespace-nowrap tracking-[0.06em] text-[var(--project-primary-foreground)] uppercase no-underline transition-colors hover:border-[var(--project-primary-dark)] hover:bg-[var(--project-primary-dark)]"
          >
            {pick(project.hero.ctaConsultLabel)}
          </a>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={pick({ vi: "Mở menu", en: "Open menu" })}
          className="flex flex-col gap-[5px] border-none bg-transparent p-2 2xl:hidden"
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
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="font-display text-[28px] text-[var(--color-warm-white)] no-underline"
              >
                {pick(item.label)}
              </a>
            ))}
          </div>
          <div className="mt-12 flex flex-col gap-2.5 font-body text-[15px] text-[var(--color-sand)]">
            <a href={CONTACT_PHONE_HREF} className="text-[var(--color-sand)] no-underline">
              {CONTACT_PHONE}
            </a>
            <a href={CONTACT_EMAIL_HREF} className="text-[var(--color-sand)] no-underline">
              {CONTACT_EMAIL}
            </a>
          </div>
        </div>
      )}
    </div>
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
  /** See Nav.tsx's LangButton for why this never falls through to `color:
   * inherit` — that silently inherited the page's default body text color
   * regardless of what was actually behind the button, going invisible
   * whenever the transparent desktop nav sat over a dark hero. */
  light?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className="cursor-pointer border-none px-3 py-[7px] font-ui text-[11px] font-bold tracking-[0.06em]"
      style={{
        background: active ? "var(--project-primary)" : "transparent",
        color: active ? "var(--project-primary-foreground)" : light ? "var(--color-warm-white)" : "var(--color-charcoal)",
      }}
    >
      {label}
    </button>
  );
}
