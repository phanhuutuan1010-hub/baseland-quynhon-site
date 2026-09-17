import type { Metadata } from "next";
import { NotFoundClient } from "./NotFoundClient";

export const metadata: Metadata = {
  title: "404 — Base Land Quy Nhơn",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return <NotFoundClient />;
}
