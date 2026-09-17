import { requireRole } from "@/lib/server/auth";
import { NewProjectForm } from "./NewProjectForm";

export const metadata = { title: "Thêm dự án" };

export default async function NewProjectPage() {
  await requireRole("ADMIN");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="m-0 font-ui text-2xl font-bold text-[var(--color-charcoal)]">Thêm dự án mới</h1>
      </div>
      <NewProjectForm />
    </div>
  );
}
