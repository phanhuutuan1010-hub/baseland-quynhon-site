import { z } from "zod";

export const createNewsSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1, "Bắt buộc")
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Slug chỉ gồm chữ thường, số và dấu gạch ngang"),
  titleVi: z.string().trim().min(1, "Bắt buộc"),
  titleEn: z.string().trim().min(1, "Bắt buộc"),
  categoryId: z.string().trim().min(1, "Chọn danh mục"),
});

export const updateNewsSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1, "Bắt buộc")
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Slug chỉ gồm chữ thường, số và dấu gạch ngang"),
  titleVi: z.string().trim().min(1, "Bắt buộc"),
  titleEn: z.string().trim().min(1, "Bắt buộc"),
  excerptVi: z.string().trim().min(1, "Bắt buộc"),
  excerptEn: z.string().trim().min(1, "Bắt buộc"),
  contentVi: z.string(),
  contentEn: z.string(),
  categoryId: z.string().trim().min(1, "Chọn danh mục"),
  featuredImageUrl: z.string().trim().optional().or(z.literal("")),
  tags: z.array(z.string().trim().min(1)),
  relatedProjectIds: z.array(z.string()),
  seoTitle: z.string().trim().optional().or(z.literal("")),
  seoDescription: z.string().trim().optional().or(z.literal("")),
});

export const categorySchema = z.object({
  key: z
    .string()
    .trim()
    .min(1, "Bắt buộc")
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Key chỉ gồm chữ thường, số và dấu gạch ngang"),
  labelVi: z.string().trim().min(1, "Bắt buộc"),
  labelEn: z.string().trim().min(1, "Bắt buộc"),
});
