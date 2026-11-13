"use client";

import { useState } from "react";
import { AdminTextField } from "@/components/admin/AdminField";
import { MediaPickerField } from "@/components/admin/MediaPickerField";
import { SaveBar } from "@/components/admin/SaveBar";
import { updateContactSettings } from "./actions";
import type { RefContact } from "@/lib/siteChrome";

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
  quickChatZalo: string;
  quickChatWhatsapp: string;
  refContacts: RefContact[];
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
        <div className="grid grid-cols-2 gap-5">
          <AdminTextField
            label="Số Zalo — nút Tư vấn nhanh (VI), vd 84373910109"
            value={value.quickChatZalo}
            onChange={set("quickChatZalo")}
          />
          <AdminTextField
            label="Số WhatsApp — nút Quick chat (EN), vd 84373910109"
            value={value.quickChatWhatsapp}
            onChange={set("quickChatWhatsapp")}
          />
        </div>
        <div className="grid grid-cols-3 gap-5">
          <AdminTextField label="Facebook (tuỳ chọn)" value={value.facebookUrl} onChange={set("facebookUrl")} />
          <AdminTextField label="Zalo (tuỳ chọn)" value={value.zaloUrl} onChange={set("zaloUrl")} />
          <AdminTextField label="YouTube (tuỳ chọn)" value={value.youtubeUrl} onChange={set("youtubeUrl")} />
        </div>
        <RefContactsEditor rows={value.refContacts} onChange={(refContacts) => setValue((prev) => ({ ...prev, refContacts }))} />
      </div>
      <SaveBar onSave={() => updateContactSettings(value)} />
    </div>
  );
}

const EMPTY_ROW: RefContact = { ref: "", name: "", phone: "", zalo: "", title: "", avatar: "" };

/** ?ref= table: a visitor opening baselandquynhon.com/...?ref=<mã> sees
 * that person's phone + Zalo on every call button (kept 30 days). */
function RefContactsEditor({ rows, onChange }: { rows: RefContact[]; onChange: (rows: RefContact[]) => void }) {
  const update = (i: number, key: keyof RefContact, v: string) =>
    onChange(rows.map((r, j) => (j === i ? { ...r, [key]: key === "ref" ? v.toLowerCase().replace(/[^a-z0-9_-]/g, "") : v } : r)));

  return (
    <div className="flex flex-col gap-3 border-t border-[var(--color-border)] pt-5">
      <div>
        <p className="m-0 font-ui text-sm font-bold text-[var(--color-charcoal)]">Số điện thoại theo link giới thiệu (?ref=)</p>
        <p className="m-0 mt-1 font-body text-[13px] text-[var(--color-text-muted)]">
          Khách mở link có <code>?ref=mã</code> (vd <code>/projects/qterra?ref=phuoc</code>) sẽ thấy số và Zalo của người đó
          trên mọi nút gọi, trong 30 ngày. Không có ref hoặc mã không có trong bảng → dùng Hotline ở trên.
          Zalo để trống = dùng số điện thoại. Tên, chức danh và ảnh hiện ở mục &quot;Người tư vấn&quot; trong pop-up video call
          (không có ảnh thì ẩn ảnh).
        </p>
      </div>
      {rows.map((row, i) => (
        <div key={i} className="flex flex-col gap-3 rounded-xs border border-[var(--color-border)] p-3">
          <div className="grid grid-cols-[1fr_1.4fr_1.4fr_1.4fr_auto] items-end gap-3">
            <AdminTextField label="Mã ref" value={row.ref} onChange={(v) => update(i, "ref", v)} />
            <AdminTextField label="Tên" value={row.name} onChange={(v) => update(i, "name", v)} />
            <AdminTextField label="Số điện thoại" value={row.phone} onChange={(v) => update(i, "phone", v)} />
            <AdminTextField label="Zalo (tuỳ chọn)" value={row.zalo} onChange={(v) => update(i, "zalo", v)} />
            <button
              type="button"
              onClick={() => onChange(rows.filter((_, j) => j !== i))}
              className="mb-1 cursor-pointer rounded-xs border border-[var(--color-border)] bg-transparent px-3 py-2 font-ui text-xs text-[var(--color-error)]"
            >
              Xoá
            </button>
          </div>
          <div className="grid grid-cols-[1fr_2fr] items-start gap-3">
            <AdminTextField label="Chức danh (tuỳ chọn)" value={row.title ?? ""} onChange={(v) => update(i, "title", v)} />
            <MediaPickerField label="Ảnh đại diện (tuỳ chọn)" value={row.avatar ?? ""} onChange={(v) => update(i, "avatar", v)} kindFilter="IMAGE" />
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...rows, EMPTY_ROW])}
        className="self-start cursor-pointer rounded-xs border border-[var(--color-brand-green)] bg-transparent px-4 py-2 font-ui text-xs font-bold text-[var(--color-brand-green)]"
      >
        + Thêm người
      </button>
    </div>
  );
}
