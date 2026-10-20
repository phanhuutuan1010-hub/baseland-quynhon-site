"use client";

import { useCallback, useEffect, useRef, useState, type ComponentType } from "react";
import { trackEvent } from "@/lib/analytics";
import { LEAD_SUBMITTED_EVENT, LEAD_SUBMITTED_KEY } from "@/lib/useLeadForm";
import type { ProjectLeadPopup } from "@/lib/project-detail/types";
import { popupKeys, storageGet, storageSet } from "@/lib/leadPopupStorage";

// The dialog (form, validation, copy rendering) is only downloaded once a
// trigger fires — a plain import() at that moment, not next/dynamic (which
// fetched the chunk up front). Nothing renders before then, so it can't
// touch LCP or CLS.
type DialogComponent = ComponentType<React.ComponentProps<typeof import("./LeadPopupDialog").default>>;

const DAY = 86_400_000;
const RECHECK_MS = 2_000;

export type PopupTrigger = "time" | "scroll" | "exit";

/** Something else is already asking for the visitor's attention: a lead
 * modal or other modal dialog, the 360° tour, fullscreen, a form being
 * filled in, the page's own lead form on screen, or a scroll-locked
 * overlay (mobile menu). */
function otherOverlayOpen(leadInView: boolean): boolean {
  if (leadInView) return true;
  if (document.fullscreenElement) return true;
  if (document.querySelector('[role="dialog"][aria-modal="true"]')) return true;
  if (document.querySelector("#virtual-tour iframe")) return true;
  if (document.activeElement?.closest("form")) return true;
  if (document.body.style.overflow === "hidden") return true;
  return false;
}

/**
 * Lead pop-up triggers: after `delaySeconds`, OR after scrolling
 * `scrollPercent`% of the page, OR exit-intent (desktop only). At most once
 * per session; closing hides it for `dismissDays`; never again once this
 * visitor has sent any lead form. If a trigger fires while another overlay
 * is open, it waits until that overlay is gone.
 */
export function LeadPopupTrigger({
  data,
  projectSlug,
  phone,
  phoneHref,
}: {
  data: ProjectLeadPopup;
  projectSlug: string;
  phone: string;
  phoneHref: string;
}) {
  const [trigger, setTrigger] = useState<PopupTrigger | null>(null);
  const [open, setOpen] = useState(false);
  const [Dialog, setDialog] = useState<DialogComponent | null>(null);
  const leadInView = useRef(false);
  const keys = popupKeys(projectSlug);

  const eligible = useCallback(() => {
    if (storageGet("local", keys.submitted)) return false;
    if (storageGet("local", LEAD_SUBMITTED_KEY)) return false;
    if (storageGet("session", keys.shownThisSession)) return false;
    if (Number(storageGet("local", keys.dismissedUntil) || 0) > Date.now()) return false;
    return true;
  }, [keys.submitted, keys.shownThisSession, keys.dismissedUntil]);

  useEffect(() => {
    if (!eligible()) return;
    const isDesktop = () => window.matchMedia("(min-width: 768px) and (hover: hover)").matches;
    let pending: PopupTrigger | null = null;
    let done = false;
    let recheck = 0;

    const tryShow = () => {
      if (done || !pending) return;
      if (!eligible()) return cleanup();
      if (otherOverlayOpen(leadInView.current)) {
        if (!recheck) recheck = window.setInterval(tryShow, RECHECK_MS);
        return;
      }
      done = true;
      cleanup();
      const t = pending;
      import("./LeadPopupDialog")
        .then((m) => {
          storageSet("session", keys.shownThisSession, "1");
          setDialog(() => m.default);
          setTrigger(t);
          setOpen(true);
        })
        .catch(() => {}); // offline / chunk error: just skip the pop-up
    };
    const fire = (t: PopupTrigger) => {
      if (pending) return;
      pending = t;
      tryShow();
    };

    const timer = window.setTimeout(() => fire("time"), Math.max(0, data.delaySeconds) * 1000);
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max > 0 && (window.scrollY / max) * 100 >= data.scrollPercent) fire("scroll");
    };
    const onMouseOut = (e: MouseEvent) => {
      if (!e.relatedTarget && e.clientY <= 0 && isDesktop()) fire("exit");
    };
    const onLeadSubmitted = () => {
      done = true;
      cleanup();
    };
    const lead = document.getElementById("lead");
    const io = lead
      ? new IntersectionObserver(([entry]) => {
          leadInView.current = entry.isIntersecting;
        })
      : null;
    if (lead && io) io.observe(lead);

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("mouseout", onMouseOut);
    window.addEventListener(LEAD_SUBMITTED_EVENT, onLeadSubmitted);

    function cleanup() {
      window.clearTimeout(timer);
      if (recheck) window.clearInterval(recheck);
      recheck = 0;
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mouseout", onMouseOut);
      window.removeEventListener(LEAD_SUBMITTED_EVENT, onLeadSubmitted);
      io?.disconnect();
    }
    return cleanup;
  }, [data.delaySeconds, data.scrollPercent, eligible, keys.shownThisSession]);

  const handleClose = useCallback(
    (method: "button" | "esc" | "backdrop", submitted: boolean) => {
      setOpen(false);
      if (!submitted) storageSet("local", keys.dismissedUntil, String(Date.now() + data.dismissDays * DAY));
      trackEvent("popup_close", { project: projectSlug, method, submitted });
    },
    [data.dismissDays, keys.dismissedUntil, projectSlug],
  );

  if (!open || !trigger || !Dialog) return null;
  return (
    <Dialog
      data={data}
      projectSlug={projectSlug}
      trigger={trigger}
      phone={phone}
      phoneHref={phoneHref}
      onClose={handleClose}
    />
  );
}
