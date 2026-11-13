import "server-only";

// Lead notifications to Telegram via the Bot API (sendMessage, plain fetch).
// Env: TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_IDS (comma-separated; a group id
// is negative, e.g. -100…). Missing env → silently skipped. Never throws:
// a Telegram failure must not fail the lead, it is only logged.

const TIMEOUT_MS = 5_000;

export function escapeTelegramHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function telegramConfig() {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatIds = (process.env.TELEGRAM_CHAT_IDS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return token && chatIds.length ? { token, chatIds } : null;
}

export type TelegramSendResult = { chatId: string; ok: boolean; error?: string };

/** Sends `html` (parse_mode HTML) to every configured chat in parallel.
 * Returns null when Telegram isn't configured. */
export async function sendTelegram(html: string): Promise<TelegramSendResult[] | null> {
  const config = telegramConfig();
  if (!config) return null;

  const results = await Promise.allSettled(
    config.chatIds.map(async (chatId) => {
      const res = await fetch(`https://api.telegram.org/bot${config.token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text: html, parse_mode: "HTML", disable_web_page_preview: true }),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      if (!res.ok) {
        // Telegram's own description ("chat not found"…) — never contains the token.
        const body = (await res.json().catch(() => null)) as { description?: string } | null;
        throw new Error(`${res.status} ${body?.description ?? res.statusText}`);
      }
    }),
  );

  return results.map((r, i) => {
    const chatId = config.chatIds[i];
    if (r.status === "fulfilled") return { chatId, ok: true };
    const error = r.reason instanceof Error ? r.reason.message : String(r.reason);
    console.error(`[telegram] sendMessage to ${chatId} failed:`, error);
    return { chatId, ok: false, error };
  });
}

/** "0901234567" → "+84901234567" (tappable in Telegram). */
export function toIntlPhone(phone: string) {
  let d = phone.replace(/\D/g, "");
  if (d.startsWith("84")) d = d.slice(2);
  else if (d.startsWith("0")) d = d.slice(1);
  return `+84${d}`;
}

export type LeadNotice = {
  projectName: string;
  name: string;
  phone: string;
  source: string;
  ref: string | null;
  utm: Record<string, string> | null;
  page: string | null;
  createdAt?: Date;
};

export function formatLeadMessage(lead: LeadNotice) {
  const e = escapeTelegramHtml;
  const time = new Intl.DateTimeFormat("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(lead.createdAt ?? new Date());
  const utmSource = lead.utm?.utm_source || "—";
  const utmContent = lead.utm?.utm_content || "—";
  const lines = [
    `🔔 <b>Lead mới – ${e(lead.projectName)}</b>`,
    `Tên: ${e(lead.name)}`,
    `SĐT: ${e(toIntlPhone(lead.phone))}`,
    `Nguồn: ${e(lead.source)}`,
    `Tư vấn: ${e(lead.ref || "—")}`,
    `utm_source · utm_content: ${e(utmSource)} · ${e(utmContent)}`,
    `Thời gian: ${e(time)}`,
  ];
  if (lead.page) lines.push(`Trang: <a href="${e(lead.page)}">${e(lead.page)}</a>`);
  return lines.join("\n");
}

/** Best-effort lead notification — resolves even on failure. */
export async function notifyTelegramLead(lead: LeadNotice) {
  try {
    await sendTelegram(formatLeadMessage(lead));
  } catch (err) {
    console.error("[telegram] lead notification failed (lead already saved):", err);
  }
}
