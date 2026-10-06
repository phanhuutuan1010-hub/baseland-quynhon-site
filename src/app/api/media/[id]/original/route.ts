import { get, list } from "@vercel/blob";
import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/server/auth";

// Admin-only access to the clean (un-watermarked) original of an uploaded
// image, archived privately by ../../upload-image/route.ts under
// originals/<mediaId>-<filename>. Streamed through this route so the
// private Blob URL/token never reaches the browser; the public site only
// ever references the watermarked copy.
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }): Promise<Response> {
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Không có quyền" }, { status: 403 });
  }

  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) {
    return NextResponse.json({ error: "Không tìm thấy" }, { status: 404 });
  }

  const token = process.env.BLOB_PRIVATE_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "Chưa cấu hình Blob token" }, { status: 503 });
  }

  const { blobs } = await list({ prefix: `originals/${id}-`, limit: 1, token });
  const found = blobs[0];
  const result = found ? await get(found.pathname, { access: "private", token }) : null;
  if (!found || !result || result.statusCode !== 200) {
    return NextResponse.json({ error: "Không có bản gốc cho ảnh này (ảnh tải lên trước khi bật watermark?)" }, { status: 404 });
  }

  const filename = found.pathname.slice(`originals/${id}-`.length) || "original";
  return new Response(result.stream, {
    headers: {
      "Content-Type": result.blob.contentType,
      "Content-Length": String(result.blob.size),
      "Content-Disposition": `inline; filename*=UTF-8''${encodeURIComponent(filename)}`,
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
