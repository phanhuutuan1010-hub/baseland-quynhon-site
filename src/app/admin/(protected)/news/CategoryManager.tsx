"use client";

import { useState } from "react";
import { AdminTextField } from "@/components/admin/AdminField";
import { createCategory, updateCategory, deleteCategory } from "./actions";

export type CategoryValue = { id: string; key: string; labelVi: string; labelEn: string };

export function CategoryManager({ initial }: { initial: CategoryValue[] }) {
  const [categories, setCategories] = useState(initial);
  const [draft, setDraft] = useState<{ key: string; labelVi: string; labelEn: string } | null>(null);

  function updateLocal(id: string, patch: Partial<CategoryValue>) {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }

  async function save(cat: CategoryValue) {
    await updateCategory(cat.id, cat);
  }

  async function remove(id: string) {
    if (!confirm("Xoá danh mục này?")) return;
    const result = await deleteCategory(id);
    if (!result?.error) setCategories((prev) => prev.filter((c) => c.id !== id));
    else alert(result.error);
  }

  async function addNew() {
    if (!draft) return;
    const result = await createCategory(draft);
    if (result.error) {
      alert(result.error);
      return;
    }
    setDraft(null);
    window.location.reload();
  }

  return (
    <details className="rounded-sm border border-[var(--color-border)] bg-[var(--color-warm-white)]">
      <summary className="cursor-pointer px-5 py-3.5 font-ui text-sm font-semibold text-[var(--color-charcoal)]">
        Quản lý danh mục ({categories.length})
      </summary>
      <div className="flex flex-col gap-3 border-t border-[var(--color-border)] p-5">
        {categories.map((cat) => (
          <div key={cat.id} className="grid grid-cols-[1fr_1fr_1fr_auto] items-end gap-3">
            <AdminTextField label="Key" value={cat.key} onChange={(v) => updateLocal(cat.id, { key: v })} />
            <AdminTextField label="Nhãn (VI)" value={cat.labelVi} onChange={(v) => updateLocal(cat.id, { labelVi: v })} />
            <AdminTextField label="Nhãn (EN)" value={cat.labelEn} onChange={(v) => updateLocal(cat.id, { labelEn: v })} />
            <div className="flex gap-2 pb-0.5">
              <button
                type="button"
                onClick={() => save(cat)}
                className="rounded-xs border border-[var(--color-brand-green)] px-3 py-2 font-ui text-xs font-bold text-[var(--color-brand-green)] uppercase"
              >
                Lưu
              </button>
              <button
                type="button"
                onClick={() => remove(cat.id)}
                className="rounded-xs border border-[var(--color-error)] px-3 py-2 font-ui text-xs font-bold text-[var(--color-error)] uppercase"
              >
                Xoá
              </button>
            </div>
          </div>
        ))}

        {draft ? (
          <div className="grid grid-cols-[1fr_1fr_1fr_auto] items-end gap-3 border-t border-dashed border-[var(--color-border)] pt-3">
            <AdminTextField label="Key" value={draft.key} onChange={(v) => setDraft({ ...draft, key: v })} />
            <AdminTextField label="Nhãn (VI)" value={draft.labelVi} onChange={(v) => setDraft({ ...draft, labelVi: v })} />
            <AdminTextField label="Nhãn (EN)" value={draft.labelEn} onChange={(v) => setDraft({ ...draft, labelEn: v })} />
            <button
              type="button"
              onClick={addNew}
              className="rounded-xs bg-[var(--color-brand-green)] px-3 py-2 font-ui text-xs font-bold text-[var(--color-warm-white)] uppercase"
            >
              Thêm
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setDraft({ key: "", labelVi: "", labelEn: "" })}
            className="self-start rounded-xs border border-dashed border-[var(--color-border)] px-4 py-2 font-ui text-xs font-bold tracking-[0.04em] uppercase hover:bg-[var(--color-sand)]"
          >
            + Thêm danh mục
          </button>
        )}
      </div>
    </details>
  );
}
