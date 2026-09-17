"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AdminTextField } from "@/components/admin/AdminField";
import { createNews } from "../actions";

export function NewNewsForm({ categories }: { categories: { id: string; labelVi: string }[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [value, setValue] = useState({ slug: "", titleVi: "", titleEn: "", categoryId: categories[0]?.id ?? "" });

  function submit() {
    startTransition(async () => {
      const result = await createNews(value);
      if (result.error) setError(result.error);
      else if (result.id) router.push(`/admin/news/${result.id}`);
    });
  }

  return (
    <div className="flex max-w-140 flex-col gap-5 rounded-sm border border-[var(--color-border)] bg-[var(--color-warm-white)] p-6">
      <AdminTextField label="Slug (vd: qterra-center)" value={value.slug} onChange={(v) => setValue({ ...value, slug: v })} />
      <div className="grid grid-cols-2 gap-4">
        <AdminTextField label="Tiêu đề (VI)" value={value.titleVi} onChange={(v) => setValue({ ...value, titleVi: v })} />
        <AdminTextField label="Tiêu đề (EN)" value={value.titleEn} onChange={(v) => setValue({ ...value, titleEn: v })} />
      </div>
      <label className="flex flex-col gap-1.5">
        <span className="font-ui text-xs font-semibold tracking-[0.04em] text-[var(--color-text-muted)] uppercase">Danh mục</span>
        <select
          value={value.categoryId}
          onChange={(e) => setValue({ ...value, categoryId: e.target.value })}
          className="rounded-xs border border-[var(--color-border)] bg-[var(--color-warm-white)] px-3.5 py-2.5 font-body text-sm"
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.labelVi}
            </option>
          ))}
        </select>
      </label>
      {error && <p className="m-0 font-body text-sm text-[var(--color-error)]">{error}</p>}
      <button
        type="button"
        onClick={submit}
        disabled={pending}
        className="self-start rounded-xs bg-[var(--color-brand-green)] px-6 py-2.5 font-ui text-sm font-bold tracking-[0.04em] text-[var(--color-warm-white)] uppercase disabled:opacity-60"
      >
        {pending ? "Đang tạo…" : "Tạo bài viết (bản nháp)"}
      </button>
    </div>
  );
}
