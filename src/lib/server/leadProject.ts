import "server-only";

import { prisma } from "./db";

// Every lead form on the site sends a free-text `source` string (see the
// call sites of LeadFormFull/LeadFormSimple/LeadModal) — either a generic
// page name ("home", "contact", "news", "about", "projects"), a project's
// own slug directly (ProjectCTA passes `data.leadSource`, which IS the
// slug), or "project-video/<slug>/<topic>" (ProjectVideoDuo's per-video
// CTA). This derives the Project this lead is about from that same string
// server-side, rather than adding a new prop to every lead form call site.
export async function resolveProjectIdFromSource(source: string): Promise<string | null> {
  const videoMatch = source.match(/^project-video\/([^/]+)\//);
  const candidateSlug = videoMatch ? videoMatch[1] : source;

  const project = await prisma.project.findUnique({ where: { slug: candidateSlug }, select: { id: true } });
  return project?.id ?? null;
}
