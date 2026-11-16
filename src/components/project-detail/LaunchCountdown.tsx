"use client";

import { useSyncExternalStore } from "react";
import { useLang } from "@/lib/i18n";

/** "YYYY-MM-DD" → start of that day in Vietnam (UTC+7), or null. */
export function launchTime(date?: string): number | null {
  const m = date?.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return null;
  return Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])) - 7 * 3600_000;
}

const subscribe = (cb: () => void) => {
  const t = window.setInterval(cb, 1000);
  return () => window.clearInterval(t);
};
const nowSeconds = () => Math.floor(Date.now() / 1000);

/**
 * Countdown to an expected launch day (Admin: Giá & lộ trình → "Đếm ngược
 * tới ngày"). The server HTML shows the date with blank counters (the page
 * is prerendered, so its clock would be stale); the browser fills them in
 * and removes the block once the day has come.
 */
export function LaunchCountdown({ to, label }: { to: string; label: string }) {
  const { pick } = useLang();
  const target = launchTime(to);
  const now = useSyncExternalStore(subscribe, nowSeconds, () => null);
  if (target == null) return null;
  const left = now == null ? null : Math.floor(target / 1000) - now;
  if (left != null && left <= 0) return null;

  const [y, mo, d] = to.split("-");
  const parts =
    left == null
      ? null
      : [Math.floor(left / 86400), Math.floor((left % 86400) / 3600), Math.floor((left % 3600) / 60), left % 60];
  const units = [
    pick({ vi: "Ngày", en: "Days" }),
    pick({ vi: "Giờ", en: "Hours" }),
    pick({ vi: "Phút", en: "Min" }),
    pick({ vi: "Giây", en: "Sec" }),
  ];

  return (
    <div className="mb-10 flex flex-col gap-5 border-l-2 border-[var(--project-accent-light)] pl-5 sm:flex-row sm:items-end sm:justify-between sm:gap-10 md:mb-12">
      <div>
        <div className="mb-2 font-ui text-xs font-bold tracking-[0.14em] text-[var(--project-accent-light)] uppercase">{label}</div>
        <div className="font-display text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.1] text-[var(--color-warm-white)] tabular-nums">
          {d}/{mo}/{y}
        </div>
      </div>
      <div className="flex gap-2.5 sm:gap-3" aria-live="off">
        {units.map((u, i) => (
          <div key={u} className="flex w-16 flex-col items-center rounded-xs border border-[rgba(233,220,199,0.28)] px-2 py-2.5 sm:w-20">
            <span className="font-display text-[clamp(1.4rem,3vw,2rem)] leading-none text-[var(--color-warm-white)] tabular-nums">
              {parts ? String(parts[i]).padStart(i === 0 ? 1 : 2, "0") : "–"}
            </span>
            <span className="mt-1.5 font-ui text-[10px] font-bold tracking-[0.12em] text-[var(--color-sand)] uppercase">{u}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
