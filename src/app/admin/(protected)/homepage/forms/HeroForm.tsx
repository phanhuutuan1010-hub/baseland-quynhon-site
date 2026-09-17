"use client";

import { useState } from "react";
import { AdminTextField } from "@/components/admin/AdminField";
import { MediaPickerField } from "@/components/admin/MediaPickerField";
import { LangToggle } from "@/components/admin/LangToggle";
import { SaveBar } from "@/components/admin/SaveBar";
import { updateHomepageSectionContent } from "../actions";

type HeroValue = {
  eyebrow: string;
  headlineLines: [string, string];
  tagline: string;
  ctaPrimary: string;
  ctaSecondary: string;
  heroImageSrc?: string;
};

export function HeroForm({ initial }: { initial: { vi: HeroValue; en: HeroValue } }) {
  const [vi, setVi] = useState(initial.vi);
  const [en, setEn] = useState(initial.en);
  const [lang, setLang] = useState<"vi" | "en">("vi");
  const current = lang === "vi" ? vi : en;
  const setCurrent = lang === "vi" ? setVi : setEn;

  // The background image isn't language-specific, but content is stored
  // once per language (see validation/homepage.ts) — write it to both so
  // switching the VI/EN tab never shows a different value.
  function setHeroImageSrc(url: string) {
    setVi((prev) => ({ ...prev, heroImageSrc: url }));
    setEn((prev) => ({ ...prev, heroImageSrc: url }));
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-5 p-6">
        <MediaPickerField label="Ảnh nền (để trống = dùng carousel mặc định)" value={current.heroImageSrc ?? ""} onChange={setHeroImageSrc} kindFilter="IMAGE" />
        <LangToggle value={lang} onChange={setLang} />
        <AdminTextField label="Eyebrow" value={current.eyebrow} onChange={(v) => setCurrent({ ...current, eyebrow: v })} />
        <AdminTextField
          label="Tiêu đề — dòng 1"
          value={current.headlineLines[0]}
          onChange={(v) => setCurrent({ ...current, headlineLines: [v, current.headlineLines[1]] })}
        />
        <AdminTextField
          label="Tiêu đề — dòng 2"
          value={current.headlineLines[1]}
          onChange={(v) => setCurrent({ ...current, headlineLines: [current.headlineLines[0], v] })}
        />
        <AdminTextField label="Tagline" value={current.tagline} onChange={(v) => setCurrent({ ...current, tagline: v })} />
        <div className="grid grid-cols-2 gap-5">
          <AdminTextField label="CTA chính" value={current.ctaPrimary} onChange={(v) => setCurrent({ ...current, ctaPrimary: v })} />
          <AdminTextField label="CTA phụ" value={current.ctaSecondary} onChange={(v) => setCurrent({ ...current, ctaSecondary: v })} />
        </div>
      </div>
      <SaveBar onSave={() => updateHomepageSectionContent("HERO", { vi, en })} />
    </div>
  );
}
