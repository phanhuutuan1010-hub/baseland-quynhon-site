import type { Metadata } from "next";
import { ProjectsPageClient } from "./ProjectsPageClient";

export const metadata: Metadata = {
  title: "Khám phá Quy Nhơn — Dự án bất động sản — Base Land Quy Nhơn",
  description:
    "Các dự án bất động sản tại Quy Nhơn được Base Land phân phối và tư vấn — chọn lọc, xác thực và cập nhật liên tục.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  return <ProjectsPageClient />;
}
