import { z } from "zod";

export const leadStatusValues = ["NEW", "CONTACTED", "CONVERTED", "ARCHIVED"] as const;

export const updateLeadSchema = z.object({
  status: z.enum(leadStatusValues).optional(),
  assignedToId: z.string().nullable().optional(),
});

export const addLeadNoteSchema = z.object({
  text: z.string().trim().min(1, "Ghi chú không được để trống"),
});
