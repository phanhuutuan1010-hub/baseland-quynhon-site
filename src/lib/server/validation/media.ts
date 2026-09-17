import { z } from "zod";
import { ALLOWED_MIME_TYPES } from "@/lib/server/media";

export const createMediaSchema = z.object({
  filename: z.string().trim().min(1),
  url: z.string().trim().url(),
  mimeType: z.enum(ALLOWED_MIME_TYPES),
  size: z.number().int().positive(),
  titleVi: z.string().trim().min(1, "Bắt buộc"),
  titleEn: z.string().trim().min(1, "Bắt buộc"),
  altVi: z.string().trim().optional().or(z.literal("")),
  altEn: z.string().trim().optional().or(z.literal("")),
});

export const updateMediaSchema = z.object({
  titleVi: z.string().trim().min(1, "Bắt buộc"),
  titleEn: z.string().trim().min(1, "Bắt buộc"),
  altVi: z.string().trim().optional().or(z.literal("")),
  altEn: z.string().trim().optional().or(z.literal("")),
  captionVi: z.string().trim().optional().or(z.literal("")),
  captionEn: z.string().trim().optional().or(z.literal("")),
  focalX: z.number().min(0).max(1),
  focalY: z.number().min(0).max(1),
  requireLeadForDownload: z.boolean(),
});
