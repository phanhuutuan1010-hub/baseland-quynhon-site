"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/server/db";
import { requireRole } from "@/lib/server/auth";
import { logActivity } from "@/lib/server/activityLog";
import { homepageSectionContentSchema, type HomepageSectionTypeKey } from "@/lib/server/validation/homepage";

type ActionResult = { error?: string };

export async function updateHomepageSectionContent(type: HomepageSectionTypeKey, content: unknown): Promise<ActionResult> {
  const user = await requireRole("ADMIN");
  const parsed = homepageSectionContentSchema(type).safeParse(content);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" };

  const existing = await prisma.homepageSection.findUnique({ where: { type } });
  const maxOrder = existing ? undefined : await prisma.homepageSection.count();

  await prisma.homepageSection.upsert({
    where: { type },
    update: { content: parsed.data },
    create: { type, content: parsed.data, order: maxOrder ?? 0, enabled: true },
  });

  await logActivity({ userId: user.id, action: "homepage.section.update", entityType: "HomepageSection", entityId: type });
  revalidatePath("/");
  revalidatePath(`/admin/homepage/${type}`);
  return {};
}

export async function toggleHomepageSectionEnabled(type: HomepageSectionTypeKey, enabled: boolean): Promise<ActionResult> {
  const user = await requireRole("ADMIN");
  await prisma.homepageSection.update({ where: { type }, data: { enabled } });
  await logActivity({ userId: user.id, action: "homepage.section.toggle", entityType: "HomepageSection", entityId: type, field: "enabled", oldValue: !enabled, newValue: enabled });
  revalidatePath("/");
  revalidatePath("/admin/homepage");
  return {};
}

export async function reorderHomepageSections(orderedTypes: HomepageSectionTypeKey[]): Promise<ActionResult> {
  const user = await requireRole("ADMIN");
  await prisma.$transaction(
    orderedTypes.map((type, order) => prisma.homepageSection.update({ where: { type }, data: { order } })),
  );
  await logActivity({ userId: user.id, action: "homepage.section.reorder", entityType: "HomepageSection", entityId: "all" });
  revalidatePath("/");
  return {};
}
