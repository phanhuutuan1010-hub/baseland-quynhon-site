import type { Localized } from "@/lib/i18n";

export const CONTACT_COPY = {
  heroEyebrow: { vi: "Liên hệ", en: "Contact" },
  heroHeadline: {
    vi: "Tìm đúng bất động sản bắt đầu từ [[một cuộc trò chuyện]].",
    en: "Let's talk about your [[property search]].",
  },
  heroSub: {
    vi: "Hãy cho chúng tôi biết bạn đang tìm điều gì tại Quy Nhơn.",
    en: "Tell us what you're looking for in Quy Nhon.",
  },
  infoKicker: { vi: "Thông tin liên hệ", en: "Contact details" },
  trustKicker: { vi: "Vì sao chọn Base Land", en: "Why Base Land" },
} satisfies Record<string, Localized>;

export const TRUST_POINTS: { title: Localized; desc: Localized }[] = [
  {
    title: { vi: "Làm việc tại Quy Nhơn", en: "Based in Quy Nhon" },
    desc: {
      vi: "Đội ngũ ở ngay thành phố, đi thực địa cùng khách hàng.",
      en: "Our team is in the city and visits sites with you.",
    },
  },
  {
    title: { vi: "Thông tin đã xác nhận", en: "Verified information" },
    desc: {
      vi: "Ưu tiên dữ liệu và tài liệu chính thức từ chủ đầu tư.",
      en: "We prioritize official data and documents from developers.",
    },
  },
  {
    title: { vi: "4 dự án đang phân phối", en: "4 projects we distribute" },
    desc: {
      vi: "Q'Terra, The Sailing, Simona Heights và Phú Gia Royal Park.",
      en: "Q'Terra, The Sailing, Simona Heights and Phu Gia Royal Park.",
    },
  },
  {
    title: { vi: "Đồng hành đến cuối", en: "Support to the end" },
    desc: {
      vi: "Từ lúc tìm hiểu đến khi hoàn tất giao dịch.",
      en: "From your first question to the finished transaction.",
    },
  },
];
