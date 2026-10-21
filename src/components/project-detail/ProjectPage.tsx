"use client";

import type { CSSProperties, ReactNode } from "react";
import type { ProjectDetailData } from "@/lib/project-detail/types";
import { getCompactAnchorItems, isCompactLayout, isSectionVisible } from "@/lib/project-detail/types";
import { ProjectHero } from "./ProjectHero";
import { ProjectIntro } from "./ProjectIntro";
import { ProjectStats } from "./ProjectStats";
import { ProjectTowerSplit } from "./ProjectTowerSplit";
import { ProjectLocation } from "./ProjectLocation";
import { ProjectMasterplan } from "./ProjectMasterplan";
import { ProjectGallery } from "./ProjectGallery";
import { ProjectPhotoStatement } from "./ProjectPhotoStatement";
import { ProjectMaterialStory } from "./ProjectMaterialStory";
import { ProjectLifestyle } from "./ProjectLifestyle";
import { AmenitySection } from "./AmenitySection";
import { ResidenceSelector } from "./ResidenceSelector";
import { ProjectVideoDuo } from "./ProjectVideoDuo";
import { FloorPlanViewer } from "./FloorPlanViewer";
import { InvestmentSection } from "./InvestmentSection";
import { DocumentSection } from "./DocumentSection";
import { TrustSection } from "./TrustSection";
import { ProjectNewsTeaser } from "./ProjectNewsTeaser";
import { FAQSection } from "./FAQSection";
import { ProjectVerificationNote } from "./ProjectVerificationNote";
import { ProjectCTA } from "./ProjectCTA";
import { SalesPhasesSection } from "./SalesPhasesSection";
import { VirtualTourSection } from "./VirtualTourSection";
import { ProjectAnchorNav } from "./ProjectAnchorNav";
import { ProjectWhy } from "./ProjectWhy";
import { VerifyTrustSection } from "./VerifyTrustSection";

/**
 * Project Detail Template — orchestrates every section in the site's fixed
 * canonical order (matches the Q'Terra flagship implementation). A section
 * renders only when its data is present and not explicitly disabled via
 * `project.sections[key] = false` (see isSectionVisible). Adding a new
 * project = writing a new ProjectDetailData object; this component and the
 * section components underneath it never change per project.
 */
export function ProjectPage({
  project,
  extras,
}: {
  project: ProjectDetailData;
  /** Optional overlays mounted at the end (e.g. Q'Terra's lead pop-up). */
  extras?: ReactNode;
}) {
  if (isCompactLayout(project)) return <CompactProjectPage project={project} extras={extras} />;
  const showTour = isSectionVisible(project, "virtualTour") && !!project.virtualTour?.tourUrl;
  return (
    <div className="relative w-full" data-project-theme={project.theme}>
      <ProjectHero
        id={project.slug}
        name={project.name}
        data={project.hero}
        tourCta={showTour && project.virtualTour ? { label: project.virtualTour.heroCtaLabel, href: "#virtual-tour" } : undefined}
      />

      {isSectionVisible(project, "intro") && project.intro && <ProjectIntro id="statement" data={project.intro} />}

      {isSectionVisible(project, "stats") && project.stats && <ProjectStats id="numbers" data={project.stats} />}

      {isSectionVisible(project, "towers") && project.towers && (
        <ProjectTowerSplit id="towers" data={project.towers} />
      )}

      {isSectionVisible(project, "salesPhases") && project.salesPhases && (
        <SalesPhasesSection id="sales-phases" data={project.salesPhases} fallbackImage={project.hero.image?.src} />
      )}

      {isSectionVisible(project, "location") && project.location && (
        <ProjectLocation id="location" data={project.location} />
      )}

      {isSectionVisible(project, "masterplan") && project.masterplan && (
        <ProjectMasterplan id="masterplan" data={project.masterplan} />
      )}

      {isSectionVisible(project, "gallery") && project.gallery && (
        <ProjectGallery id="destinations" data={project.gallery} />
      )}

      {isSectionVisible(project, "architecture") && project.architecture && (
        <ProjectPhotoStatement id="architecture" data={project.architecture} variant="architecture" />
      )}

      {isSectionVisible(project, "materialStory") && project.materialStory && (
        <ProjectMaterialStory data={project.materialStory} />
      )}

      {isSectionVisible(project, "lifestyle") && project.lifestyle && (
        <ProjectLifestyle id="lifestyle" data={project.lifestyle} />
      )}

      {isSectionVisible(project, "education") && project.education && (
        <ProjectPhotoStatement id="education" data={project.education} variant="architecture" />
      )}

      {isSectionVisible(project, "amenities") && project.amenities && (
        <AmenitySection id="amenities" data={project.amenities} />
      )}

      {isSectionVisible(project, "views") && project.views && (
        <ProjectPhotoStatement data={project.views} variant="views" />
      )}

      {isSectionVisible(project, "residences") && project.residences && (
        <ResidenceSelector id="residences" data={project.residences} />
      )}

      {isSectionVisible(project, "videoDuo") && project.videoDuo && (
        <ProjectVideoDuo id="video-stories" data={project.videoDuo} projectSlug={project.slug} />
      )}

      {isSectionVisible(project, "floorPlans") && project.floorPlans && (
        <FloorPlanViewer id="floorplans" data={project.floorPlans} />
      )}

      {showTour && project.virtualTour && (
        <VirtualTourSection
          id="virtual-tour"
          data={project.virtualTour}
          projectSlug={project.slug}
          fallbackImage={project.hero.image?.src}
          qualifiers={project.cta.qualifiers}
        />
      )}

      {isSectionVisible(project, "investment") && project.investment && (
        <InvestmentSection id="investment" data={project.investment} />
      )}

      {isSectionVisible(project, "documents") && project.documents && (
        <DocumentSection id="documents" data={project.documents} tourUrl={project.virtualTour?.tourUrl} projectSlug={project.slug} />
      )}

      {isSectionVisible(project, "verification") && project.verification && (
        <ProjectVerificationNote id="verification" data={project.verification} />
      )}

      {isSectionVisible(project, "faq") && project.faq && <FAQSection id="faq" data={project.faq} />}

      {isSectionVisible(project, "news") && project.news && <ProjectNewsTeaser id="news" data={project.news} articles={project.relatedArticles ?? []} />}

      {isSectionVisible(project, "legal") && project.legal && <TrustSection data={project.legal} tourUrl={project.virtualTour?.tourUrl} projectSlug={project.slug} />}

      <ProjectCTA id="lead" data={project.cta} />

      {extras}
    </div>
  );
}

/**
 * Standard project layout (the Q'Terra template) — every project uses it
 * unless Admin sets hero.layout = "full" (the older editorial flow above).
 * Order: Hero → Vì sao → Vị trí → Kiến trúc → Chọn căn → 360° → Tiện ích →
 * Video → Giá & lộ trình → Kiểm chứng & Base Land → Form.
 *
 * Per-project differences come only from the theme and project modules,
 * placed in the matching slot:
 *   Vì sao   — towers.reasons cards, else the two-tower split (Simona's
 *              The Sea / The Harbour, The Sailing's The Maestro / The Sailing)
 *   Chọn căn — masterplan (Phú Gia) shown first, then the residence selector
 *   Kiến trúc — education photo statement follows it (Phú Gia)
 *   Kiểm chứng — verification (verified/pending facts), FAQ, news follow it
 * A slot with no real data is skipped — nothing is filled in. Merged
 * sections (gallery → Vị trí, floorPlans → Chọn căn dialog, salesPhases
 * date → Giá, legal → Kiểm chứng) are read even when hidden as standalone.
 */
function CompactProjectPage({ project, extras }: { project: ProjectDetailData; extras?: ReactNode }) {
  const show = (key: Parameters<typeof isSectionVisible>[1]) => isSectionVisible(project, key);
  const { towers, location, architecture, residences, amenities, videoDuo, documents, legal } = project;
  const showTour = show("virtualTour") && !!project.virtualTour?.tourUrl;
  const anchors = getCompactAnchorItems(project);

  const hasReasons = !!towers?.reasons?.length;
  const hasTowerPair = towers?.towers?.length === 2;
  const showLocation = show("location") && !!location && !!(pickAny(location.headline) || location.journey?.length || location.benefits?.length);
  const showArchitecture = show("architecture") && !!architecture && !!pickAny(architecture.headline);
  const showResidences = show("residences") && !!residences?.items.length;
  const showAmenities = show("amenities") && !!amenities?.chapters.length;
  // Only real videos — no "đang sản xuất" placeholder cards.
  const showVideo = show("videoDuo") && !!videoDuo?.items.some((v) => v.enabled && v.videoUrl);
  const showDocuments = show("documents") && !!documents?.items.length;
  const showLegal = !!legal?.points.length || !!pickAny(legal?.body);

  return (
    <div
      className="relative w-full [&_section[id]]:scroll-mt-[104px] md:[&_section[id]]:scroll-mt-[120px]"
      data-project-theme={project.theme}
      // Vietnamese stacked diacritics need a little more room between
      // wrapped headline lines than the site default (1.25).
      style={{ "--lh-heading": "1.32" } as CSSProperties}
    >
      <ProjectHero
        id={project.slug}
        name={project.name}
        data={{ ...project.hero, layout: "compact", facts: heroFacts(project) }}
        tourCta={showTour && project.virtualTour ? { label: project.virtualTour.heroCtaLabel, href: "#virtual-tour" } : undefined}
      />
      <ProjectAnchorNav items={anchors} />

      {show("towers") && towers && hasReasons && <ProjectWhy id="overview" data={towers} />}
      {show("towers") && towers && !hasReasons && hasTowerPair && <ProjectTowerSplit id="overview" data={towers} />}

      {showLocation && location && <ProjectLocation id="location" data={location} compact destinations={project.gallery} />}

      {showArchitecture && architecture && <ProjectPhotoStatement id="architecture" data={architecture} variant="compact" />}
      {show("education") && project.education && (
        <ProjectPhotoStatement id="education" data={project.education} variant="compact" />
      )}

      {show("masterplan") && project.masterplan && <ProjectMasterplan id="masterplan" data={project.masterplan} />}
      {showResidences && residences && (
        <ResidenceSelector id="residences" data={residences} compact floorPlans={project.floorPlans} />
      )}

      {showTour && project.virtualTour && (
        <VirtualTourSection
          id="virtual-tour"
          compact
          data={project.virtualTour}
          projectSlug={project.slug}
          fallbackImage={project.hero.image?.src}
          qualifiers={project.cta.qualifiers}
        />
      )}

      {showAmenities && amenities && <AmenitySection id="amenities" data={amenities} compact />}

      {showVideo && videoDuo && <ProjectVideoDuo id="video-stories" data={videoDuo} projectSlug={project.slug} compact />}

      <InvestmentSection
        id="investment"
        data={show("investment") ? project.investment : undefined}
        compact
        salesPhases={project.salesPhases}
      />

      {(showDocuments || showLegal) && (
        <VerifyTrustSection
          id="documents"
          documents={showDocuments ? documents : undefined}
          legal={showLegal ? legal : undefined}
          tourUrl={project.virtualTour?.tourUrl}
          projectSlug={project.slug}
        />
      )}
      {show("verification") && project.verification && !!project.verification.items.length && (
        <ProjectVerificationNote id="verification" data={project.verification} />
      )}
      {show("faq") && project.faq && !!project.faq.items.length && <FAQSection id="faq" data={project.faq} />}
      {show("news") && project.news && !!project.relatedArticles?.length && <ProjectNewsTeaser id="news" data={project.news} articles={project.relatedArticles ?? []} />}

      <ProjectCTA id="lead" data={project.cta} />

      {extras}
    </div>
  );
}

function pickAny(v?: { vi: string; en: string }) {
  return !!(v?.vi.trim() || v?.en.trim());
}

/** Hero key-figure line: hero.facts when set, else the project's own Stats
 * items ("39 Tầng"), so no project needs a separately written line. */
function heroFacts(project: ProjectDetailData) {
  if (pickAny(project.hero.facts)) return project.hero.facts;
  // First four figures, like Q'Terra's line; "·" inside a figure would
  // split it, so it becomes "/" (values) or "," (labels).
  const items = (isSectionVisible(project, "stats") ? (project.stats?.items ?? []) : []).slice(0, 4);
  if (!items.length) return undefined;
  const line = (lang: "vi" | "en") =>
    items
      .map((it) => `${it.value.replace(/\s*·\s*/g, "/")} ${it.label[lang].replace(/\s*·\s*/g, ", ")}`.trim())
      .join(" · ");
  return { vi: line("vi"), en: line("en") };
}
