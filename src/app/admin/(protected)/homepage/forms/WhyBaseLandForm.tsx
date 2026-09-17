"use client";

import { useState } from "react";
import { AdminTextField } from "@/components/admin/AdminField";
import { LangToggle } from "@/components/admin/LangToggle";
import { SaveBar } from "@/components/admin/SaveBar";
import { RepeatableObjectList } from "@/components/admin/RepeatableList";
import { updateHomepageSectionContent } from "../actions";

type ValueItem = { name: string; desc: string };
type WhyBaseLandValue = { kicker: string; title: string; values: ValueItem[] };

export function WhyBaseLandForm({ initial }: { initial: { vi: WhyBaseLandValue; en: WhyBaseLandValue } }) {
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
        <div>
          <p className="mb-2 font-ui text-xs font-semibold tracking-[0.04em] text-[var(--color-text-muted)] uppercase">Giá trị cốt lõi</p>
          <RepeatableObjectList
            items={current.values}
            onChange={(values) => setCurrent({ ...current, values })}
            fields={[
              { key: "name", label: "Tên giá trị" },
              { key: "desc", label: "Mô tả" },
            ]}
            itemLabel="Giá trị"
          />
        </div>
      </div>
      <SaveBar onSave={() => updateHomepageSectionContent("WHY_BASE_LAND", { vi, en })} />
    </div>
  );
}
