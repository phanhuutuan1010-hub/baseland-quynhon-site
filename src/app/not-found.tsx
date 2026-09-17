import Link from "next/link";

// True top-level fallback — Next.js requires this when an app has multiple
// root layouts (here: src/app/(site)/layout.tsx and src/app/admin/layout.tsx),
// for the rare case where a URL doesn't match either root layout's tree at
// all. It has no parent layout, so it needs its own <html>/<body> and can't
// use LanguageProvider/useLang. The common in-app 404 case (a bad project or
// news slug, `notFound()` called from within a real page) is handled by the
// bilingual, fully-chromed src/app/(site)/not-found.tsx instead — this file
// is a last resort, not the primary 404 UX.
export default function GlobalNotFound() {
  return (
    <html lang="vi">
      <body style={{ fontFamily: "system-ui, sans-serif", textAlign: "center", padding: "20vh 5vw" }}>
        <h1>404 — Không tìm thấy trang</h1>
        <p>Đường dẫn không tồn tại.</p>
        <Link href="/">Về trang chủ Base Land Quy Nhơn</Link>
      </body>
    </html>
  );
}
