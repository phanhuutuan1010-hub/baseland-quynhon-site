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
  /** Sticky "Tư vấn nhanh / Quick chat" numbers (Settings → Liên hệ),
   * digits only, international format (84…). */
  quickChat: { zalo: string; whatsapp: string };
  /** Published project slug → display name, for the quick-chat message. */
  projectNames: Record<string, string>;
  /** ?ref= table (Settings → Liên hệ) — see components/SiteContact. */
  refContacts: RefContact[];
};

/** One row of the ?ref= table: `ref` code → that person's name/phone/Zalo,
 * plus job title + photo shown as the advisor in the video-call pop-up. */
export type RefContact = { ref: string; name: string; phone: string; zalo: string; title: string; avatar: string };
