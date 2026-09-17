import Link from "next/link";
import { requireRole } from "@/lib/server/auth";
import { prisma } from "@/lib/server/db";
import { CategoryManager } from "./CategoryManager";

export const metadata = { title: "Tin tức" };

const STATUS_LABEL: Record<string, string> = { DRAFT: "Nháp", PUBLISHED: "Đã publish" };
const STATUS_COLOR: Record<string, string> = {
  DRAFT: "bg-[var(--color-sand)] text-[var(--color-text-muted)]",
  PUBLISHED: "bg-[var(--color-brand-green)] text-[var(--color-warm-white)]",
};

export default async function AdminNewsPage() {
  await requireRole("ADMIN");

  const [articles, categories] = await Promise.all([
    prisma.news.findMany({ include: { category: true }, orderBy: { createdAt: "desc" } }),
    prisma.category.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="m-0 font-ui text-2xl font-bold text-[var(--color-charcoal)]">Tin tức</h1>
          <p className="m-0 mt-1 font-body text-sm text-[var(--color-text-muted)]">Tạo, chỉnh sửa và publish bài viết.</p>
        </div>
        <Link
          href="/admin/news/new"
          className="rounded-xs bg-[var(--color-brand-green)] px-5 py-2.5 font-ui text-sm font-bold tracking-[0.04em] text-[var(--color-warm-white)] uppercase no-underline hover:opacity-90"
        >
          + Thêm bài viết
        </Link>
      </div>

      <CategoryManager initial={categories.map((c) => ({ id: c.id, key: c.key, labelVi: c.labelVi, labelEn: c.labelEn }))} />

      <div className="flex flex-col divide-y divide-[var(--color-border)] rounded-sm border border-[var(--color-border)] bg-[var(--color-warm-white)]">
        {articles.length === 0 && <p className="m-0 p-6 font-body text-sm text-[var(--color-text-muted)]">Chưa có bài viết nào.</p>}
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/admin/news/${article.id}`}
            className="flex items-center justify-between gap-4 px-5 py-4 no-underline hover:bg-[var(--color-sand)]"
          >
            <div>
              <p className="m-0 font-ui text-sm font-semibold text-[var(--color-charcoal)]">{article.titleVi}</p>
              <p className="m-0 mt-0.5 font-body text-xs text-[var(--color-text-muted)]">
                /news/{article.slug} · {article.category.labelVi}
              </p>
            </div>
            <span className={`rounded-full px-3 py-1 font-ui text-[10px] font-bold tracking-[0.05em] uppercase ${STATUS_COLOR[article.status]}`}>
              {STATUS_LABEL[article.status]}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
