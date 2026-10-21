"use client";

import { usePathname } from "next/navigation";
import { useLang } from "@/lib/i18n";
import { trackEvent } from "@/lib/analytics";
import type { SiteChromeData } from "@/lib/siteChrome";

/**
 * Sticky "Tư vấn nhanh" (VI → Zalo) / "Quick chat" (EN → WhatsApp with a
 * prefilled message naming the project being viewed). Numbers come from
 * Admin → Cài đặt → Liên hệ.
 */
export function QuickChatLink({
  quickChat,
  projectNames,
  className,
}: Pick<SiteChromeData, "quickChat" | "projectNames"> & { className: string }) {
  const { lang } = useLang();
  const page = usePathname() ?? "/";
  const slug = page.match(/^\/projects\/([^/]+)/)?.[1];
  const project = slug ? projectNames[slug] : undefined;

  const channel = lang === "en" ? "whatsapp" : "zalo";
  const number = channel === "whatsapp" ? quickChat.whatsapp : quickChat.zalo;
  if (!number) return null;

  // WhatsApp shows the text as typed, so drop Vietnamese diacritics.
  const name = project?.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D");
  const message = name ? `Hello, I'm interested in ${name}` : "Hello, I'm interested";
  const href = channel === "whatsapp" ? `https://wa.me/${number}?text=${encodeURIComponent(message)}` : `https://zalo.me/${number}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent("quick_chat_click", { channel, page })}
      className={className}
    >
      {channel === "whatsapp" ? "Quick chat" : "Tư vấn nhanh"}
    </a>
  );
}
