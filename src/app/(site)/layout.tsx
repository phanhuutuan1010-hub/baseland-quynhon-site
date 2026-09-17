import type { Metadata, Viewport } from "next";
import { Montserrat, Plus_Jakarta_Sans, Prata } from "next/font/google";
import "@/app/globals.css";
import { LanguageProvider } from "@/lib/i18n";
import { SiteChrome } from "@/components/SiteChrome";
import { Footer } from "@/components/Footer";
import { StickyCta } from "@/components/StickyCta";
import { Analytics } from "@/components/Analytics";
import { getSiteChromeData, getSiteMetaSettings } from "@/lib/server/mappers/siteChrome";
import { toJsonLdString } from "@/lib/jsonLd";

const prata = Prata({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-prata",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jakarta",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const DEFAULT_DESCRIPTION = "Base Land Quy Nhơn — an cư & đầu tư bên bờ biển Quy Nhơn.";

export async function generateMetadata(): Promise<Metadata> {
  const meta = await getSiteMetaSettings();
  return {
    metadataBase: new URL(SITE_URL),
    title: meta.siteName,
    description: DEFAULT_DESCRIPTION,
    icons: meta.faviconUrl ? { icon: meta.faviconUrl } : undefined,
    openGraph: {
      title: meta.siteName,
      description: DEFAULT_DESCRIPTION,
      siteName: meta.siteName,
      locale: "vi_VN",
      type: "website",
      images: meta.defaultOgImageUrl ? [{ url: meta.defaultOgImageUrl }] : undefined,
    },
    robots: { index: true, follow: true },
  };
}

// viewport-fit=cover is required for env(safe-area-inset-*) (used by the
// mobile sticky CTA bar) to resolve to the device's real inset instead of 0.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [chrome, meta] = await Promise.all([getSiteChromeData(), getSiteMetaSettings()]);

  // LocalBusiness structured data — only fields already publicly shown on
  // the Contact page (name, address, phone, email), sourced from the same
  // Settings row as Nav/Footer so an Admin hotline change updates this too.
  // No unverified claims (ratings, price range, opening hours, etc.).
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: "Base Land Quy Nhơn",
    url: SITE_URL,
    logo: `${SITE_URL}/images/brand/icon-baseland.png`,
    telephone: chrome.contactPhoneHref.replace(/^tel:/, ""),
    email: chrome.contactEmail,
    address: {
      "@type": "PostalAddress",
      streetAddress: "41 Hoa Lư",
      addressLocality: "Phường Quy Nhơn",
      addressRegion: "Gia Lai",
      addressCountry: "VN",
    },
  };

  return (
    <html lang="vi" className={`${prata.variable} ${jakarta.variable} ${montserrat.variable}`}>
      <body className="flex min-h-screen flex-col overflow-x-clip bg-[var(--color-bg)] pb-[calc(72px+env(safe-area-inset-bottom,0px))] md:pb-0">
        {meta.gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${meta.gtmId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: toJsonLdString(organizationSchema) }}
        />
        <Analytics gaId={meta.gaId} gtmId={meta.gtmId} metaPixelId={meta.metaPixelId} />
        <LanguageProvider>
          <SiteChrome data={chrome} />
          <main className="flex-1">{children}</main>
          <Footer data={chrome} />
          <StickyCta data={chrome} />
        </LanguageProvider>
      </body>
    </html>
  );
}
