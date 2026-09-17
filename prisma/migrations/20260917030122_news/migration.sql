-- CreateEnum
CREATE TYPE "NewsStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "labelVi" TEXT NOT NULL,
    "labelEn" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "news" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "titleVi" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "excerptVi" TEXT NOT NULL,
    "excerptEn" TEXT NOT NULL,
    "contentVi" TEXT NOT NULL,
    "contentEn" TEXT NOT NULL,
    "featuredImageUrl" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "categoryId" TEXT NOT NULL,
    "status" "NewsStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "news_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "news_projects" (
    "newsId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "news_projects_pkey" PRIMARY KEY ("newsId","projectId")
);

-- CreateIndex
CREATE UNIQUE INDEX "categories_key_key" ON "categories"("key");

-- CreateIndex
CREATE UNIQUE INDEX "news_slug_key" ON "news"("slug");

-- AddForeignKey
ALTER TABLE "news" ADD CONSTRAINT "news_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "news_projects" ADD CONSTRAINT "news_projects_newsId_fkey" FOREIGN KEY ("newsId") REFERENCES "news"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "news_projects" ADD CONSTRAINT "news_projects_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
