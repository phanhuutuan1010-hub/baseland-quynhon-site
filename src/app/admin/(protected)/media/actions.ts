"use server";

import { randomUUID } from "node:crypto";
import { del } from "@vercel/blob";
import { prisma } from "@/lib/server/db";
import { requireRole } from "@/lib/server/auth";
import { activityLogWrite } from "@/lib/server/activityLog";
import type { MediaKind } from "@prisma/client";
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

  // Id generated here so the audit row can share the insert's transaction.
  const id = randomUUID();
  await prisma.$transaction([
    prisma.media.create({
      data: {
        id,
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
    }),
    activityLogWrite({ userId: user.id, action: "media.create", entityType: "Media", entityId: id }),
  ]);
  // No revalidatePath: the library/picker add the new item to their own
  // client state, and revalidating would re-render the whole media page
  // into every upload's response.
  return { id };
}

export async function updateMedia(id: string, input: unknown): Promise<ActionResult> {
  const user = await requireRole("ADMIN");
  const parsed = updateMediaSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" };
  const d = parsed.data;

  try {
    await prisma.$transaction([
      prisma.media.update({
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
      }),
      activityLogWrite({ userId: user.id, action: "media.update", entityType: "Media", entityId: id }),
    ]);
  } catch (err) {
    if ((err as { code?: string }).code === "P2025") return { error: "Không tìm thấy media" };
    throw err;
  }
  return {};
}

export async function deleteMedia(id: string): Promise<ActionResult> {
  const user = await requireRole("ADMIN");
  const media = await prisma.media.findUnique({ where: { id }, select: { url: true } });
  if (!media) return { error: "Không tìm thấy media" };

  await del(media.url).catch(() => {
    // Blob object may already be gone (e.g. deleted directly on Vercel) —
    // still proceed to remove the DB row so the library doesn't get stuck.
  });
  await prisma.$transaction([
    prisma.media.delete({ where: { id } }),
    activityLogWrite({ userId: user.id, action: "media.delete", entityType: "Media", entityId: id }),
  ]);
  return {};
}

// Media Picker: filtered in the DB instead of shipping every row to the
// browser and filtering there.
export async function listMedia(kind?: MediaKind) {
  await requireRole("ADMIN");
  return prisma.media.findMany({
    where: kind ? { kind } : undefined,
    orderBy: { createdAt: "desc" },
    select: {
      id: true, filename: true, url: true, mimeType: true, size: true, kind: true,
      titleVi: true, titleEn: true, altVi: true, altEn: true, captionVi: true, captionEn: true,
      focalX: true, focalY: true, requireLeadForDownload: true, createdAt: true,
    },
  });
}
