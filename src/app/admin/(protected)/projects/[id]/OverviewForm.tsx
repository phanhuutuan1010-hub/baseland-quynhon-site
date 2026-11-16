"use client";

import { useState } from "react";
import { AdminTextField, AdminTextAreaField } from "@/components/admin/AdminField";
import { MediaPickerField } from "@/components/admin/MediaPickerField";
import { CardImageField } from "@/components/admin/CardImageField";
import { SaveBar } from "@/components/admin/SaveBar";
import { updateProjectOverview } from "../actions";
import type { ProjectOverviewValue } from "./types";

export function OverviewForm({ projectId, initial }: { projectId: string; initial: ProjectOverviewValue }) {
  const [value, setValue] = useState(initial);
  const set = <K extends keyof ProjectOverviewValue>(key: K) => (v: ProjectOverviewValue[K]) =>
    setValue((prev) => ({ ...prev, [key]: v }));

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-6 p-6">
        <section className="flex flex-col gap-4">
          <h2 className="m-0 font-ui text-sm font-bold tracking-[0.04em] text-[var(--color-charcoal)] uppercase">Định danh</h2>
          <AdminTextField label="Tên dự án" value={value.name} onChange={set("name")} />
          <div className="grid grid-cols-2 gap-4">
            <AdminTextField label="Loại hình (VI)" value={value.categoryVi} onChange={set("categoryVi")} />
            <AdminTextField label="Loại hình (EN)" value={value.categoryEn} onChange={set("categoryEn")} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <AdminTextField label="Trạng thái hiển thị (VI)" value={value.statusLabelVi} onChange={set("statusLabelVi")} />
            <AdminTextField label="Trạng thái hiển thị (EN)" value={value.statusLabelEn} onChange={set("statusLabelEn")} />
          </div>
          <AdminTextField label="Theme (vd: simona, phu-gia, để trống = mặc định)" value={value.theme} onChange={set("theme")} />
          <label className="flex items-center gap-2 font-ui text-xs font-semibold tracking-[0.04em] uppercase">
            <input type="checkbox" checked={value.verificationRequired} onChange={(e) => set("verificationRequired")(e.target.checked)} />
            Chỉ hiện field đã VERIFIED trong mục Minh bạch dữ liệu
          </label>
        </section>

        <section className="flex flex-col gap-4 border-t border-[var(--color-border)] pt-6">
          <h2 className="m-0 font-ui text-sm font-bold tracking-[0.04em] text-[var(--color-charcoal)] uppercase">Hero</h2>
          <div className="grid grid-cols-2 gap-4">
            <AdminTextField label="Eyebrow (VI)" value={value.heroEyebrowVi} onChange={set("heroEyebrowVi")} />
            <AdminTextField label="Eyebrow (EN)" value={value.heroEyebrowEn} onChange={set("heroEyebrowEn")} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <AdminTextField label="Địa chỉ hiển thị (VI)" value={value.heroAddressLineVi} onChange={set("heroAddressLineVi")} />
            <AdminTextField label="Địa chỉ hiển thị (EN)" value={value.heroAddressLineEn} onChange={set("heroAddressLineEn")} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <AdminTextAreaField label="Mô tả ngắn (VI)" value={value.heroSubheadVi} onChange={set("heroSubheadVi")} rows={2} />
            <AdminTextAreaField label="Mô tả ngắn (EN)" value={value.heroSubheadEn} onChange={set("heroSubheadEn")} rows={2} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <AdminTextField label="CTA khám phá (VI)" value={value.heroCtaExploreLabelVi} onChange={set("heroCtaExploreLabelVi")} />
            <AdminTextField label="CTA khám phá (EN)" value={value.heroCtaExploreLabelEn} onChange={set("heroCtaExploreLabelEn")} />
          </div>
          <AdminTextField label="CTA khám phá — href" value={value.heroCtaExploreHref} onChange={set("heroCtaExploreHref")} />
          <div className="grid grid-cols-2 gap-4">
            <AdminTextField label="CTA tư vấn (VI)" value={value.heroCtaConsultLabelVi} onChange={set("heroCtaConsultLabelVi")} />
            <AdminTextField label="CTA tư vấn (EN)" value={value.heroCtaConsultLabelEn} onChange={set("heroCtaConsultLabelEn")} />
          </div>
          <AdminTextField label="CTA tư vấn — href" value={value.heroCtaConsultHref} onChange={set("heroCtaConsultHref")} />
          <MediaPickerField label="Ảnh hero (để trống = dùng placeholder)" value={value.heroImageSrc} onChange={set("heroImageSrc")} kindFilter="IMAGE" />
          <div className="flex flex-col gap-2 rounded-xs border border-[var(--color-border)] p-3">
            <span className="font-ui text-xs font-semibold tracking-[0.04em] uppercase">Tiêu điểm ảnh hero — vị trí chủ thể trong ảnh (%)</span>
            <div className="grid grid-cols-2 gap-4">
              <AdminTextField label="Ngang — 0 = mép trái, 100 = mép phải" value={value.heroFocusX} onChange={set("heroFocusX")} />
              <AdminTextField label="Dọc — 0 = mép trên, 100 = mép dưới" value={value.heroFocusY} onChange={set("heroFocusY")} />
            </div>
            <span className="font-body text-xs text-[var(--color-text-muted)]">
              VD tòa tháp nằm ở khoảng 60% chiều ngang ảnh → nhập 60. Hero luôn giữ chủ thể trong khung: điện thoại canh giữa, desktop tự đẩy chủ thể sang
              phần bên phải (khối chữ chiếm 55% bên trái). Để trống = cắt ảnh quanh điểm lấy nét trong Thư viện Media như cũ.
            </span>
            <span className="mt-1 font-ui text-xs font-semibold tracking-[0.04em] uppercase">Cắt bớt mép ảnh hero (% — không sửa file ảnh)</span>
            <div className="grid grid-cols-4 gap-3">
              <AdminTextField label="Trên" value={value.heroTrimTop} onChange={set("heroTrimTop")} />
              <AdminTextField label="Phải" value={value.heroTrimRight} onChange={set("heroTrimRight")} />
              <AdminTextField label="Dưới" value={value.heroTrimBottom} onChange={set("heroTrimBottom")} />
              <AdminTextField label="Trái" value={value.heroTrimLeft} onChange={set("heroTrimLeft")} />
            </div>
            <span className="font-body text-xs text-[var(--color-text-muted)]">
              Dải ảnh không hiển thị trên tablet/desktop (VD logo in sẵn ở góc ảnh nằm dưới thanh menu). Điện thoại chỉ hiện phần ảnh quanh chủ thể nên không
              áp dụng. Để trống = không cắt.
            </span>
          </div>
          <CardImageField value={value.cardImageSrc} onChange={set("cardImageSrc")} />
          <label className="flex flex-col gap-1.5">
            <span className="font-ui text-xs font-semibold tracking-[0.04em] uppercase">Bố cục trang</span>
            <select
              value={value.heroLayout}
              onChange={(e) => set("heroLayout")(e.target.value as ProjectOverviewValue["heroLayout"])}
              className="rounded-xs border border-[var(--color-border)] bg-white px-3 py-2.5 font-body text-sm"
            >
              <option value="compact">Chuẩn Q&apos;Terra (mặc định cho mọi dự án)</option>
              <option value="full">Cũ — bố cục đầy đủ</option>
            </select>
            <span className="font-body text-xs text-[var(--color-text-muted)]">
              Chuẩn: Hero → Vì sao → Vị trí → Kiến trúc → Chọn căn → 360° → Tiện ích → Video → Giá → Kiểm chứng → Form. Mục nào chưa có
              dữ liệu thì tự ẩn. Vì sao = Tháp → Lý do (reasons), nếu trống thì hiện 2 tháp. Thư viện ảnh → trong Vị trí · Mặt bằng → popup
              ở Căn hộ · Giai đoạn bán hàng (ngày) → trong Giá · Pháp lý → trong Kiểm chứng. Dòng số liệu trống → lấy từ Số liệu (Stats).
            </span>
          </label>
          <div className="grid grid-cols-2 gap-4">
            <AdminTextField label="Badge trên tên dự án (VI)" value={value.heroBadgeVi} onChange={set("heroBadgeVi")} />
            <AdminTextField label="Badge (EN)" value={value.heroBadgeEn} onChange={set("heroBadgeEn")} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <AdminTextField label="Dòng số liệu, ngăn bằng · (VI)" value={value.heroFactsVi} onChange={set("heroFactsVi")} />
            <AdminTextField label="Dòng số liệu (EN)" value={value.heroFactsEn} onChange={set("heroFactsEn")} />
          </div>
        </section>

        <section className="flex flex-col gap-4 border-t border-[var(--color-border)] pt-6">
          <h2 className="m-0 font-ui text-sm font-bold tracking-[0.04em] text-[var(--color-charcoal)] uppercase">CTA cuối trang</h2>
          <div className="grid grid-cols-2 gap-4">
            <AdminTextField label="Eyebrow (VI)" value={value.ctaEyebrowVi} onChange={set("ctaEyebrowVi")} />
            <AdminTextField label="Eyebrow (EN)" value={value.ctaEyebrowEn} onChange={set("ctaEyebrowEn")} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <AdminTextField label="Tiêu đề (VI)" value={value.ctaHeadlineVi} onChange={set("ctaHeadlineVi")} />
            <AdminTextField label="Tiêu đề (EN)" value={value.ctaHeadlineEn} onChange={set("ctaHeadlineEn")} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <AdminTextAreaField label="Nội dung (VI)" value={value.ctaBodyVi} onChange={set("ctaBodyVi")} rows={2} />
            <AdminTextAreaField label="Nội dung (EN)" value={value.ctaBodyEn} onChange={set("ctaBodyEn")} rows={2} />
          </div>
          <div className="flex flex-col gap-3 rounded-xs border border-[var(--color-border)] p-4">
            <p className="m-0 font-ui text-xs font-bold tracking-[0.04em] uppercase">Form tư vấn — nhóm chip chọn 1 (không bắt buộc)</p>
            <p className="m-0 font-body text-xs text-[var(--color-text-muted)]">
              Mỗi dòng một lựa chọn, dạng <code>Tiếng Việt | English</code> (bỏ phần English nếu giống nhau). Để trống = ẩn nhóm đó.
            </p>
            {value.qualifiers.map((q, i) => {
              const setQ = (patch: Partial<typeof q>) =>
                setValue((prev) => ({ ...prev, qualifiers: prev.qualifiers.map((x, j) => (j === i ? { ...x, ...patch } : x)) }));
              return (
                <div key={q.key} className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_2fr]">
                  <AdminTextField label={`Nhãn nhóm (VI) — ${q.key === "region" ? "khu vực" : "nhu cầu"}`} value={q.labelVi} onChange={(v) => setQ({ labelVi: v })} />
                  <AdminTextField label="Nhãn nhóm (EN)" value={q.labelEn} onChange={(v) => setQ({ labelEn: v })} />
                  <AdminTextAreaField label="Lựa chọn" value={q.optionsText} onChange={(v) => setQ({ optionsText: v })} rows={4} />
                </div>
              );
            })}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <AdminTextField label="Nhãn 'Gọi ngay' (VI)" value={value.ctaCallNowLabelVi} onChange={set("ctaCallNowLabelVi")} />
            <AdminTextField label="Nhãn 'Gọi ngay' (EN)" value={value.ctaCallNowLabelEn} onChange={set("ctaCallNowLabelEn")} />
          </div>
          <AdminTextField label="Lead source (định danh dự án cho form liên hệ)" value={value.ctaLeadSource} onChange={set("ctaLeadSource")} />
        </section>

        <section className="flex flex-col gap-4 border-t border-[var(--color-border)] pt-6">
          <h2 className="m-0 font-ui text-sm font-bold tracking-[0.04em] text-[var(--color-charcoal)] uppercase">SEO (tuỳ chọn)</h2>
          <p className="m-0 font-body text-xs text-[var(--color-text-muted)]">
            Để trống để dùng tiêu đề/mô tả mặc định được tạo tự động từ tên dự án và mô tả hero.
          </p>
          <AdminTextField label="Tiêu đề SEO (ghi đè)" value={value.seoTitle} onChange={set("seoTitle")} />
          <AdminTextAreaField label="Mô tả SEO (ghi đè)" value={value.seoDescription} onChange={set("seoDescription")} rows={2} />
          <MediaPickerField label="Ảnh Open Graph (ghi đè)" value={value.seoOgImageUrl} onChange={set("seoOgImageUrl")} kindFilter="IMAGE" />
        </section>
      </div>
      <SaveBar onSave={() => updateProjectOverview(projectId, value)} />
    </div>
  );
}
