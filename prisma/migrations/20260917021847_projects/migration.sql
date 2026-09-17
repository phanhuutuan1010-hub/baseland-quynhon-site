-- CreateEnum
CREATE TYPE "ProjectPublishStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ProjectSectionType" AS ENUM ('INTRO', 'STATS', 'TOWERS', 'LOCATION', 'MASTERPLAN', 'ARCHITECTURE', 'MATERIAL_STORY', 'LIFESTYLE', 'EDUCATION', 'VIEWS', 'INVESTMENT', 'LEGAL', 'FAQ', 'VERIFICATION', 'VIDEO_DUO', 'NEWS_TEASER');

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" JSONB NOT NULL,
    "statusLabel" JSONB NOT NULL,
    "theme" TEXT,
    "sections" JSONB NOT NULL DEFAULT '{}',
    "hero" JSONB NOT NULL,
    "cta" JSONB NOT NULL,
    "publishStatus" "ProjectPublishStatus" NOT NULL DEFAULT 'DRAFT',
    "verificationRequired" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "publishedAt" TIMESTAMP(3),

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_sections" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "type" "ProjectSectionType" NOT NULL,
    "content" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_residences" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_residences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_floor_plans" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_floor_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_amenities" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_amenities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_gallery" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_gallery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_documents" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_documents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "projects_slug_key" ON "projects"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "project_sections_projectId_type_key" ON "project_sections"("projectId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "project_residences_projectId_key" ON "project_residences"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "project_floor_plans_projectId_key" ON "project_floor_plans"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "project_amenities_projectId_key" ON "project_amenities"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "project_gallery_projectId_key" ON "project_gallery"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "project_documents_projectId_key" ON "project_documents"("projectId");

-- AddForeignKey
ALTER TABLE "project_sections" ADD CONSTRAINT "project_sections_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_residences" ADD CONSTRAINT "project_residences_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_floor_plans" ADD CONSTRAINT "project_floor_plans_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_amenities" ADD CONSTRAINT "project_amenities_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_gallery" ADD CONSTRAINT "project_gallery_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_documents" ADD CONSTRAINT "project_documents_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
