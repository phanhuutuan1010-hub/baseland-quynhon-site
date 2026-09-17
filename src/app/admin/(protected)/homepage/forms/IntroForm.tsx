"use client";

import { useState } from "react";
import { AdminTextField, AdminTextAreaField } from "@/components/admin/AdminField";
import { LangToggle } from "@/components/admin/LangToggle";
import { SaveBar } from "@/components/admin/SaveBar";
import { updateHomepageSectionContent } from "../actions";

type IntroValue = { kicker: string; title: string; body: string };

export function IntroForm({ initial }: { initial: { vi: IntroValue; en: IntroValue } }) {
  const [vi, setVi] = useState(initial.vi);
  const [en, setEn] = useState(initial.en);
  const [lang, setLang] = useState<"vi" | "en">("vi");
  const current = lang === "vi" ? vi : en;
  const setCurrent = lang === "vi" ? setVi : setEn;

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-5 p-6">
        <LangToggle value={lang} onChange={setLang} />
        <AdminTextField label="Kicker" value={current.kicker} onChange={(v) => setCurrent({ ...current, kicker: v })} />
        <AdminTextField label="Tiêu đề" value={current.title} onChange={(v) => setCurrent({ ...current, title: v })} />
        <AdminTextAreaField label="Nội dung" value={current.body} onChange={(v) => setCurrent({ ...current, body: v })} rows={4} />
      </div>
      <SaveBar onSave={() => updateHomepageSectionContent("INTRODUCTION", { vi, en })} />
    </div>
  );
}
