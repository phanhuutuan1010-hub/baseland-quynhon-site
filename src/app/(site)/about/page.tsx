import type { Metadata } from "next";
import { AboutPageClient } from "./AboutPageClient";

export const metadata: Metadata = {
  title: "Giới thiệu — Base Land Quy Nhơn",
  description:
    "Uy tín, minh bạch và am hiểu sâu sắc thị trường địa phương — nền tảng cho một quyết định an tâm tại Quy Nhơn.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return <AboutPageClient />;
}
