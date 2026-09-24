import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getHomepageSections } from "@/lib/server/mappers/homepage";
import { getSiteChromeData } from "@/lib/server/mappers/siteChrome";
import { getPublishedArticles } from "@/lib/server/mappers/news";
import { HeroSection } from "@/components/home/HeroSection";
import { IntroSection } from "@/components/home/IntroSection";
import { WhyQuyNhonSection } from "@/components/home/WhyQuyNhonSection";
import { FeaturedProjectSection } from "@/components/home/FeaturedProjectSection";
import { ProjectsTeaserSection } from "@/components/home/ProjectsTeaserSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { WhyBaseLandSection } from "@/components/home/WhyBaseLandSection";
import { NewsTeaserSection } from "@/components/home/NewsTeaserSection";
import { LeadCtaSection } from "@/components/home/LeadCtaSection";

export const metadata: Metadata = buildMetadata({
  title: "Bất động sản Quy Nhơn | Base Land Quy Nhơn",
  description:
    "Khám phá các dự án bất động sản tại Quy Nhơn cùng Base Land Quy Nhơn. Căn hộ, nhà phố, shophouse và cơ hội đầu tư.",
  path: "/",
});

// Data-driven orchestrator — mirrors ProjectPage.tsx's pattern (section list
// decides what renders), except here the Admin-controlled `enabled`/`order`
// genuinely comes from the DB instead of a fixed per-project literal.
export default async function HomePage() {
  const [sections, chrome, articles] = await Promise.all([getHomepageSections(), getSiteChromeData(), getPublishedArticles()]);
  const latestArticles = articles.slice(0, 3);

  return (
    <div className="relative w-full">
      {sections.map((section) => {
        switch (section.type) {
          case "HERO":
            return <HeroSection key={section.type} content={section.content} />;
          case "INTRODUCTION":
            return <IntroSection key={section.type} content={section.content} />;
          case "WHY_QUY_NHON":
            return <WhyQuyNhonSection key={section.type} content={section.content} />;
          case "FEATURED_PROJECT":
            return <FeaturedProjectSection key={section.type} content={section.content} />;
          case "PROJECTS_TEASER":
            return <ProjectsTeaserSection key={section.type} content={section.content} />;
          case "SERVICES":
            return <ServicesSection key={section.type} content={section.content} />;
          case "WHY_BASE_LAND":
            return <WhyBaseLandSection key={section.type} content={section.content} />;
          case "NEWS_TEASER":
            return <NewsTeaserSection key={section.type} content={section.content} latestArticles={latestArticles} />;
          case "LEAD_CTA":
            return (
              <LeadCtaSection
                key={section.type}
                content={section.content}
                contactPhone={chrome.contactPhone}
                contactPhoneHref={chrome.contactPhoneHref}
              />
            );
        }
      })}
    </div>
  );
}
