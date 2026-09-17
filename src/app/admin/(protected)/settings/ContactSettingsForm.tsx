"use client";

import { useState } from "react";
import { AdminTextField } from "@/components/admin/AdminField";
import { SaveBar } from "@/components/admin/SaveBar";
import { updateContactSettings } from "./actions";

export type ContactSettingsValue = {
  branchName: string;
  navCtaLabelVi: string;
  navCtaLabelEn: string;
  hotline: string;
  hotlineHref: string;
  contactEmail: string;
  contactEmailHref: string;
  addressVi: string;
  addressEn: string;
  mapsUrl: string;
  facebookUrl: string;
  zaloUrl: string;
  youtubeUrl: string;
};

export function ContactSettingsForm({ initial }: { initial: ContactSettingsValue }) {
  const [value, setValue] = useState(initial);
  const set = <K extends keyof ContactSettingsValue>(key: K) => (v: string) => setValue((prev) => ({ ...prev, [key]: v }));

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-5 p-6">
        <AdminTextField label="Tên chi nhánh" value={value.branchName} onChange={set("branchName")} />
        <div className="grid grid-cols-2 gap-5">
          <AdminTextField label="Nhãn nút CTA (VI)" value={value.navCtaLabelVi} onChange={set("navCtaLabelVi")} />
          <AdminTextField label="Nhãn nút CTA (EN)" value={value.navCtaLabelEn} onChange={set("navCtaLabelEn")} />
        </div>
        <div className="grid grid-cols-2 gap-5">
          <AdminTextField label="Hotline (hiển thị)" value={value.hotline} onChange={set("hotline")} />
          <AdminTextField label="Hotline (href, vd tel:+84...)" value={value.hotlineHref} onChange={set("hotlineHref")} />
        </div>
        <div className="grid grid-cols-2 gap-5">
          <AdminTextField label="Email" value={value.contactEmail} onChange={set("contactEmail")} />
          <AdminTextField label="Email href (vd mailto:...)" value={value.contactEmailHref} onChange={set("contactEmailHref")} />
        </div>
        <div className="grid grid-cols-2 gap-5">
          <AdminTextField label="Địa chỉ (VI)" value={value.addressVi} onChange={set("addressVi")} />
          <AdminTextField label="Địa chỉ (EN)" value={value.addressEn} onChange={set("addressEn")} />
        </div>
        <AdminTextField label="Link Google Maps (tuỳ chọn)" value={value.mapsUrl} onChange={set("mapsUrl")} />
        <div className="grid grid-cols-3 gap-5">
          <AdminTextField label="Facebook (tuỳ chọn)" value={value.facebookUrl} onChange={set("facebookUrl")} />
          <AdminTextField label="Zalo (tuỳ chọn)" value={value.zaloUrl} onChange={set("zaloUrl")} />
          <AdminTextField label="YouTube (tuỳ chọn)" value={value.youtubeUrl} onChange={set("youtubeUrl")} />
        </div>
      </div>
      <SaveBar onSave={() => updateContactSettings(value)} />
    </div>
  );
}
