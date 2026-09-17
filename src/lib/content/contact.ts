import type { Localized } from "@/lib/i18n";

export const CONTACT_COPY = {
  heroEyebrow: { vi: "Liên hệ", en: "Contact" },
  heroHeadline: { vi: "Cùng trò chuyện về Quy Nhơn", en: "Let's talk about Quy Nhon" },
  heroSub: {
    vi: "Base Land Quy Nhơn sẵn sàng lắng nghe nhu cầu của bạn và đưa ra tư vấn phù hợp.",
    en: "Base Land Quy Nhon is ready to listen and offer advice that fits your needs.",
  },
  infoKicker: { vi: "Thông tin liên hệ", en: "Contact Information" },
  trustKicker: { vi: "Vì sao chọn Base Land", en: "Why Base Land" },
} satisfies Record<string, Localized>;

export const TRUST_POINTS: { title: Localized; desc: Localized }[] = [
  {
    title: { vi: "Base Land Quy Nhơn", en: "Base Land Quy Nhon" },
    desc: { vi: "Chi nhánh của Base Land tại thành phố biển Quy Nhơn.", en: "Base Land's branch in the coastal city of Quy Nhon." },
  },
  {
    title: { vi: "Am hiểu Quy Nhơn", en: "Local expertise" },
    desc: {
      vi: "Làm việc trực tiếp tại thị trường bất động sản Quy Nhơn.",
      en: "Working directly in the Quy Nhon real estate market.",
    },
  },
  {
    title: { vi: "4 dự án đã triển khai", en: "4 projects underway" },
    desc: {
      vi: "Q'Terra, The Sailing Quy Nhơn, Simona Heights, Phú Gia Royal Park Quy Nhơn.",
      en: "Q'Terra, The Sailing Quy Nhon, Simona Heights, Phu Gia Royal Park Quy Nhon.",
    },
  },
  {
    title: { vi: "Hỗ trợ chuyên nghiệp", en: "Professional support" },
    desc: {
      vi: "Đội ngũ tư vấn đồng hành từ bước đầu tiên đến khi hoàn tất giao dịch.",
      en: "An advisory team guiding you from the first conversation through to closing.",
    },
  },
];
