import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { PrivacyPageClient } from "./PrivacyPageClient";

export const metadata: Metadata = buildMetadata({
  title: "Chính sách bảo mật | Base Land Quy Nhơn",
  description:
    "Cách Base Land Quy Nhơn thu thập và sử dụng thông tin khi bạn để lại yêu cầu tư vấn trên website.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return <PrivacyPageClient />;
}
