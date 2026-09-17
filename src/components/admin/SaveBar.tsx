"use client";

import { useState, useTransition } from "react";

export function SaveBar({ onSave, label = "Lưu thay đổi" }: { onSave: () => Promise<{ error?: string } | void>; label?: string }) {
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function handleClick() {
    startTransition(async () => {
      const result = await onSave();
      if (result?.error) {
        setStatus("error");
        setErrorMessage(result.error);
      } else {
        setStatus("success");
        setErrorMessage(null);
        setTimeout(() => setStatus("idle"), 2500);
      }
    });
  }

  return (
    <div className="sticky bottom-0 flex items-center gap-4 border-t border-[var(--color-border)] bg-[var(--color-warm-white)] px-6 py-4">
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        className="inline-flex items-center justify-center rounded-xs bg-[var(--color-brand-green)] px-6 py-2.5 font-ui text-sm font-bold tracking-[0.05em] text-[var(--color-warm-white)] uppercase transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Đang lưu…" : label}
      </button>
      {status === "success" && <span className="font-body text-sm text-[var(--color-brand-green)]">Đã lưu.</span>}
      {status === "error" && <span className="font-body text-sm text-[var(--color-error)]">{errorMessage || "Có lỗi xảy ra."}</span>}
    </div>
  );
}
