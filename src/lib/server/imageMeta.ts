import "server-only";

import path from "node:path";
import sharp from "sharp";
import { prisma } from "@/lib/server/db";

/** Intrinsic size + crop anchor of an image, attached to project content
 * so components can frame each image at its real ratio (posters, plans)
 * and anchor `object-cover` crops on the Media focal point. */
export type ImageMeta = { width: number; height: number; focalX: number; focalY: number };

// Local /public files never change between deploys — read each once.
const localCache = new Map<string, ImageMeta | null>();

async function localMeta(src: string): Promise<ImageMeta | null> {
  if (localCache.has(src)) return localCache.get(src)!;
  let meta: ImageMeta | null = null;
  try {
    const file = path.join(process.cwd(), "public", decodeURIComponent(src.split("?")[0]));
    const m = await sharp(file).metadata();
    if (m.width && m.height) meta = { width: m.width, height: m.height, focalX: 0.5, focalY: 0.5 };
  } catch {
    meta = null;
  }
  localCache.set(src, meta);
  return meta;
}

type Node = Record<string, unknown>;

/** Walks project content and adds `width/height/focalX/focalY` next to
 * every non-empty `src` it can resolve — Media Library rows by URL first,
 * then files under /public. Unknown sources are left untouched. */
export async function attachImageMeta<T>(content: T): Promise<T> {
  const holders: Node[] = [];
  const visit = (v: unknown) => {
    if (Array.isArray(v)) return v.forEach(visit);
    if (!v || typeof v !== "object") return;
    const node = v as Node;
    if (typeof node.src === "string" && node.src && node.width == null) holders.push(node);
    Object.values(node).forEach(visit);
  };
  visit(content);
  if (!holders.length) return content;

  const srcs = [...new Set(holders.map((h) => h.src as string))];
  const media = await prisma.media.findMany({
    where: { url: { in: srcs } },
    select: { url: true, width: true, height: true, focalX: true, focalY: true },
  });
  const byUrl = new Map<string, ImageMeta>();
  for (const m of media) if (m.width && m.height) byUrl.set(m.url, { width: m.width, height: m.height, focalX: m.focalX, focalY: m.focalY });
  await Promise.all(
    srcs.filter((s) => !byUrl.has(s) && s.startsWith("/")).map(async (s) => {
      const meta = await localMeta(s);
      if (meta) byUrl.set(s, meta);
    }),
  );
  for (const h of holders) {
    const meta = byUrl.get(h.src as string);
    if (meta) Object.assign(h, meta);
  }
  return content;
}
