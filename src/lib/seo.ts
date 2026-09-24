import type { Metadata } from "next";
import { stripAccent } from "@/lib/accent";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const DEFAULT_OG_IMAGE = "/images/qterra/qterra-facade.jpg";

/**
 * Full per-page metadata. A page-level `openGraph` object replaces the
 * layout's entirely (Next merges metadata shallowly), so every page builds
 * the complete set here instead of relying on inheritance.
 */
export function buildMetadata({
  title,
  description,
  path,
  image,
  type = "website",
  publishedTime,
}: {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  type?: "website" | "article";
  publishedTime?: string;
}): Metadata {
  const cleanTitle = stripAccent(title);
  const cleanDescription = stripAccent(description);
  const url = `${SITE_URL}${path === "/" ? "" : path}` || SITE_URL;
  const images = [{ url: image || DEFAULT_OG_IMAGE }];
  return {
    title: { absolute: cleanTitle },
    description: cleanDescription,
    alternates: { canonical: path },
    openGraph: {
      title: cleanTitle,
      description: cleanDescription,
      url,
      siteName: SITE_NAME,
      locale: "vi_VN",
      alternateLocale: ["en_US"],
      type,
      images,
      ...(type === "article" && publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: cleanTitle,
      description: cleanDescription,
      images: images.map((i) => i.url),
    },
  };
}
