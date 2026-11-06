"use client";

import { useEffect, useState } from "react";
import { useLang, type Localized } from "@/lib/i18n";
import { cleanTelHref, useProjectContact } from "./ProjectContact";

const FROM_AD_KEY = "bl_from_ad";

/** True when this visit came from an ad: utm_source in the URL now, or
 * earlier in this browser session (so it survives in-site navigation). */
function useFromAd() {
  const [fromAd, setFromAd] = useState(false);
  useEffect(() => {
    let yes = !!new URLSearchParams(window.location.search).get("utm_source");
    try {
      if (yes) sessionStorage.setItem(FROM_AD_KEY, "1");
      else yes = sessionStorage.getItem(FROM_AD_KEY) === "1";
    } catch {}
    // eslint-disable-next-line react-hooks/set-state-in-effect -- URL/session storage are client-only
    setFromAd(yes);
  }, []);
  return fromAd;
}

/**
 * Strip right under the hero for ad visitors only (Admin → Dự án → Nội
 * dung → Giai đoạn bán hàng → "Dải thông báo"). Direct visitors never see
 * it; with no text in the CMS it never renders.
 */
export function AdNoticeBar({ text, ctaLabel }: { text?: Localized<string>; ctaLabel?: Localized<string> }) {
  const { pick } = useLang();
  const { phoneHref } = useProjectContact();
  const fromAd = useFromAd();
  const message = text ? pick(text).trim() : "";
  if (!fromAd || !message) return null;
  const label = (ctaLabel && pick(ctaLabel).trim()) || pick({ vi: "Gọi đặt lịch xem", en: "Call to book a viewing" });

  return (
    <div
      role="note"
      data-track-pos="ad_notice"
      className="border-b border-[rgba(250,245,238,0.14)] bg-[var(--color-deep-earth)] text-[var(--color-warm-white)]"
    >
      <div className="mx-auto flex max-w-[1200px] flex-col gap-3 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6 lg:px-10">
        <p className="m-0 font-body text-[15px] leading-[1.5] [text-wrap:balance]">{message}</p>
        <a
          href={cleanTelHref(phoneHref)}
          data-track="click_call"
          className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xs bg-[var(--project-primary)] px-5 py-2.5 font-ui text-[12px] font-bold tracking-[0.08em] text-[var(--project-primary-foreground)] uppercase no-underline hover:bg-[var(--project-primary-dark)]"
        >
          {label}
        </a>
      </div>
    </div>
  );
}
