import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { getSessionUser } from "@/lib/server/auth";
import { ALLOWED_MIME_TYPES, MAX_SIZE_BY_KIND, kindForMimeType } from "@/lib/server/media";

// Issues a short-lived, constrained client upload token so the file goes
// straight from the admin's browser to Blob storage — never through this
// server's request body — which is what makes large video uploads work on
// a serverless deployment. Auth uses getSessionUser() directly (not
// requireRole(), which calls next/navigation's redirect() — meant for
// Server Components/Actions, not a plain Route Handler).
export async function POST(request: Request): Promise<NextResponse> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "Chưa cấu hình BLOB_READ_WRITE_TOKEN trên server — xem ADMIN_GUIDE.md mục 9." },
      { status: 503 },
    );
  }

  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        const user = await getSessionUser();
        if (!user || user.role !== "ADMIN") {
          throw new Error("Không có quyền upload");
        }

        const ext = pathname.split(".").pop()?.toLowerCase();
        const guessedMime =
          ext === "mp4"
            ? "video/mp4"
            : ext === "pdf"
              ? "application/pdf"
              : ext === "png"
                ? "image/png"
                : ext === "webp"
                  ? "image/webp"
                  : ext === "gif"
                    ? "image/gif"
                    : "image/jpeg";
        const kind = kindForMimeType(guessedMime) ?? "IMAGE";

        return {
          allowedContentTypes: [...ALLOWED_MIME_TYPES],
          maximumSizeInBytes: MAX_SIZE_BY_KIND[kind],
          addRandomSuffix: true,
        };
      },
      // No onUploadCompleted: that webhook needs a publicly reachable
      // deploy URL and never fires against localhost. The DB row is
      // created instead by a normal Server Action (createMedia) called
      // client-side right after upload() resolves — see MediaUploader.tsx.
    });
    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
