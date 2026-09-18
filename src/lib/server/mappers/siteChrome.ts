import "server-only";

import { cache } from "react";
import { prisma } from "@/lib/server/db";
import { FOOTER_COPYRIGHT } from "@/lib/content/nav";
import type { SiteChromeData } from "@/lib/siteChrome";

// Static fallback — used only if Settings/MenuItem rows don't exist yet
// (e.g. straight after `prisma migrate dev`, before the first seed/edit).
// Keeps the exact values the site already shipped with.
const FALLBACK: SiteChromeData = {
  navLinks: [
    { href: "/", label: { vi: "Trang chủ", en: "Home" } },
    { href: "/projects", label: { vi: "Dự án", en: "Projects" } },
    { href: "/news", label: { vi: "Tin tức", en: "News" } },
    { href: "/about", label: { vi: "Giới thiệu", en: "About" } },
    { href: "/contact", label: { vi: "Liên hệ", en: "Contact" } },
  ],
  navCtaLabel: { vi: "Nhận tư vấn", en: "Get in Touch" },
  contactPhone: "0965 273 179",
  contactPhoneHref: "tel:+84965273179",
  contactEmail: "baselandquynhon@gmail.com",
  contactEmailHref: "mailto:baselandquynhon@gmail.com",
  contactAddress: { vi: "41 Hoa Lư, Phường Quy Nhơn, Tỉnh Gia Lai", en: "41 Hoa Lư, Quy Nhơn Ward, Gia Lai Province" },
  footerCopyright: FOOTER_COPYRIGHT,
  logoUrl: null,
};

function menuTypeToHref(item: { type: string; href: string | null; targetSlug: string | null }): string {
  if (item.type === "PROJECT" && item.targetSlug) return `/projects/${item.targetSlug}`;
  if (item.type === "NEWS" && item.targetSlug) return `/news/${item.targetSlug}`;
  return item.href ?? "#";
}

// cache() memoizes per-request — layout.tsx (Nav/Footer) and page.tsx
// (Lead CTA's phone number) both call this without a duplicate DB round trip.
export const getSiteChromeData = cache(async function getSiteChromeData(): Promise<SiteChromeData> {
  const [settings, menuItems] = await Promise.all([
    prisma.settings.findUnique({ where: { id: 1 } }),
    prisma.menuItem.findMany({ where: { enabled: true }, orderBy: { order: "asc" } }),
  ]);

  const navLinks =
    menuItems.length > 0
      ? menuItems.map((item) => ({ href: menuTypeToHref(item), label: { vi: item.labelVi, en: item.labelEn } }))
      : FALLBACK.navLinks;

  if (!settings) {
    return { ...FALLBACK, navLinks };
  }

  return {
    navLinks,
    navCtaLabel: { vi: settings.navCtaLabelVi, en: settings.navCtaLabelEn },
    contactPhone: settings.hotline,
    contactPhoneHref: settings.hotlineHref,
    contactEmail: settings.contactEmail,
    contactEmailHref: settings.contactEmailHref,
    contactAddress: { vi: settings.addressVi, en: settings.addressEn },
    footerCopyright: FOOTER_COPYRIGHT,
    logoUrl: settings.logoUrl,
  };
});

export type SiteMetaSettings = {
  siteName: string;
  defaultOgImageUrl: string | null;
  faviconUrl: string | null;
  gaId: string | null;
  gtmId: string | null;
  metaPixelId: string | null;
};

const META_FALLBACK: SiteMetaSettings = {
  siteName: "Base Land Quy Nhơn",
  defaultOgImageUrl: null,
  faviconUrl: null,
  gaId: null,
  gtmId: null,
  metaPixelId: null,
};

// Root layout metadata + analytics script injection read only this small
// slice of Settings — kept separate from getSiteChromeData so Nav/Footer
// callers don't pull in fields they don't use.
export const getSiteMetaSettings = cache(async (): Promise<SiteMetaSettings> => {
  const settings = await prisma.settings.findUnique({ where: { id: 1 } });
  if (!settings) return META_FALLBACK;
  return {
    siteName: settings.siteName,
    defaultOgImageUrl: settings.defaultOgImageUrl,
    faviconUrl: settings.faviconUrl,
    gaId: settings.gaId,
    gtmId: settings.gtmId,
    metaPixelId: settings.metaPixelId,
  };
});
