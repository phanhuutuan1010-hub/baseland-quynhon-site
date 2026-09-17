import { notFound } from "next/navigation";
import { requireRole } from "@/lib/server/auth";
import { prisma } from "@/lib/server/db";
import { OverviewForm } from "./OverviewForm";
import type { ProjectOverviewValue } from "./types";
import type { ProjectHero, ProjectCta } from "@/lib/project-detail/types";
import type { Localized } from "@/lib/i18n";

export const metadata = { title: "Overview" };

export default async function ProjectOverviewPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireRole("ADMIN", "SALES");
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) notFound();

  if (user.role !== "ADMIN") {
    return (
      <p className="m-0 font-body text-sm text-[var(--color-text-muted)]">
        Bạn không có quyền chỉnh sửa dự án — liên hệ Admin nếu cần cập nhật.
      </p>
    );
  }

  const category = project.category as Localized<string>;
  const statusLabel = project.statusLabel as Localized<string>;
  const hero = project.hero as ProjectHero;
  const cta = project.cta as ProjectCta;

  const initial: ProjectOverviewValue = {
    name: project.name,
    categoryVi: category.vi,
    categoryEn: category.en,
    statusLabelVi: statusLabel.vi,
    statusLabelEn: statusLabel.en,
    theme: project.theme ?? "",
    verificationRequired: project.verificationRequired,
    heroEyebrowVi: hero.eyebrow.vi,
    heroEyebrowEn: hero.eyebrow.en,
    heroAddressLineVi: hero.addressLine.vi,
    heroAddressLineEn: hero.addressLine.en,
    heroSubheadVi: hero.subhead.vi,
    heroSubheadEn: hero.subhead.en,
    heroCtaExploreLabelVi: hero.ctaExploreLabel.vi,
    heroCtaExploreLabelEn: hero.ctaExploreLabel.en,
    heroCtaExploreHref: hero.ctaExploreHref,
    heroCtaConsultLabelVi: hero.ctaConsultLabel.vi,
    heroCtaConsultLabelEn: hero.ctaConsultLabel.en,
    heroCtaConsultHref: hero.ctaConsultHref,
    heroImageSrc: hero.image?.src ?? "",
    ctaEyebrowVi: cta.eyebrow.vi,
    ctaEyebrowEn: cta.eyebrow.en,
    ctaHeadlineVi: cta.headline.vi,
    ctaHeadlineEn: cta.headline.en,
    ctaBodyVi: cta.body.vi,
    ctaBodyEn: cta.body.en,
    ctaCallNowLabelVi: cta.callNowLabel.vi,
    ctaCallNowLabelEn: cta.callNowLabel.en,
    ctaLeadSource: cta.leadSource,
    seoTitle: project.seoTitle ?? "",
    seoDescription: project.seoDescription ?? "",
    seoOgImageUrl: project.seoOgImageUrl ?? "",
  };

  return (
    <div className="rounded-sm border border-[var(--color-border)] bg-[var(--color-warm-white)]">
      <OverviewForm projectId={project.id} initial={initial} />
    </div>
  );
}
