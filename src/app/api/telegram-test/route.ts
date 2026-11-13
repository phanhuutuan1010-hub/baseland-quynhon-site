import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { formatLeadMessage, sendTelegram } from "@/lib/server/telegram";
import { isRateLimited } from "@/lib/server/rateLimit";
import { SITE_URL } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function sameKey(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

/**
 * GET /api/telegram-test?key=<ADMIN_TEST_KEY> — sends a sample lead message
 * to every TELEGRAM_CHAT_IDS chat, to check the bot after a deploy.
 * Without ADMIN_TEST_KEY set, the route doesn't exist (404).
 */
export async function GET(request: Request) {
  const expected = process.env.ADMIN_TEST_KEY?.trim();
  if (!expected) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(`telegram-test:${ip}`, 5, 10 * 60_000)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  const key = new URL(request.url).searchParams.get("key") ?? "";
  if (!sameKey(key, expected)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const html = formatLeadMessage({
    projectName: "TIN THỬ – Q'Terra Quy Nhơn",
    name: "Khách thử (không phải lead thật)",
    phone: "0900000000",
    source: "telegram-test",
    ref: "test",
    utm: { utm_source: "test", utm_content: "z1_test" },
    page: `${SITE_URL}/projects/qterra`,
  });
  const results = await sendTelegram(html);
  if (!results) {
    return NextResponse.json({ ok: false, error: "TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_IDS chưa cấu hình" }, { status: 503 });
  }
  return NextResponse.json({ ok: results.every((r) => r.ok), results }, { headers: { "Cache-Control": "no-store" } });
}
