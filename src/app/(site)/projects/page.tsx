import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { ProjectsPageClient } from "./ProjectsPageClient";

export const metadata: Metadata = buildMetadata({
  title: "Dự án bất động sản Quy Nhơn | Base Land",
  description:
    "Tổng hợp các dự án bất động sản được Base Land Quy Nhơn phân phối và tư vấn — từ căn hộ trung tâm đến khu đô thị thấp tầng.",
  path: "/projects",
});

export default function ProjectsPage() {
  return <ProjectsPageClient />;
}
