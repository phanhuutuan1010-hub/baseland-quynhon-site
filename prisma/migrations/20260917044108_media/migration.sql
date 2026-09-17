-- CreateEnum
CREATE TYPE "MediaKind" AS ENUM ('IMAGE', 'VIDEO', 'DOCUMENT');

-- CreateTable
CREATE TABLE "media" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "titleVi" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "altVi" TEXT NOT NULL,
    "altEn" TEXT NOT NULL,
    "captionVi" TEXT,
    "captionEn" TEXT,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "kind" "MediaKind" NOT NULL,
    "focalX" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "focalY" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "requireLeadForDownload" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "media_url_key" ON "media"("url");
