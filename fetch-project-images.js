#!/usr/bin/env node
// Tải ảnh còn thiếu cho các dự án từ website nguồn, để DUYỆT TAY trước khi
// dùng — script này không upload gì, không đụng DB, không gắn ảnh lên site.
//
// Cách dùng:
//   node fetch-project-images.js                      (tất cả dự án)
//   node fetch-project-images.js phu-gia-royal-park   (1 dự án)
//   node fetch-project-images.js --stage              (sau khi duyệt: gom ảnh
//                                   còn giữ vào photos-in/ để resize + upload)
//
// Kết quả:
//   images-fetched/<slug>/          ảnh giữ lại, chờ bạn duyệt
//   images-fetched/<slug>/_loai/    ảnh bị loại tự động (bảng giá, QR, ảnh
//                                   chụp thực tế của môi giới...) — chỉ để
//                                   bạn xem lại, không upload
//   images-fetched/manifest.csv     danh sách đầy đủ, mở được bằng Excel
//
// Chạy lại nhiều lần được: URL đã xử lý (kể cả đã bỏ qua) được nhớ trong
// images-fetched/state.json nên không tải lại.

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const sharp = require("sharp");

const OUT_DIR = path.join(__dirname, "images-fetched");
const STATE_FILE = path.join(OUT_DIR, "state.json");
const MANIFEST_FILE = path.join(OUT_DIR, "manifest.csv");

const USER_AGENT = "BaseLandImageFetcher/1.0";
const REQUEST_DELAY_MS = 2000;
const MIN_LONG_EDGE = 1000;
const MAX_IMAGE_BYTES = 25 * 1024 * 1024;
const REQUEST_TIMEOUT_MS = 30000;
const MAX_DEPTH = 2;
// dHash Hamming distance ≤ this = cùng một ảnh (khác kích thước/nén lại).
const NEAR_DUPLICATE_DISTANCE = 6;

const PROJECTS = [
  {
    slug: "phu-gia-royal-park",
    name: "Phú Gia Royal Park",
    keywords: ["royal-park", "royalpark", "royal park"],
    excludeKeywords: ["simona", "sailing", "maestro", "qterra", "q-terra"],
    sources: [
      // Site chủ đầu tư có nhiều dự án — chỉ đi vào trang có nhắc Royal Park.
      { url: "https://phu-gia.com/", priority: 1, maxPages: 25, onlyKeywordPages: true },
      { url: "https://phugiaroyalpark.vn/", priority: 2, maxPages: 20 },
      { url: "https://phugiaroyalpark.com.vn/", priority: 2, maxPages: 20 },
      { url: "https://quynhonrealty.vn/phu-gia-royal-park-quy-nhon/", priority: 2, maxPages: 1 },
    ],
  },
  {
    slug: "simona-heights",
    name: "Simona Heights",
    keywords: ["simona"],
    excludeKeywords: ["royal-park", "royal park", "sailing", "maestro", "qterra", "q-terra"],
    sources: [{ url: "https://simonaheights.vn/", priority: 1, maxPages: 25 }],
  },
  {
    slug: "the-sailing",
    name: "The Sailing Quy Nhơn",
    keywords: ["sailing", "maestro"],
    excludeKeywords: ["royal-park", "royal park", "simona", "qterra", "q-terra"],
    sources: [
      { url: "https://premiersailingquynhon.com.vn/", priority: 2, maxPages: 20 },
      { url: "https://thesailingquynhon.com.vn/", priority: 2, maxPages: 20 },
    ],
  },
  // Q'Terra: không có nguồn trong danh sách — cố ý không tự lấy ảnh.
];

// ---------------------------------------------------------------- helpers

function slugify(text) {
  return String(text)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);
}

function matchesAny(text, keywords) {
  const hay = slugify(decodeSafe(text)).replace(/-/g, "");
  return keywords.some((k) => hay.includes(slugify(k).replace(/-/g, "")));
}

function decodeSafe(s) {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

function decodeEntities(s) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\\\//g, "/");
}

function absolutize(raw, base) {
  if (!raw) return null;
  const cleaned = decodeEntities(raw.trim());
  if (!cleaned || cleaned.startsWith("data:") || cleaned.startsWith("javascript:")) return null;
  try {
    const u = new URL(cleaned, base);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    u.hash = "";
    return u.toString();
  } catch {
    return null;
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------------------------------------------------------------- robots.txt

const robotsCache = new Map();

function parseRobots(text) {
  // Nhóm User-agent -> rules. Dùng nhóm khớp tên bot của mình, nếu không có
  // thì dùng nhóm "*".
  const groups = [];
  let current = null;
  let lastWasAgent = false;
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.replace(/#.*$/, "").trim();
    if (!line) continue;
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const field = line.slice(0, idx).trim().toLowerCase();
    const value = line.slice(idx + 1).trim();
    if (field === "user-agent") {
      if (!lastWasAgent || !current) {
        current = { agents: [], rules: [], crawlDelay: null };
        groups.push(current);
      }
      current.agents.push(value.toLowerCase());
      lastWasAgent = true;
      continue;
    }
    lastWasAgent = false;
    if (!current) continue;
    if (field === "allow" || field === "disallow") current.rules.push({ allow: field === "allow", path: value });
    else if (field === "crawl-delay") current.crawlDelay = Number(value) || null;
  }
  const me = USER_AGENT.split("/")[0].toLowerCase();
  return (
    groups.find((g) => g.agents.some((a) => a !== "*" && me.includes(a))) ||
    groups.find((g) => g.agents.includes("*")) || { rules: [], crawlDelay: null }
  );
}

function robotsRuleToRegex(p) {
  const escaped = p.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*");
  return new RegExp("^" + (escaped.endsWith("\\$") ? escaped.slice(0, -2) + "$" : escaped));
}

function isAllowedByRobots(group, url) {
  const u = new URL(url);
  const target = u.pathname + u.search;
  let best = null;
  for (const rule of group.rules) {
    if (rule.path === "") continue; // "Disallow:" rỗng = cho phép tất cả
    if (robotsRuleToRegex(rule.path).test(target)) {
      if (!best || rule.path.length > best.path.length || (rule.path.length === best.path.length && rule.allow)) best = rule;
    }
  }
  return !best || best.allow;
}

async function getRobots(origin) {
  if (robotsCache.has(origin)) return robotsCache.get(origin);
  let group = { rules: [], crawlDelay: null };
  try {
    const res = await politeFetch(`${origin}/robots.txt`, { skipRobots: true });
    if (res.ok) group = parseRobots(await res.text());
  } catch {
    // Không đọc được robots.txt -> coi như không có giới hạn (chuẩn chung).
  }
  robotsCache.set(origin, group);
  return group;
}

// ---------------------------------------------------------------- fetching

const lastRequestAt = new Map();

async function politeFetch(url, { skipRobots = false } = {}) {
  const origin = new URL(url).origin;
  let delay = REQUEST_DELAY_MS;
  if (!skipRobots) {
    const robots = await getRobots(origin);
    if (!isAllowedByRobots(robots, url)) {
      const err = new Error("robots.txt không cho phép");
      err.code = "ROBOTS";
      throw err;
    }
    if (robots.crawlDelay) delay = Math.max(delay, robots.crawlDelay * 1000);
  }
  const wait = (lastRequestAt.get(origin) ?? 0) + delay - Date.now();
  if (wait > 0) await sleep(wait);
  lastRequestAt.set(origin, Date.now());
  return fetch(url, {
    headers: { "User-Agent": USER_AGENT, Accept: "*/*" },
    redirect: "follow",
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
}

// ---------------------------------------------------------------- HTML parsing

function getAttr(tag, name) {
  const m = tag.match(new RegExp(`\\s${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, "i"));
  return m ? (m[2] ?? m[3] ?? m[4] ?? "") : null;
}

function largestFromSrcset(srcset) {
  if (!srcset) return null;
  let best = null;
  let bestW = -1;
  for (const part of srcset.split(",")) {
    const [u, d] = part.trim().split(/\s+/);
    if (!u) continue;
    const w = d ? parseFloat(d) * (d.endsWith("x") ? 1000 : 1) : 0;
    if (w > bestW) {
      bestW = w;
      best = u;
    }
  }
  return best;
}

const IMAGE_EXT_RE = /\.(jpe?g|png|webp)(\?[^"'\s)]*)?$/i;

function extractImages(html, pageUrl) {
  const found = new Map(); // url -> alt
  const put = (raw, alt = "") => {
    const abs = absolutize(raw, pageUrl);
    if (!abs) return;
    if (!found.has(abs) || (!found.get(abs) && alt)) found.set(abs, alt);
  };

  for (const tag of html.match(/<(img|source)\b[^>]*>/gi) ?? []) {
    const alt = decodeEntities(getAttr(tag, "alt") ?? getAttr(tag, "title") ?? "");
    for (const a of ["data-srcset", "data-lazy-srcset", "srcset"]) {
      const best = largestFromSrcset(getAttr(tag, a));
      if (best) put(best, alt);
    }
    for (const a of ["data-src", "data-lazy-src", "data-original", "data-full-url", "data-large_image", "src"]) {
      const v = getAttr(tag, a);
      if (v) put(v, alt);
    }
  }
  for (const tag of html.match(/<meta\b[^>]*>/gi) ?? []) {
    const prop = (getAttr(tag, "property") ?? getAttr(tag, "name") ?? "").toLowerCase();
    if (prop === "og:image" || prop === "twitter:image") put(getAttr(tag, "content"));
  }
  for (const tag of html.match(/<a\b[^>]*>/gi) ?? []) {
    // Lightbox/gallery: thẻ <a href="anh-goc.jpg"> bọc thumbnail nhỏ.
    const href = getAttr(tag, "href");
    if (href && IMAGE_EXT_RE.test(href)) put(href, decodeEntities(getAttr(tag, "title") ?? ""));
  }
  // Ảnh nền (CSS inline, Elementor/slider data JSON) — quét mọi URL ảnh còn lại.
  const sweep = decodeEntities(html).match(/(https?:)?\/\/?[^\s"'()<>]+?\.(?:jpe?g|png|webp)(?:\?[^\s"'()<>]*)?/gi) ?? [];
  for (const u of sweep) put(u);

  return [...found].map(([url, alt]) => ({ url, alt }));
}

function extractLinks(html, pageUrl) {
  const links = new Set();
  for (const tag of html.match(/<a\b[^>]*>/gi) ?? []) {
    const abs = absolutize(getAttr(tag, "href"), pageUrl);
    if (abs) links.add(abs);
  }
  return [...links];
}

const SKIP_PAGE_RE = /\/(wp-admin|wp-login|wp-json|feed|tag|author|cart|checkout|my-account)\b|\.(pdf|jpe?g|png|webp|gif|svg|zip|mp4|docx?|xlsx?)(\?|$)|[?&](replytocom|share|add-to-cart)=/i;

// ---------------------------------------------------------------- filters

const JUNK_NAME_RE = /(logo|icon|favicon|sprite|avatar|gravatar|placeholder|loading|spinner|emoji|flag|arrow|btn|button|social|facebook|zalo|youtube|tiktok|messenger|instagram|twitter|pinterest|call-now|phone)/i;
const AD_NAME_RE = /(quang-cao|quangcao|advert|\bads?\b|popup|pop-up)/i;
const PRICE_POLICY_RE = /(bang-?gia|gia-?ban|price|chinh-?sach|csbh|policy|phap-?ly|giay-?phep|so-?do|so-?hong|qr|hotline|lien-?he|contact|thanh-?toan|uu-?dai|khuyen-?mai)/i;
const BROKER_PHOTO_RE = /(thuc-?te|hinh-?chup|anh-?chup|cong-?truong|tien-?do|tham-?quan|site-?visit|khach-?hang|su-?kien|event|mo-?ban|le-?ky|dat-?coc|img_\d{4}|dsc_?\d{3,}|screenshot|z\d{9,})/i;

// Ảnh WordPress thường có bản gốc lớn hơn khi bỏ hậu tố "-1024x683".
function originalCandidates(url) {
  const out = [url];
  const stripped = url.replace(/-\d{2,4}x\d{2,4}(\.(?:jpe?g|png|webp))/i, "$1");
  if (stripped !== url) out.unshift(stripped);
  return out;
}

async function dHash(buffer) {
  const px = await sharp(buffer).grayscale().resize(9, 8, { fit: "fill" }).raw().toBuffer();
  let bits = "";
  for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) bits += px[y * 9 + x] > px[y * 9 + x + 1] ? "1" : "0";
  return BigInt("0b" + bits);
}

function hamming(a, b) {
  let x = BigInt(a) ^ BigInt(b);
  let n = 0;
  while (x) {
    n += Number(x & 1n);
    x >>= 1n;
  }
  return n;
}

// ---------------------------------------------------------------- state / manifest

function loadState() {
  try {
    return JSON.parse(fs.readFileSync(STATE_FILE, "utf8"));
  } catch {
    return { records: [] };
  }
}

function saveState(state) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
  const header = ["file", "url_goc", "domain_nguon", "muc_uu_tien", "kich_thuoc", "nghi_watermark", "trang_thai", "ly_do", "du_an", "trang_chua_anh", "alt"];
  const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const lines = state.records.map((r) =>
    [r.file, r.url, r.domain, r.priority, r.size, r.watermark, r.status, r.reason, r.project, r.pageUrl, r.alt].map(esc).join(","),
  );
  // BOM để Excel hiển thị đúng tiếng Việt.
  fs.writeFileSync(MANIFEST_FILE, "﻿" + [header.join(","), ...lines].join("\r\n"));
}

function uniqueFilePath(dir, base, ext) {
  let name = `${base}${ext}`;
  let i = 2;
  while (fs.existsSync(path.join(dir, name))) name = `${base}-${i++}${ext}`;
  return path.join(dir, name);
}

// ---------------------------------------------------------------- core

async function processImage(project, source, candidate, pageUrl, state, ctx) {
  const domain = new URL(source.url).hostname;
  const seenUrls = new Set(state.records.filter((r) => r.status !== "loi").map((r) => r.url));
  const record = (fields) => {
    const r = { project: project.slug, domain, priority: source.priority, pageUrl, alt: candidate.alt, file: "", size: "", watermark: "", ...fields };
    state.records.push(r);
    saveState(state);
    return r;
  };

  // Đã xử lý chính URL này, hoặc bản gốc của nó (biến thể -768x512 của ảnh đã tải).
  if (originalCandidates(candidate.url).some((u) => seenUrls.has(u))) return;

  const nameText = `${candidate.url} ${candidate.alt}`;
  const fileName = decodeSafe(new URL(candidate.url).pathname.split("/").pop() || "");
  if (JUNK_NAME_RE.test(slugify(fileName))) return record({ url: candidate.url, status: "bo_qua", reason: "icon/logo/nút" });
  if (matchesAny(nameText, project.excludeKeywords)) return record({ url: candidate.url, status: "bo_qua", reason: "thuộc dự án khác" });
  if (source.onlyKeywordPages && !matchesAny(pageUrl, project.keywords) && !matchesAny(nameText, project.keywords)) {
    return record({ url: candidate.url, status: "bo_qua", reason: "không rõ thuộc dự án (site CĐT nhiều dự án)" });
  }

  // Thử bản gốc (bỏ hậu tố kích thước WordPress) trước, rồi mới tới URL thấy trên trang.
  let buffer = null;
  let finalUrl = candidate.url;
  let lastError = "";
  for (const url of originalCandidates(candidate.url)) {
    if (url !== candidate.url && seenUrls.has(url)) continue;
    try {
      const res = await politeFetch(url);
      if (!res.ok) {
        lastError = `HTTP ${res.status}`;
        continue;
      }
      const type = res.headers.get("content-type") ?? "";
      if (!type.startsWith("image/") || type.includes("svg") || type.includes("gif")) {
        lastError = `không phải ảnh (${type || "?"})`;
        continue;
      }
      if (Number(res.headers.get("content-length") ?? 0) > MAX_IMAGE_BYTES) {
        lastError = "file quá lớn";
        continue;
      }
      buffer = Buffer.from(await res.arrayBuffer());
      finalUrl = url;
      break;
    } catch (err) {
      lastError = err.code === "ROBOTS" ? "robots.txt chặn" : err.message;
    }
  }
  if (!buffer) return record({ url: candidate.url, status: lastError === "robots.txt chặn" ? "bo_qua" : "loi", reason: lastError });

  let meta;
  try {
    meta = await sharp(buffer).metadata();
  } catch {
    return record({ url: finalUrl, status: "loi", reason: "file ảnh hỏng" });
  }
  const longEdge = Math.max(meta.width ?? 0, meta.height ?? 0);
  const size = `${meta.width}x${meta.height}`;
  if (longEdge < MIN_LONG_EDGE) return record({ url: finalUrl, size, status: "bo_qua", reason: `nhỏ (cạnh dài ${longEdge}px)` });
  if (meta.width / meta.height > 3.2 || AD_NAME_RE.test(slugify(nameText))) {
    return record({ url: finalUrl, size, status: "bo_qua", reason: "dạng banner quảng cáo" });
  }

  const sha1 = crypto.createHash("sha1").update(buffer).digest("hex");
  const hash = (await dHash(buffer)).toString();
  const dup = ctx.kept.find((k) => k.sha1 === sha1 || hamming(k.hash, hash) <= NEAR_DUPLICATE_DISTANCE);
  if (dup) return record({ url: finalUrl, size, status: "bo_qua", reason: `trùng ảnh ${dup.file} (ưu tiên ${dup.priority})` });

  // Phân loại theo mục 4 của yêu cầu.
  const slugText = slugify(`${fileName} ${candidate.alt}`);
  let exclude = "";
  if (PRICE_POLICY_RE.test(slugText)) exclude = "nghi bảng giá/chính sách/pháp lý/thông tin liên hệ";
  else if (source.priority === 2 && BROKER_PHOTO_RE.test(slugText)) exclude = "nghi ảnh chụp thực tế/sự kiện của đơn vị môi giới";

  const watermark =
    source.priority === 2 ? "CẦN KIỂM TRA (nguồn môi giới)" : /watermark|wm/i.test(slugText) ? "CÓ THỂ" : "chưa thấy dấu hiệu";

  const baseName = slugify(candidate.alt) || slugify(fileName.replace(/\.[^.]+$/, "").replace(/-\d{2,4}x\d{2,4}$/, "")) || "anh";
  const ext = { jpeg: ".jpg", png: ".png", webp: ".webp" }[meta.format] ?? ".jpg";
  const dir = path.join(OUT_DIR, project.slug, exclude ? "_loai" : "");
  fs.mkdirSync(dir, { recursive: true });
  const filePath = uniqueFilePath(dir, `p${source.priority}-${baseName}`, ext);
  fs.writeFileSync(filePath, buffer);

  const rel = path.relative(OUT_DIR, filePath).replace(/\\/g, "/");
  const rec = record({ url: finalUrl, size, file: rel, watermark, status: exclude ? "loai" : "giu_lai", reason: exclude });
  if (!exclude) ctx.kept.push({ sha1, hash, file: rel, priority: source.priority });
  console.log(`    ${exclude ? "LOẠI " : "GIỮ  "} ${rel}  (${size})${exclude ? " — " + exclude : ""}`);
  return rec;
}

async function crawlSource(project, source, state, ctx, summary) {
  const startHost = new URL(source.url).hostname;
  const queue = [{ url: source.url, depth: 0 }];
  const visited = new Set();
  let pages = 0;

  while (queue.length && pages < source.maxPages) {
    const { url, depth } = queue.shift();
    if (visited.has(url)) continue;
    visited.add(url);

    let html;
    try {
      const res = await politeFetch(url);
      if (!res.ok || !(res.headers.get("content-type") ?? "").includes("html")) {
        if (depth === 0) summary.errors.push(`${source.url}: HTTP ${res.status}`);
        continue;
      }
      html = await res.text();
    } catch (err) {
      const msg = err.code === "ROBOTS" ? "robots.txt không cho phép" : `không truy cập được (${err.message})`;
      if (depth === 0) summary.errors.push(`${source.url}: ${msg}`);
      continue;
    }
    pages++;
    console.log(`  [trang ${pages}] ${url}`);

    // Ảnh có alt xử lý trước để tên file có nghĩa khi cùng ảnh xuất hiện nhiều lần.
    const candidates = extractImages(html, url).sort((a, b) => Number(!!b.alt) - Number(!!a.alt));
    for (const candidate of candidates) {
      await processImage(project, source, candidate, url, state, ctx);
    }

    if (depth >= MAX_DEPTH || source.maxPages <= 1) continue;
    for (const link of extractLinks(html, url)) {
      const u = new URL(link);
      if (u.hostname !== startHost || SKIP_PAGE_RE.test(link) || visited.has(link)) continue;
      if (matchesAny(link, project.excludeKeywords)) continue;
      if (source.onlyKeywordPages && !matchesAny(link, project.keywords)) continue;
      queue.push({ url: link, depth: depth + 1 });
    }
  }
  summary.pages.push(`${source.url}: ${pages} trang`);
}

// ---------------------------------------------------------------- stage (bước 3)

const PHOTOS_IN = path.join(__dirname, "photos-in");
const SOURCES_FILE = path.join(PHOTOS_IN, "_nguon.json");

// Gom ảnh bạn đã duyệt (mọi file còn nằm trong images-fetched/<slug>/, trừ
// _loai/) vào photos-in/ để chạy tiếp resize-photos.js -> upload-photos.js.
// Ảnh tải tay (không có trong manifest) cũng đi qua cùng bộ lọc kích thước +
// chống trùng như lúc crawl. Nguồn gốc từng ảnh ghi vào photos-in/_nguon.json.
async function stage() {
  fs.mkdirSync(PHOTOS_IN, { recursive: true });
  if (fs.readdirSync(PHOTOS_IN).some((f) => /\.(jpe?g|png|webp)$/i.test(f))) {
    console.log("photos-in/ đang có ảnh — dọn trống trước khi gom để không lẫn ảnh khác.");
    process.exit(1);
  }
  const state = loadState();
  const byFile = new Map(state.records.filter((r) => r.file).map((r) => [r.file.toLowerCase(), r]));
  const sources = {};

  for (const dirName of fs.readdirSync(OUT_DIR)) {
    const dir = path.join(OUT_DIR, dirName);
    if (!fs.statSync(dir).isDirectory()) continue;
    const project = PROJECTS.find((p) => p.slug === dirName.toLowerCase());
    if (!project) {
      console.log(`Bỏ qua thư mục không khớp dự án nào: ${dirName}`);
      continue;
    }
    const fallbackDomain = new URL([...project.sources].sort((a, b) => a.priority - b.priority)[0].url).hostname;
    const kept = [];
    const counts = { staged: 0, small: 0, dup: 0 };

    for (const file of fs.readdirSync(dir).sort()) {
      const fp = path.join(dir, file);
      if (!fs.statSync(fp).isFile() || !/\.(jpe?g|png|webp)$/i.test(file)) continue;
      const buf = fs.readFileSync(fp);
      let meta;
      try {
        meta = await sharp(buf).metadata();
      } catch {
        console.log(`  hỏng, bỏ qua: ${file}`);
        continue;
      }
      if (Math.max(meta.width, meta.height) < MIN_LONG_EDGE) {
        counts.small++;
        continue;
      }
      const sha1 = crypto.createHash("sha1").update(buf).digest("hex");
      const hash = (await dHash(buf)).toString();
      if (kept.some((k) => k.sha1 === sha1 || hamming(k.hash, hash) <= NEAR_DUPLICATE_DISTANCE)) {
        counts.dup++;
        continue;
      }
      kept.push({ sha1, hash });

      const rec = byFile.get(`${dirName}/${file}`.toLowerCase());
      const originalName = file.replace(/\.[^.]+$/, "").replace(/^imgi_\d+_/i, "").replace(/^p[12]-/, "");
      const baseName = `${project.slug}__${slugify(originalName) || "anh"}`;
      let staged = baseName;
      for (let i = 2; sources[staged]; i++) staged = `${baseName}-${i}`;
      fs.copyFileSync(fp, path.join(PHOTOS_IN, `${staged}${path.extname(file).toLowerCase()}`));
      sources[staged] = {
        project: project.slug,
        projectName: project.name,
        title: (rec?.alt || originalName.replace(/[-_]+/g, " ")).trim(),
        domain: rec?.domain ?? fallbackDomain,
        url: rec?.url ?? "",
        priority: rec?.priority ?? 1,
        original: `${dirName}/${file}`,
      };
      counts.staged++;
    }
    console.log(`${project.name}: gom ${counts.staged} ảnh, bỏ ${counts.small} ảnh nhỏ, bỏ ${counts.dup} ảnh trùng`);
  }

  fs.writeFileSync(SOURCES_FILE, JSON.stringify(sources, null, 2));
  console.log(`\nĐã gom ${Object.keys(sources).length} ảnh vào photos-in/. Tiếp theo: node resize-photos.js`);
}

async function main() {
  if (process.argv[2] === "--stage") return stage();
  const only = process.argv[2];
  const projects = only ? PROJECTS.filter((p) => p.slug === only) : PROJECTS;
  if (only && projects.length === 0) {
    console.log(`Không có dự án "${only}". Chọn một trong: ${PROJECTS.map((p) => p.slug).join(", ")}`);
    process.exit(1);
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const state = loadState();

  for (const project of projects) {
    console.log(`\n=== ${project.name} (${project.slug}) ===`);
    // Ảnh đã giữ ở lần chạy trước cũng tham gia chống trùng.
    const ctx = { kept: [] };
    for (const r of state.records.filter((r) => r.project === project.slug && r.status === "giu_lai" && r.file)) {
      const fp = path.join(OUT_DIR, r.file);
      if (!fs.existsSync(fp)) continue;
      const buf = fs.readFileSync(fp);
      ctx.kept.push({ sha1: crypto.createHash("sha1").update(buf).digest("hex"), hash: (await dHash(buf)).toString(), file: r.file, priority: r.priority });
    }

    const summary = { pages: [], errors: [] };
    // Ưu tiên 1 chạy trước — ảnh ưu tiên 2 trùng với ảnh ưu tiên 1 sẽ bị bỏ.
    for (const source of [...project.sources].sort((a, b) => a.priority - b.priority)) {
      console.log(`\n Nguồn (ưu tiên ${source.priority}): ${source.url}`);
      await crawlSource(project, source, state, ctx, summary);
    }

    const recs = state.records.filter((r) => r.project === project.slug);
    const count = (s) => recs.filter((r) => r.status === s).length;
    console.log(`\n Tổng ${project.name}: giữ lại ${count("giu_lai")}, loại ${count("loai")}, bỏ qua ${count("bo_qua")}, lỗi ${count("loi")}`);
    for (const p of summary.pages) console.log(`   ${p}`);
    for (const e of summary.errors) console.log(`   LỖI NGUỒN: ${e}`);
  }

  console.log(`\nXong. Xem ${path.relative(process.cwd(), MANIFEST_FILE)} và thư mục images-fetched/.`);
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = { PROJECTS, main, parseRobots, isAllowedByRobots, extractImages, extractLinks, originalCandidates, largestFromSrcset, slugify, matchesAny };
