"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { captureAttribution } from "@/lib/attribution";
import type { RefContact } from "@/lib/siteChrome";

/**
 * The phone/Zalo every "Gọi ngay", tel: link, Zalo link and displayed
 * number reads. Default = Settings hotline; a visitor who arrived with
 * `?ref=<code>` (kept 30 days, see lib/attribution) gets that person's
 * number from the ref table in Admin → Cài đặt → Liên hệ.
 *
 * The server renders the default; the ref swap happens after hydration.
 */
export type SiteContact = {
  phone: string;
  phoneHref: string;
  /** Zalo number, digits only (84… or 0…). */
  zalo: string;
  /** Active ref code ("" = none), sent with Contact events and leads. */
  ref: string;
  /** The ?ref= person's name/title/photo (ref table), null without a match. */
  advisor: { name: string; title: string; avatar: string } | null;
};

const SiteContactContext = createContext<SiteContact | null>(null);

const digits = (v: string) => v.replace(/\D/g, "");

/** "0389414003" / "+84 389 414 003" → display "0389 414 003", href "tel:+84389414003". */
export function phoneParts(raw: string) {
  let d = digits(raw);
  if (d.startsWith("84")) d = `0${d.slice(2)}`;
  if (!d.startsWith("0")) d = `0${d}`;
  const display = d.length === 10 ? `${d.slice(0, 4)} ${d.slice(4, 7)} ${d.slice(7)}` : d;
  return { display, href: `tel:+84${d.slice(1)}` };
}

export function SiteContactProvider({
  defaults,
  refContacts,
  children,
}: {
  defaults: Omit<SiteContact, "ref" | "advisor">;
  refContacts: RefContact[];
  children: ReactNode;
}) {
  const [ref, setRef] = useState("");
  // After hydration only: the server can't see the URL/localStorage, and
  // reading them during render would mismatch the server HTML.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setRef(captureAttribution().ref), []);

  const value = useMemo<SiteContact>(() => {
    const match = ref ? refContacts.find((r) => r.ref === ref) : undefined;
    if (!match?.phone) return { ...defaults, ref, advisor: null };
    const { display, href } = phoneParts(match.phone);
    const advisor = match.name ? { name: match.name, title: match.title ?? "", avatar: match.avatar ?? "" } : null;
    return { phone: display, phoneHref: href, zalo: digits(match.zalo || match.phone), ref, advisor };
  }, [ref, refContacts, defaults]);

  return <SiteContactContext.Provider value={value}>{children}</SiteContactContext.Provider>;
}

const FALLBACK: SiteContact = { phone: "0373 910 109", phoneHref: "tel:+84373910109", zalo: "84373910109", ref: "", advisor: null };

export function useSiteContact(): SiteContact {
  return useContext(SiteContactContext) ?? FALLBACK;
}
