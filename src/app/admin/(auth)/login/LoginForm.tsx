"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "./actions";

const initialState: LoginState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4" noValidate>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="font-ui text-xs font-semibold tracking-[0.04em] text-[var(--color-text-muted)] uppercase">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          className="rounded-xs border border-[var(--color-border)] bg-[var(--color-warm-white)] px-3.5 py-2.5 font-body text-[var(--fs-body)] text-[var(--color-charcoal)] outline-none focus-visible:border-[var(--color-brand-green)] focus-visible:ring-2 focus-visible:ring-[var(--color-brand-green)]/30"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="font-ui text-xs font-semibold tracking-[0.04em] text-[var(--color-text-muted)] uppercase">
          Mật khẩu
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="rounded-xs border border-[var(--color-border)] bg-[var(--color-warm-white)] px-3.5 py-2.5 font-body text-[var(--fs-body)] text-[var(--color-charcoal)] outline-none focus-visible:border-[var(--color-brand-green)] focus-visible:ring-2 focus-visible:ring-[var(--color-brand-green)]/30"
        />
      </div>

      {state.error && (
        <p role="alert" className="rounded-xs bg-[var(--color-error)]/10 px-3.5 py-2.5 font-body text-sm text-[var(--color-error)]">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 inline-flex items-center justify-center rounded-xs bg-[var(--color-brand-green)] px-5 py-3 font-ui text-sm font-bold tracking-[0.05em] text-[var(--color-warm-white)] uppercase transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Đang đăng nhập…" : "Đăng nhập"}
      </button>
    </form>
  );
}
