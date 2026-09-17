"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AdminTextField } from "@/components/admin/AdminField";
import { createProject } from "../actions";

export function NewProjectForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [value, setValue] = useState({ slug: "", name: "", categoryVi: "", categoryEn: "", statusLabelVi: "Đang triển khai", statusLabelEn: "In progress" });

  function submit() {
    startTransition(async () => {
      const result = await createProject(value);
      if (result.error) {
        setError(result.error);
      } else if (result.id) {
        router.push(`/admin/projects/${result.id}`);
      }
    });
  }

  return (
    <div className="flex max-w-140 flex-col gap-5 rounded-sm border border-[var(--color-border)] bg-[var(--color-warm-white)] p-6">
      <AdminTextField label="Slug (vd: qterra)" value={value.slug} onChange={(v) => setValue({ ...value, slug: v })} />
      <AdminTextField label="Tên dự án" value={value.name} onChange={(v) => setValue({ ...value, name: v })} />
      <div className="grid grid-cols-2 gap-4">
        <AdminTextField label="Loại hình (VI)" value={value.categoryVi} onChange={(v) => setValue({ ...value, categoryVi: v })} />
        <AdminTextField label="Loại hình (EN)" value={value.categoryEn} onChange={(v) => setValue({ ...value, categoryEn: v })} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <AdminTextField label="Trạng thái hiển thị (VI)" value={value.statusLabelVi} onChange={(v) => setValue({ ...value, statusLabelVi: v })} />
        <AdminTextField label="Trạng thái hiển thị (EN)" value={value.statusLabelEn} onChange={(v) => setValue({ ...value, statusLabelEn: v })} />
      </div>
      {error && <p className="m-0 font-body text-sm text-[var(--color-error)]">{error}</p>}
      <button
        type="button"
        onClick={submit}
        disabled={pending}
        className="self-start rounded-xs bg-[var(--color-brand-green)] px-6 py-2.5 font-ui text-sm font-bold tracking-[0.04em] text-[var(--color-warm-white)] uppercase disabled:opacity-60"
      >
        {pending ? "Đang tạo…" : "Tạo dự án (bản nháp)"}
      </button>
      <p className="m-0 font-body text-xs text-[var(--color-text-muted)]">
        Sau khi tạo, bạn sẽ được chuyển sang trang chỉnh sửa đầy đủ (Hero, CTA, các section...). Dự án mới luôn bắt đầu ở
        trạng thái Nháp — chỉ hiện công khai sau khi bạn bấm Publish.
      </p>
    </div>
  );
}
