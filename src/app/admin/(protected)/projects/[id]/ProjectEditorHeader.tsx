"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import type { ProjectPublishStatus } from "@prisma/client";
import { setProjectPublishStatus, deleteProject } from "../actions";

const STATUS_LABEL: Record<ProjectPublishStatus, string> = { DRAFT: "Nháp", PUBLISHED: "Đã publish", ARCHIVED: "Lưu trữ" };

export function ProjectEditorHeader({
  projectId,
  name,
  slug,
  publishStatus,
  canEdit,
}: {
  projectId: string;
  name: string;
  slug: string;
  publishStatus: ProjectPublishStatus;
  canEdit: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const basePath = `/admin/projects/${projectId}`;
  const isOverview = pathname === basePath;
  const isSections = pathname.startsWith(`${basePath}/sections`);

  function changeStatus(status: ProjectPublishStatus) {
    startTransition(() => {
      setProjectPublishStatus(projectId, status);
    });
  }

  function remove() {
    if (!confirm(`Xoá vĩnh viễn dự án "${name}"? Hành động này không thể hoàn tác.`)) return;
    startTransition(() => {
      deleteProject(projectId);
      router.push("/admin/projects");
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="m-0 font-ui text-xs font-bold tracking-[0.04em] text-[var(--color-brand-green)] uppercase">
            Dự án
          </p>
          <h1 className="m-0 mt-1 font-ui text-2xl font-bold text-[var(--color-charcoal)]">{name}</h1>
          <p className="m-0 mt-0.5 font-body text-xs text-[var(--color-text-muted)]">/projects/{slug}</p>
        </div>

        {canEdit && (
          <div className="flex items-center gap-2.5">
            <span className="font-ui text-xs font-bold tracking-[0.04em] text-[var(--color-text-muted)] uppercase">
              {STATUS_LABEL[publishStatus]}
            </span>
            {publishStatus !== "PUBLISHED" && (
              <button
                type="button"
                disabled={pending}
                onClick={() => changeStatus("PUBLISHED")}
                className="rounded-xs bg-[var(--color-brand-green)] px-4 py-2 font-ui text-xs font-bold tracking-[0.04em] text-[var(--color-warm-white)] uppercase disabled:opacity-60"
              >
                Publish
              </button>
            )}
            {publishStatus === "PUBLISHED" && (
              <button
                type="button"
                disabled={pending}
                onClick={() => changeStatus("DRAFT")}
                className="rounded-xs border border-[var(--color-border)] px-4 py-2 font-ui text-xs font-bold tracking-[0.04em] uppercase disabled:opacity-60"
              >
                Unpublish
              </button>
            )}
            {publishStatus !== "ARCHIVED" && (
              <button
                type="button"
                disabled={pending}
                onClick={() => changeStatus("ARCHIVED")}
                className="rounded-xs border border-[var(--color-border)] px-4 py-2 font-ui text-xs font-bold tracking-[0.04em] uppercase disabled:opacity-60"
              >
                Lưu trữ
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
        )}
      </div>

      <div className="flex gap-1 border-b border-[var(--color-border)]">
        <Link
          href={basePath}
          className={`rounded-t-xs px-4 py-2.5 font-ui text-sm font-semibold no-underline ${
            isOverview ? "border-b-2 border-[var(--color-brand-green)] text-[var(--color-brand-green)]" : "text-[var(--color-text-muted)]"
          }`}
        >
          Overview
        </Link>
        <Link
          href={`${basePath}/sections`}
          className={`rounded-t-xs px-4 py-2.5 font-ui text-sm font-semibold no-underline ${
            isSections ? "border-b-2 border-[var(--color-brand-green)] text-[var(--color-brand-green)]" : "text-[var(--color-text-muted)]"
          }`}
        >
          Nội dung (Sections)
        </Link>
      </div>
    </div>
  );
}
