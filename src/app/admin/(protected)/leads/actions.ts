"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/server/db";
import { requireRole } from "@/lib/server/auth";
import { logActivity } from "@/lib/server/activityLog";
import { updateLeadSchema, addLeadNoteSchema } from "@/lib/server/validation/lead";
import type { LeadStatus } from "@prisma/client";

type ActionResult = { error?: string };
type LeadNote = { text: string; authorName: string; createdAt: string };

// ADMIN and SALES can both work leads (see mục 2) — only ADMIN manages
// content/system settings elsewhere.
async function requireLeadAccess() {
  return requireRole("ADMIN", "SALES");
}

export async function setLeadStatus(id: string, status: LeadStatus): Promise<ActionResult> {
  const user = await requireLeadAccess();
  const parsed = updateLeadSchema.safeParse({ status });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" };

  const lead = await prisma.lead.findUnique({ where: { id } });
  if (!lead) return { error: "Không tìm thấy lead" };

  await prisma.lead.update({ where: { id }, data: { status } });
  await logActivity({
    userId: user.id,
    action: "lead.status.update",
    entityType: "Lead",
    entityId: id,
    field: "status",
    oldValue: lead.status,
    newValue: status,
  });
  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${id}`);
  return {};
}

export async function assignLead(id: string, assignedToId: string | null): Promise<ActionResult> {
  const user = await requireLeadAccess();
  const lead = await prisma.lead.findUnique({ where: { id } });
  if (!lead) return { error: "Không tìm thấy lead" };

  await prisma.lead.update({ where: { id }, data: { assignedToId } });
  await logActivity({
    userId: user.id,
    action: "lead.assign.update",
    entityType: "Lead",
    entityId: id,
    field: "assignedToId",
    oldValue: lead.assignedToId,
    newValue: assignedToId,
  });
  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${id}`);
  return {};
}

export async function addLeadNote(id: string, input: unknown): Promise<ActionResult> {
  const user = await requireLeadAccess();
  const parsed = addLeadNoteSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" };

  const lead = await prisma.lead.findUnique({ where: { id } });
  if (!lead) return { error: "Không tìm thấy lead" };

  const notes = (lead.notes as LeadNote[]) ?? [];
  const nextNotes: LeadNote[] = [...notes, { text: parsed.data.text, authorName: user.name, createdAt: new Date().toISOString() }];

  await prisma.lead.update({ where: { id }, data: { notes: nextNotes } });
  await logActivity({ userId: user.id, action: "lead.note.add", entityType: "Lead", entityId: id });
  revalidatePath(`/admin/leads/${id}`);
  return {};
}

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

export async function exportLeadsCsv(): Promise<string> {
  await requireLeadAccess();
  const leads = await prisma.lead.findMany({
    include: { project: { select: { name: true } }, assignedTo: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  const header = ["Tên", "Điện thoại", "Email", "Nhu cầu", "Nguồn", "Dự án", "Trạng thái", "Người phụ trách", "Ngày tạo"];
  const rows = leads.map((l) =>
    [
      l.name,
      l.phone,
      l.email ?? "",
      l.message ?? "",
      l.source,
      l.project?.name ?? "",
      l.status,
      l.assignedTo?.name ?? "",
      l.createdAt.toISOString(),
    ]
      .map((v) => csvEscape(String(v)))
      .join(","),
  );

  return [header.join(","), ...rows].join("\n");
}
