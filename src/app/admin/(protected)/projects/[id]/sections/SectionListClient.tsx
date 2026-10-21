"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { toggleProjectSectionEnabled } from "../../actions";
import type { EditableProjectSectionKey } from "@/lib/server/validation/project";

type LangState = "ok" | "missing" | "empty";
type Row = {
  key: EditableProjectSectionKey;
  label: string;
  hasContent: boolean;
  enabled: boolean;
  /** Label of the section this one is shown inside (rendered nested). */
  parent?: string;
  /** Not shown by the standard layout. */
  unused?: boolean;
  lang?: { vi: LangState; en: LangState };
};

function LangBadge({ code, state }: { code: string; state: LangState }) {
  if (state === "empty") return null;
  const ok = state === "ok";
  return (
    <span
      className={`rounded-full px-2 py-0.5 font-ui text-[10px] font-bold tracking-[0.04em] uppercase ${
        ok ? "bg-[rgba(46,107,80,0.12)] text-[var(--color-brand-green)]" : "bg-[rgba(179,38,30,0.1)] text-[var(--color-error)]"
      }`}
    >
      {code} {ok ? "✓" : "thiếu"}
    </span>
  );
}

export function SectionListClient({ projectId, initial, canEdit }: { projectId: string; initial: Row[]; canEdit: boolean }) {
  const [rows, setRows] = useState(initial);
  const [pending, startTransition] = useTransition();

  function toggle(index: number) {
    if (!canEdit) return;
    const next = [...rows];
    next[index] = { ...next[index], enabled: !next[index].enabled };
    setRows(next);
    startTransition(() => {
      toggleProjectSectionEnabled(projectId, next[index].key, next[index].enabled);
    });
  }

  return (
    <div className="flex flex-col divide-y divide-[var(--color-border)] overflow-hidden rounded-sm border border-[var(--color-border)] bg-[var(--color-warm-white)]">
      {rows.map((row, index) => (
        <div key={row.key}>
          {row.unused && !rows[index - 1]?.unused && (
            <div className="bg-[var(--color-sand)] px-5 py-2 font-ui text-[11px] font-bold tracking-[0.06em] text-[var(--color-text-muted)] uppercase">
              Không hiển thị ở layout chuẩn
            </div>
          )}
        <div className={`flex items-center justify-between gap-4 py-3.5 pr-5 ${row.parent ? "pl-10" : "pl-5"}`}>
          <div className="flex flex-wrap items-center gap-2.5">
            {row.parent && <span aria-hidden className="text-[var(--color-text-muted)]">↳</span>}
            <span className={`font-ui text-sm text-[var(--color-charcoal)] ${row.parent ? "font-medium" : "font-semibold"}`}>{row.label}</span>
            {row.lang && <LangBadge code="VI" state={row.lang.vi} />}
            {row.lang && <LangBadge code="EN" state={row.lang.en} />}
            {!row.hasContent && (
              <span className="rounded-full bg-[var(--color-sand)] px-2.5 py-0.5 font-ui text-[10px] font-bold tracking-[0.04em] text-[var(--color-text-muted)] uppercase">
                Chưa có nội dung
              </span>
            )}
            {row.hasContent && !row.enabled && (
              <span className="rounded-full bg-[var(--color-sand)] px-2.5 py-0.5 font-ui text-[10px] font-bold tracking-[0.04em] text-[var(--color-text-muted)] uppercase">
                Đã ẩn
              </span>
            )}
          </div>
          <div className="flex items-center gap-5">
            {canEdit && row.hasContent && (
              <label className="flex items-center gap-2 font-ui text-xs font-semibold tracking-[0.04em] uppercase">
                <input type="checkbox" checked={row.enabled} disabled={pending} onChange={() => toggle(index)} />
                Hiện
              </label>
            )}
            {canEdit ? (
              <Link
                href={`/admin/projects/${projectId}/sections/${row.key}`}
                className="font-ui text-xs font-bold tracking-[0.04em] text-[var(--color-brand-green)] uppercase no-underline"
              >
                {row.hasContent ? "Chỉnh sửa" : "Thêm nội dung"} →
              </Link>
            ) : (
              row.hasContent && (
                <Link
                  href={`/admin/projects/${projectId}/sections/${row.key}`}
                  className="font-ui text-xs font-bold tracking-[0.04em] text-[var(--color-text-muted)] uppercase no-underline"
                >
                  Xem →
                </Link>
              )
            )}
          </div>
        </div>
        </div>
      ))}
    </div>
  );
}
