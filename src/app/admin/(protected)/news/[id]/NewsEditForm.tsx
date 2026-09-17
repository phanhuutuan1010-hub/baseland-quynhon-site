"use client";

import { useState } from "react";
import { AdminTextField, AdminTextAreaField } from "@/components/admin/AdminField";
import { MediaPickerField } from "@/components/admin/MediaPickerField";
import { LangToggle } from "@/components/admin/LangToggle";
import { RepeatableStringList } from "@/components/admin/RepeatableList";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { SaveBar } from "@/components/admin/SaveBar";
import { updateNews } from "../actions";

export type NewsEditValue = {
  slug: string;
  titleVi: string;
  titleEn: string;
  excerptVi: string;
  excerptEn: string;
  contentVi: string;
  contentEn: string;
  categoryId: string;
  featuredImageUrl: string;
  tags: string[];
  relatedProjectIds: string[];
  seoTitle: string;
  seoDescription: string;
};

export function NewsEditForm({
  newsId,
  initial,
  categories,
  projects,
}: {
  newsId: string;
  initial: NewsEditValue;
  categories: { id: string; labelVi: string }[];
  projects: { id: string; name: string }[];
}) {
  const [value, setValue] = useState(initial);
  const [lang, setLang] = useState<"vi" | "en">("vi");
  const set = <K extends keyof NewsEditValue>(key: K) => (v: NewsEditValue[K]) => setValue((prev) => ({ ...prev, [key]: v }));

  function toggleProject(id: string) {
    setValue((prev) => ({
      ...prev,
      relatedProjectIds: prev.relatedProjectIds.includes(id)
        ? prev.relatedProjectIds.filter((p) => p !== id)
        : [...prev.relatedProjectIds, id],
    }));
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-6 p-6">
        <AdminTextField label="Slug" value={value.slug} onChange={set("slug")} />

        <div className="grid grid-cols-2 gap-4">
          <AdminTextField label="Tiêu đề (VI)" value={value.titleVi} onChange={set("titleVi")} />
          <AdminTextField label="Tiêu đề (EN)" value={value.titleEn} onChange={set("titleEn")} />
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="font-ui text-xs font-semibold tracking-[0.04em] text-[var(--color-text-muted)] uppercase">Danh mục</span>
          <select
            value={value.categoryId}
            onChange={(e) => set("categoryId")(e.target.value)}
            className="rounded-xs border border-[var(--color-border)] bg-[var(--color-warm-white)] px-3.5 py-2.5 font-body text-sm"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.labelVi}
              </option>
            ))}
          </select>
        </label>

        <MediaPickerField label="Ảnh đại diện (để trống = dùng placeholder)" value={value.featuredImageUrl} onChange={set("featuredImageUrl")} kindFilter="IMAGE" />

        <div>
          <p className="mb-2 font-ui text-xs font-semibold tracking-[0.04em] text-[var(--color-text-muted)] uppercase">Tags</p>
          <RepeatableStringList items={value.tags} onChange={set("tags")} itemLabel="Tag" />
        </div>

        <div>
          <p className="mb-2 font-ui text-xs font-semibold tracking-[0.04em] text-[var(--color-text-muted)] uppercase">Dự án liên quan</p>
          <div className="flex flex-wrap gap-3">
            {projects.map((p) => (
              <label key={p.id} className="flex items-center gap-2 rounded-full border border-[var(--color-border)] px-3.5 py-1.5 font-ui text-xs font-semibold">
                <input type="checkbox" checked={value.relatedProjectIds.includes(p.id)} onChange={() => toggleProject(p.id)} />
                {p.name}
              </label>
            ))}
          </div>
        </div>

        <div className="border-t border-[var(--color-border)] pt-6">
          <LangToggle value={lang} onChange={setLang} />
        </div>

        {lang === "vi" ? (
          <>
            <AdminTextAreaField label="Tóm tắt (VI)" value={value.excerptVi} onChange={set("excerptVi")} rows={2} />
            <div>
              <p className="mb-2 font-ui text-xs font-semibold tracking-[0.04em] text-[var(--color-text-muted)] uppercase">Nội dung (VI)</p>
              <RichTextEditor value={value.contentVi} onChange={set("contentVi")} />
            </div>
          </>
        ) : (
          <>
            <AdminTextAreaField label="Tóm tắt (EN)" value={value.excerptEn} onChange={set("excerptEn")} rows={2} />
            <div>
              <p className="mb-2 font-ui text-xs font-semibold tracking-[0.04em] text-[var(--color-text-muted)] uppercase">Nội dung (EN)</p>
              <RichTextEditor value={value.contentEn} onChange={set("contentEn")} />
            </div>
          </>
        )}

        <div className="flex flex-col gap-4 border-t border-[var(--color-border)] pt-6">
          <h2 className="m-0 font-ui text-sm font-bold tracking-[0.04em] text-[var(--color-charcoal)] uppercase">SEO (tuỳ chọn)</h2>
          <p className="m-0 font-body text-xs text-[var(--color-text-muted)]">
            Để trống để dùng tiêu đề/mô tả mặc định được tạo tự động từ tiêu đề và tóm tắt bài viết.
          </p>
          <AdminTextField label="Tiêu đề SEO (ghi đè)" value={value.seoTitle} onChange={set("seoTitle")} />
          <AdminTextAreaField label="Mô tả SEO (ghi đè)" value={value.seoDescription} onChange={set("seoDescription")} rows={2} />
        </div>
      </div>
      <SaveBar onSave={() => updateNews(newsId, value)} />
    </div>
  );
}
