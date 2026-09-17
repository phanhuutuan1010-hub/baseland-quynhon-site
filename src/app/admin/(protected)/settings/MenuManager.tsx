"use client";

import { useState, useTransition } from "react";
import { AdminTextField } from "@/components/admin/AdminField";
import { createMenuItem, updateMenuItem, deleteMenuItem, reorderMenuItems } from "./actions";

export type MenuItemValue = {
  id: string;
  labelVi: string;
  labelEn: string;
  type: "INTERNAL" | "EXTERNAL" | "PROJECT" | "NEWS" | "ANCHOR";
  href: string;
  targetSlug: string;
  enabled: boolean;
};

const MENU_TYPES: MenuItemValue["type"][] = ["INTERNAL", "EXTERNAL", "PROJECT", "NEWS", "ANCHOR"];

export function MenuManager({ initial }: { initial: MenuItemValue[] }) {
  const [items, setItems] = useState(initial);
  const [pending, startTransition] = useTransition();

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    setItems(next);
    startTransition(() => {
      reorderMenuItems(next.map((i) => i.id));
    });
  }

  function updateLocal(id: string, patch: Partial<MenuItemValue>) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  }

  function addNew() {
    const draft: MenuItemValue = {
      id: `draft-${Date.now()}`,
      labelVi: "Mục mới",
      labelEn: "New item",
      type: "INTERNAL",
      href: "/",
      targetSlug: "",
      enabled: true,
    };
    setItems((prev) => [...prev, draft]);
  }

  async function save(item: MenuItemValue) {
    if (item.id.startsWith("draft-")) {
      await createMenuItem(item);
    } else {
      await updateMenuItem(item.id, item);
    }
  }

  async function remove(id: string) {
    if (id.startsWith("draft-")) {
      setItems((prev) => prev.filter((i) => i.id !== id));
      return;
    }
    if (!confirm("Xoá mục menu này?")) return;
    await deleteMenuItem(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <div className="flex flex-col gap-4 p-6">
      {items.map((item, index) => (
        <div key={item.id} className="rounded-sm border border-[var(--color-border)] p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => move(index, -1)}
                disabled={index === 0 || pending}
                className="rounded-xs border border-[var(--color-border)] px-2 py-1 text-xs disabled:opacity-30"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(index, 1)}
                disabled={index === items.length - 1 || pending}
                className="rounded-xs border border-[var(--color-border)] px-2 py-1 text-xs disabled:opacity-30"
              >
                ↓
              </button>
            </div>
            <label className="flex items-center gap-2 font-ui text-xs font-semibold tracking-[0.04em] uppercase">
              <input
                type="checkbox"
                checked={item.enabled}
                onChange={(e) => updateLocal(item.id, { enabled: e.target.checked })}
              />
              Hiện trên site
            </label>
            <button
              type="button"
              onClick={() => remove(item.id)}
              className="font-ui text-xs font-bold tracking-[0.04em] text-[var(--color-error)] uppercase"
            >
              Xoá
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <AdminTextField label="Nhãn (VI)" value={item.labelVi} onChange={(v) => updateLocal(item.id, { labelVi: v })} />
            <AdminTextField label="Nhãn (EN)" value={item.labelEn} onChange={(v) => updateLocal(item.id, { labelEn: v })} />
            <label className="flex flex-col gap-1.5">
              <span className="font-ui text-xs font-semibold tracking-[0.04em] text-[var(--color-text-muted)] uppercase">Loại</span>
              <select
                value={item.type}
                onChange={(e) => updateLocal(item.id, { type: e.target.value as MenuItemValue["type"] })}
                className="rounded-xs border border-[var(--color-border)] bg-[var(--color-warm-white)] px-3.5 py-2.5 font-body text-sm"
              >
                {MENU_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>
            {item.type === "PROJECT" || item.type === "NEWS" ? (
              <AdminTextField label="Slug đích" value={item.targetSlug} onChange={(v) => updateLocal(item.id, { targetSlug: v })} />
            ) : (
              <AdminTextField label="Href" value={item.href} onChange={(v) => updateLocal(item.id, { href: v })} />
            )}
          </div>
          <div className="mt-3">
            <button
              type="button"
              onClick={() => save(item)}
              className="rounded-xs border border-[var(--color-brand-green)] px-4 py-1.5 font-ui text-xs font-bold tracking-[0.04em] text-[var(--color-brand-green)] uppercase"
            >
              Lưu mục này
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={addNew}
        className="self-start rounded-xs border border-dashed border-[var(--color-border)] px-4 py-2 font-ui text-xs font-bold tracking-[0.04em] text-[var(--color-charcoal)] uppercase hover:bg-[var(--color-sand)]"
      >
        + Thêm mục menu
      </button>
    </div>
  );
}
