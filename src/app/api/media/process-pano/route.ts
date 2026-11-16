import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { del, put } from "@vercel/blob";
import sharp, { type Metadata } from "sharp";
import { getSessionUser } from "@/lib/server/auth";
import { prisma } from "@/lib/server/db";
import { activityLogWrite } from "@/lib/server/activityLog";
import { PANO_MAX_RAW_BYTES, PANO_MAX_WIDTH, PANO_RAW_PREFIX, PANO_WEBP_QUALITY, publicMediaUrl } from "@/lib/server/media";

// A 6000px WebP re-encode of a 25MB source takes a few seconds.
export const maxDuration = 60;

/**
 * Second half of a 360° upload (see PANO_* in lib/server/media.ts): the
 * browser has already put the raw file at "pano-raw/…" in Blob storage;
 * this re-encodes it to WebP q80 at most 6000px wide (no 2560px cap, no
 * watermark), stores it as a normal Media Library image ("360-….webp"),
 * archives the untouched original privately and deletes the raw copy.
 */
export async function POST(request: Request): Promise<NextResponse> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: "Chưa cấu hình BLOB_READ_WRITE_TOKEN trên server — xem ADMIN_GUIDE.md mục 9." }, { status: 503 });
  }
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Không có quyền upload" }, { status: 403 });
  }

  const body = (await request.json().catch(() => null)) as { url?: string; filename?: string } | null;
  const rawUrl = body?.url ?? "";
  // Only our own Blob store's raw-pano folder — never an arbitrary URL.
  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return NextResponse.json({ error: "Thiếu đường dẫn ảnh" }, { status: 400 });
  }
  if (
    parsed.protocol !== "https:" ||
    !parsed.hostname.endsWith(".public.blob.vercel-storage.com") ||
    !decodeURIComponent(parsed.pathname).startsWith(`/${PANO_RAW_PREFIX}`)
  ) {
    return NextResponse.json({ error: "Đường dẫn ảnh 360° không hợp lệ" }, { status: 400 });
  }

  const removeRaw = () => del(rawUrl).catch((err) => console.error("[process-pano] could not delete raw upload:", err));

  let input: Buffer;
  try {
    const res = await fetch(rawUrl);
    if (!res.ok) throw new Error(String(res.status));
    input = Buffer.from(await res.arrayBuffer());
  } catch {
    return NextResponse.json({ error: "Không đọc được ảnh vừa tải lên — thử lại." }, { status: 502 });
  }
  if (input.length > PANO_MAX_RAW_BYTES) {
    await removeRaw();
    return NextResponse.json({ error: "Ảnh 360° tối đa 25MB." }, { status: 400 });
  }

  let meta: Metadata;
  try {
    meta = await sharp(input).metadata();
  } catch {
    await removeRaw();
    return NextResponse.json({ error: "Không đọc được file ảnh — file có thể bị hỏng hoặc sai định dạng." }, { status: 400 });
  }
  const w = meta.width ?? 0;
  const h = meta.height ?? 0;
  // Equirectangular = 2:1. Anything else isn't a full 360° sphere.
  if (!w || !h || Math.abs(w / h - 2) > 0.05) {
    await removeRaw();
    return NextResponse.json(
      { error: `Ảnh ${w}×${h} không phải ảnh 360° equirectangular (tỉ lệ 2:1, VD 6000×3000).` },
      { status: 400 },
    );
  }

  const processed = await sharp(input)
    .rotate()
    .resize({ width: PANO_MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: PANO_WEBP_QUALITY })
    .toBuffer({ resolveWithObject: true });

  const rawName = (body?.filename ?? "").replace(/\.[^.]+$/, "");
  const baseName =
    rawName
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .replace(/[^a-zA-Z0-9-_]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .toLowerCase() || "pano";
  const id = randomUUID();

  try {
    await put(`originals/${id}-${baseName}`, input, {
      access: "private",
      contentType: meta.format ? `image/${meta.format === "jpeg" ? "jpeg" : meta.format}` : "application/octet-stream",
      addRandomSuffix: false,
      token: process.env.BLOB_PRIVATE_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN,
    });
  } catch (err) {
    console.error("[process-pano] could not archive private original:", err);
  }

  const blob = await put(`360-${baseName}.webp`, processed.data, { access: "public", contentType: "image/webp", addRandomSuffix: true });
  await removeRaw();

  const title = `360° ${rawName || baseName}`;
  const item = {
    id,
    filename: `360-${baseName}.webp`,
    url: publicMediaUrl(blob),
    mimeType: "image/webp",
    size: processed.info.size,
    kind: "IMAGE" as const,
    titleVi: title,
    titleEn: title,
    altVi: "",
    altEn: "",
  };
  await prisma.$transaction([
    prisma.media.create({ data: { ...item, width: processed.info.width, height: processed.info.height } }),
    activityLogWrite({ userId: user.id, action: "media.create", entityType: "Media", entityId: id }),
  ]);

  return NextResponse.json({
    item: {
      ...item,
      captionVi: "",
      captionEn: "",
      focalX: 0.5,
      focalY: 0.5,
      requireLeadForDownload: false,
      createdAt: new Date().toISOString(),
    },
  });
}
