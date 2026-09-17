import { z } from "zod";

export const contactSettingsSchema = z.object({
  branchName: z.string().trim().min(1, "Bắt buộc"),
  navCtaLabelVi: z.string().trim().min(1, "Bắt buộc"),
  navCtaLabelEn: z.string().trim().min(1, "Bắt buộc"),
  hotline: z.string().trim().min(1, "Bắt buộc"),
  hotlineHref: z.string().trim().min(1, "Bắt buộc"),
  contactEmail: z.string().trim().email("Email không hợp lệ"),
  contactEmailHref: z.string().trim().min(1, "Bắt buộc"),
  addressVi: z.string().trim().min(1, "Bắt buộc"),
  addressEn: z.string().trim().min(1, "Bắt buộc"),
  mapsUrl: z.string().trim().optional().or(z.literal("")),
  facebookUrl: z.string().trim().optional().or(z.literal("")),
  zaloUrl: z.string().trim().optional().or(z.literal("")),
  youtubeUrl: z.string().trim().optional().or(z.literal("")),
});

export const analyticsSettingsSchema = z.object({
  gaId: z.string().trim().optional().or(z.literal("")),
  gtmId: z.string().trim().optional().or(z.literal("")),
  metaPixelId: z.string().trim().optional().or(z.literal("")),
});

export const globalSettingsSchema = z.object({
  siteName: z.string().trim().min(1, "Bắt buộc"),
  defaultLanguage: z.enum(["vi", "en"]),
  logoUrl: z.string().trim().optional().or(z.literal("")),
  faviconUrl: z.string().trim().optional().or(z.literal("")),
  defaultOgImageUrl: z.string().trim().optional().or(z.literal("")),
});

export const menuItemSchema = z.object({
  labelVi: z.string().trim().min(1, "Bắt buộc"),
  labelEn: z.string().trim().min(1, "Bắt buộc"),
  type: z.enum(["INTERNAL", "EXTERNAL", "PROJECT", "NEWS", "ANCHOR"]),
  href: z.string().trim().optional().or(z.literal("")),
  targetSlug: z.string().trim().optional().or(z.literal("")),
  enabled: z.boolean(),
});
