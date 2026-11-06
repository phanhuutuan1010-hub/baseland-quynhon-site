"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/lib/i18n";
import type { ProjectSalesPhases } from "@/lib/project-detail/types";
import { CalendarIcon, PinIcon } from "./icons";
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
 * dung → Giai đoạn bán hàng → "Dải thông báo" dòng 1 / dòng 2). Direct
 * visitors never see it; with both lines empty it never renders. The call
 * button is outlined so it doesn't compete with the mobile call bar.
 */
export function AdNoticeBar({ data }: { data?: ProjectSalesPhases }) {
  const { pick } = useLang();
  const { phoneHref } = useProjectContact();
  const fromAd = useFromAd();
  const lines = [
    { text: data?.adNoticeLine1 ? pick(data.adNoticeLine1).trim() : "", Icon: CalendarIcon },
    { text: data?.adNoticeLine2 ? pick(data.adNoticeLine2).trim() : "", Icon: PinIcon },
  ].filter((l) => l.text);
  if (!fromAd || !lines.length) return null;
  const label =
    (data?.adNoticeCtaLabel && pick(data.adNoticeCtaLabel).trim()) || pick({ vi: "Gọi đặt lịch xem", en: "Call to book a viewing" });

  return (
    <div
      role="note"
      data-track-pos="dai_thong_bao"
      className="border-b border-[rgba(250,245,238,0.14)] bg-[var(--color-deep-earth)] text-[var(--color-warm-white)]"
    >
      <div className="mx-auto flex max-w-[1200px] flex-col gap-2.5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6 lg:px-10">
        <ul className="m-0 flex list-none flex-col gap-1 p-0 sm:flex-row sm:flex-wrap sm:gap-x-6">
          {lines.map(({ text, Icon }) => (
            <li key={text} className="flex items-start gap-2 font-body text-[13px] leading-[1.45]">
              <Icon className="mt-[2px] h-3.5 w-3.5 flex-none text-[var(--project-accent-light)]" />
              <span>{text}</span>
            </li>
          ))}
        </ul>
        <a
          href={cleanTelHref(phoneHref)}
          data-track="click_call"
          className="inline-flex min-h-10 shrink-0 items-center justify-center self-start rounded-xs border border-[rgba(250,245,238,0.7)] bg-transparent px-4 py-2 font-ui text-[11px] font-bold tracking-[0.08em] text-[var(--color-warm-white)] uppercase no-underline hover:bg-[rgba(250,245,238,0.1)] sm:self-auto"
        >
          {label}
        </a>
      </div>
    </div>
  );
}
