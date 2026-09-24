"use client";

import { useState } from "react";
import { AdminTextField, AdminTextAreaField } from "@/components/admin/AdminField";
import { LangToggle } from "@/components/admin/LangToggle";
import { SaveBar } from "@/components/admin/SaveBar";
import { RepeatableObjectList } from "@/components/admin/RepeatableList";
import { updateHomepageSectionContent } from "../actions";

type Point = { label: string; desc: string; imageSrc?: string };
type WhyQuyNhonValue = { kicker: string; statement: string; points: Point[] };

export function WhyQuyNhonForm({ initial }: { initial: { vi: WhyQuyNhonValue; en: WhyQuyNhonValue } }) {
  const [vi, setVi] = useState(initial.vi);
  const [en, setEn] = useState(initial.en);
  const [lang, setLang] = useState<"vi" | "en">("vi");
  const current = lang === "vi" ? vi : en;
  const setCurrent = lang === "vi" ? setVi : setEn;
  const setOther = lang === "vi" ? setEn : setVi;

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-5 p-6">
        <LangToggle value={lang} onChange={setLang} />
        <AdminTextField label="Kicker" value={current.kicker} onChange={(v) => setCurrent({ ...current, kicker: v })} />
        <AdminTextAreaField label="Câu tuyên ngôn" value={current.statement} onChange={(v) => setCurrent({ ...current, statement: v })} rows={3} />
        <div>
          <p className="mb-2 font-ui text-xs font-semibold tracking-[0.04em] text-[var(--color-text-muted)] uppercase">Điểm nổi bật</p>
          <RepeatableObjectList
            items={current.points}
            onChange={(points) => setCurrent({ ...current, points })}
            fields={[
              { key: "label", label: "Nhãn" },
              { key: "desc", label: "Mô tả" },
              { key: "imageSrc", label: "Ảnh (để trống = dùng placeholder)", type: "image" },
            ]}
            itemLabel="Điểm"
            onImageChange={(index, key, value) =>
              setOther((prev) => ({ ...prev, points: prev.points.map((p, i) => (i === index ? { ...p, [key]: value } : p)) }))
            }
          />
        </div>
      </div>
      <SaveBar onSave={() => updateHomepageSectionContent("WHY_QUY_NHON", { vi, en })} />
    </div>
  );
}
