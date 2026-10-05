import { CONTACT_PHONE, CONTACT_PHONE_HREF, HOTLINE } from "./nav";

/**
 * Cấu hình khối "Giai đoạn mở bán" + pop-up thu SĐT của trang /projects/qterra.
 * Mọi chữ hiển thị nằm ở đây để sửa nhanh. Hotline lấy từ HOTLINE dùng chung
 * (src/lib/content/nav.ts) — không viết cứng số ở component.
 */
export const QTERRA_LAUNCH = {
  slug: "qterra",
  path: "/projects/qterra",

  HOTLINE,
  hotlineHref: CONTACT_PHONE_HREF, // tel:+84373910109
  hotlineDisplay: CONTACT_PHONE, // 0373 910 109
  ZALO_URL: "", // rỗng = ẩn nút Zalo
  BOOKING_ENABLED: false,
  OPEN_DATE_TEXT: "Dự kiến 30/10/2026",

  section: {
    eyebrow: "Q'Terra Quy Nhơn",
    title: "Giai đoạn mở bán",
    description:
      "Thông tin dự kiến, có thể thay đổi theo thông báo chính thức của chủ đầu tư và đơn vị phân phối.",
    steps: {
      register: {
        title: "Đăng ký nguyện vọng",
        body: "Chọn tầng, loại căn, hướng bạn quan tâm. Điều kiện giữ chỗ (nếu có) gửi bằng văn bản trước khi bạn chuyển tiền.",
        badgeOpen: "Đang mở giữ chỗ",
        badgeClosed: "Đăng ký quan tâm, chưa thu tiền",
      },
      launch: {
        title: "Mở bán · chọn căn",
        bodySuffix: ". Quy tắc chọn căn được công bố bằng văn bản trước ngày mở bán.",
      },
      inventory: {
        title: "Bán theo giỏ hàng",
        body: "Các căn còn lại mở bán công khai theo bảng hàng cập nhật.",
      },
    },
    note: "Loại hình: căn hộ du lịch · đất thuê đến 2069.",
    ctaLead: "Nhận tư vấn chọn căn",
    ctaCall: "Gọi ngay",
  },

  popup: {
    title: "Mở bán dự kiến 30/10/2026. Cần chọn vị trí căn?",
    subtitle: "Để lại số, chuyên viên Base Land gửi mặt bằng tầng và 6 câu hỏi nên hỏi trước khi giữ chỗ.",
    phoneLabel: "Số điện thoại",
    phonePlaceholder: "VD: 0901234567",
    phoneError: "Số điện thoại chưa đúng (10 số, bắt đầu bằng 0 hoặc +84).",
    nameLabel: "Tên (không bắt buộc)",
    unitLabel: "Loại căn",
    unitOptions: ["Studio", "1PN", "2PN"],
    floorLabel: "Tầng",
    floorOptions: ["Tầng thấp", "Tầng trung", "Tầng cao"],
    consentPre: "Tôi đồng ý để Base Land Quy Nhơn liên hệ tư vấn Q'Terra. Xem",
    consentLink: "Chính sách bảo mật",
    consentPost: ".",
    consentError: "Vui lòng đồng ý để chúng tôi liên hệ.",
    submit: "Gọi lại cho tôi",
    submitting: "Đang gửi…",
    call: "Gọi ngay",
    zalo: "Zalo",
    consult: "Nhận tư vấn",
    close: "Đóng",
    success: "Đã nhận. Chuyên viên sẽ liên hệ bạn.",
    error: "Chưa gửi được, có thể do mạng. Thông tin bạn nhập vẫn còn — vui lòng thử lại hoặc gọi hotline.",
    fallbackName: "Khách để lại SĐT (popup Q'Terra)",
  },

  // Hành vi pop-up
  source: "qterra-popup",
  desktopDelayMs: 30_000,
  desktopScrollRatio: 0.4,
  mobileScrollRatio: 0.5,
  dismissDays: 5,
  submittedDays: 30,
} as const;
