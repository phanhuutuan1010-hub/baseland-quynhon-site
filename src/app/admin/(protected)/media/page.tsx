import { requireRole } from "@/lib/server/auth";
import { prisma } from "@/lib/server/db";
import { MediaLibraryClient } from "./MediaLibraryClient";
import type { MediaItem } from "./types";

export const metadata = { title: "Media" };

export default async function MediaLibraryPage() {
  await requireRole("ADMIN");
  const rows = await prisma.media.findMany({ orderBy: { createdAt: "desc" } });

  const items: MediaItem[] = rows.map((m) => ({
    id: m.id,
    filename: m.filename,
    url: m.url,
    mimeType: m.mimeType,
    size: m.size,
    kind: m.kind,
    titleVi: m.titleVi,
    titleEn: m.titleEn,
    altVi: m.altVi,
    altEn: m.altEn,
    captionVi: m.captionVi ?? "",
    captionEn: m.captionEn ?? "",
    focalX: m.focalX,
    focalY: m.focalY,
    requireLeadForDownload: m.requireLeadForDownload,
    createdAt: m.createdAt.toISOString(),
  }));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="m-0 font-ui text-2xl font-bold text-[var(--color-charcoal)]">Media</h1>
        <p className="m-0 mt-1 font-body text-sm text-[var(--color-text-muted)]">
          Ảnh/video/tài liệu upload từ đây có thể chọn lại trong Dự án, Tin tức và Cài đặt.
        </p>
      </div>
      <MediaLibraryClient initial={items} />
    </div>
  );
}
