"use client";

import { usePathname } from "next/navigation";
import { Nav } from "./Nav";
import type { SiteChromeData } from "@/lib/siteChrome";

/**
 * Picks which nav renders for the current route. Every route keeps the
 * shared site Nav (Home/Projects/News/About/Contact) EXCEPT a project
 * detail page (`/projects/[slug]`, e.g. /projects/qterra), which renders its
 * own ProjectNav directly from the page itself (see
 * (site)/projects/[slug]/page.tsx) — that page already fetches the full,
 * DB-backed project data server-side, so this client component only needs
 * to suppress the generic Nav here rather than trying to look one up itself.
 * The `/projects` listing page itself is unaffected (its path has no third
 * segment, so it falls through to Nav).
 */
export function SiteChrome({ data }: { data: SiteChromeData }) {
  const pathname = usePathname();
  const isProjectDetailRoute = /^\/projects\/([^/]+)\/?$/.test(pathname);

  if (isProjectDetailRoute) return null;
  return <Nav data={data} />;
}
