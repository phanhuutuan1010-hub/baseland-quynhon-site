#!/usr/bin/env node
// Upload ảnh đã nén (photos-out/) vào Media Library: file lên Vercel Blob,
// thông tin lên bảng Media. KHÔNG gắn ảnh vào section nào.
//
// Cách dùng (chạy trong thư mục web/):
//   node upload-photos.js --prod     upload vào Media Library production
//   node upload-photos.js --dev      upload vào DB dev
//   thêm --limit 3 để chạy thử 3 ảnh trước
//
// Nếu có photos-in/_nguon.json (tạo bởi `node fetch-project-images.js --stage`)
// thì CHỈ upload các ảnh có trong danh sách đó, kèm tiêu đề + caption ghi
// nguồn. Không có file đó thì upload mọi ảnh trong photos-out/.
// Chạy lại an toàn: ảnh đã upload được ghi trong photos-out/_da-upload.json.

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const target = process.argv[2];
const limitArg = process.argv.indexOf("--limit");
const limit = limitArg > -1 ? Number(process.argv[limitArg + 1]) : undefined; // chạy thử vài ảnh
if (target !== "--prod" && target !== "--dev") {
  console.log("Chọn nơi upload: node upload-photos.js --prod   hoặc   node upload-photos.js --dev");
  process.exit(1);
}
// BLOB token nằm trong .env.local (dùng chung dev/prod); DATABASE_URL theo target.
process.loadEnvFile(path.join(__dirname, ".env.local"));
process.loadEnvFile(path.join(__dirname, target === "--prod" ? ".env.production.local" : ".env"));
if (!process.env.BLOB_READ_WRITE_TOKEN || !process.env.DATABASE_URL) {
  console.log("Thiếu BLOB_READ_WRITE_TOKEN hoặc DATABASE_URL trong file env.");
  process.exit(1);
}

const { put } = require("@vercel/blob");
const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("@prisma/client");

const OUTPUT_DIR = path.join(__dirname, "photos-out");
const SOURCES_FILE = path.join(__dirname, "photos-in", "_nguon.json");
const LOG_FILE = path.join(OUTPUT_DIR, "_da-upload.json");
const CONCURRENCY = 3;
const MIME = { ".webp": "image/webp", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png" };

const NOISE_WORDS = /^(img|imgi|dsc|jpg|jpeg|png|webp|pdf|file|final|draft|rev[a-z]?|copy|image|anh|photo|picture|scaled|klg|lg)$/i;
function isMeaningful(text) {
  return text.split(/[\s_-]+/).some((w) => /^\p{L}{3,}$/u.test(w) && !NOISE_WORDS.test(w));
}

function readJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

async function main() {
  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });
  const dbHost = new URL(process.env.DATABASE_URL).hostname.split(".")[0];
  const sources = readJson(SOURCES_FILE, null);
  const log = readJson(LOG_FILE, {});
  const logKey = (file) => `${dbHost}:${file}`;

  const files = fs
    .readdirSync(OUTPUT_DIR)
    .filter((f) => MIME[path.extname(f).toLowerCase()])
    .filter((f) => !sources || sources[f.replace(/\.[^.]+$/, "")])
    .filter((f) => !log[logKey(f)])
    .sort()
    .slice(0, limit);

  console.log(`Đích: ${target === "--prod" ? "PRODUCTION" : "dev"} (${dbHost}) — ${files.length} ảnh cần upload\n`);

  let ok = 0;
  let failed = 0;
  let cursor = 0;

  async function worker() {
    while (cursor < files.length) {
      const file = files[cursor++];
      const src = sources?.[file.replace(/\.[^.]+$/, "")];
      try {
        const buf = fs.readFileSync(path.join(OUTPUT_DIR, file));
        const meta = await sharp(buf).metadata();
        const mimeType = MIME[path.extname(file).toLowerCase()];
        const blobName = (src ? file.replace(/^[^_]+__/, `${src.project}/`) : file).normalize("NFC");
        const blob = await put(blobName, buf, { access: "public", contentType: mimeType, addRandomSuffix: true });

        // Tên kiểu "z7895724820921", UUID, "1755589784pg3" không mô tả gì —
        // alt vô nghĩa còn tệ hơn để trống, nên chỉ dùng khi có chữ thật.
        const meaningful = src && isMeaningful(src.title);
        const title = src
          ? `${src.projectName} — ${meaningful ? src.title : `ảnh từ ${src.domain}`}`
          : file.replace(/\.[^.]+$/, "");
        const media = await prisma.media.create({
          data: {
            filename: path.basename(blobName),
            url: blob.url,
            mimeType,
            size: buf.length,
            width: meta.width,
            height: meta.height,
            kind: "IMAGE",
            titleVi: title,
            titleEn: title,
            altVi: meaningful ? src.title : "",
            altEn: "",
            captionVi: src ? `Nguồn: ${src.domain}` : null,
            captionEn: src ? `Source: ${src.domain}` : null,
          },
        });
        log[logKey(file)] = { id: media.id, url: blob.url, uploadedAt: new Date().toISOString() };
        fs.writeFileSync(LOG_FILE, JSON.stringify(log, null, 2));
        ok++;
        console.log(`OK   ${file}`);
      } catch (err) {
        failed++;
        console.log(`LỖI ${file}: ${err.message}`);
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  await prisma.$disconnect();
  console.log(`\nXong: ${ok} thành công, ${failed} lỗi. Danh sách: photos-out/_da-upload.json`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
