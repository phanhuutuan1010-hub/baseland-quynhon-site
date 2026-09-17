"use client";

import { useState } from "react";
import { AdminTextField, AdminTextAreaField } from "@/components/admin/AdminField";
import { LangToggle } from "@/components/admin/LangToggle";
import { SaveBar } from "@/components/admin/SaveBar";
import { RepeatableStringList } from "@/components/admin/RepeatableList";

// Human-friendly label from a camelCase/snake_case field key — not a
// per-section label map, since this form is intentionally generic (see its
// doc comment in validation/project.ts for why).
function prettifyKey(key: string): string {
  const spaced = key.replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/_/g, " ");
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

export type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

function isPlainObject(value: unknown): value is Record<string, Json> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// Every Project section field is EITHER a plain value (string/number/
// boolean/non-bilingual object like `{src, alt}`) OR a `Localized<T>` leaf
// shaped exactly `{ vi: T, en: T }` — inline per-field, unlike Homepage's
// sections which duplicate the WHOLE object once per language. Detecting
// this shape (rather than trusting a field-name convention) is what lets
// one form handle all 21 section types without a hard-coded field map.
function isLocalizedLeaf(value: unknown): value is { vi: string; en: string } {
  return (
    isPlainObject(value) &&
    Object.keys(value).length === 2 &&
    typeof value.vi === "string" &&
    typeof value.en === "string"
  );
}

function isLocalizedStringArray(value: Json[]): value is { vi: string; en: string }[] {
  return value.length > 0 && value.every((item) => isLocalizedLeaf(item));
}

function FieldEditor({
  path,
  value,
  lang,
  onChange,
}: {
  path: string;
  value: Json;
  lang: "vi" | "en";
  onChange: (next: Json) => void;
}) {
  if (isLocalizedLeaf(value)) {
    const text = value[lang];
    const long = text.length > 70 || /body|desc|statement|note|content|sub/i.test(path);
    return long ? (
      <AdminTextAreaField label={prettifyKey(path)} value={text} onChange={(v) => onChange({ ...value, [lang]: v })} rows={3} />
    ) : (
      <AdminTextField label={prettifyKey(path)} value={text} onChange={(v) => onChange({ ...value, [lang]: v })} />
    );
  }

  if (typeof value === "string") {
    return <AdminTextField label={`${prettifyKey(path)} (chung, không tách ngôn ngữ)`} value={value} onChange={(v) => onChange(v)} />;
  }

  if (typeof value === "boolean") {
    return (
      <label className="flex items-center gap-2 font-ui text-xs font-semibold tracking-[0.04em] uppercase">
        <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} />
        {prettifyKey(path)}
      </label>
    );
  }

  if (typeof value === "number") {
    return <AdminTextField label={prettifyKey(path)} value={String(value)} onChange={(v) => onChange(Number(v) || 0)} />;
  }

  if (Array.isArray(value)) {
    if (value.length === 0 || value.every((v) => typeof v === "string")) {
      return (
        <div>
          <p className="mb-2 font-ui text-xs font-semibold tracking-[0.04em] text-[var(--color-text-muted)] uppercase">
            {prettifyKey(path)}
          </p>
          <RepeatableStringList items={value as string[]} onChange={(items) => onChange(items)} itemLabel={prettifyKey(path)} />
        </div>
      );
    }

    if (isLocalizedStringArray(value)) {
      return (
        <div className="flex flex-col gap-2">
          <p className="m-0 font-ui text-xs font-semibold tracking-[0.04em] text-[var(--color-text-muted)] uppercase">
            {prettifyKey(path)}
          </p>
          {value.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                value={item[lang]}
                onChange={(e) => {
                  const next = [...value];
                  next[index] = { ...item, [lang]: e.target.value };
                  onChange(next);
                }}
                className="flex-1 rounded-xs border border-[var(--color-border)] bg-[var(--color-warm-white)] px-3.5 py-2 font-body text-sm text-[var(--color-charcoal)]"
              />
              <button
                type="button"
                onClick={() => onChange(value.filter((_, i) => i !== index))}
                className="font-ui text-xs font-bold text-[var(--color-error)] uppercase"
              >
                Xoá
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => onChange([...value, { vi: "", en: "" }])}
            className="self-start rounded-xs border border-dashed border-[var(--color-border)] px-4 py-2 font-ui text-xs font-bold tracking-[0.04em] uppercase hover:bg-[var(--color-sand)]"
          >
            + Thêm {prettifyKey(path).toLowerCase()}
          </button>
        </div>
      );
    }

    // Array of mixed-shape objects — one card per item, each field
    // recursively edited with this same FieldEditor.
    return (
      <div className="flex flex-col gap-3">
        <p className="m-0 font-ui text-xs font-semibold tracking-[0.04em] text-[var(--color-text-muted)] uppercase">
          {prettifyKey(path)}
        </p>
        {value.map((item, index) => (
          <div key={index} className="rounded-xs border border-[var(--color-border)] p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-ui text-xs font-bold text-[var(--color-text-muted)] uppercase">
                {prettifyKey(path)} {index + 1}
              </span>
              <button
                type="button"
                onClick={() => onChange(value.filter((_, i) => i !== index))}
                className="font-ui text-xs font-bold text-[var(--color-error)] uppercase"
              >
                Xoá
              </button>
            </div>
            {isPlainObject(item) ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {Object.entries(item).map(([k, v]) => (
                  <FieldEditor
                    key={k}
                    path={k}
                    value={v}
                    lang={lang}
                    onChange={(next) => {
                      const nextArr = [...value];
                      nextArr[index] = { ...item, [k]: next };
                      onChange(nextArr);
                    }}
                  />
                ))}
              </div>
            ) : (
              <FieldEditor
                path={path}
                value={item}
                lang={lang}
                onChange={(next) => {
                  const nextArr = [...value];
                  nextArr[index] = next;
                  onChange(nextArr);
                }}
              />
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => {
            const template = isPlainObject(value[0]) ? Object.fromEntries(Object.keys(value[0]).map((k) => [k, ""])) : "";
            onChange([...value, template as Json]);
          }}
          className="self-start rounded-xs border border-dashed border-[var(--color-border)] px-4 py-2 font-ui text-xs font-bold tracking-[0.04em] uppercase hover:bg-[var(--color-sand)]"
        >
          + Thêm {prettifyKey(path).toLowerCase()}
        </button>
      </div>
    );
  }

  if (isPlainObject(value)) {
    // Nested non-localized object (e.g. an image { src, alt }, or a
    // groupLabels map keyed by arbitrary group ids) — recurse the same way,
    // grouped visually so it reads as one field rather than a flat list.
    return (
      <div className="rounded-xs border border-[var(--color-border)] p-3">
        <p className="m-0 mb-2 font-ui text-xs font-bold tracking-[0.04em] text-[var(--color-text-muted)] uppercase">
          {prettifyKey(path)}
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {Object.entries(value).map(([k, v]) => (
            <FieldEditor key={k} path={k} value={v} lang={lang} onChange={(next) => onChange({ ...value, [k]: next })} />
          ))}
        </div>
      </div>
    );
  }

  return null;
}

export function GenericSectionForm({
  initial,
  onSave,
}: {
  initial: Record<string, unknown>;
  onSave: (content: Record<string, unknown>) => Promise<{ error?: string } | void>;
}) {
  const [content, setContent] = useState(initial as Record<string, Json>);
  const [lang, setLang] = useState<"vi" | "en">("vi");

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-5 p-6">
        <LangToggle value={lang} onChange={setLang} />
        {Object.entries(content).map(([key, value]) => (
          <FieldEditor
            key={key}
            path={key}
            value={value}
            lang={lang}
            onChange={(next) => setContent({ ...content, [key]: next })}
          />
        ))}
      </div>
      <SaveBar onSave={() => onSave(content)} />
    </div>
  );
}
