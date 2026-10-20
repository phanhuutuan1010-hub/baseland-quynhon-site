import { CONTACT_PHONE, CONTACT_PHONE_HREF, HOTLINE } from "./nav";

/**
 * Cấu hình thanh liên hệ nhanh (mobile) của trang /projects/qterra.
 * Nội dung pop-up thu lead KHÔNG còn ở đây — quản lý trong Admin
 * (Dự án → Nội dung → Popup thu lead).
 */
export const QTERRA_LAUNCH = {
  slug: "qterra",
  path: "/projects/qterra",

  HOTLINE,
  hotlineHref: CONTACT_PHONE_HREF, // tel:+84373910109
  hotlineDisplay: CONTACT_PHONE, // 0373 910 109
  ZALO_URL: "https://zalo.me/0373910109", // rỗng = ẩn nút Zalo

  bar: {
    call: "Gọi ngay",
    zalo: "Zalo",
    consult: "Nhận tư vấn",
  },
} as const;
