-- AlterTable
ALTER TABLE "news" ADD COLUMN     "seoDescription" TEXT,
ADD COLUMN     "seoTitle" TEXT;

-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "seoDescription" TEXT,
ADD COLUMN     "seoOgImageUrl" TEXT,
ADD COLUMN     "seoTitle" TEXT;
