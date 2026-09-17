import { requireRole } from "@/lib/server/auth";
import { prisma } from "@/lib/server/db";
import { HOMEPAGE_SECTION_LABELS, HOMEPAGE_SECTION_ORDER } from "@/lib/server/validation/homepageLabels";
import { SectionListClient } from "./SectionListClient";

export const metadata = { title: "Trang chủ" };

export default async function AdminHomepagePage() {
  await requireRole("ADMIN");

  const rows = await prisma.homepageSection.findMany({ orderBy: { order: "asc" } });

  // If no rows exist yet (fresh DB before any seed/edit), show the 9
  // sections in their default order so Admin can still enable/reorder them
  // — the edit action creates the row on first save.
  const sections =
    rows.length > 0
      ? rows.map((r) => ({ type: r.type, enabled: r.enabled }))
      : HOMEPAGE_SECTION_ORDER.map((type) => ({ type, enabled: true }));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="m-0 font-ui text-2xl font-bold text-[var(--color-charcoal)]">Trang chủ</h1>
        <p className="m-0 mt-1 font-body text-sm text-[var(--color-text-muted)]">
          Ẩn/hiện, sắp xếp thứ tự và chỉnh nội dung từng section của trang chủ.
        </p>
      </div>

      <SectionListClient
        initial={sections.map((s) => ({ type: s.type, enabled: s.enabled, label: HOMEPAGE_SECTION_LABELS[s.type] }))}
      />
    </div>
  );
}
