import type { Metadata } from "next";
import { PrivacyPageClient } from "./PrivacyPageClient";

export const metadata: Metadata = {
  title: "Chính sách bảo mật — Base Land Quy Nhơn",
  description:
    "Cách Base Land Quy Nhơn thu thập và sử dụng thông tin khi bạn để lại yêu cầu tư vấn trên website.",
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return <PrivacyPageClient />;
}
