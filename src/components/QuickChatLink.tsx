"use client";

import { createContext, useContext, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useLang } from "@/lib/i18n";
import { trackEvent } from "@/lib/analytics";
import type { SiteChromeData } from "@/lib/siteChrome";

type QuickChatData = Pick<SiteChromeData, "quickChat" | "projectNames">;

const QuickChatContext = createContext<QuickChatData>({ quickChat: { zalo: "", whatsapp: "" }, projectNames: {} });

/** Mounted once in (site)/layout.tsx with the Settings numbers. */
export function QuickChatProvider({ value, children }: { value: QuickChatData; children: ReactNode }) {
  return <QuickChatContext.Provider value={value}>{children}</QuickChatContext.Provider>;
}

/**
 * "Tư vấn nhanh" (VI → Zalo) / "Quick chat" (EN → WhatsApp with a
 * prefilled message naming the project being viewed). Numbers come from
 * Admin → Cài đặt → Liên hệ. `null` when no number is configured.
 */
export function useQuickChat() {
  const { quickChat, projectNames } = useContext(QuickChatContext);
  const { lang } = useLang();
  const page = usePathname() ?? "/";
  const slug = page.match(/^\/projects\/([^/]+)/)?.[1];
  const project = slug ? projectNames[slug] : undefined;

  const channel = lang === "en" ? ("whatsapp" as const) : ("zalo" as const);
  const number = channel === "whatsapp" ? quickChat.whatsapp : quickChat.zalo;
  if (!number) return null;

  // WhatsApp shows the text as typed, so drop Vietnamese diacritics.
  const name = project?.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D");
  const message = name ? `Hello, I'm interested in ${name}` : "Hello, I'm interested";
  const href = channel === "whatsapp" ? `https://wa.me/${number}?text=${encodeURIComponent(message)}` : `https://zalo.me/${number}`;
  return { channel, href, track: () => trackEvent("quick_chat_click", { channel, page }) };
}

/** Sticky-bar button. `label` overrides the default "Tư vấn nhanh / Quick chat". */
export function QuickChatLink({ className, label }: { className: string; label?: { vi: string; en: string } }) {
  const { pick } = useLang();
  const chat = useQuickChat();
  if (!chat) return null;
  return (
    <a href={chat.href} target="_blank" rel="noopener noreferrer" onClick={chat.track} className={className}>
      {pick(label ?? { vi: "Tư vấn nhanh", en: "Quick chat" })}
    </a>
  );
}
