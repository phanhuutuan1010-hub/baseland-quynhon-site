"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/server/db";
import { requireRole } from "@/lib/server/auth";
import { logActivity } from "@/lib/server/activityLog";
import {
  contactSettingsSchema,
  analyticsSettingsSchema,
  globalSettingsSchema,
  menuItemSchema,
} from "@/lib/server/validation/settings";

type ActionResult = { error?: string };

async function getOrCreateSettingsRow() {
  return prisma.settings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      branchName: "Base Land Quy Nhơn",
      navCtaLabelVi: "Nhận tư vấn",
      navCtaLabelEn: "Get in Touch",
      hotline: "0965 273 179",
      hotlineHref: "tel:+84965273179",
      contactEmail: "baselandquynhon@gmail.com",
      contactEmailHref: "mailto:baselandquynhon@gmail.com",
      addressVi: "41 Hoa Lư, Phường Quy Nhơn, Tỉnh Gia Lai",
      addressEn: "41 Hoa Lư, Quy Nhơn Ward, Gia Lai Province",
      siteName: "Base Land Quy Nhơn",
    },
  });
}

export async function updateContactSettings(input: unknown): Promise<ActionResult> {
  const user = await requireRole("ADMIN");
  const parsed = contactSettingsSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" };

  const before = await getOrCreateSettingsRow();
  const d = parsed.data;
  await prisma.settings.update({
    where: { id: 1 },
    data: {
      branchName: d.branchName,
      navCtaLabelVi: d.navCtaLabelVi,
      navCtaLabelEn: d.navCtaLabelEn,
      hotline: d.hotline,
      hotlineHref: d.hotlineHref,
      contactEmail: d.contactEmail,
      contactEmailHref: d.contactEmailHref,
      addressVi: d.addressVi,
      addressEn: d.addressEn,
      mapsUrl: d.mapsUrl || null,
      socialLinks: { facebook: d.facebookUrl || null, zalo: d.zaloUrl || null, youtube: d.youtubeUrl || null },
    },
  });

  await logActivity({
    userId: user.id,
    action: "settings.contact.update",
    entityType: "Settings",
    entityId: "1",
    oldValue: { hotline: before.hotline, contactEmail: before.contactEmail },
    newValue: { hotline: d.hotline, contactEmail: d.contactEmail },
  });

  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
  return {};
}

export async function updateAnalyticsSettings(input: unknown): Promise<ActionResult> {
  const user = await requireRole("ADMIN");
  const parsed = analyticsSettingsSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" };

  await getOrCreateSettingsRow();
  await prisma.settings.update({
    where: { id: 1 },
    data: {
      gaId: parsed.data.gaId || null,
      gtmId: parsed.data.gtmId || null,
      metaPixelId: parsed.data.metaPixelId || null,
    },
  });

  await logActivity({ userId: user.id, action: "settings.analytics.update", entityType: "Settings", entityId: "1" });
  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
  return {};
}

export async function updateGlobalSettings(input: unknown): Promise<ActionResult> {
  const user = await requireRole("ADMIN");
  const parsed = globalSettingsSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" };

  await getOrCreateSettingsRow();
  await prisma.settings.update({
    where: { id: 1 },
    data: {
      siteName: parsed.data.siteName,
      defaultLanguage: parsed.data.defaultLanguage,
      logoUrl: parsed.data.logoUrl || null,
      faviconUrl: parsed.data.faviconUrl || null,
      defaultOgImageUrl: parsed.data.defaultOgImageUrl || null,
    },
  });

  await logActivity({ userId: user.id, action: "settings.global.update", entityType: "Settings", entityId: "1" });
  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
  return {};
}

export async function createMenuItem(input: unknown): Promise<ActionResult> {
  const user = await requireRole("ADMIN");
  const parsed = menuItemSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" };

  const count = await prisma.menuItem.count();
  const item = await prisma.menuItem.create({
    data: {
      labelVi: parsed.data.labelVi,
      labelEn: parsed.data.labelEn,
      type: parsed.data.type,
      href: parsed.data.href || null,
      targetSlug: parsed.data.targetSlug || null,
      enabled: parsed.data.enabled,
      order: count,
    },
  });

  await logActivity({ userId: user.id, action: "menu.create", entityType: "MenuItem", entityId: item.id });
  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
  return {};
}

export async function updateMenuItem(id: string, input: unknown): Promise<ActionResult> {
  const user = await requireRole("ADMIN");
  const parsed = menuItemSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" };

  await prisma.menuItem.update({
    where: { id },
    data: {
      labelVi: parsed.data.labelVi,
      labelEn: parsed.data.labelEn,
      type: parsed.data.type,
      href: parsed.data.href || null,
      targetSlug: parsed.data.targetSlug || null,
      enabled: parsed.data.enabled,
    },
  });

  await logActivity({ userId: user.id, action: "menu.update", entityType: "MenuItem", entityId: id });
  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
  return {};
}

export async function deleteMenuItem(id: string): Promise<ActionResult> {
  const user = await requireRole("ADMIN");
  await prisma.menuItem.delete({ where: { id } });
  await logActivity({ userId: user.id, action: "menu.delete", entityType: "MenuItem", entityId: id });
  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
  return {};
}

export async function reorderMenuItems(orderedIds: string[]): Promise<ActionResult> {
  const user = await requireRole("ADMIN");
  await prisma.$transaction(orderedIds.map((id, order) => prisma.menuItem.update({ where: { id }, data: { order } })));
  await logActivity({ userId: user.id, action: "menu.reorder", entityType: "MenuItem", entityId: "all" });
  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
  return {};
}
