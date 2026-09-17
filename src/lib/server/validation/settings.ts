import { z } from "zod";

export const contactSettingsSchema = z.object({
  branchName: z.string().trim(),
  navCtaLabelVi: z.string().trim(),
  navCtaLabelEn: z.string().trim(),
  hotline: z.string().trim(),
  hotlineHref: z.string().trim(),
  // Empty is fine (no phone/email set yet); if something IS entered, it
  // must be a real email — see StickyCta/Footer/Nav, which already hide
  // the phone/email row when the value is blank.
  contactEmail: z.string().trim().email("Email không hợp lệ").optional().or(z.literal("")),
  contactEmailHref: z.string().trim(),
  addressVi: z.string().trim(),
  addressEn: z.string().trim(),
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
  siteName: z.string().trim(),
  defaultLanguage: z.enum(["vi", "en"]),
  logoUrl: z.string().trim().optional().or(z.literal("")),
  faviconUrl: z.string().trim().optional().or(z.literal("")),
  defaultOgImageUrl: z.string().trim().optional().or(z.literal("")),
});

export const menuItemSchema = z.object({
  labelVi: z.string().trim(),
  labelEn: z.string().trim(),
  type: z.enum(["INTERNAL", "EXTERNAL", "PROJECT", "NEWS", "ANCHOR"]),
  href: z.string().trim().optional().or(z.literal("")),
  targetSlug: z.string().trim().optional().or(z.literal("")),
  enabled: z.boolean(),
});
