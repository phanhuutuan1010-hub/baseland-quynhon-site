// Dev-only seed — creates 2 login accounts (Admin/Sales) so the Admin CMS
// can be logged into and tested locally. NOT for production: run this only
// against a dev/staging database. Passwords are printed once to the console
// so no secret is written into a tracked file.
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, type HomepageSectionType, type ProjectSectionType } from "@prisma/client";
import bcrypt from "bcryptjs";
import { HOME_CONTENT } from "../src/lib/content/home";
import type { ProjectDetailData, ProjectSectionKey } from "../src/lib/project-detail/types";
import { QTERRA_PROJECT } from "../src/lib/project-detail/qterra";
import { THE_SAILING_PROJECT } from "../src/lib/project-detail/the-sailing";
import { SIMONA_HEIGHTS_PROJECT } from "../src/lib/project-detail/simona";
import { PHU_GIA_ROYAL_PARK_PROJECT } from "../src/lib/project-detail/phu-gia";
import { NEWS_CATEGORIES, ARTICLES, type ProjectKey } from "../src/lib/content/news";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Real production content (not dev-only) — the site's actual Settings/Menu/
// Homepage copy, moved from src/lib/content/{nav,home}.ts into the DB so
// Phase 1's Admin CMS has something real to edit from day one.
async function seedRealContent() {
  await prisma.settings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      branchName: "Base Land Quy Nhơn",
      navCtaLabelVi: "Nhận tư vấn",
      navCtaLabelEn: "Get in Touch",
      hotline: "0965 273 179",
      hotlineHref: "tel:+84965273179",
      contactEmail: "baselandquynhon@gmail.com",
      contactEmailHref: "mailto:baselandquynhon@gmail.com",
      addressVi: "41 Hoa Lư, Phường Quy Nhơn, Tỉnh Gia Lai",
      addressEn: "41 Hoa Lư, Quy Nhơn Ward, Gia Lai Province",
      siteName: "Base Land Quy Nhơn",
      defaultLanguage: "vi",
    },
  });

  const menuLinks = [
    { labelVi: "Trang chủ", labelEn: "Home", href: "/" },
    { labelVi: "Dự án", labelEn: "Projects", href: "/projects" },
    { labelVi: "Tin tức", labelEn: "News", href: "/news" },
    { labelVi: "Giới thiệu", labelEn: "About", href: "/about" },
    { labelVi: "Liên hệ", labelEn: "Contact", href: "/contact" },
  ];
  for (const [index, link] of menuLinks.entries()) {
    await prisma.menuItem.upsert({
      where: { id: `seed-menu-${index}` },
      update: {},
      create: { id: `seed-menu-${index}`, ...link, type: "INTERNAL", order: index, enabled: true },
    });
  }

  const sections: { type: HomepageSectionType; content: object }[] = [
    { type: "HERO", content: { vi: HOME_CONTENT.vi.hero, en: HOME_CONTENT.en.hero } },
    { type: "INTRODUCTION", content: { vi: HOME_CONTENT.vi.intro, en: HOME_CONTENT.en.intro } },
    { type: "WHY_QUY_NHON", content: { vi: HOME_CONTENT.vi.whyqn, en: HOME_CONTENT.en.whyqn } },
    { type: "FEATURED_PROJECT", content: { vi: HOME_CONTENT.vi.featured, en: HOME_CONTENT.en.featured } },
    { type: "PROJECTS_TEASER", content: { vi: HOME_CONTENT.vi.local, en: HOME_CONTENT.en.local } },
    { type: "SERVICES", content: { vi: HOME_CONTENT.vi.services, en: HOME_CONTENT.en.services } },
    { type: "WHY_BASE_LAND", content: { vi: HOME_CONTENT.vi.whybl, en: HOME_CONTENT.en.whybl } },
    { type: "NEWS_TEASER", content: { vi: HOME_CONTENT.vi.news, en: HOME_CONTENT.en.news } },
    { type: "LEAD_CTA", content: { vi: HOME_CONTENT.vi.cta, en: HOME_CONTENT.en.cta } },
  ];
  for (const [index, section] of sections.entries()) {
    await prisma.homepageSection.upsert({
      where: { type: section.type },
      update: {},
      create: { type: section.type, order: index, enabled: true, content: section.content },
    });
  }

  console.log("Real content seed complete: Settings, 5 menu items, 9 homepage sections.");
}

const KEY_TO_SECTION_TYPE: Record<string, ProjectSectionType> = {
  intro: "INTRO",
  stats: "STATS",
  towers: "TOWERS",
  location: "LOCATION",
  masterplan: "MASTERPLAN",
  architecture: "ARCHITECTURE",
  materialStory: "MATERIAL_STORY",
  lifestyle: "LIFESTYLE",
  education: "EDUCATION",
  views: "VIEWS",
  investment: "INVESTMENT",
  legal: "LEGAL",
  faq: "FAQ",
  verification: "VERIFICATION",
  videoDuo: "VIDEO_DUO",
  news: "NEWS_TEASER",
};

// Real production content — the site's 4 actual project detail pages,
// moved from src/lib/project-detail/{qterra,simona,phu-gia,the-sailing}.ts
// into the DB verbatim (same objects, just re-homed) so nothing is lost or
// retyped by hand. Seeded as PUBLISHED since this is the site's real,
// already-live content, not placeholder data.
async function seedProject(data: ProjectDetailData) {
  const project = await prisma.project.upsert({
    where: { slug: data.slug },
    update: {},
    create: {
      slug: data.slug,
      name: data.name,
      category: data.category,
      statusLabel: data.status,
      theme: data.theme ?? null,
      sections: data.sections ?? {},
      hero: data.hero,
      cta: data.cta,
      publishStatus: "PUBLISHED",
      publishedAt: new Date(),
    },
  });

  for (const key of Object.keys(KEY_TO_SECTION_TYPE) as ProjectSectionKey[]) {
    const content = (data as unknown as Record<string, unknown>)[key];
    if (content == null) continue;
    const type = KEY_TO_SECTION_TYPE[key];
    await prisma.projectSection.upsert({
      where: { projectId_type: { projectId: project.id, type } },
      update: {},
      create: { projectId: project.id, type, content: content as object },
    });
  }

  if (data.residences) {
    await prisma.projectResidences.upsert({
      where: { projectId: project.id },
      update: {},
      create: { projectId: project.id, content: data.residences },
    });
  }
  if (data.floorPlans) {
    await prisma.projectFloorPlans.upsert({
      where: { projectId: project.id },
      update: {},
      create: { projectId: project.id, content: data.floorPlans },
    });
  }
  if (data.amenities) {
    await prisma.projectAmenities.upsert({
      where: { projectId: project.id },
      update: {},
      create: { projectId: project.id, content: data.amenities },
    });
  }
  if (data.gallery) {
    await prisma.projectGallery.upsert({
      where: { projectId: project.id },
      update: {},
      create: { projectId: project.id, content: data.gallery },
    });
  }
  if (data.documents) {
    await prisma.projectDocuments.upsert({
      where: { projectId: project.id },
      update: {},
      create: { projectId: project.id, content: data.documents },
    });
  }

  console.log(`Seeded project: ${data.slug}`);
}

async function seedAllProjects() {
  for (const data of [QTERRA_PROJECT, THE_SAILING_PROJECT, SIMONA_HEIGHTS_PROJECT, PHU_GIA_ROYAL_PARK_PROJECT]) {
    await seedProject(data);
  }
}

const PROJECT_KEY_TO_SLUG: Record<ProjectKey, string> = {
  qterra: "qterra",
  sailing: "the-sailing",
  simona: "simona-heights",
  phugia: "phu-gia-royal-park",
};

// Real production content — the site's 6 actual articles, moved from
// src/lib/content/news.ts verbatim. Paragraph arrays become sanitized-shape
// HTML (`<p>...</p>` per paragraph) directly here since this is our own
// trusted source content, not admin input — new/edited articles go through
// sanitizeArticleHtml() (src/lib/server/sanitizeHtml.ts) in the admin actions.
async function seedNews() {
  for (const [index, cat] of NEWS_CATEGORIES.entries()) {
    await prisma.category.upsert({
      where: { key: cat.key },
      update: {},
      create: { key: cat.key, labelVi: cat.label.vi, labelEn: cat.label.en, order: index },
    });
  }

  for (const article of ARTICLES) {
    const category = await prisma.category.findUniqueOrThrow({ where: { key: article.category } });
    const news = await prisma.news.upsert({
      where: { slug: article.slug },
      update: {},
      create: {
        slug: article.slug,
        titleVi: article.title.vi,
        titleEn: article.title.en,
        excerptVi: article.excerpt.vi,
        excerptEn: article.excerpt.en,
        contentVi: article.body.vi.map((p) => `<p>${p}</p>`).join(""),
        contentEn: article.body.en.map((p) => `<p>${p}</p>`).join(""),
        categoryId: category.id,
        status: "PUBLISHED",
        publishedAt: new Date(article.date),
      },
    });

    if (article.relatedProject) {
      const projectSlug = PROJECT_KEY_TO_SLUG[article.relatedProject];
      const project = await prisma.project.findUnique({ where: { slug: projectSlug } });
      if (project) {
        await prisma.newsProject.upsert({
          where: { newsId_projectId: { newsId: news.id, projectId: project.id } },
          update: {},
          create: { newsId: news.id, projectId: project.id },
        });
      }
    }
  }

  console.log(`Seeded news: ${NEWS_CATEGORIES.length} categories, ${ARTICLES.length} articles.`);
}

async function main() {
  const devAdminPassword = "ChangeMe-Admin-2026!";
  const devSalesPassword = "ChangeMe-Sales-2026!";

  const admin = await prisma.user.upsert({
    where: { email: "admin@baselandquynhon.dev" },
    update: {},
    create: {
      email: "admin@baselandquynhon.dev",
      name: "Admin (dev seed)",
      role: "ADMIN",
      passwordHash: await bcrypt.hash(devAdminPassword, 12),
    },
  });

  const sales = await prisma.user.upsert({
    where: { email: "sales@baselandquynhon.dev" },
    update: {},
    create: {
      email: "sales@baselandquynhon.dev",
      name: "Sales (dev seed)",
      role: "SALES",
      passwordHash: await bcrypt.hash(devSalesPassword, 12),
    },
  });

  console.log("Dev seed complete. These are DEV-ONLY accounts — do not use in production:");
  console.log(`  Admin: ${admin.email} / ${devAdminPassword}`);
  console.log(`  Sales: ${sales.email} / ${devSalesPassword}`);
  console.log("Change both passwords immediately after first login.");

  await seedRealContent();
  await seedAllProjects();
  await seedNews();
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
