"use client";

import { useEffect, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { useLang } from "@/lib/i18n";
import { useZaloHref } from "@/components/QuickChatLink";
import { cleanTelHref, useProjectContact } from "./ProjectContact";

const TYPING_SELECTOR = 'input:not([type="checkbox"]):not([type="radio"]):not([type="hidden"]), textarea, select, [contenteditable="true"]';

/** True while the visitor is typing into a form field — the bar hides so it
 * never sits on top of the on-screen keyboard or the field itself. */
function useTyping() {
  const [typing, setTyping] = useState(false);
  useEffect(() => {
    const update = () => setTyping(!!document.activeElement?.matches(TYPING_SELECTOR));
    const onFocusOut = () => window.setTimeout(update, 0); // activeElement settles after focusout
    document.addEventListener("focusin", update);
    document.addEventListener("focusout", onFocusOut);
    return () => {
      document.removeEventListener("focusin", update);
      document.removeEventListener("focusout", onFocusOut);
    };
  }, []);
  return typing;
}

/**
 * Mobile (<768px) call bar on every project page: "Gọi ngay" (2/3, project
 * accent) + "Zalo" (1/3). Replaces the site-wide StickyCta mobile bar on
 * project routes. The body reserves 72px + safe-area at the bottom on mobile
 * ((site)/layout.tsx), so the ~52px bar never covers the last content.
 * Also tracks clicks on every [data-track] element on the page.
 */
export function ProjectCallBar({ projectSlug }: { projectSlug: string }) {
  const { phoneHref } = useProjectContact();
  const zaloHref = useZaloHref();
  const { pick } = useLang();
  const typing = useTyping();

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-track]");
      if (el?.dataset.track) trackEvent(el.dataset.track, { project: projectSlug });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [projectSlug]);

  const base =
    "flex min-h-[52px] items-center justify-center px-3 font-ui text-[13px] font-bold tracking-[0.07em] uppercase no-underline";

  return (
    <nav
      aria-label={pick({ vi: "Liên hệ nhanh", en: "Quick contact" })}
      aria-hidden={typing || undefined}
      className={`fixed inset-x-0 bottom-0 z-[90] flex border-t border-[rgba(250,245,238,0.18)] bg-[var(--color-deep-earth)] pb-[env(safe-area-inset-bottom,0px)] transition-transform duration-200 md:hidden ${
        typing ? "pointer-events-none translate-y-full" : ""
      }`}
    >
      <a
        href={cleanTelHref(phoneHref)}
        data-track="click_call"
        data-track-pos="call_bar"
        className={`${base} basis-2/3 bg-[var(--project-primary)] text-[var(--project-primary-foreground)]`}
      >
        {pick({ vi: "Gọi ngay", en: "Call now" })}
      </a>
      {zaloHref && (
        <a
          href={zaloHref}
          target="_blank"
          rel="noopener noreferrer"
          data-track="click_zalo"
          data-track-pos="call_bar"
          className={`${base} basis-1/3 border-l border-[rgba(250,245,238,0.2)] text-[var(--color-warm-white)]`}
        >
          Zalo
        </a>
      )}
    </nav>
  );
}
