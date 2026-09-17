"use client";

import { useState } from "react";
import { ContactSettingsForm, type ContactSettingsValue } from "./ContactSettingsForm";
import { AnalyticsSettingsForm, type AnalyticsSettingsValue } from "./AnalyticsSettingsForm";
import { GlobalSettingsForm, type GlobalSettingsValue } from "./GlobalSettingsForm";
import { MenuManager, type MenuItemValue } from "./MenuManager";

const TABS = ["Liên hệ", "Analytics", "Chung", "Menu"] as const;

export function SettingsTabs({
  contact,
  analytics,
  global,
  menu,
}: {
  contact: ContactSettingsValue;
  analytics: AnalyticsSettingsValue;
  global: GlobalSettingsValue;
  menu: MenuItemValue[];
}) {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Liên hệ");

  return (
    <div className="rounded-sm border border-[var(--color-border)] bg-[var(--color-warm-white)]">
      <div className="flex gap-1 border-b border-[var(--color-border)] px-4 pt-3">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-t-xs px-4 py-2.5 font-ui text-sm font-semibold tracking-[0.02em] ${
              tab === t
                ? "border-b-2 border-[var(--color-brand-green)] text-[var(--color-brand-green)]"
                : "text-[var(--color-text-muted)]"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      {tab === "Liên hệ" && <ContactSettingsForm initial={contact} />}
      {tab === "Analytics" && <AnalyticsSettingsForm initial={analytics} />}
      {tab === "Chung" && <GlobalSettingsForm initial={global} />}
      {tab === "Menu" && <MenuManager initial={menu} />}
    </div>
  );
}
