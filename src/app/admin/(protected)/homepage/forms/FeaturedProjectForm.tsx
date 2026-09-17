"use client";

import { useState } from "react";
import { AdminTextField, AdminTextAreaField } from "@/components/admin/AdminField";
import { MediaPickerField } from "@/components/admin/MediaPickerField";
import { LangToggle } from "@/components/admin/LangToggle";
import { SaveBar } from "@/components/admin/SaveBar";
import { RepeatableObjectList } from "@/components/admin/RepeatableList";
import { updateHomepageSectionContent } from "../actions";

type FeaturedAmenity = { label: string; imageSrc?: string };
type FeaturedValue = {
  kicker: string;
  title: string;
  desc: string;
  locationLabel: string;
  locationValue: string;
  scaleLabel: string;
  scaleValue: string;
  cta: string;
  amenities: FeaturedAmenity[];
  imageSrc?: string;
};

export function FeaturedProjectForm({ initial }: { initial: { vi: FeaturedValue; en: FeaturedValue } }) {
  const [vi, setVi] = useState(initial.vi);
  const [en, setEn] = useState(initial.en);
  const [lang, setLang] = useState<"vi" | "en">("vi");
  const current = lang === "vi" ? vi : en;
  const setCurrent = lang === "vi" ? setVi : setEn;

  // Not language-specific, but content is stored once per language — write
  // to both so switching the VI/EN tab never shows a different value.
  function setImageSrc(url: string) {
    setVi((prev) => ({ ...prev, imageSrc: url }));
    setEn((prev) => ({ ...prev, imageSrc: url }));
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-5 p-6">
        <MediaPickerField label="Ảnh (để trống = dùng ảnh Q'Terra mặc định)" value={current.imageSrc ?? ""} onChange={setImageSrc} kindFilter="IMAGE" />
        <LangToggle value={lang} onChange={setLang} />
        <p className="m-0 -mb-2 font-body text-xs text-[var(--color-text-muted)]">
          Link dự án hiện đang cố định (Q&apos;Terra) — sẽ chọn được dự án thật khi có bộ chọn Project trong section này.
        </p>
        <AdminTextField label="Kicker" value={current.kicker} onChange={(v) => setCurrent({ ...current, kicker: v })} />
        <AdminTextField label="Tiêu đề" value={current.title} onChange={(v) => setCurrent({ ...current, title: v })} />
        <AdminTextAreaField label="Mô tả" value={current.desc} onChange={(v) => setCurrent({ ...current, desc: v })} rows={3} />
        <div className="grid grid-cols-2 gap-5">
          <AdminTextField label="Nhãn vị trí" value={current.locationLabel} onChange={(v) => setCurrent({ ...current, locationLabel: v })} />
          <AdminTextField label="Giá trị vị trí" value={current.locationValue} onChange={(v) => setCurrent({ ...current, locationValue: v })} />
        </div>
        <div className="grid grid-cols-2 gap-5">
          <AdminTextField label="Nhãn quy mô" value={current.scaleLabel} onChange={(v) => setCurrent({ ...current, scaleLabel: v })} />
          <AdminTextField label="Giá trị quy mô" value={current.scaleValue} onChange={(v) => setCurrent({ ...current, scaleValue: v })} />
        </div>
        <AdminTextField label="Nhãn CTA" value={current.cta} onChange={(v) => setCurrent({ ...current, cta: v })} />
        <div>
          <p className="mb-2 font-ui text-xs font-semibold tracking-[0.04em] text-[var(--color-text-muted)] uppercase">Tiện ích</p>
          <RepeatableObjectList
            items={current.amenities}
            onChange={(amenities) => setCurrent({ ...current, amenities })}
            fields={[
              { key: "label", label: "Tên tiện ích" },
              { key: "imageSrc", label: "Ảnh (để trống = dùng placeholder)", type: "image" },
            ]}
            itemLabel="Tiện ích"
          />
        </div>
      </div>
      <SaveBar onSave={() => updateHomepageSectionContent("FEATURED_PROJECT", { vi, en })} />
    </div>
  );
}
