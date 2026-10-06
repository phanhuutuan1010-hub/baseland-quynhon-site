import "server-only";

import { copyFileSync, existsSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import sharp, { type OutputInfo } from "sharp";

// Bundled into the upload-image function's trace via
// next.config.ts → outputFileTracingIncludes (public/ and assets/ are NOT
// traced automatically, and Vercel's runtime has no system fonts, so text
// must be rendered from an explicit fontfile).
const LOGO_PATH = path.join(process.cwd(), "public/images/brand/logo-baseland.png");
const FONT_PATH = path.join(process.cwd(), "assets/fonts/Geist-Regular.ttf");

// fontconfig (inside sharp/libvips) silently ignores a fontfile whose path
// has non-ASCII characters — e.g. a local checkout under "…Quy Nhơn" — and
// falls back to a monospace font. Copy to the OS temp dir in that case.
let fontFile: string | null = null;
function resolveFontFile(): string {
  if (fontFile) return fontFile;
  if (/^[ -~]*$/.test(FONT_PATH)) return (fontFile = FONT_PATH);
  const tmp = path.join(os.tmpdir(), "baseland-watermark-Geist-Regular.ttf");
  if (!existsSync(tmp)) copyFileSync(FONT_PATH, tmp);
  return (fontFile = tmp);
}

export const WATERMARK_TEXT = "baselandquynhon.com · 0373 910 109";
export const WATERMARK_OPACITY = 0.2;
export const COPYRIGHT_OWNER = "Base Land Quy Nhơn";

const escapeXml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// One repeat unit: logo on top, site + hotline below, rotated, padded so
// the tiled pattern stays sparse, alpha scaled down to WATERMARK_OPACITY.
async function buildTile(imageWidth: number): Promise<Buffer> {
  const unit = Math.round(Math.min(Math.max(imageWidth / 4.5, 220), 600));
  const logoH = Math.round(unit * 0.3);
  const dpi = Math.round(unit * 0.3); // "Geist 12" at this dpi spans ≈ 0.9 × unit
  const gap = Math.round(unit * 0.04);
  const shadow = Math.max(1, Math.round(unit / 300));

  const logo = await sharp(LOGO_PATH).resize({ height: logoH }).png().toBuffer({ resolveWithObject: true });

  const renderText = (color: string) =>
    sharp({
      text: {
        text: `<span foreground="${color}">${escapeXml(WATERMARK_TEXT)}</span>`,
        font: "Geist 12",
        fontfile: resolveFontFile(),
        dpi,
        rgba: true,
      },
    })
      .png()
      .toBuffer({ resolveWithObject: true });
  // Dark shadow under white text keeps it legible on both light and dark photos.
  const [light, dark] = await Promise.all([renderText("#ffffff"), renderText("#000000")]);

  const blockW = Math.max(logo.info.width, light.info.width) + shadow;
  const blockH = logo.info.height + gap + light.info.height + shadow;
  const textLeft = Math.round((blockW - light.info.width) / 2);
  const textTop = logo.info.height + gap;

  const block = await sharp({
    create: { width: blockW, height: blockH, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([
      { input: logo.data, left: Math.round((blockW - logo.info.width) / 2), top: 0 },
      { input: dark.data, left: textLeft + shadow, top: textTop + shadow },
      { input: light.data, left: textLeft, top: textTop },
    ])
    .png()
    .toBuffer();

  const pad = Math.round(unit * 0.15);
  return sharp(block)
    .rotate(-30, { background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .extend({ top: pad, bottom: pad, left: pad, right: pad, background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .ensureAlpha()
    .linear([1, 1, 1, WATERMARK_OPACITY], [0, 0, 0, 0])
    .png()
    .toBuffer();
}

function copyrightXmp(year: number): string {
  const owner = escapeXml(COPYRIGHT_OWNER);
  const notice = escapeXml(`© ${year} ${COPYRIGHT_OWNER}. All rights reserved.`);
  return `<?xpacket begin="﻿" id="W5M0MpCehiHzreSzNTczkc9d"?>
<x:xmpmeta xmlns:x="adobe:ns:meta/">
 <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
  <rdf:Description rdf:about=""
    xmlns:dc="http://purl.org/dc/elements/1.1/"
    xmlns:xmpRights="http://ns.adobe.com/xap/1.0/rights/"
    xmlns:photoshop="http://ns.adobe.com/photoshop/1.0/"
    xmlns:Iptc4xmpCore="http://iptc.org/std/Iptc4xmpCore/1.0/xmlns/">
   <dc:creator><rdf:Seq><rdf:li>${owner}</rdf:li></rdf:Seq></dc:creator>
   <dc:rights><rdf:Alt><rdf:li xml:lang="x-default">${notice}</rdf:li></rdf:Alt></dc:rights>
   <xmpRights:Marked>True</xmpRights:Marked>
   <xmpRights:WebStatement>https://baselandquynhon.com/dieu-khoan</xmpRights:WebStatement>
   <photoshop:Credit>${owner}</photoshop:Credit>
   <photoshop:Source>baselandquynhon.com</photoshop:Source>
   <Iptc4xmpCore:CreatorContactInfo rdf:parseType="Resource">
    <Iptc4xmpCore:CiUrlWork>https://baselandquynhon.com</Iptc4xmpCore:CiUrlWork>
    <Iptc4xmpCore:CiTelWork>0373 910 109</Iptc4xmpCore:CiTelWork>
   </Iptc4xmpCore:CreatorContactInfo>
  </rdf:Description>
 </rdf:RDF>
</x:xmpmeta>
<?xpacket end="w"?>`;
}

/**
 * Resize + watermark + re-encode to WebP, embedding copyright in EXIF
 * (IFD0 Copyright/Artist) and XMP (dc:rights + IPTC Core fields — sharp
 * cannot write legacy IPTC-IIM, XMP is the IPTC-endorsed carrier).
 * Animated input is flattened to its first frame (tiled composite over
 * every frame isn't supported reliably).
 */
export async function watermarkImage(
  input: Buffer,
  opts: { maxDimension: number; quality: number },
): Promise<{ data: Buffer; info: OutputInfo }> {
  const base = await sharp(input)
    .rotate() // apply EXIF orientation before resizing
    .resize({ width: opts.maxDimension, height: opts.maxDimension, fit: "inside", withoutEnlargement: true })
    .png()
    .toBuffer({ resolveWithObject: true });

  const tile = await buildTile(base.info.width);
  const year = new Date().getFullYear();

  return sharp(base.data)
    .composite([{ input: tile, tile: true, gravity: "northwest" }])
    .withExif({
      IFD0: {
        Copyright: `© ${year} ${COPYRIGHT_OWNER}`,
        Artist: COPYRIGHT_OWNER,
        ImageDescription: WATERMARK_TEXT,
      },
    })
    .withXmp(copyrightXmp(year))
    .webp({ quality: opts.quality })
    .toBuffer({ resolveWithObject: true });
}
