import type { Localized } from "@/lib/i18n";

export type NavLink = {
  href: string;
  label: Localized;
};

export const NAV_LINKS: NavLink[] = [
  { href: "/", label: { vi: "Trang chủ", en: "Home" } },
  { href: "/projects", label: { vi: "Dự án", en: "Projects" } },
  { href: "/news", label: { vi: "Tin tức", en: "News" } },
  { href: "/about", label: { vi: "Giới thiệu", en: "About" } },
  { href: "/contact", label: { vi: "Liên hệ", en: "Contact" } },
];

export const NAV_CTA: Localized = { vi: "Nhận tư vấn", en: "Get in Touch" };

export const CONTACT_PHONE = "0373 910 109";
export const CONTACT_PHONE_HREF = "tel:+84373910109";
export const CONTACT_EMAIL = "baselandquynhon@gmail.com";
export const CONTACT_EMAIL_HREF = "mailto:baselandquynhon@gmail.com";
export const CONTACT_ADDRESS: Localized = {
  vi: "41 Hoa Lư, Phường Quy Nhơn, Tỉnh Gia Lai",
  en: "41 Hoa Lư, Quy Nhơn Ward, Gia Lai Province",
};
export const FOOTER_COPYRIGHT: Localized = {
  vi: "© 2026 Base Land Quy Nhơn. Thuộc hệ sinh thái Base Land.",
  en: "© 2026 Base Land Quy Nhon. Part of the Base Land ecosystem.",
};
