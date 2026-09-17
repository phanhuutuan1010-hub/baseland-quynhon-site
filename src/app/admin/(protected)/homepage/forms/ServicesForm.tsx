"use client";

import { useState } from "react";
import { AdminTextField } from "@/components/admin/AdminField";
import { LangToggle } from "@/components/admin/LangToggle";
import { SaveBar } from "@/components/admin/SaveBar";
import { RepeatableObjectList } from "@/components/admin/RepeatableList";
import { updateHomepageSectionContent } from "../actions";

type ServiceItem = { num: string; title: string; desc: string };
type ServicesValue = { kicker: string; title: string; items: ServiceItem[] };

export function ServicesForm({ initial }: { initial: { vi: ServicesValue; en: ServicesValue } }) {
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
          <p className="mb-2 font-ui text-xs font-semibold tracking-[0.04em] text-[var(--color-text-muted)] uppercase">Dịch vụ</p>
          <RepeatableObjectList
            items={current.items}
            onChange={(items) => setCurrent({ ...current, items })}
            fields={[
              { key: "num", label: "Số thứ tự (vd 01)" },
              { key: "title", label: "Tiêu đề" },
              { key: "desc", label: "Mô tả" },
            ]}
            itemLabel="Dịch vụ"
          />
        </div>
      </div>
      <SaveBar onSave={() => updateHomepageSectionContent("SERVICES", { vi, en })} />
    </div>
  );
}
