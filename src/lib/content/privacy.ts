import type { Localized } from "@/lib/i18n";

/**
 * Privacy policy content — deliberately factual/descriptive only (what the
 * lead form actually collects and why), never a fabricated legal
 * commitment. Sections that require real legal drafting (retention period,
 * data-subject rights process, third-party sharing terms) are marked
 * "đang cập nhật" / "being finalized" instead of invented — matching the
 * same verified/pending honesty pattern used for unconfirmed facts across
 * the project detail pages (Q'Terra, Simona, Phú Gia, The Sailing). Replace
 * those bodies once legal counsel has approved final wording — no other
 * change should be needed (heading/order structure can stay as-is).
 */
export const PRIVACY_COPY = {
  eyebrow: { vi: "Pháp lý", en: "Legal" },
  headline: { vi: "Chính sách bảo mật", en: "Privacy Policy" },
  intro: {
    vi: "Trang này mô tả cách Base Land Quy Nhơn thu thập và sử dụng thông tin khi bạn để lại yêu cầu tư vấn trên website. Một số mục dưới đây đang được hoàn thiện cùng bộ phận pháp lý và sẽ được cập nhật đầy đủ khi có nội dung chính thức.",
    en: "This page describes how Base Land Quy Nhon collects and uses information when you submit a consultation request on this website. Some sections below are still being finalized with legal counsel and will be updated once official wording is ready.",
  },
  lastUpdated: { vi: "Cập nhật lần cuối", en: "Last updated" },
  lastUpdatedDate: "2026-09",
} satisfies Record<string, Localized | string>;

export type PrivacySection = { title: Localized; body: Localized };

export const PRIVACY_SECTIONS: PrivacySection[] = [
  {
    title: { vi: "Thông tin chúng tôi thu thập", en: "Information we collect" },
    body: {
      vi: "Khi bạn gửi yêu cầu tư vấn qua biểu mẫu trên website, chúng tôi thu thập: họ tên, số điện thoại, email (nếu bạn cung cấp) và nội dung nhu cầu bạn để lại.",
      en: "When you submit a consultation request through this website's form, we collect: your full name, phone number, email (if provided), and the message/need you describe.",
    },
  },
  {
    title: { vi: "Mục đích sử dụng", en: "How we use it" },
    body: {
      vi: "Thông tin được dùng để chuyên viên Base Land Quy Nhơn liên hệ lại và tư vấn theo đúng nhu cầu bạn đã nêu — không dùng cho mục đích nào khác ngoài việc này.",
      en: "Your information is used so a Base Land Quy Nhon advisor can contact you back and assist with the need you described — for no other purpose.",
    },
  },
  {
    title: { vi: "Chia sẻ thông tin với bên thứ ba", en: "Sharing with third parties" },
    body: {
      vi: "Nội dung chi tiết đang được hoàn thiện cùng bộ phận pháp lý.",
      en: "Detailed terms are still being finalized with legal counsel.",
    },
  },
  {
    title: { vi: "Lưu trữ & bảo mật dữ liệu", en: "Data storage & security" },
    body: {
      vi: "Nội dung chi tiết đang được hoàn thiện cùng bộ phận pháp lý.",
      en: "Detailed terms are still being finalized with legal counsel.",
    },
  },
  {
    title: { vi: "Quyền của bạn", en: "Your rights" },
    body: {
      vi: "Nếu bạn muốn chỉnh sửa hoặc yêu cầu xóa thông tin đã gửi, vui lòng liên hệ trực tiếp qua hotline hoặc email bên dưới — quy trình chính thức đang được hoàn thiện.",
      en: "If you'd like to update or request deletion of information you've submitted, please contact us directly via the hotline or email below — a formal process is still being finalized.",
    },
  },
];
