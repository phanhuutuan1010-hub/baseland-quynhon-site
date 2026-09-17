"use client";

import type { ProjectDetailData } from "@/lib/project-detail/types";
import { isSectionVisible } from "@/lib/project-detail/types";
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

/**
 * Project Detail Template — orchestrates every section in the site's fixed
 * canonical order (matches the Q'Terra flagship implementation). A section
 * renders only when its data is present and not explicitly disabled via
 * `project.sections[key] = false` (see isSectionVisible). Adding a new
 * project = writing a new ProjectDetailData object; this component and the
 * section components underneath it never change per project.
 */
export function ProjectPage({ project }: { project: ProjectDetailData }) {
  return (
    <div className="relative w-full" data-project-theme={project.theme}>
      <ProjectHero id={project.slug} name={project.name} data={project.hero} />

      {isSectionVisible(project, "intro") && project.intro && <ProjectIntro id="statement" data={project.intro} />}

      {isSectionVisible(project, "stats") && project.stats && <ProjectStats id="numbers" data={project.stats} />}

      {isSectionVisible(project, "towers") && project.towers && (
        <ProjectTowerSplit id="towers" data={project.towers} />
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

      {isSectionVisible(project, "investment") && project.investment && (
        <InvestmentSection id="investment" data={project.investment} />
      )}

      {isSectionVisible(project, "documents") && project.documents && (
        <DocumentSection id="documents" data={project.documents} />
      )}

      {isSectionVisible(project, "verification") && project.verification && (
        <ProjectVerificationNote id="verification" data={project.verification} />
      )}

      {isSectionVisible(project, "faq") && project.faq && <FAQSection id="faq" data={project.faq} />}

      {isSectionVisible(project, "news") && project.news && <ProjectNewsTeaser id="news" data={project.news} />}

      {isSectionVisible(project, "legal") && project.legal && <TrustSection data={project.legal} />}

      <ProjectCTA id="lead" data={project.cta} />
    </div>
  );
}
