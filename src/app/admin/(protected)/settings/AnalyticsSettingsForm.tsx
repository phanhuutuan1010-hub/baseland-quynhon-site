"use client";

import { useState } from "react";
import { AdminTextField } from "@/components/admin/AdminField";
import { SaveBar } from "@/components/admin/SaveBar";
import { updateAnalyticsSettings } from "./actions";

export type AnalyticsSettingsValue = { gaId: string; gtmId: string; metaPixelId: string };

export function AnalyticsSettingsForm({ initial }: { initial: AnalyticsSettingsValue }) {
  const [value, setValue] = useState(initial);
  const set = <K extends keyof AnalyticsSettingsValue>(key: K) => (v: string) => setValue((prev) => ({ ...prev, [key]: v }));

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-5 p-6">
        <p className="m-0 font-body text-sm text-[var(--color-text-muted)]">
          Chỉ nhập tracking ID — không lưu secret/API key ở đây.
        </p>
        <AdminTextField label="Google Analytics ID (vd G-XXXXXXX)" value={value.gaId} onChange={set("gaId")} />
        <AdminTextField label="Google Tag Manager ID (vd GTM-XXXXXXX)" value={value.gtmId} onChange={set("gtmId")} />
        <AdminTextField label="Meta Pixel ID" value={value.metaPixelId} onChange={set("metaPixelId")} />
      </div>
      <SaveBar onSave={() => updateAnalyticsSettings(value)} />
    </div>
  );
}
