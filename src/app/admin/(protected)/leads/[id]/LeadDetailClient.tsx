"use client";

import { useState, useTransition } from "react";
import type { LeadStatus } from "@prisma/client";
import { setLeadStatus, assignLead, addLeadNote } from "../actions";

const STATUS_LABEL: Record<LeadStatus, string> = { NEW: "Mới", CONTACTED: "Đã liên hệ", CONVERTED: "Đã chuyển đổi", ARCHIVED: "Lưu trữ" };

type LeadNote = { text: string; authorName: string; createdAt: string };

export function LeadDetailClient({
  leadId,
  status,
  assignedToId,
  notes,
  users,
}: {
  leadId: string;
  status: LeadStatus;
  assignedToId: string | null;
  notes: LeadNote[];
  users: { id: string; name: string }[];
}) {
  const [currentStatus, setCurrentStatus] = useState(status);
  const [currentAssignee, setCurrentAssignee] = useState(assignedToId ?? "");
  const [noteList, setNoteList] = useState(notes);
  const [noteText, setNoteText] = useState("");
  const [pending, startTransition] = useTransition();

  function changeStatus(next: LeadStatus) {
    setCurrentStatus(next);
    startTransition(() => {
      setLeadStatus(leadId, next);
    });
  }

  function changeAssignee(id: string) {
    setCurrentAssignee(id);
    startTransition(() => {
      assignLead(leadId, id || null);
    });
  }

  function submitNote() {
    if (!noteText.trim()) return;
    const text = noteText;
    setNoteText("");
    startTransition(async () => {
      await addLeadNote(leadId, { text });
      setNoteList((prev) => [...prev, { text, authorName: "Bạn", createdAt: new Date().toISOString() }]);
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4 rounded-sm border border-[var(--color-border)] bg-[var(--color-warm-white)] p-5">
        <label className="flex flex-col gap-1.5">
          <span className="font-ui text-xs font-semibold tracking-[0.04em] text-[var(--color-text-muted)] uppercase">Trạng thái</span>
          <select
            value={currentStatus}
            disabled={pending}
            onChange={(e) => changeStatus(e.target.value as LeadStatus)}
            className="rounded-xs border border-[var(--color-border)] px-3.5 py-2.5 font-body text-sm"
          >
            {Object.entries(STATUS_LABEL).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="font-ui text-xs font-semibold tracking-[0.04em] text-[var(--color-text-muted)] uppercase">Phụ trách</span>
          <select
            value={currentAssignee}
            disabled={pending}
            onChange={(e) => changeAssignee(e.target.value)}
            className="rounded-xs border border-[var(--color-border)] px-3.5 py-2.5 font-body text-sm"
          >
            <option value="">Chưa gán</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="rounded-sm border border-[var(--color-border)] bg-[var(--color-warm-white)] p-5">
        <h2 className="m-0 mb-4 font-ui text-sm font-bold tracking-[0.04em] text-[var(--color-charcoal)] uppercase">Ghi chú</h2>
        <div className="mb-4 flex flex-col gap-3">
          {noteList.length === 0 && <p className="m-0 font-body text-sm text-[var(--color-text-muted)]">Chưa có ghi chú.</p>}
          {noteList.map((note, i) => (
            <div key={i} className="rounded-xs border border-[var(--color-border)] p-3">
              <p className="m-0 font-body text-sm text-[var(--color-charcoal)]">{note.text}</p>
              <p className="m-0 mt-1 font-ui text-[11px] text-[var(--color-text-muted)]">
                {note.authorName} · {new Date(note.createdAt).toLocaleString("vi-VN")}
              </p>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Thêm ghi chú…"
            className="flex-1 rounded-xs border border-[var(--color-border)] px-3.5 py-2.5 font-body text-sm"
          />
          <button
            type="button"
            onClick={submitNote}
            disabled={pending}
            className="rounded-xs bg-[var(--color-brand-green)] px-4 py-2 font-ui text-xs font-bold tracking-[0.04em] text-[var(--color-warm-white)] uppercase disabled:opacity-60"
          >
            Thêm
          </button>
        </div>
      </div>
    </div>
  );
}
