"use client";

import { useTransition } from "react";
import { exportLeadsCsv } from "./actions";

export function ExportCsvButton() {
  const [pending, startTransition] = useTransition();

  function handleExport() {
    startTransition(async () => {
      const csv = await exportLeadsCsv();
      const blob = new Blob([`﻿${csv}`], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={pending}
      className="rounded-xs border border-[var(--color-border)] px-4 py-2 font-ui text-xs font-bold tracking-[0.04em] uppercase disabled:opacity-60"
    >
      {pending ? "Đang xuất…" : "Xuất CSV"}
    </button>
  );
}
