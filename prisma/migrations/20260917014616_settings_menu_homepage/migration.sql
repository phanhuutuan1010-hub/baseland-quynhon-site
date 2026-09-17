-- CreateEnum
CREATE TYPE "MenuType" AS ENUM ('INTERNAL', 'EXTERNAL', 'PROJECT', 'NEWS', 'ANCHOR');

-- CreateEnum
CREATE TYPE "HomepageSectionType" AS ENUM ('HERO', 'INTRODUCTION', 'WHY_QUY_NHON', 'FEATURED_PROJECT', 'PROJECTS_TEASER', 'SERVICES', 'WHY_BASE_LAND', 'NEWS_TEASER', 'LEAD_CTA');

-- CreateTable
CREATE TABLE "settings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "branchName" TEXT NOT NULL,
    "hotline" TEXT NOT NULL,
    "hotlineHref" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "contactEmailHref" TEXT NOT NULL,
    "addressVi" TEXT NOT NULL,
    "addressEn" TEXT NOT NULL,
    "mapsUrl" TEXT,
    "socialLinks" JSONB,
    "gaId" TEXT,
    "gtmId" TEXT,
    "metaPixelId" TEXT,
    "siteName" TEXT NOT NULL,
    "defaultLanguage" TEXT NOT NULL DEFAULT 'vi',
    "logoUrl" TEXT,
    "faviconUrl" TEXT,
    "defaultOgImageUrl" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "menu_items" (
    "id" TEXT NOT NULL,
    "labelVi" TEXT NOT NULL,
    "labelEn" TEXT NOT NULL,
    "type" "MenuType" NOT NULL,
    "href" TEXT,
    "targetSlug" TEXT,
    "order" INTEGER NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "menu_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "homepage_sections" (
    "id" TEXT NOT NULL,
    "type" "HomepageSectionType" NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL,
    "content" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "homepage_sections_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "homepage_sections_type_key" ON "homepage_sections"("type");
