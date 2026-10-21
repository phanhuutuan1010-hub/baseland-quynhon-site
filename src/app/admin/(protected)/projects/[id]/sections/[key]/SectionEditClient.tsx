"use client";

import { GenericSectionForm } from "@/components/admin/GenericSectionForm";
import { updateProjectSectionContent } from "../../../actions";
import type { EditableProjectSectionKey } from "@/lib/server/validation/project";

export function SectionEditClient({
  projectId,
  sectionKey,
  initial,
  itemTemplates,
}: {
  projectId: string;
  sectionKey: EditableProjectSectionKey;
  initial: Record<string, unknown>;
  itemTemplates: Record<string, unknown>;
}) {
  return (
    <GenericSectionForm
      initial={initial}
      itemTemplates={itemTemplates}
      onSave={(content) => updateProjectSectionContent(projectId, sectionKey, content)}
    />
  );
}
