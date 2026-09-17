import { requireUser } from "@/lib/server/auth";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  // The authoritative check — middleware only fast-redirects on a missing
  // cookie, this validates the session against the database on every request.
  const user = await requireUser();

  return <AdminShell user={user}>{children}</AdminShell>;
}
