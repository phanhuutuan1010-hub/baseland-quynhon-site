import type { Localized } from "@/lib/i18n";

export type NeedOption = {
  /** Canonical value (Vietnamese label), sent to the API and used as the
   * lookup key into NEED_CTA_MAP — mirrors the prototype's convention. */
  value: string;
  label: Localized;
};

export const NEED_OPTIONS: NeedOption[] = [
  { value: "Căn hộ", label: { vi: "Căn hộ", en: "Apartment" } },
  { value: "Nhà phố / Liền kề", label: { vi: "Nhà phố / Liền kề", en: "Townhouse" } },
  { value: "Shophouse", label: { vi: "Shophouse", en: "Shophouse" } },
  { value: "Đầu tư", label: { vi: "Đầu tư", en: "Investment" } },
  { value: "Tìm hiểu dự án", label: { vi: "Tìm hiểu dự án", en: "Project information" } },
  { value: "Nhu cầu khác", label: { vi: "Nhu cầu khác", en: "Other" } },
];

export const NEED_CTA_MAP: Record<string, { label: Localized; href: string | null }> = {
  "Căn hộ": {
    label: { vi: "Q'Terra, Simona Heights và The Sailing là các dự án căn hộ.", en: "Q'Terra, Simona Heights and The Sailing are apartment projects." },
    href: "/projects",
  },
  "Nhà phố / Liền kề": {
    label: { vi: "Phú Gia Royal Park có nhà phố liền kề nội khu.", en: "Phu Gia Royal Park offers townhouses inside the community." },
    href: "/projects/phu-gia-royal-park",
  },
  Shophouse: {
    label: { vi: "Phú Gia Royal Park có shophouse mặt tiền Tây Sơn và nội khu.", en: "Phu Gia Royal Park offers shophouses on Tay Son Avenue and inside the community." },
    href: "/projects/phu-gia-royal-park",
  },
  "Đầu tư": {
    label: { vi: "Chúng tôi sẽ gửi thông tin phù hợp với mục tiêu đầu tư của bạn.", en: "We'll send information that fits your investment goals." },
    href: null,
  },
  "Tìm hiểu dự án": {
    label: { vi: "Xem nhanh 4 dự án Base Land Quy Nhơn đang phân phối.", en: "See the 4 projects Base Land Quy Nhon currently distributes." },
    href: "/projects",
  },
};

export const LEAD_COPY = {
  formName: { vi: "Họ tên", en: "Full name" },
  formPhone: { vi: "Số điện thoại", en: "Phone number" },
  formEmail: { vi: "Email", en: "Email" },
  formNeed: { vi: "Bạn đang tìm gì?", en: "What are you looking for?" },
  needPlaceholder: { vi: "Chọn một lựa chọn", en: "Choose one" },
  viewMore: { vi: "Xem dự án", en: "View projects" },
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
    vi: "Chuyên viên Base Land Quy Nhơn sẽ liên hệ với bạn sớm.",
    en: "A Base Land Quy Nhon advisor will be in touch shortly.",
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
