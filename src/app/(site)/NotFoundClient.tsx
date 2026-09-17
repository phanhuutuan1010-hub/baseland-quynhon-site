"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n";

const COPY = {
  eyebrow: { vi: "Lỗi 404", en: "404 Error" },
  headline: {
    vi: "Trang bạn tìm kiếm không tồn tại",
    en: "The page you're looking for doesn't exist",
  },
  body: {
    vi: "Đường dẫn có thể đã bị đổi hoặc không còn tồn tại. Quay lại trang chủ hoặc khám phá các dự án của Base Land Quy Nhơn.",
    en: "The link may have changed or no longer exists. Head back to the homepage or explore Base Land Quy Nhon's projects.",
  },
  ctaHome: { vi: "Về trang chủ", en: "Back to homepage" },
  ctaProjects: { vi: "Khám phá dự án", en: "Explore projects" },
};

export function NotFoundClient() {
  const { pick } = useLang();

  return (
    <section className="flex min-h-[70vh] w-full items-center bg-[var(--color-warm-white)] px-5 py-20 sm:px-8 md:px-12">
      <div className="mx-auto w-full max-w-[720px] text-center">
        <div className="mb-4 font-ui text-[length:var(--fs-label)] tracking-[var(--ls-label)] text-[var(--color-terracotta-accessible)] uppercase">
          {pick(COPY.eyebrow)}
        </div>
        <div className="mb-4 font-display text-[clamp(4rem,14vw,8rem)] leading-none text-[var(--color-charcoal)]">
          404
        </div>
        <h1 className="m-0 mb-4 font-display text-[length:var(--fs-h2)] leading-[var(--lh-heading)] font-normal text-[var(--color-charcoal)]">
          {pick(COPY.headline)}
        </h1>
        <p className="m-0 mb-9 font-body text-[length:var(--fs-body-lg)] leading-[var(--lh-body)] text-[var(--color-text-muted)]">
          {pick(COPY.body)}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center rounded-xs border border-[var(--color-brand-green)] bg-[var(--color-brand-green)] px-8 py-4 font-ui text-[13px] font-bold tracking-[0.08em] text-[var(--color-warm-white)] uppercase no-underline hover:bg-[var(--color-brand-green-dark)]"
          >
            {pick(COPY.ctaHome)}
          </Link>
          <Link
            href="/projects"
            className="inline-flex items-center rounded-xs border border-[var(--color-terracotta)] bg-transparent px-8 py-4 font-ui text-[13px] font-bold tracking-[0.08em] text-[var(--color-charcoal)] uppercase no-underline hover:bg-[rgba(193,99,60,0.1)]"
          >
            {pick(COPY.ctaProjects)}
          </Link>
        </div>
      </div>
    </section>
  );
}
