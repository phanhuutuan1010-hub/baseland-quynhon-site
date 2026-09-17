import type { Localized } from "@/lib/i18n";

// Shape Nav.tsx/Footer.tsx render from — sourced from the DB (Settings +
// MenuItem) via src/lib/server/mappers/siteChrome.ts, with the exact same
// static defaults as the old src/lib/content/nav.ts as a fallback so the
// site never breaks if Settings hasn't been created yet.
export type SiteChromeNavLink = { href: string; label: Localized<string> };

export type SiteChromeData = {
  navLinks: SiteChromeNavLink[];
  navCtaLabel: Localized<string>;
  contactPhone: string;
  contactPhoneHref: string;
  contactEmail: string;
  contactEmailHref: string;
  contactAddress: Localized<string>;
  footerCopyright: Localized<string>;
  /** Admin-set logo (Settings > Chung) — falls back to the built-in Base
   * Land mark (Nav.tsx/Footer.tsx) when unset. */
  logoUrl: string | null;
};
