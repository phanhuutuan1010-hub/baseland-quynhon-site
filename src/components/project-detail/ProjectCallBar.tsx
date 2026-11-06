"use client";

import { useEffect, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { useLang } from "@/lib/i18n";
import { useZaloHref } from "@/components/QuickChatLink";
import { cleanTelHref, useProjectContact } from "./ProjectContact";
import { ChatIcon, PhoneIcon } from "./icons";

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
 * Mobile (<768px) call bar on every project page: "Gọi ngay" + the active
 * number (60%, project green) and "Zalo" (40%, light). Replaces the site-wide
 * StickyCta mobile bar on project routes. The body reserves 72px + safe-area
 * at the bottom on mobile ((site)/layout.tsx), so the 56px bar never covers
 * the last content.
 * Also tracks clicks on every [data-track] element on the page.
 */
export function ProjectCallBar({ projectSlug }: { projectSlug: string }) {
  const { phone, phoneHref } = useProjectContact();
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

  // Each button carries its own safe-area padding, so its colour runs to the
  // very bottom of the screen (no dark strip under the bar on iPhones).
  const btn =
    "flex flex-col items-center justify-center gap-0.5 px-3 pt-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom,0px))] min-h-[calc(56px+env(safe-area-inset-bottom,0px))] no-underline";

  return (
    <nav
      aria-label={pick({ vi: "Liên hệ nhanh", en: "Quick contact" })}
      aria-hidden={typing || undefined}
      className={`fixed inset-x-0 bottom-0 z-[90] flex transition-transform duration-200 md:hidden ${
        typing ? "pointer-events-none translate-y-full" : ""
      }`}
    >
      <a
        href={cleanTelHref(phoneHref)}
        data-track="click_call"
        data-track-pos="call_bar"
        className={`${btn} ${zaloHref ? "basis-3/5" : "flex-1"} border-t border-[var(--project-primary)] bg-[var(--project-primary)] text-[var(--project-primary-foreground)]`}
      >
        <span className="inline-flex items-center gap-2 font-ui text-[13px] font-bold tracking-[0.07em] uppercase">
          <PhoneIcon className="h-4 w-4 flex-none" />
          {pick({ vi: "Gọi ngay", en: "Call now" })}
        </span>
        <span className="font-body text-[12px] leading-none tracking-[0.02em] opacity-90">{phone}</span>
      </a>
      {zaloHref && (
        <a
          href={zaloHref}
          target="_blank"
          rel="noopener noreferrer"
          data-track="click_zalo"
          data-track-pos="call_bar"
          className={`${btn} basis-2/5 border-t border-[var(--color-border)] bg-[var(--color-warm-white)] text-[var(--project-primary-text)]`}
        >
          <span className="inline-flex items-center gap-2 font-ui text-[13px] font-bold tracking-[0.07em] uppercase">
            <ChatIcon className="h-4 w-4 flex-none" />
            Zalo
          </span>
        </a>
      )}
    </nav>
  );
}
