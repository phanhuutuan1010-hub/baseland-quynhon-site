import Link from "next/link";
import { requireRole } from "@/lib/server/auth";
import { prisma } from "@/lib/server/db";
import { MediaLibraryClient } from "./MediaLibraryClient";
import type { MediaItem } from "./types";

export const metadata = { title: "Media" };

const PAGE_SIZE = 48;

export default async function MediaLibraryPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  await requireRole("ADMIN");
  const page = Math.max(1, Number((await searchParams).page) || 1);

  const [rows, total] = await Promise.all([
    prisma.media.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        id: true,
        filename: true,
        url: true,
        mimeType: true,
        size: true,
        kind: true,
        titleVi: true,
        titleEn: true,
        altVi: true,
        altEn: true,
        captionVi: true,
        captionEn: true,
        focalX: true,
        focalY: true,
        requireLeadForDownload: true,
        createdAt: true,
      },
    }),
    prisma.media.count(),
  ]);
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const items: MediaItem[] = rows.map((m) => ({
    ...m,
    captionVi: m.captionVi ?? "",
    captionEn: m.captionEn ?? "",
    createdAt: m.createdAt.toISOString(),
  }));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="m-0 font-ui text-2xl font-bold text-[var(--color-charcoal)]">Media</h1>
        <p className="m-0 mt-1 font-body text-sm text-[var(--color-text-muted)]">
          Ảnh/video/tài liệu upload từ đây có thể chọn lại trong Dự án, Tin tức và Cài đặt. Tổng {total} file.
        </p>
      </div>
      {/* key: each page is its own client state — otherwise useState would keep the previous page's items. */}
      <MediaLibraryClient key={page} initial={items} />
      {pageCount > 1 && (
        <nav className="flex items-center gap-4 font-ui text-sm" aria-label="Phân trang Media">
          {page > 1 ? <Link href={`/admin/media?page=${page - 1}`}>← Trang trước</Link> : <span className="opacity-40">← Trang trước</span>}
          <span className="text-[var(--color-text-muted)]">
            Trang {page}/{pageCount}
          </span>
          {page < pageCount ? <Link href={`/admin/media?page=${page + 1}`}>Trang sau →</Link> : <span className="opacity-40">Trang sau →</span>}
        </nav>
      )}
    </div>
  );
}
