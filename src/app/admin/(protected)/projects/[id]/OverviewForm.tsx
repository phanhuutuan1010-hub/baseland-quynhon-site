"use client";

import { useState } from "react";
import { AdminTextField, AdminTextAreaField } from "@/components/admin/AdminField";
import { MediaPickerField } from "@/components/admin/MediaPickerField";
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
