"use client";

import { useEffect } from "react";
import { QTERRA_LAUNCH } from "@/lib/content/qterraLaunch";
import { trackEvent } from "@/lib/analytics";
import { useLang } from "@/lib/i18n";
import { cleanTelHref, useProjectContact } from "./ProjectContact";
import { QuickChatLink } from "@/components/QuickChatLink";

const c = QTERRA_LAUNCH;

/**
 * Q'Terra's mobile bottom bar (Gọi ngay | Tư vấn nhanh) — replaces the
 * site-wide StickyCta bar on this route — plus click tracking for every
 * [data-track] link on the page (incl. the "Giai đoạn mở bán" block). The
 * lead pop-up itself lives in LeadPopupTrigger (DB-driven).
 */
export function QterraQuickBar() {
  const { phoneHref } = useProjectContact();
  const { pick } = useLang();
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-track]");
      if (el?.dataset.track) trackEvent(el.dataset.track, { project: c.slug });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const barLinks = [
    { key: "call", href: cleanTelHref(phoneHref), label: c.bar.call, track: "click_call", primary: false },
  ];
  // The old separate Zalo button is gone: "Tư vấn nhanh" (VI) already opens Zalo.

  // Body already reserves 72px + safe-area padding on mobile (see
  // (site)/layout.tsx), so this ~52px bar never covers the page's last
  // content or buttons.
  return (
    <nav
      aria-label="Liên hệ nhanh"
      className="fixed inset-x-0 bottom-0 z-[90] flex border-t border-[rgba(250,245,238,0.18)] bg-[var(--color-deep-earth)] pb-[env(safe-area-inset-bottom,0px)] md:hidden"
    >
      {barLinks.map((l, i) => (
        <a
          key={l.key}
          href={l.href}
          data-track={l.track || undefined}
          {...(l.key === "zalo" ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className={`flex min-h-[52px] flex-1 items-center justify-center px-3 font-ui text-[13px] font-bold tracking-[0.07em] text-[var(--color-warm-white)] uppercase no-underline ${
            i > 0 ? "border-l border-[rgba(250,245,238,0.2)]" : ""
          } ${l.primary ? "bg-[var(--color-brand-green)]" : ""}`}
        >
          {pick(l.label)}
        </a>
      ))}
      <QuickChatLink
        className="flex min-h-[52px] flex-1 items-center justify-center border-l border-[rgba(250,245,238,0.2)] bg-[var(--color-brand-green)] px-3 font-ui text-[13px] font-bold tracking-[0.07em] text-[var(--color-warm-white)] uppercase no-underline"
      />
    </nav>
  );
}
