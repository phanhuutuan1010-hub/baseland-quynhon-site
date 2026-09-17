/*
  Warnings:

  - Added the required column `navCtaLabelEn` to the `settings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `navCtaLabelVi` to the `settings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "settings" ADD COLUMN     "navCtaLabelEn" TEXT NOT NULL,
ADD COLUMN     "navCtaLabelVi" TEXT NOT NULL;
