import { notFound } from "next/navigation";
import { requireRole } from "@/lib/server/auth";
import { prisma } from "@/lib/server/db";
import { LeadDetailClient } from "./LeadDetailClient";

export const metadata = { title: "Chi tiết Lead" };

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireRole("ADMIN", "SALES");
  const { id } = await params;

  const [lead, users] = await Promise.all([
    prisma.lead.findUnique({ where: { id }, include: { project: { select: { name: true } } } }),
    prisma.user.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);
  if (!lead) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="m-0 font-ui text-xs font-bold tracking-[0.04em] text-[var(--color-brand-green)] uppercase">Lead</p>
        <h1 className="m-0 mt-1 font-ui text-2xl font-bold text-[var(--color-charcoal)]">{lead.name}</h1>
      </div>

      <div className="grid grid-cols-2 gap-4 rounded-sm border border-[var(--color-border)] bg-[var(--color-warm-white)] p-5 sm:grid-cols-4">
        <div>
          <p className="m-0 font-ui text-[10px] font-bold tracking-[0.04em] text-[var(--color-text-muted)] uppercase">Điện thoại</p>
          <p className="m-0 mt-1 font-body text-sm text-[var(--color-charcoal)]">{lead.phone}</p>
        </div>
        <div>
          <p className="m-0 font-ui text-[10px] font-bold tracking-[0.04em] text-[var(--color-text-muted)] uppercase">Email</p>
          <p className="m-0 mt-1 font-body text-sm text-[var(--color-charcoal)]">{lead.email ?? "—"}</p>
        </div>
        <div>
          <p className="m-0 font-ui text-[10px] font-bold tracking-[0.04em] text-[var(--color-text-muted)] uppercase">Nhu cầu</p>
          <p className="m-0 mt-1 font-body text-sm text-[var(--color-charcoal)]">{lead.message ?? "—"}</p>
        </div>
        <div>
          <p className="m-0 font-ui text-[10px] font-bold tracking-[0.04em] text-[var(--color-text-muted)] uppercase">Dự án</p>
          <p className="m-0 mt-1 font-body text-sm text-[var(--color-charcoal)]">{lead.project?.name ?? "—"}</p>
        </div>
        <div>
          <p className="m-0 font-ui text-[10px] font-bold tracking-[0.04em] text-[var(--color-text-muted)] uppercase">Nguồn</p>
          <p className="m-0 mt-1 font-body text-sm text-[var(--color-charcoal)]">{lead.source}</p>
        </div>
        <div>
          <p className="m-0 font-ui text-[10px] font-bold tracking-[0.04em] text-[var(--color-text-muted)] uppercase">Ngày tạo</p>
          <p className="m-0 mt-1 font-body text-sm text-[var(--color-charcoal)]">{lead.createdAt.toLocaleString("vi-VN")}</p>
        </div>
      </div>

      <LeadDetailClient
        leadId={lead.id}
        status={lead.status}
        assignedToId={lead.assignedToId}
        notes={(lead.notes as { text: string; authorName: string; createdAt: string }[]) ?? []}
        users={users}
      />
    </div>
  );
}
