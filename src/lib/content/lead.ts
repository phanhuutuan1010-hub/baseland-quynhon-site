import type { Localized } from "@/lib/i18n";

export type NeedOption = {
  /** Canonical value (Vietnamese label), sent to the API and used as the
   * lookup key into NEED_CTA_MAP — mirrors the prototype's convention. */
  value: string;
  label: Localized;
};

export const NEED_OPTIONS: NeedOption[] = [
  { value: "Mua để ở", label: { vi: "Mua để ở", en: "For living" } },
  { value: "Đầu tư", label: { vi: "Đầu tư", en: "Investment" } },
  { value: "Nghỉ dưỡng", label: { vi: "Nghỉ dưỡng", en: "Vacation home" } },
  { value: "Tìm hiểu dự án", label: { vi: "Tìm hiểu dự án", en: "Learn about a project" } },
  { value: "Quan tâm Q'Terra", label: { vi: "Quan tâm Q'Terra", en: "Interested in Q'Terra" } },
  { value: "Khác", label: { vi: "Khác", en: "Other" } },
];

export const NEED_CTA_MAP: Record<string, { label: Localized; href: string | null }> = {
  "Quan tâm Q'Terra": {
    label: { vi: "Nhận thông tin Q'Terra", en: "Get Q'Terra information" },
    href: "/projects/qterra",
  },
  "Đầu tư": { label: { vi: "Tư vấn đầu tư", en: "Investment advisory" }, href: null },
  "Mua để ở": { label: { vi: "Tư vấn sản phẩm", en: "Product advisory" }, href: null },
  "Nghỉ dưỡng": { label: { vi: "Tư vấn sản phẩm", en: "Product advisory" }, href: null },
  "Tìm hiểu dự án": { label: { vi: "Tư vấn sản phẩm", en: "Product advisory" }, href: "/projects" },
};

export const LEAD_COPY = {
  formName: { vi: "Họ tên", en: "Full name" },
  formPhone: { vi: "Số điện thoại", en: "Phone number" },
  formEmail: { vi: "Email", en: "Email" },
  formNeed: { vi: "Nhu cầu", en: "Interest" },
  needPlaceholder: { vi: "Chọn nhu cầu của bạn", en: "Select your interest" },
  viewMore: { vi: "Xem thêm", en: "View more" },
  consentPre: { vi: "Tôi đồng ý với", en: "I agree to the" },
  privacyLinkLabel: { vi: "Chính sách bảo mật", en: "Privacy Policy" },
  consentPost: {
    vi: " để được Base Land Quy Nhơn liên hệ tư vấn.",
    en: " so Base Land Quy Nhon can contact me with advice.",
  },
  errNameRequired: { vi: "Vui lòng nhập họ tên.", en: "Please enter your name." },
  errPhoneInvalid: { vi: "Vui lòng nhập số điện thoại hợp lệ.", en: "Please enter a valid phone number." },
  errConsentRequired: { vi: "Vui lòng đồng ý để tiếp tục.", en: "Please agree to continue." },
  errorMsg: {
    vi: "Không thể gửi yêu cầu. Vui lòng kiểm tra kết nối và thử lại.",
    en: "We couldn't send your request. Please check your connection and try again.",
  },
  retryBtn: { vi: "Thử lại", en: "Retry" },
  submitIdle: { vi: "Gửi yêu cầu", en: "Send Request" },
  submitLoading: { vi: "Đang gửi…", en: "Sending…" },
  callNow: { vi: "Gọi ngay", en: "Call Now" },
  successTitle: { vi: "Yêu cầu của bạn đã được tiếp nhận.", en: "Your request has been received." },
  successBody: {
    vi: "Đội ngũ Base Land Quy Nhơn sẽ liên hệ với bạn.",
    en: "The Base Land Quy Nhon team will contact you.",
  },
} satisfies Record<string, Localized>;

export type LeadPayload = {
  name: string;
  phone: string;
  email: string;
  need: string;
  consent: boolean;
  source: string;
  lang: "vi" | "en";
};
