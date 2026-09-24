import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { ContactPageClient } from "./ContactPageClient";

export const metadata: Metadata = buildMetadata({
  title: "Liên hệ Base Land Quy Nhơn | Nhận tư vấn",
  description:
    "Liên hệ Base Land Quy Nhơn để nhận thông tin dự án, mặt bằng, bảng giá và tư vấn bất động sản phù hợp.",
  path: "/contact",
});

export default function ContactPage() {
  return <ContactPageClient />;
}
