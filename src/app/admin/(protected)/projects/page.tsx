import Link from "next/link";
import { requireRole } from "@/lib/server/auth";
import { prisma } from "@/lib/server/db";

export const metadata = { title: "Dự án" };

const STATUS_LABEL: Record<string, string> = { DRAFT: "Nháp", PUBLISHED: "Đã publish", ARCHIVED: "Lưu trữ" };
const STATUS_COLOR: Record<string, string> = {
  DRAFT: "bg-[var(--color-sand)] text-[var(--color-text-muted)]",
  PUBLISHED: "bg-[var(--color-brand-green)] text-[var(--color-warm-white)]",
  ARCHIVED: "bg-[var(--color-clay)] text-[var(--color-warm-white)]",
};

export default async function AdminProjectsPage() {
  const user = await requireRole("ADMIN", "SALES");
  const projects = await prisma.project.findMany({ orderBy: { createdAt: "asc" } });
  const canEdit = user.role === "ADMIN";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="m-0 font-ui text-2xl font-bold text-[var(--color-charcoal)]">Dự án</h1>
          <p className="m-0 mt-1 font-body text-sm text-[var(--color-text-muted)]">
            {canEdit ? "Tạo, chỉnh sửa và publish trang chi tiết dự án." : "Xem thông tin dự án (chỉ Admin được chỉnh sửa)."}
          </p>
        </div>
        {canEdit && (
          <Link
            href="/admin/projects/new"
            className="rounded-xs bg-[var(--color-brand-green)] px-5 py-2.5 font-ui text-sm font-bold tracking-[0.04em] text-[var(--color-warm-white)] uppercase no-underline hover:opacity-90"
          >
            + Thêm dự án
          </Link>
        )}
      </div>

      <div className="flex flex-col divide-y divide-[var(--color-border)] rounded-sm border border-[var(--color-border)] bg-[var(--color-warm-white)]">
        {projects.length === 0 && (
          <p className="m-0 p-6 font-body text-sm text-[var(--color-text-muted)]">Chưa có dự án nào.</p>
        )}
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/admin/projects/${project.id}`}
            className="flex items-center justify-between gap-4 px-5 py-4 no-underline hover:bg-[var(--color-sand)]"
          >
            <div>
              <p className="m-0 font-ui text-sm font-semibold text-[var(--color-charcoal)]">{project.name}</p>
              <p className="m-0 mt-0.5 font-body text-xs text-[var(--color-text-muted)]">/projects/{project.slug}</p>
            </div>
            <span
              className={`rounded-full px-3 py-1 font-ui text-[10px] font-bold tracking-[0.05em] uppercase ${STATUS_COLOR[project.publishStatus]}`}
            >
              {STATUS_LABEL[project.publishStatus]}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
