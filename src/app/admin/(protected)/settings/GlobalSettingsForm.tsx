"use client";

import { useState } from "react";
import { AdminTextField } from "@/components/admin/AdminField";
import { MediaPickerField } from "@/components/admin/MediaPickerField";
import { SaveBar } from "@/components/admin/SaveBar";
import { updateGlobalSettings } from "./actions";

export type GlobalSettingsValue = {
  siteName: string;
  defaultLanguage: "vi" | "en";
  logoUrl: string;
  faviconUrl: string;
  defaultOgImageUrl: string;
};

export function GlobalSettingsForm({ initial }: { initial: GlobalSettingsValue }) {
  const [value, setValue] = useState(initial);
  const set = <K extends keyof GlobalSettingsValue>(key: K) => (v: string) => setValue((prev) => ({ ...prev, [key]: v }) as GlobalSettingsValue);

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-5 p-6">
        <AdminTextField label="Tên site" value={value.siteName} onChange={set("siteName")} />
        <label className="flex flex-col gap-1.5">
          <span className="font-ui text-xs font-semibold tracking-[0.04em] text-[var(--color-text-muted)] uppercase">
            Ngôn ngữ mặc định
          </span>
          <select
            value={value.defaultLanguage}
            onChange={(e) => setValue((prev) => ({ ...prev, defaultLanguage: e.target.value as "vi" | "en" }))}
            className="rounded-xs border border-[var(--color-border)] bg-[var(--color-warm-white)] px-3.5 py-2.5 font-body text-[var(--fs-body)] text-[var(--color-charcoal)]"
          >
            <option value="vi">Tiếng Việt</option>
            <option value="en">English</option>
          </select>
        </label>
        <MediaPickerField label="Logo (tuỳ chọn)" value={value.logoUrl} onChange={set("logoUrl")} kindFilter="IMAGE" />
        <MediaPickerField label="Favicon (tuỳ chọn)" value={value.faviconUrl} onChange={set("faviconUrl")} kindFilter="IMAGE" />
        <MediaPickerField label="Ảnh Open Graph mặc định (tuỳ chọn)" value={value.defaultOgImageUrl} onChange={set("defaultOgImageUrl")} kindFilter="IMAGE" />
      </div>
      <SaveBar onSave={() => updateGlobalSettings(value)} />
    </div>
  );
}
