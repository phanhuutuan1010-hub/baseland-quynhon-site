import type { Metadata } from "next";
import { ContactPageClient } from "./ContactPageClient";

export const metadata: Metadata = {
  title: "Liên hệ — Base Land Quy Nhơn",
  description:
    "Liên hệ Base Land Quy Nhơn để được tư vấn các dự án bất động sản tại Quy Nhơn — hotline 0373 910109, email baselandquynhon@gmail.com.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return <ContactPageClient />;
}
