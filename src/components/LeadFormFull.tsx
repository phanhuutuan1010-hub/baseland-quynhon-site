"use client";

import Link from "next/link";
import type { Localized } from "@/lib/i18n";
import { useLang } from "@/lib/i18n";
import { LEAD_COPY, NEED_CTA_MAP, NEED_OPTIONS } from "@/lib/content/lead";
import { CONTACT_PHONE_HREF } from "@/lib/content/nav";
import { useLeadForm } from "@/lib/useLeadForm";

const kicker = { vi: "Gửi yêu cầu tư vấn", en: "Request Consultation" };
const title = { vi: "Cho chúng tôi biết bạn cần gì", en: "Tell us what you need" };

/** Full lead-capture form (kicker, need-based contextual CTA, consent
 * checkbox, retryable error state) — used on the Contact page and reused
 * anywhere else a full (not the compact Homepage-style) form is needed.
 * `source` identifies the originating page in the emailed lead.
 * `prefillNeed` preselects the "Interest" dropdown (e.g. from a video
 * story's CTA); `contextNote` shows a small banner above the form saying
 * what prompted it (e.g. which video), for the visitor's own clarity, not
 * just tracking. */
export function LeadFormFull({
  source = "contact",
  prefillNeed,
  contextNote,
}: {
  source?: string;
  prefillNeed?: string;
  contextNote?: Localized<string>;
}) {
  const { pick } = useLang();
  const { lead, updateField, errors, status, submit, retry } = useLeadForm(source, {
    requireConsent: true,
    initial: prefillNeed ? { need: prefillNeed } : undefined,
  });

  const inputClass = (hasError?: boolean) =>
    `rounded-xs border px-3.5 py-3 text-[15px] bg-[var(--color-warm-white)] text-[var(--color-charcoal)] ${
      hasError ? "border-[var(--color-error)]" : "border-[var(--color-border)]"
    }`;

  if (status === "success") {
    return (
      <div>
        <h2 className="m-0 mb-4 font-display text-[length:var(--fs-h2)] leading-[var(--lh-heading)] font-normal text-[var(--color-charcoal)]">
          {pick(LEAD_COPY.successTitle)}
        </h2>
        <p className="m-0 mb-7 font-body text-base leading-[var(--lh-body)] text-[var(--color-text-muted)]">
          {pick(LEAD_COPY.successBody)}
        </p>
        <a
          href={CONTACT_PHONE_HREF}
          className="inline-flex items-center rounded-xs border border-[var(--project-primary)] bg-[var(--project-primary)] px-8 py-4 font-ui text-[13px] font-bold tracking-[0.08em] text-[var(--project-primary-foreground)] uppercase no-underline hover:bg-[var(--project-primary-dark)]"
        >
          {pick(LEAD_COPY.callNow)}
        </a>
      </div>
    );
  }

  const contextualCta = NEED_CTA_MAP[lead.need];

  return (
    <div>
      <div className="mb-4 font-ui text-[length:var(--fs-label)] tracking-[var(--ls-label)] text-[var(--project-accent-dark)] uppercase">
        {pick(kicker)}
      </div>
      <h2 className="m-0 mb-7 font-display text-[length:var(--fs-h2)] leading-[var(--lh-heading)] font-normal text-[var(--color-charcoal)]">
        {pick(title)}
      </h2>

      {contextNote && (
        <div className="mb-5 rounded-xs border border-[var(--project-border)] bg-[var(--project-surface)] px-4 py-3 font-body text-sm leading-[var(--lh-body)] text-[var(--color-text-muted)]">
          {pick(contextNote)}
        </div>
      )}

      {status === "error" && (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xs border border-[rgba(179,38,30,0.35)] bg-[rgba(179,38,30,0.1)] px-4 py-3.5">
          <span className="font-body text-sm text-[var(--color-error)]">{pick(LEAD_COPY.errorMsg)}</span>
          <button
            type="button"
            onClick={retry}
            className="rounded-xs border border-[var(--color-error)] bg-transparent px-4 py-2 font-ui text-[11px] font-bold tracking-[0.05em] text-[var(--color-error)] uppercase"
          >
            {pick(LEAD_COPY.retryBtn)}
          </button>
        </div>
      )}

      <form onSubmit={submit} className="flex flex-col gap-4.5">
        <label className="flex flex-col gap-2">
          <span className="font-ui text-xs font-semibold tracking-[0.05em] text-[var(--color-text-muted)] uppercase">
            {pick(LEAD_COPY.formName)}
          </span>
          <input
            type="text"
            value={lead.name}
            onChange={(e) => updateField("name", e.target.value)}
            className={inputClass(errors.name)}
          />
          {errors.name && (
            <span className="font-body text-[13px] text-[var(--color-error)]">{pick(LEAD_COPY.errNameRequired)}</span>
          )}
        </label>

        <label className="flex flex-col gap-2">
          <span className="font-ui text-xs font-semibold tracking-[0.05em] text-[var(--color-text-muted)] uppercase">
            {pick(LEAD_COPY.formPhone)}
          </span>
          <input
            type="tel"
            inputMode="tel"
            value={lead.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            className={inputClass(errors.phone)}
          />
          {errors.phone && (
            <span className="font-body text-[13px] text-[var(--color-error)]">{pick(LEAD_COPY.errPhoneInvalid)}</span>
          )}
        </label>

        <label className="flex flex-col gap-2">
          <span className="font-ui text-xs font-semibold tracking-[0.05em] text-[var(--color-text-muted)] uppercase">
            {pick(LEAD_COPY.formEmail)}
          </span>
          <input
            type="email"
            inputMode="email"
            value={lead.email}
            onChange={(e) => updateField("email", e.target.value)}
            className={inputClass()}
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="font-ui text-xs font-semibold tracking-[0.05em] text-[var(--color-text-muted)] uppercase">
            {pick(LEAD_COPY.formNeed)}
          </span>
          <select
            value={lead.need}
            onChange={(e) => updateField("need", e.target.value)}
            className={inputClass()}
          >
            <option value="">{pick(LEAD_COPY.needPlaceholder)}</option>
            {NEED_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {pick(opt.label)}
              </option>
            ))}
          </select>
        </label>

        {contextualCta && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xs border border-[rgba(var(--project-primary-rgb),0.3)] bg-[var(--color-warm-white)] px-4 py-3.5">
            <span className="font-ui text-[13px] font-bold text-[var(--project-primary-text)]">
              {pick(contextualCta.label)}
            </span>
            {contextualCta.href && (
              <Link
                href={contextualCta.href}
                className="font-ui text-xs font-bold tracking-[0.05em] text-[var(--project-primary-text)] uppercase no-underline"
              >
                {pick(LEAD_COPY.viewMore)} →
              </Link>
            )}
          </div>
        )}

        <label className="flex items-start gap-2.5">
          <input
            type="checkbox"
            checked={lead.consent}
            onChange={(e) => updateField("consent", e.target.checked)}
            className="mt-0.5 h-4 w-4 flex-none accent-[var(--project-primary)]"
          />
          <span className="font-body text-[13px] leading-[1.5] text-[var(--color-text-muted)]">
            {pick(LEAD_COPY.consentPre)}{" "}
            <Link href="/privacy" className="text-[var(--project-primary-text)] underline">
              {pick(LEAD_COPY.privacyLinkLabel)}
            </Link>
            {pick(LEAD_COPY.consentPost)}
          </span>
        </label>
        {errors.consent && (
          <span className="-mt-2 font-body text-[13px] text-[var(--color-error)]">
            {pick(LEAD_COPY.errConsentRequired)}
          </span>
        )}

        <div className="mt-2 flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={status === "loading"}
            className="rounded-xs border border-[var(--project-primary)] px-8 py-4 font-ui text-[13px] font-bold tracking-[0.08em] text-[var(--project-primary-foreground)] uppercase"
            style={{
              background: status === "loading" ? "var(--project-primary-light)" : "var(--project-primary)",
              cursor: status === "loading" ? "default" : "pointer",
            }}
          >
            {status === "loading" ? pick(LEAD_COPY.submitLoading) : pick(LEAD_COPY.submitIdle)}
          </button>
          <a
            href={CONTACT_PHONE_HREF}
            className="inline-flex items-center rounded-xs border border-[var(--project-accent)] bg-transparent px-7 py-[15px] font-ui text-[13px] font-bold tracking-[0.08em] text-[var(--color-charcoal)] uppercase no-underline hover:bg-[rgba(var(--project-accent-rgb),0.15)]"
          >
            {pick(LEAD_COPY.callNow)}
          </a>
        </div>
      </form>
    </div>
  );
}
