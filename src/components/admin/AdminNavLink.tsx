"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function AdminNavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`block rounded-xs px-3.5 py-2.5 font-ui text-sm font-medium transition-colors ${
        active
          ? "bg-[var(--color-brand-green)] text-[var(--color-warm-white)]"
          : "text-[var(--color-charcoal)] hover:bg-[var(--color-sand)]"
      }`}
    >
      {label}
    </Link>
  );
}

export function AdminNavComingSoon({ label }: { label: string }) {
  return (
    <span className="block cursor-not-allowed rounded-xs px-3.5 py-2.5 font-ui text-sm font-medium text-[var(--color-text-muted)]/60">
      {label} <span className="text-[10px] tracking-[0.04em] uppercase">· sắp có</span>
    </span>
  );
}
