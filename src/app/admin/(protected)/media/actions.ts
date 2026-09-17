"use server";

import { revalidatePath } from "next/cache";
import { del } from "@vercel/blob";
import { prisma } from "@/lib/server/db";
import { requireRole } from "@/lib/server/auth";
import { logActivity } from "@/lib/server/activityLog";
import { isAllowedMimeType, kindForMimeType } from "@/lib/server/media";
import { createMediaSchema, updateMediaSchema } from "@/lib/server/validation/media";

type ActionResult = { error?: string };

// Re-validates what the upload route's token constraints already enforced —
// defense in depth, since this action is the one write path that actually
// persists a Media row (see src/app/api/media/upload/route.ts for why the
// file bytes themselves are never re-inspected server-side).
export async function createMedia(input: unknown): Promise<ActionResult & { id?: string }> {
  const user = await requireRole("ADMIN");
  const parsed = createMediaSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" };
  const d = parsed.data;

  if (!isAllowedMimeType(d.mimeType)) return { error: "Định dạng file không được hỗ trợ" };
  const kind = kindForMimeType(d.mimeType);
  if (!kind) return { error: "Định dạng file không được hỗ trợ" };

  const media = await prisma.media.create({
    data: {
      filename: d.filename,
      url: d.url,
      mimeType: d.mimeType,
      size: d.size,
      width: d.width,
      height: d.height,
      kind,
      titleVi: d.titleVi,
      titleEn: d.titleEn,
      altVi: d.altVi || "",
      altEn: d.altEn || "",
    },
  });

  await logActivity({ userId: user.id, action: "media.create", entityType: "Media", entityId: media.id });
  revalidatePath("/admin/media");
  return { id: media.id };
}

export async function updateMedia(id: string, input: unknown): Promise<ActionResult> {
  const user = await requireRole("ADMIN");
  const parsed = updateMediaSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" };
  const d = parsed.data;

  const existing = await prisma.media.findUnique({ where: { id } });
  if (!existing) return { error: "Không tìm thấy media" };

  await prisma.media.update({
    where: { id },
    data: {
      titleVi: d.titleVi,
      titleEn: d.titleEn,
      altVi: d.altVi || "",
      altEn: d.altEn || "",
      captionVi: d.captionVi || null,
      captionEn: d.captionEn || null,
      focalX: d.focalX,
      focalY: d.focalY,
      requireLeadForDownload: d.requireLeadForDownload,
    },
  });

  await logActivity({ userId: user.id, action: "media.update", entityType: "Media", entityId: id });
  revalidatePath("/admin/media");
  return {};
}

export async function deleteMedia(id: string): Promise<ActionResult> {
  const user = await requireRole("ADMIN");
  const media = await prisma.media.findUnique({ where: { id } });
  if (!media) return { error: "Không tìm thấy media" };

  await del(media.url).catch(() => {
    // Blob object may already be gone (e.g. deleted directly on Vercel) —
    // still proceed to remove the DB row so the library doesn't get stuck.
  });
  await prisma.media.delete({ where: { id } });
  await logActivity({ userId: user.id, action: "media.delete", entityType: "Media", entityId: id });
  revalidatePath("/admin/media");
  return {};
}

export async function listMedia() {
  await requireRole("ADMIN");
  return prisma.media.findMany({ orderBy: { createdAt: "desc" } });
}
