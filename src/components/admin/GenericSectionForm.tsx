"use client";

import { createContext, useContext, useState } from "react";
import { AdminTextField, AdminTextAreaField } from "@/components/admin/AdminField";
import { MediaPickerField } from "@/components/admin/MediaPickerField";
import { LangToggle } from "@/components/admin/LangToggle";
import { SaveBar } from "@/components/admin/SaveBar";
import { RepeatableStringList } from "@/components/admin/RepeatableList";

// Human-friendly label from a camelCase/snake_case field key — not a
// per-section label map, since this form is intentionally generic (see its
// doc comment in validation/project.ts for why).
// Optional Vietnamese labels for field keys that read poorly when
// auto-prettified; any key not listed falls back to prettifyKey's output.
const FIELD_LABELS: Record<string, string> = {
  eyebrow: "Dòng nhỏ trên tiêu đề",
  headline: "Tiêu đề",
  body: "Mô tả",
  dateLabel: "Nhãn ngày",
  date: "Ngày (VD: 30/10/2026)",
  dateCaption: "Ghi chú dưới ngày",
  steps: "Các bước",
  title: "Tiêu đề",
  tag: "Nhãn nổi bật (để trống = thẻ thường)",
  ctaLeadLabel: "Nút tư vấn — chữ",
  ctaLeadHref: "Nút tư vấn — link",
  ctaCallLabel: "Nút gọi — chữ (số lấy từ hotline chung)",
  ctaZaloLabel: "Nút Zalo — chữ",
  zaloUrl: "Link Zalo (để trống = ẩn nút)",
  backgroundImage: "Ảnh nền (để trống = dùng ảnh hero)",
  area: "Diện tích (VD: 32 – 38 m²)",
  share: "Quỹ căn / số căn",
  areaLabel: "Nhãn cột diện tích",
  shareLabel: "Nhãn cột quỹ căn",
  tableTitle: "Tiêu đề bảng cơ cấu căn (để trống = ẩn bảng)",
  typicalFloor: "Mặt bằng tầng điển hình",
  orientations: "Các hướng view",
  priceFacts: "Giá dự kiến",
  paymentTitle: "Tiêu đề phương thức thanh toán",
  paymentPlans: "Phương thức thanh toán",
  paymentNote: "Ghi chú dưới bảng thanh toán",
  summary: "Tóm tắt",
  milestone: "Mốc (VD: T+7)",
  links: "Liên kết tham chiếu",
  journey: "Nhóm thời gian di chuyển",
  tier: "Mốc thời gian",
  landmarks: "Địa điểm",
  characteristics: "Đặc điểm",
  verified: "Đã xác nhận",
  source: "Nguồn",
  lastUpdated: "Cập nhật lần cuối",
  tourUrl: "Link tour 360°",
  allowEmbed: "Cho nhúng tại chỗ trên desktop (tắt = luôn mở tab mới)",
  poster: "Ảnh poster (để trống = dùng ảnh hero)",
  playLabel: "Nút play — chữ",
  fullscreenLabel: "Nút toàn màn hình — chữ",
  newTabLabel: "Nút mở tab mới — chữ",
  heroCtaLabel: "Nút phụ ở Hero (để trống = ẩn)",
  ctaLabel: "Nút CTA — chữ",
  ctaNote: "Ghi chú trên form tư vấn",
  leadSource: "Lead source (để trống = <slug>-360)",
  note: "Ghi chú",
  benefits: "Quyền lợi",
  phoneLabel: "Nhãn ô SĐT",
  phonePlaceholder: "Gợi ý trong ô SĐT",
  phoneError: "Thông báo SĐT sai",
  nameLabel: "Nhãn ô họ tên",
  submitLabel: "Nút gửi — chữ",
  submittingLabel: "Nút gửi — chữ khi đang gửi",
  privacyNote: "Dòng nhỏ trước link bảo mật",
  privacyLinkLabel: "Chữ của link /privacy",
  successMessage: "Thông báo gửi thành công",
  errorMessage: "Thông báo lỗi gửi",
  callLabel: "Nút gọi — chữ (số lấy từ hotline trong Cài đặt)",
  zaloLabel: "Nút Zalo — chữ",
  closeLabel: "Nút đóng — nhãn",
  delaySeconds: "Hiện sau (giây)",
  scrollPercent: "Hoặc khi cuộn tới (% trang)",
  dismissDays: "Đóng thì ẩn (ngày)",
  fallbackName: "Tên lưu khi khách bỏ trống",
  reasons: "Lý do (mục \"Vì sao\")",
  kicker: "Nhãn nhỏ",
  actionLabel: "Nút CTA của mục — chữ (để trống = ẩn)",
  actionHref: "Nút CTA của mục — link (#lead, hoặc call = gọi hotline)",
  navLabel: "Nhãn trên thanh mục lục",
};

function prettifyKey(key: string): string {
  if (FIELD_LABELS[key]) return FIELD_LABELS[key];
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

// Empty value with the same shape as `sample` — used for "+ Thêm" so a new
// list item keeps bilingual `{vi,en}` leaves, nested objects and flags
// instead of collapsing every field to a plain "" string.
function blankLike(sample: Json): Json {
  if (isLocalizedLeaf(sample)) return { vi: "", en: "" };
  if (Array.isArray(sample)) return [];
  if (isPlainObject(sample)) return Object.fromEntries(Object.entries(sample).map(([k, v]) => [k, blankLike(v)]));
  if (typeof sample === "boolean") return false;
  if (typeof sample === "number") return 0;
  return "";
}

function isLocalizedStringArray(value: Json[]): value is { vi: string; en: string }[] {
  return value.length > 0 && value.every((item) => isLocalizedLeaf(item));
}

/** Per-section item shapes keyed by field name (e.g. `reasons`,
 * `priceFacts`) — lets an EMPTY list still offer "+ Thêm" with the right
 * shape, so every project can fill the same fields as Q'Terra. */
const ItemTemplates = createContext<Record<string, Json>>({});

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
    // Every image/video/document URL field across the 21 section types uses
    // one of these exact key names (see lib/project-detail/types.ts) — that
    // naming convention is what lets one generic field detect "this is
    // media", same spirit as isLocalizedLeaf() detecting bilingual leaves
    // by shape rather than a per-section field map.
    if (path === "src" || path === "posterUrl" || path === "avatar") {
      return <MediaPickerField label={prettifyKey(path)} value={value} onChange={onChange} kindFilter="IMAGE" />;
    }
    if (path === "videoUrl") return <MediaPickerField label="Video" value={value} onChange={onChange} kindFilter="VIDEO" />;
    if (path === "fileUrl") return <MediaPickerField label="Tài liệu" value={value} onChange={onChange} kindFilter="DOCUMENT" />;
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
    return <ArrayEditor path={path} value={value} lang={lang} onChange={onChange} />;
  }

  if (isPlainObject(value)) {
    return <ObjectEditor path={path} value={value} lang={lang} onChange={onChange} />;
  }

  return null;
}

function ArrayEditor({
  path,
  value,
  lang,
  onChange,
}: {
  path: string;
  value: Json[];
  lang: "vi" | "en";
  onChange: (next: Json) => void;
}) {
  const template = useContext(ItemTemplates)[path];
  const sample = value[0] ?? template;
  {
    if (sample === undefined || value.every((v) => typeof v === "string") && typeof sample === "string") {
      return (
        <div>
          <p className="mb-2 font-ui text-xs font-semibold tracking-[0.04em] text-[var(--color-text-muted)] uppercase">
            {prettifyKey(path)}
          </p>
          <RepeatableStringList items={value as string[]} onChange={(items) => onChange(items)} itemLabel={prettifyKey(path)} />
        </div>
      );
    }

    if (isLocalizedStringArray(value) || (value.length === 0 && isLocalizedLeaf(sample))) {
      const items = value as { vi: string; en: string }[];
      return (
        <div className="flex flex-col gap-2">
          <p className="m-0 font-ui text-xs font-semibold tracking-[0.04em] text-[var(--color-text-muted)] uppercase">
            {prettifyKey(path)}
          </p>
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                value={item[lang]}
                onChange={(e) => {
                  const next = [...items];
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
            onChange([...value, blankLike(sample)]);
          }}
          className="self-start rounded-xs border border-dashed border-[var(--color-border)] px-4 py-2 font-ui text-xs font-bold tracking-[0.04em] uppercase hover:bg-[var(--color-sand)]"
        >
          + Thêm {prettifyKey(path).toLowerCase()}
        </button>
      </div>
    );
  }
}

function ObjectEditor({
  path,
  value,
  lang,
  onChange,
}: {
  path: string;
  value: Record<string, Json>;
  lang: "vi" | "en";
  onChange: (next: Json) => void;
}) {
  {
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
}

export function GenericSectionForm({
  initial,
  onSave,
  itemTemplates = {},
}: {
  initial: Record<string, unknown>;
  onSave: (content: Record<string, unknown>) => Promise<{ error?: string } | void>;
  itemTemplates?: Record<string, unknown>;
}) {
  const [content, setContent] = useState(initial as Record<string, Json>);
  const [lang, setLang] = useState<"vi" | "en">("vi");

  return (
    <ItemTemplates.Provider value={itemTemplates as Record<string, Json>}>
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
    </ItemTemplates.Provider>
  );
}
