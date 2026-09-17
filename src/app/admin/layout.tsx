import type { Metadata } from "next";
import { Montserrat, Plus_Jakarta_Sans } from "next/font/google";
import "@/app/globals.css";

// Admin has its own independent root layout (own <html>/<body>) — it must
// NOT inherit the public site's Nav/Footer/StickyCta, which live in
// src/app/(site)/layout.tsx. Reuses the same UI/body fonts as the public
// site (Montserrat/Jakarta) for typographic consistency, per the CMS spec,
// but skips the decorative serif (Prata) since admin never uses font-display.
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

// Applies to every /admin/* route (both the (auth) and (protected) groups).
// Kept out of the public sitemap/search index — see also robots.ts (Phase 5).
export const metadata: Metadata = {
  title: { default: "Admin — Base Land Quy Nhơn", template: "%s — Admin Base Land" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${jakarta.variable} ${montserrat.variable}`}>
      <body className="bg-[var(--color-sand)]">{children}</body>
    </html>
  );
}
