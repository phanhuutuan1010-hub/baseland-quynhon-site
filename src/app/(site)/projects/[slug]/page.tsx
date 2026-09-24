import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublishedProjectBySlug, getPublishedProjectSlugs } from "@/lib/server/mappers/project";
import { ProjectPage } from "@/components/project-detail/ProjectPage";
import { ProjectNav } from "@/components/project-detail/ProjectNav";
import { toJsonLdString } from "@/lib/jsonLd";

type Params = { slug: string };

// Prerendered at build; projects published later render on first visit and
// are cached. Admin project actions call revalidatePath to refresh them.
export async function generateStaticParams() {
  return (await getPublishedProjectSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);
  if (!project) return {};

  const title = project.seo?.title || `${project.name} — Base Land Quy Nhơn`;
  const description = project.seo?.description || project.hero.subhead.vi;
  const ogImage = project.seo?.ogImageUrl || project.hero.image?.src;

  return {
    title,
    description,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title,
      description,
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
  };
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default async function ProjectDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Base Land Quy Nhơn", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Dự án", item: `${SITE_URL}/projects` },
      { "@type": "ListItem", position: 3, name: project.name, item: `${SITE_URL}/projects/${project.slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLdString(breadcrumbSchema) }} />
      {/* Replaces the shared site Nav for this route (see SiteChrome) — now
          rendered here, not derived from a client-side static-registry
          lookup, since project content is DB-backed and can change per edit. */}
      <ProjectNav project={project} />
      <ProjectPage project={project} />
    </>
  );
}
