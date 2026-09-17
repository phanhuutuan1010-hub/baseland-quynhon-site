"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import type { HomepageSectionTypeKey } from "@/lib/server/validation/homepage";
import { toggleHomepageSectionEnabled, reorderHomepageSections } from "./actions";

type Row = { type: HomepageSectionTypeKey; enabled: boolean; label: string };

export function SectionListClient({ initial }: { initial: Row[] }) {
  const [rows, setRows] = useState(initial);
  const [pending, startTransition] = useTransition();

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= rows.length) return;
    const next = [...rows];
    [next[index], next[target]] = [next[target], next[index]];
    setRows(next);
    startTransition(() => {
      reorderHomepageSections(next.map((r) => r.type));
    });
  }

  function toggle(index: number) {
    const next = [...rows];
    next[index] = { ...next[index], enabled: !next[index].enabled };
    setRows(next);
    startTransition(() => {
      toggleHomepageSectionEnabled(next[index].type, next[index].enabled);
    });
  }

  return (
    <div className="flex flex-col divide-y divide-[var(--color-border)] rounded-sm border border-[var(--color-border)] bg-[var(--color-warm-white)]">
      {rows.map((row, index) => (
        <div key={row.type} className="flex items-center justify-between gap-4 px-5 py-3.5">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <button
                type="button"
                onClick={() => move(index, -1)}
                disabled={index === 0 || pending}
                className="leading-none disabled:opacity-30"
                aria-label="Lên"
              >
                ▲
              </button>
              <button
                type="button"
                onClick={() => move(index, 1)}
                disabled={index === rows.length - 1 || pending}
                className="leading-none disabled:opacity-30"
                aria-label="Xuống"
              >
                ▼
              </button>
            </div>
            <span className="font-ui text-sm font-semibold text-[var(--color-charcoal)]">{row.label}</span>
            {!row.enabled && (
              <span className="rounded-full bg-[var(--color-sand)] px-2.5 py-0.5 font-ui text-[10px] font-bold tracking-[0.04em] text-[var(--color-text-muted)] uppercase">
                Đã ẩn
              </span>
            )}
          </div>
          <div className="flex items-center gap-5">
            <label className="flex items-center gap-2 font-ui text-xs font-semibold tracking-[0.04em] uppercase">
              <input type="checkbox" checked={row.enabled} onChange={() => toggle(index)} />
              Hiện
            </label>
            <Link
              href={`/admin/homepage/${row.type}`}
              className="font-ui text-xs font-bold tracking-[0.04em] text-[var(--color-brand-green)] uppercase no-underline"
            >
              Chỉnh sửa →
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
