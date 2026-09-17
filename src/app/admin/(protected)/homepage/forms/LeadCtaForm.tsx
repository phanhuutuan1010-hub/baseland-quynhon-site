"use client";

import { useState } from "react";
import { AdminTextAreaField, AdminTextField } from "@/components/admin/AdminField";
import { LangToggle } from "@/components/admin/LangToggle";
import { SaveBar } from "@/components/admin/SaveBar";
import { updateHomepageSectionContent } from "../actions";

type LeadCtaValue = { title: string; sub: string };

export function LeadCtaForm({ initial }: { initial: { vi: LeadCtaValue; en: LeadCtaValue } }) {
  const [vi, setVi] = useState(initial.vi);
  const [en, setEn] = useState(initial.en);
  const [lang, setLang] = useState<"vi" | "en">("vi");
  const current = lang === "vi" ? vi : en;
  const setCurrent = lang === "vi" ? setVi : setEn;

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-5 p-6">
        <LangToggle value={lang} onChange={setLang} />
        <p className="m-0 -mb-2 font-body text-xs text-[var(--color-text-muted)]">
          Số hotline hiển thị trong nút &quot;Gọi ngay&quot; lấy từ Cài đặt → Liên hệ, không sửa ở đây.
        </p>
        <AdminTextField label="Tiêu đề" value={current.title} onChange={(v) => setCurrent({ ...current, title: v })} />
        <AdminTextAreaField label="Mô tả" value={current.sub} onChange={(v) => setCurrent({ ...current, sub: v })} rows={3} />
      </div>
      <SaveBar onSave={() => updateHomepageSectionContent("LEAD_CTA", { vi, en })} />
    </div>
  );
}
