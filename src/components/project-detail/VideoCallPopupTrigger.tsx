"use client";

import { useCallback, useEffect, useState, type ComponentType } from "react";
import { pixelTrackCustom } from "@/lib/pixel";
import { LEAD_SUBMITTED_EVENT, LEAD_SUBMITTED_KEY } from "@/lib/useLeadForm";
import type { ProjectVideoCallPopup } from "@/lib/project-detail/types";
import { CONTACT_CLICKED_KEY, popupKeys, storageGet, storageSet, videoCallPopupKeys } from "@/lib/leadPopupStorage";

// Dialog code is fetched with import() only when the pop-up is about to
// show — nothing renders before then (no effect on LCP/CLS).
type DialogComponent = ComponentType<React.ComponentProps<typeof import("./VideoCallPopupDialog").default>>;

const HOUR = 3_600_000;
const RECHECK_MS = 2_000;

/** Another overlay or a form in use — wait instead of interrupting. */
function busy(): boolean {
  if (document.fullscreenElement) return true;
  if (document.querySelector('[role="dialog"][aria-modal="true"]')) return true;
  if (document.querySelector("#tour-360 iframe:not([hidden]), #virtual-tour iframe:not([hidden])")) return true;
  if (document.activeElement?.closest("form")) return true;
  if (document.body.style.overflow === "hidden") return true;
  return false;
}

/**
 * "Xem thực địa qua video Zalo" pop-up. Shows once the visitor scrolls
 * `scrollPercent`% of the page OR #kiem-chung / the footer comes into view.
 * Never shows if, in this session, the visitor already clicked a tel:/Zalo
 * link, or already saw this or the lead pop-up; never after any lead form
 * was sent; closing hides it for `dismissHours`.
 */
export function VideoCallPopupTrigger({ data, projectSlug }: { data: ProjectVideoCallPopup; projectSlug: string }) {
  const [Dialog, setDialog] = useState<DialogComponent | null>(null);
  const [open, setOpen] = useState(false);
  const keys = videoCallPopupKeys(projectSlug);

  const eligible = useCallback(() => {
    if (storageGet("session", CONTACT_CLICKED_KEY)) return false;
    if (storageGet("local", LEAD_SUBMITTED_KEY)) return false;
    if (storageGet("local", keys.submitted)) return false;
    if (storageGet("session", keys.shownThisSession)) return false;
    // One pop-up per session: the lead pop-up already had its turn.
    if (storageGet("session", popupKeys(projectSlug).shownThisSession)) return false;
    if (Number(storageGet("local", keys.dismissedUntil) || 0) > Date.now()) return false;
    return true;
  }, [keys.submitted, keys.shownThisSession, keys.dismissedUntil, projectSlug]);

  useEffect(() => {
    if (!eligible()) return;
    let fired = false;
    let done = false;
    let recheck = 0;

    const tryShow = () => {
      if (done || !fired) return;
      if (!eligible()) return cleanup();
      if (busy()) {
        if (!recheck) recheck = window.setInterval(tryShow, RECHECK_MS);
        return;
      }
      done = true;
      cleanup();
      import("./VideoCallPopupDialog")
        .then((m) => {
          // Re-check: a tel:/Zalo click may have happened while loading.
          if (!eligible()) return;
          storageSet("session", keys.shownThisSession, "1");
          setDialog(() => m.default);
          setOpen(true);
          pixelTrackCustom("PopupShown", { content_name: projectSlug, source: "popup_videocall" });
        })
        .catch(() => {}); // offline / chunk error: skip the pop-up
    };
    const fire = () => {
      if (fired) return;
      fired = true;
      tryShow();
    };

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max > 0 && (window.scrollY / max) * 100 >= data.scrollPercent) fire();
    };
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) fire();
    });
    const targets = [document.getElementById("kiem-chung"), document.querySelector("footer")].filter(Boolean) as Element[];
    targets.forEach((t) => io.observe(t));
    const stop = () => {
      done = true;
      cleanup();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener(LEAD_SUBMITTED_EVENT, stop);

    function cleanup() {
      if (recheck) window.clearInterval(recheck);
      recheck = 0;
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener(LEAD_SUBMITTED_EVENT, stop);
    }
    return cleanup;
  }, [data.scrollPercent, eligible, keys.shownThisSession, projectSlug]);

  const handleClose = useCallback(
    (method: "button" | "esc" | "backdrop", submitted: boolean) => {
      setOpen(false);
      if (!submitted) storageSet("local", keys.dismissedUntil, String(Date.now() + data.dismissHours * HOUR));
      pixelTrackCustom("PopupClose", { content_name: projectSlug, source: "popup_videocall", method, submitted: submitted ? 1 : 0 });
    },
    [data.dismissHours, keys.dismissedUntil, projectSlug],
  );

  if (!open || !Dialog) return null;
  return <Dialog data={data} projectSlug={projectSlug} onClose={handleClose} />;
}
