"use client";

import { useState } from "react";
import { AdminTextField } from "@/components/admin/AdminField";
import { LangToggle } from "@/components/admin/LangToggle";
import { SaveBar } from "@/components/admin/SaveBar";
import { RepeatableObjectList } from "@/components/admin/RepeatableList";
import { updateHomepageSectionContent } from "../actions";

type NewsItem = { date: string; title: string };
type NewsTeaserValue = { kicker: string; title: string; viewAll: string; items: NewsItem[] };

// items here are a small display-only fallback list (see src/lib/content/
// home.ts's comment on `news`) — the real teaser cards always render the 3
// latest ARTICLES from news.ts, not these; kept editable for parity with the
// old content shape until News migrates to the DB in Phase 3.
export function NewsTeaserForm({ initial }: { initial: { vi: NewsTeaserValue; en: NewsTeaserValue } }) {
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
        <AdminTextField label="Nhãn 'Xem tất cả'" value={current.viewAll} onChange={(v) => setCurrent({ ...current, viewAll: v })} />
        <div>
          <p className="mb-2 font-ui text-xs font-semibold tracking-[0.04em] text-[var(--color-text-muted)] uppercase">
            Danh sách dự phòng (bài viết thật lấy từ module Tin tức)
          </p>
          <RepeatableObjectList
            items={current.items}
            onChange={(items) => setCurrent({ ...current, items })}
            fields={[
              { key: "date", label: "Ngày" },
              { key: "title", label: "Tiêu đề" },
            ]}
            itemLabel="Bài viết"
          />
        </div>
      </div>
      <SaveBar onSave={() => updateHomepageSectionContent("NEWS_TEASER", { vi, en })} />
    </div>
  );
}
