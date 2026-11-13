"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { pixelTrack, pixelTrackCustom } from "@/lib/pixel";
import { useSiteContact } from "@/components/SiteContact";
import { pixelUtmParams } from "@/lib/attribution";
import { CONTACT_CLICKED_KEY } from "@/lib/leadPopupStorage";

/** Where on the page a button sits: its data-track-pos, else the nearest
 * section/element id, else header/footer. */
function buttonPosition(el: HTMLElement): string {
  return (
    el.closest<HTMLElement>("[data-track-pos]")?.dataset.trackPos ||
    el.closest("[id]")?.id ||
    (el.closest("header, nav") ? "header" : el.closest("footer") ? "footer" : "page")
  );
}

/**
 * Site-wide Meta Pixel events (mounted once in (site)/layout.tsx):
 * PageView on client-side route changes (the first one is sent by the init
 * snippet), Contact on any tel: click, ClickZalo on any zalo.me click.
 * A tel:/Zalo click inside an element with data-track-pos="popup" is
 * reported with vi_tri_nut "popup".
 */
export function PixelEvents() {
  const pathname = usePathname();
  const { ref } = useSiteContact();
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    pixelTrack("PageView");
  }, [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest<HTMLAnchorElement>("a[href]");
      if (!a) return;
      const href = a.getAttribute("href") ?? "";
      const params = { ref: ref || "none", vi_tri_nut: buttonPosition(a), ...pixelUtmParams() };
      const isTel = href.startsWith("tel:");
      const isZalo = /^https?:\/\/(www\.)?zalo\.me\//.test(href);
      if (isTel) pixelTrack("Contact", params);
      else if (isZalo) pixelTrackCustom("ClickZalo", params);
      // Remembered for this session: the video-call pop-up stays away from
      // visitors who already called or messaged.
      if (isTel || isZalo) {
        try {
          sessionStorage.setItem(CONTACT_CLICKED_KEY, "1");
        } catch {}
      }
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [ref]);

  return null;
}

/** ViewContent for a project page (content_name = slug). */
export function PixelViewContent({ slug }: { slug: string }) {
  useEffect(() => {
    pixelTrack("ViewContent", { content_name: slug, content_type: "project" });
  }, [slug]);
  return null;
}
