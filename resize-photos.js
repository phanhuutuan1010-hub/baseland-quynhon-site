#!/usr/bin/env node
// Batch-compress photos before uploading them to the CMS by hand.
//
// Usage:
//   1. Drop original photos into ./photos-in
//   2. node resize-photos.js
//   3. Compressed WebP files land in ./photos-out (same base filename)
//
// Same resize/encode settings as the Media Library's own upload pipeline
// (src/lib/server/media.ts + src/app/api/media/upload-image/route.ts):
// resize to a 2560px long edge (never upscale) and re-encode as WebP q80.

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const INPUT_DIR = path.join(__dirname, "photos-in");
const OUTPUT_DIR = path.join(__dirname, "photos-out");
const MAX_DIMENSION = 2560;
const WEBP_QUALITY = 80;
const ALLOWED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif", ".tiff"]);

function formatBytes(bytes) {
  return `${(bytes / 1024).toFixed(0)} KB`;
}

async function processFile(filename) {
  const inputPath = path.join(INPUT_DIR, filename);
  const baseName = filename.slice(0, filename.length - path.extname(filename).length);
  const outputPath = path.join(OUTPUT_DIR, `${baseName}.webp`);

  const originalSize = fs.statSync(inputPath).size;

  await sharp(inputPath, { animated: true })
    .rotate() // apply EXIF orientation before resizing, then strip it
    .resize({ width: MAX_DIMENSION, height: MAX_DIMENSION, fit: "inside", withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY })
    .toFile(outputPath);

  const newSize = fs.statSync(outputPath).size;
  const reduction = Math.round((1 - newSize / originalSize) * 100);

  console.log(
    `${filename} -> ${baseName}.webp  ${formatBytes(originalSize)} -> ${formatBytes(newSize)}  (${reduction >= 0 ? "-" : "+"}${Math.abs(reduction)}%)`,
  );

  return { originalSize, newSize };
}

async function main() {
  if (!fs.existsSync(INPUT_DIR)) {
    fs.mkdirSync(INPUT_DIR, { recursive: true });
    console.log(`Đã tạo thư mục ${INPUT_DIR} — bỏ ảnh vào đó rồi chạy lại script.`);
    return;
  }
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const files = fs
    .readdirSync(INPUT_DIR)
    .filter((f) => ALLOWED_EXTENSIONS.has(path.extname(f).toLowerCase()))
    .sort();

  if (files.length === 0) {
    console.log(`Không có ảnh nào trong ${INPUT_DIR}.`);
    return;
  }

  console.log(`Đang xử lý ${files.length} ảnh...\n`);

  let totalOriginal = 0;
  let totalNew = 0;
  let failed = 0;

  for (const filename of files) {
    try {
      const { originalSize, newSize } = await processFile(filename);
      totalOriginal += originalSize;
      totalNew += newSize;
    } catch (err) {
      console.log(`${filename} -> LỖI: ${err.message}`);
      failed++;
    }
  }

  const totalReduction = totalOriginal > 0 ? Math.round((1 - totalNew / totalOriginal) * 100) : 0;
  console.log(`\nXong. ${files.length - failed}/${files.length} ảnh thành công.`);
  console.log(`Tổng: ${formatBytes(totalOriginal)} -> ${formatBytes(totalNew)} (giảm ${totalReduction}%)`);
  console.log(`Ảnh đã nén nằm trong: ${OUTPUT_DIR}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
