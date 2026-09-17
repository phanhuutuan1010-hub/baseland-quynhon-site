"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { toggleProjectSectionEnabled } from "../../actions";
import type { EditableProjectSectionKey } from "@/lib/server/validation/project";

type Row = { key: EditableProjectSectionKey; label: string; hasContent: boolean; enabled: boolean };

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
    <div className="flex flex-col divide-y divide-[var(--color-border)] rounded-sm border border-[var(--color-border)] bg-[var(--color-warm-white)]">
      {rows.map((row, index) => (
        <div key={row.key} className="flex items-center justify-between gap-4 px-5 py-3.5">
          <div className="flex items-center gap-3">
            <span className="font-ui text-sm font-semibold text-[var(--color-charcoal)]">{row.label}</span>
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
      ))}
    </div>
  );
}
