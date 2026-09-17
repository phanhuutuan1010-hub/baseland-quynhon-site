import type { Role } from "@prisma/client";
import { logoutAction } from "@/app/admin/(protected)/actions";
import { AdminNavLink, AdminNavComingSoon } from "./AdminNavLink";

type NavItem = { href: string; label: string; roles: Role[]; ready: boolean };

// Full intended information architecture, shown now so the shape of the
// admin is visible from Phase 0 onward — entries not yet built render as
// disabled "sắp có" rows instead of dead links, and disappear per role.
const NAV_ITEMS: NavItem[] = [
  { href: "/admin", label: "Dashboard", roles: ["ADMIN", "SALES"], ready: true },
  { href: "/admin/homepage", label: "Trang chủ", roles: ["ADMIN"], ready: true },
  { href: "/admin/projects", label: "Dự án", roles: ["ADMIN", "SALES"], ready: true },
  { href: "/admin/news", label: "Tin tức", roles: ["ADMIN"], ready: true },
  { href: "/admin/media", label: "Media", roles: ["ADMIN"], ready: true },
  { href: "/admin/leads", label: "Lead", roles: ["ADMIN", "SALES"], ready: true },
  { href: "/admin/settings", label: "Cài đặt", roles: ["ADMIN"], ready: true },
  { href: "/admin/users", label: "Người dùng", roles: ["ADMIN"], ready: false },
];

export function AdminShell({
  user,
  children,
}: {
  user: { name: string; email: string; role: Role };
  children: React.ReactNode;
}) {
  const items = NAV_ITEMS.filter((item) => item.roles.includes(user.role));

  return (
    <div className="flex min-h-screen bg-[var(--color-sand)]">
      <aside className="flex w-64 flex-none flex-col border-r border-[var(--color-border)] bg-[var(--color-warm-white)] px-4 py-6">
        <div className="mb-6 px-2">
          <p className="m-0 font-ui text-[11px] font-bold tracking-[0.14em] text-[var(--color-brand-green)] uppercase">
            Base Land
          </p>
          <p className="m-0 font-ui text-xs text-[var(--color-text-muted)]">Admin CMS</p>
        </div>

        <nav className="flex flex-1 flex-col gap-1">
          {items.map((item) =>
            item.ready ? (
              <AdminNavLink key={item.href} href={item.href} label={item.label} />
            ) : (
              <AdminNavComingSoon key={item.href} label={item.label} />
            ),
          )}
        </nav>

        <div className="mt-6 border-t border-[var(--color-border)] pt-4">
          <p className="m-0 truncate font-ui text-sm font-medium text-[var(--color-charcoal)]">{user.name}</p>
          <p className="m-0 truncate font-ui text-xs text-[var(--color-text-muted)]">
            {user.email} · {user.role === "ADMIN" ? "Admin" : "Sales"}
          </p>
          <form action={logoutAction} className="mt-3">
            <button
              type="submit"
              className="w-full rounded-xs border border-[var(--color-border)] px-3 py-2 font-ui text-xs font-semibold tracking-[0.04em] text-[var(--color-charcoal)] uppercase hover:bg-[var(--color-sand)]"
            >
              Đăng xuất
            </button>
          </form>
        </div>
      </aside>

      <main className="min-w-0 flex-1 p-8">{children}</main>
    </div>
  );
}
