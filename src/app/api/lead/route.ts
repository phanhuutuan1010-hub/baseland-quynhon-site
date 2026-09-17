import { NextResponse } from "next/server";
import { Resend } from "resend";
import { prisma } from "@/lib/server/db";
import { resolveProjectIdFromSource } from "@/lib/server/leadProject";
import { isRateLimited } from "@/lib/server/rateLimit";

export const runtime = "nodejs";

// Backend delivery address for lead notifications — intentionally separate
// from the publicly displayed contact email (baselandquynhon@gmail.com,
// shown on the Contact page and in the Footer), which is left unchanged.
const LEAD_RECIPIENT = process.env.LEAD_RECIPIENT_EMAIL || "phanhuutuan1010@gmail.com";
// Resend requires sending from a domain you've verified with them. Until a
// custom domain is verified, resend.dev's shared onboarding address works
// for testing but only delivers to the account's own signup email.
const LEAD_SENDER = process.env.LEAD_SENDER_EMAIL || "Base Land Quy Nhon <onboarding@resend.dev>";

type LeadBody = {
  name?: unknown;
  phone?: unknown;
  email?: unknown;
  need?: unknown;
  consent?: unknown;
  source?: unknown;
  lang?: unknown;
  requireConsent?: unknown;
};

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

function digitsOnly(v: string) {
  return v.replace(/[^0-9]/g, "");
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(`lead:${ip}`, 8, 10 * 60_000)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  let body: LeadBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const name = isNonEmptyString(body.name) ? body.name.trim() : "";
  const phone = isNonEmptyString(body.phone) ? body.phone.trim() : "";
  const email = isNonEmptyString(body.email) ? body.email.trim() : "";
  const need = isNonEmptyString(body.need) ? body.need.trim() : "";
  const consent = body.consent === true;
  const source = isNonEmptyString(body.source) ? body.source.trim() : "unknown";
  const lang = body.lang === "en" ? "en" : "vi";
  const requireConsent = body.requireConsent === true;

  const errors: Record<string, boolean> = {};
  if (!name) errors.name = true;
  const phoneDigits = digitsOnly(phone);
  if (phoneDigits.length < 9 || phoneDigits.length > 11) errors.phone = true;
  if (requireConsent && !consent) errors.consent = true;

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ error: "validation", fields: errors }, { status: 422 });
  }

  // The lead is durably recorded here FIRST — email below is a best-effort
  // notification, not the source of truth. Previously a missing/misconfigured
  // RESEND_API_KEY meant the lead was lost entirely; it no longer can be.
  const projectId = await resolveProjectIdFromSource(source);
  try {
    await prisma.lead.create({
      data: { name, phone, email: email || null, message: need || null, source, projectId },
    });
  } catch (err) {
    console.error("[api/lead] Failed to save lead to database:", err);
    return NextResponse.json({ error: "save_failed" }, { status: 500 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[api/lead] RESEND_API_KEY is not configured — lead saved, but no email sent.", { name, source });
    return NextResponse.json({ ok: true });
  }

  const resend = new Resend(apiKey);
  const subject = `Yêu cầu tư vấn mới — ${name}${need ? ` (${need})` : ""}`;
  const html = `
    <h2>Yêu cầu tư vấn mới — Base Land Quy Nhơn</h2>
    <table cellpadding="6" cellspacing="0" style="border-collapse:collapse">
      <tr><td><strong>Họ tên</strong></td><td>${escapeHtml(name)}</td></tr>
      <tr><td><strong>Điện thoại</strong></td><td>${escapeHtml(phone)}</td></tr>
      <tr><td><strong>Email</strong></td><td>${escapeHtml(email || "—")}</td></tr>
      <tr><td><strong>Nhu cầu</strong></td><td>${escapeHtml(need || "—")}</td></tr>
      <tr><td><strong>Nguồn</strong></td><td>${escapeHtml(source)}</td></tr>
      <tr><td><strong>Ngôn ngữ</strong></td><td>${escapeHtml(lang)}</td></tr>
    </table>
  `;

  try {
    const { error } = await resend.emails.send({
      from: LEAD_SENDER,
      to: LEAD_RECIPIENT,
      replyTo: email || undefined,
      subject,
      html,
    });
    if (error) console.error("[api/lead] Resend error (lead already saved):", error);
  } catch (err) {
    console.error("[api/lead] Unexpected error sending email (lead already saved):", err);
  }

  return NextResponse.json({ ok: true });
}
