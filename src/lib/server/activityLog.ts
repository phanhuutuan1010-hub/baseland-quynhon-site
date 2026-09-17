import "server-only";

import { prisma } from "./db";

// Field groups that must always be logged with old/new values when changed,
// per the CMS spec — price, legal, ownership, handover, progress, operator
// and developer are the fields a lead or a legal dispute could hinge on.
export const SENSITIVE_FIELD_GROUPS = [
  "price",
  "legal",
  "ownership",
  "handover",
  "progress",
  "operator",
  "developer",
] as const;

export function isSensitiveField(field: string): boolean {
  const normalized = field.toLowerCase();
  return SENSITIVE_FIELD_GROUPS.some((group) => normalized.includes(group));
}

export async function logActivity(params: {
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  field?: string;
  oldValue?: unknown;
  newValue?: unknown;
}): Promise<void> {
  const { userId, action, entityType, entityId, field } = params;
  if (field && isSensitiveField(field) && params.oldValue === undefined && params.newValue === undefined) {
    throw new Error(`logActivity: sensitive field "${field}" requires oldValue/newValue`);
  }
  await prisma.activityLog.create({
    data: {
      userId,
      action,
      entityType,
      entityId,
      field,
      oldValue: params.oldValue === undefined ? undefined : (params.oldValue as object),
      newValue: params.newValue === undefined ? undefined : (params.newValue as object),
    },
  });
}
