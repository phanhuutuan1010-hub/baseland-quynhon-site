import Link from "next/link";
import { requireRole } from "@/lib/server/auth";
import { prisma } from "@/lib/server/db";
import type { LeadStatus, Prisma } from "@prisma/client";
import { ExportCsvButton } from "./ExportCsvButton";

export const metadata = { title: "Lead" };

const STATUS_LABEL: Record<LeadStatus, string> = { NEW: "Mới", CONTACTED: "Đã liên hệ", CONVERTED: "Đã chuyển đổi", ARCHIVED: "Lưu trữ" };
const STATUS_COLOR: Record<LeadStatus, string> = {
  NEW: "bg-[var(--color-brand-green)] text-[var(--color-warm-white)]",
  CONTACTED: "bg-[var(--color-ocean-blue)] text-[var(--color-warm-white)]",
  CONVERTED: "bg-[var(--color-terracotta)] text-[var(--color-warm-white)]",
  ARCHIVED: "bg-[var(--color-sand)] text-[var(--color-text-muted)]",
};

type SearchParams = { q?: string; status?: string; project?: string; from?: string; to?: string };

export default async function AdminLeadsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  await requireRole("ADMIN", "SALES");
  const params = await searchParams;

  const where: Prisma.LeadWhereInput = {};
  if (params.q) {
    where.OR = [
      { name: { contains: params.q, mode: "insensitive" } },
      { phone: { contains: params.q, mode: "insensitive" } },
      { email: { contains: params.q, mode: "insensitive" } },
    ];
  }
  if (params.status) where.status = params.status as LeadStatus;
  if (params.project) where.projectId = params.project;
  if (params.from || params.to) {
    where.createdAt = {
      ...(params.from ? { gte: new Date(params.from) } : {}),
      ...(params.to ? { lte: new Date(`${params.to}T23:59:59`) } : {}),
    };
  }

  const [leads, projects] = await Promise.all([
    prisma.lead.findMany({
      where,
      include: { project: { select: { name: true } }, assignedTo: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
    prisma.project.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="m-0 font-ui text-2xl font-bold text-[var(--color-charcoal)]">Lead</h1>
          <p className="m-0 mt-1 font-body text-sm text-[var(--color-text-muted)]">Danh sách yêu cầu tư vấn từ site public.</p>
        </div>
        <ExportCsvButton />
      </div>

      <form className="flex flex-wrap items-end gap-3 rounded-sm border border-[var(--color-border)] bg-[var(--color-warm-white)] p-4">
        <label className="flex flex-col gap-1">
          <span className="font-ui text-[10px] font-bold tracking-[0.04em] text-[var(--color-text-muted)] uppercase">Tìm (tên/SĐT/email)</span>
          <input name="q" defaultValue={params.q} className="rounded-xs border border-[var(--color-border)] px-3 py-2 font-body text-sm" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-ui text-[10px] font-bold tracking-[0.04em] text-[var(--color-text-muted)] uppercase">Trạng thái</span>
          <select name="status" defaultValue={params.status ?? ""} className="rounded-xs border border-[var(--color-border)] px-3 py-2 font-body text-sm">
            <option value="">Tất cả</option>
            {Object.entries(STATUS_LABEL).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-ui text-[10px] font-bold tracking-[0.04em] text-[var(--color-text-muted)] uppercase">Dự án</span>
          <select name="project" defaultValue={params.project ?? ""} className="rounded-xs border border-[var(--color-border)] px-3 py-2 font-body text-sm">
            <option value="">Tất cả</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-ui text-[10px] font-bold tracking-[0.04em] text-[var(--color-text-muted)] uppercase">Từ ngày</span>
          <input type="date" name="from" defaultValue={params.from} className="rounded-xs border border-[var(--color-border)] px-3 py-2 font-body text-sm" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-ui text-[10px] font-bold tracking-[0.04em] text-[var(--color-text-muted)] uppercase">Đến ngày</span>
          <input type="date" name="to" defaultValue={params.to} className="rounded-xs border border-[var(--color-border)] px-3 py-2 font-body text-sm" />
        </label>
        <button type="submit" className="rounded-xs bg-[var(--color-brand-green)] px-4 py-2 font-ui text-xs font-bold tracking-[0.04em] text-[var(--color-warm-white)] uppercase">
          Lọc
        </button>
        <Link href="/admin/leads" className="rounded-xs border border-[var(--color-border)] px-4 py-2 font-ui text-xs font-bold tracking-[0.04em] uppercase no-underline">
          Đặt lại
        </Link>
      </form>

      <div className="overflow-x-auto rounded-sm border border-[var(--color-border)] bg-[var(--color-warm-white)]">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-[var(--color-border)] font-ui text-[11px] font-bold tracking-[0.04em] text-[var(--color-text-muted)] uppercase">
              <th className="px-4 py-3">Tên</th>
              <th className="px-4 py-3">Dự án</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3">Nguồn</th>
              <th className="px-4 py-3">Phụ trách</th>
              <th className="px-4 py-3">Ngày tạo</th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center font-body text-sm text-[var(--color-text-muted)]">
                  Không có lead nào khớp bộ lọc.
                </td>
              </tr>
            )}
            {leads.map((lead) => (
              <tr key={lead.id} className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-sand)]">
                <td className="px-4 py-3">
                  <Link href={`/admin/leads/${lead.id}`} className="font-ui text-sm font-semibold text-[var(--color-charcoal)] no-underline">
                    {lead.name}
                  </Link>
                  <p className="m-0 font-body text-xs text-[var(--color-text-muted)]">{lead.phone}</p>
                </td>
                <td className="px-4 py-3 font-body text-sm text-[var(--color-text-muted)]">{lead.project?.name ?? "—"}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-1 font-ui text-[10px] font-bold tracking-[0.04em] uppercase ${STATUS_COLOR[lead.status]}`}>
                    {STATUS_LABEL[lead.status]}
                  </span>
                </td>
                <td className="px-4 py-3 font-body text-sm text-[var(--color-text-muted)]">{lead.source}</td>
                <td className="px-4 py-3 font-body text-sm text-[var(--color-text-muted)]">{lead.assignedTo?.name ?? "—"}</td>
                <td className="px-4 py-3 font-body text-sm text-[var(--color-text-muted)]">
                  {lead.createdAt.toLocaleDateString("vi-VN")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
