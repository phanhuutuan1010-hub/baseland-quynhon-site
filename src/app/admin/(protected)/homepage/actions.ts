"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/server/db";
import { requireRole } from "@/lib/server/auth";
import { logActivity, activityLogWrite } from "@/lib/server/activityLog";
import { homepageSectionContentSchema, type HomepageSectionTypeKey } from "@/lib/server/validation/homepage";

type ActionResult = { error?: string };

export async function updateHomepageSectionContent(type: HomepageSectionTypeKey, content: unknown): Promise<ActionResult> {
  const user = await requireRole("ADMIN");
  const parsed = homepageSectionContentSchema(type).safeParse(content);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" };

  const log = { userId: user.id, action: "homepage.section.update", entityType: "HomepageSection", entityId: type };
  try {
    await prisma.$transaction([
      prisma.homepageSection.update({ where: { type }, data: { content: parsed.data } }),
      activityLogWrite(log),
    ]);
  } catch (err) {
    if ((err as { code?: string }).code !== "P2025") throw err;
    // Section row doesn't exist yet (never seeded) — rare, so the extra
    // count query only runs here, not on every save.
    const order = await prisma.homepageSection.count();
    await prisma.$transaction([
      prisma.homepageSection.create({ data: { type, content: parsed.data, order, enabled: true } }),
      activityLogWrite(log),
    ]);
  }
  // Only the public page needs re-rendering; the admin form already holds
  // the saved values, and revalidating its own path would make this action
  // re-render the whole editor page into the response.
  revalidatePath("/");
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
