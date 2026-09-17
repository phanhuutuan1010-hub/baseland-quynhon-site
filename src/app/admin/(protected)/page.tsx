import Link from "next/link";
import { requireUser } from "@/lib/server/auth";
import { prisma } from "@/lib/server/db";

export const metadata = { title: "Dashboard" };

const ACTION_LABEL: Record<string, string> = {
  "project.create": "tạo dự án",
  "project.overview.update": "sửa thông tin dự án",
  "project.section.update": "sửa nội dung dự án",
  "project.section.toggle": "ẩn/hiện section dự án",
  "project.publishStatus.update": "đổi trạng thái publish dự án",
  "project.delete": "xoá dự án",
  "news.create": "tạo bài viết",
  "news.update": "sửa bài viết",
  "news.status.update": "đổi trạng thái bài viết",
  "news.delete": "xoá bài viết",
  "homepage.section.update": "sửa section trang chủ",
  "homepage.section.toggle": "ẩn/hiện section trang chủ",
  "homepage.section.reorder": "sắp xếp lại trang chủ",
  "settings.contact.update": "sửa thông tin liên hệ",
  "settings.analytics.update": "sửa cấu hình analytics",
  "settings.global.update": "sửa cấu hình chung",
  "menu.create": "thêm mục menu",
  "menu.update": "sửa mục menu",
  "menu.delete": "xoá mục menu",
  "lead.status.update": "đổi trạng thái lead",
  "lead.assign.update": "gán lead",
  "lead.note.add": "thêm ghi chú lead",
  "media.create": "tải lên media",
  "media.update": "sửa thông tin media",
  "media.delete": "xoá media",
};

export default async function AdminDashboardPage() {
  const user = await requireUser();

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const [publishedProjects, publishedNews, totalLeads, newLeadsThisWeek, recentActivity] = await Promise.all([
    prisma.project.count({ where: { publishStatus: "PUBLISHED" } }),
    prisma.news.count({ where: { status: "PUBLISHED" } }),
    prisma.lead.count(),
    prisma.lead.count({ where: { createdAt: { gte: weekAgo } } }),
    prisma.activityLog.findMany({ orderBy: { createdAt: "desc" }, take: 8, include: { user: { select: { name: true } } } }),
  ]);

  const stats = [
    { label: "Dự án đã publish", value: publishedProjects },
    { label: "Bài viết đã publish", value: publishedNews },
    { label: "Tổng số lead", value: totalLeads },
    { label: "Lead mới trong tuần", value: newLeadsThisWeek },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="m-0 font-ui text-2xl font-bold text-[var(--color-charcoal)]">Dashboard</h1>
        <p className="m-0 mt-1 font-body text-sm text-[var(--color-text-muted)]">
          Chào {user.name} — bạn đang đăng nhập với quyền {user.role === "ADMIN" ? "Admin" : "Sales"}.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-sm border border-[var(--color-border)] bg-[var(--color-warm-white)] p-5">
            <p className="m-0 font-ui text-[28px] font-bold text-[var(--color-charcoal)]">{stat.value}</p>
            <p className="m-0 mt-1 font-body text-sm text-[var(--color-text-muted)]">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-sm border border-[var(--color-border)] bg-[var(--color-warm-white)] p-5">
        <h2 className="m-0 mb-3 font-ui text-sm font-bold tracking-[0.04em] text-[var(--color-charcoal)] uppercase">
          Hoạt động gần đây
        </h2>
        {recentActivity.length === 0 ? (
          <p className="m-0 font-body text-sm text-[var(--color-text-muted)]">Chưa có hoạt động nào.</p>
        ) : (
          <ul className="m-0 flex flex-col gap-2.5 pl-0">
            {recentActivity.map((log) => (
              <li key={log.id} className="flex items-center justify-between gap-4 font-body text-sm text-[var(--color-charcoal)]">
                <span>
                  <strong>{log.user.name}</strong> {ACTION_LABEL[log.action] ?? log.action}
                </span>
                <span className="font-ui text-xs text-[var(--color-text-muted)]">{log.createdAt.toLocaleString("vi-VN")}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {newLeadsThisWeek > 0 && (
        <Link
          href="/admin/leads"
          className="self-start rounded-xs border border-[var(--color-brand-green)] px-4 py-2 font-ui text-xs font-bold tracking-[0.04em] text-[var(--color-brand-green)] uppercase no-underline"
        >
          Xem {newLeadsThisWeek} lead mới trong tuần →
        </Link>
      )}
    </div>
  );
}
