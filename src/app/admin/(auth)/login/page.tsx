import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Đăng nhập Admin — Base Land Quy Nhơn", robots: { index: false, follow: false } };

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-sand)] px-4">
      <div className="w-full max-w-95 rounded-sm border border-[var(--color-border)] bg-[var(--color-warm-white)] p-8 shadow-[var(--shadow-lg)]">
        <div className="mb-6">
          <p className="m-0 font-ui text-[11px] font-bold tracking-[0.14em] text-[var(--color-brand-green)] uppercase">
            Base Land Quy Nhơn
          </p>
          <h1 className="m-0 mt-1 font-ui text-xl font-bold text-[var(--color-charcoal)]">Đăng nhập Admin</h1>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
