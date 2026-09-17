import { requireRole } from "@/lib/server/auth";
import { prisma } from "@/lib/server/db";
import { NewNewsForm } from "./NewNewsForm";

export const metadata = { title: "Thêm bài viết" };

export default async function NewNewsPage() {
  await requireRole("ADMIN");
  const categories = await prisma.category.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="m-0 font-ui text-2xl font-bold text-[var(--color-charcoal)]">Thêm bài viết mới</h1>
      <NewNewsForm categories={categories.map((c) => ({ id: c.id, labelVi: c.labelVi }))} />
    </div>
  );
}
