import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import sharp, { type OutputInfo } from "sharp";
import { getSessionUser } from "@/lib/server/auth";
import { prisma } from "@/lib/server/db";
import { activityLogWrite } from "@/lib/server/activityLog";
import { MAX_RAW_IMAGE_UPLOAD_BYTES, IMAGE_MAX_DIMENSION, IMAGE_WEBP_QUALITY } from "@/lib/server/media";

// Images are the one kind that goes THROUGH this server (not
// browser-direct-to-Blob like video/PDF, see ../upload/route.ts) — the
// whole point is to resize/re-encode before it ever reaches storage. That
// only works within Vercel's ~4.5MB function body limit, which is fine for
// images (video/PDF, which can be much bigger, keep the client-direct path).
export async function POST(request: Request): Promise<NextResponse> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "Chưa cấu hình BLOB_READ_WRITE_TOKEN trên server — xem ADMIN_GUIDE.md mục 9." },
      { status: 503 },
    );
  }

  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Không có quyền upload" }, { status: 403 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Thiếu file" }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Chỉ chấp nhận file ảnh ở endpoint này" }, { status: 400 });
  }
  if (file.size > MAX_RAW_IMAGE_UPLOAD_BYTES) {
    return NextResponse.json(
      { error: `Ảnh gốc tối đa ${Math.round(MAX_RAW_IMAGE_UPLOAD_BYTES / (1024 * 1024))}MB — nén bớt trước khi tải lên.` },
      { status: 400 },
    );
  }

  const inputBuffer = Buffer.from(await file.arrayBuffer());

  let processed: { data: Buffer; info: OutputInfo };
  try {
    processed = await sharp(inputBuffer, { animated: true })
      .rotate() // apply EXIF orientation before resizing, then strip it
      .resize({ width: IMAGE_MAX_DIMENSION, height: IMAGE_MAX_DIMENSION, fit: "inside", withoutEnlargement: true })
      .webp({ quality: IMAGE_WEBP_QUALITY })
      .toBuffer({ resolveWithObject: true });
  } catch {
    return NextResponse.json({ error: "Không đọc được file ảnh — file có thể bị hỏng hoặc sai định dạng." }, { status: 400 });
  }

  const baseName = file.name.replace(/\.[^.]+$/, "") || "image";
  const blob = await put(`${baseName}.webp`, processed.data, {
    access: "public",
    contentType: "image/webp",
    addRandomSuffix: true,
  });

  // Persist the Media row (+ audit log) in this same request — saves the
  // browser a second round trip to the createMedia Server Action.
  const id = randomUUID();
  const title = baseName;
  const item = {
    id,
    filename: `${baseName}.webp`,
    url: blob.url,
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
