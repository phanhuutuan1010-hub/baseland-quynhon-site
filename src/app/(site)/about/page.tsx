import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { AboutPageClient } from "./AboutPageClient";

export const metadata: Metadata = buildMetadata({
  title: "Base Land Quy Nhơn | Đơn vị tư vấn bất động sản",
  description:
    "Tìm hiểu Base Land Quy Nhơn – đơn vị phân phối và tư vấn bất động sản am hiểu thị trường địa phương.",
  path: "/about",
});

export default function AboutPage() {
  return <AboutPageClient />;
}
