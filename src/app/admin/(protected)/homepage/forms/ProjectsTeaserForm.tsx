"use client";

import { useState } from "react";
import { AdminTextField } from "@/components/admin/AdminField";
import { LangToggle } from "@/components/admin/LangToggle";
import { SaveBar } from "@/components/admin/SaveBar";
import { RepeatableObjectList } from "@/components/admin/RepeatableList";
import { updateHomepageSectionContent } from "../actions";

type TeaserItem = { slotId: string; name: string; location: string; status: string; cta: string };
type TeaserValue = { kicker: string; title: string; items: TeaserItem[] };

export function ProjectsTeaserForm({ initial }: { initial: { vi: TeaserValue; en: TeaserValue } }) {
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
          <p className="mb-2 font-ui text-xs font-semibold tracking-[0.04em] text-[var(--color-text-muted)] uppercase">Dự án</p>
          <RepeatableObjectList
            items={current.items}
            onChange={(items) => setCurrent({ ...current, items })}
            fields={[
              { key: "slotId", label: "Slot ID (định danh ảnh)" },
              { key: "name", label: "Tên dự án" },
              { key: "location", label: "Vị trí" },
              { key: "status", label: "Trạng thái" },
              { key: "cta", label: "Nhãn CTA" },
            ]}
            itemLabel="Dự án"
          />
        </div>
      </div>
      <SaveBar onSave={() => updateHomepageSectionContent("PROJECTS_TEASER", { vi, en })} />
    </div>
  );
}
