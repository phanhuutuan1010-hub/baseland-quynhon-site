"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import type { NewsStatus } from "@prisma/client";
import { setNewsStatus, deleteNews } from "../actions";

const STATUS_LABEL: Record<NewsStatus, string> = { DRAFT: "Nháp", PUBLISHED: "Đã publish" };

export function NewsEditorHeader({
  newsId,
  title,
  slug,
  status,
}: {
  newsId: string;
  title: string;
  slug: string;
  status: NewsStatus;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function changeStatus(next: NewsStatus) {
    startTransition(() => {
      setNewsStatus(newsId, next);
    });
  }

  function remove() {
    if (!confirm(`Xoá vĩnh viễn bài viết "${title}"?`)) return;
    startTransition(() => {
      deleteNews(newsId);
      router.push("/admin/news");
    });
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <p className="m-0 font-ui text-xs font-bold tracking-[0.04em] text-[var(--color-brand-green)] uppercase">Tin tức</p>
        <h1 className="m-0 mt-1 font-ui text-2xl font-bold text-[var(--color-charcoal)]">{title}</h1>
        <p className="m-0 mt-0.5 font-body text-xs text-[var(--color-text-muted)]">/news/{slug}</p>
      </div>
      <div className="flex items-center gap-2.5">
        <span className="font-ui text-xs font-bold tracking-[0.04em] text-[var(--color-text-muted)] uppercase">{STATUS_LABEL[status]}</span>
        {status !== "PUBLISHED" ? (
          <button
            type="button"
            disabled={pending}
            onClick={() => changeStatus("PUBLISHED")}
            className="rounded-xs bg-[var(--color-brand-green)] px-4 py-2 font-ui text-xs font-bold tracking-[0.04em] text-[var(--color-warm-white)] uppercase disabled:opacity-60"
          >
            Publish
          </button>
        ) : (
          <button
            type="button"
            disabled={pending}
            onClick={() => changeStatus("DRAFT")}
            className="rounded-xs border border-[var(--color-border)] px-4 py-2 font-ui text-xs font-bold tracking-[0.04em] uppercase disabled:opacity-60"
          >
            Unpublish
          </button>
        )}
        <button
          type="button"
          disabled={pending}
          onClick={remove}
          className="rounded-xs border border-[var(--color-error)] px-4 py-2 font-ui text-xs font-bold tracking-[0.04em] text-[var(--color-error)] uppercase disabled:opacity-60"
        >
          Xoá
        </button>
      </div>
    </div>
  );
}
