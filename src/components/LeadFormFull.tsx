"use client";

import Link from "next/link";
import type { Localized } from "@/lib/i18n";
import { useLang } from "@/lib/i18n";
import { LEAD_COPY, NEED_CTA_MAP, NEED_OPTIONS } from "@/lib/content/lead";
import { useLeadForm } from "@/lib/useLeadForm";
import { useQuickChat } from "@/components/QuickChatLink";
import type { ProjectLeadQualifier } from "@/lib/project-detail/types";

const kicker = { vi: "Gửi yêu cầu tư vấn", en: "Request Consultation" };
const title = { vi: "Cho chúng tôi biết bạn cần gì", en: "Tell us what you need" };
const copy = {
  name: { vi: "Họ tên *", en: "Full name *" },
  phone: { vi: "Số điện thoại / Zalo *", en: "Phone / Zalo *" },
  phonePlaceholder: { vi: "VD: 0901 234 567", en: "e.g. 0901 234 567" },
  phoneError: { vi: "Số điện thoại chưa đúng (VD: 0901 234 567).", en: "Please enter a valid Vietnamese phone number (e.g. 0901 234 567)." },
  optional: { vi: "không bắt buộc", en: "optional" },
  submit: { vi: "Gửi yêu cầu", en: "Send request" },
  chat: { vi: "Chat Zalo", en: "Chat on WhatsApp" },
  success: {
    vi: "Đã nhận yêu cầu. Chuyên viên Base Land Quy Nhơn sẽ liên hệ sớm nhất.",
    en: "Request received. A Base Land Quy Nhon advisor will contact you as soon as possible.",
  },
};

const primaryBtn =
  "inline-flex min-h-12 flex-1 cursor-pointer items-center justify-center rounded-xs border border-[var(--color-brand-green)] px-6 py-3.5 font-ui text-[13px] font-bold tracking-[0.08em] whitespace-nowrap text-[var(--color-warm-white)] uppercase sm:flex-none sm:px-8";
const outlineBtn =
  "inline-flex min-h-12 flex-1 items-center justify-center rounded-xs border border-[var(--color-brand-green)] bg-transparent px-6 py-3.5 font-ui text-[13px] font-bold tracking-[0.08em] whitespace-nowrap text-[var(--color-brand-green)] uppercase no-underline hover:bg-[color-mix(in_srgb,var(--color-brand-green)_8%,transparent)] sm:flex-none";
const labelClass = "font-ui text-xs font-semibold tracking-[0.05em] text-[var(--color-text-muted)] uppercase";

function chipClass(active: boolean) {
  return `cursor-pointer rounded-full border px-3.5 py-2 font-body text-sm transition-colors ${
    active
      ? "border-[var(--color-brand-green)] bg-[var(--color-brand-green)] text-[var(--color-warm-white)]"
      : "border-[var(--color-border)] bg-[var(--color-warm-white)] text-[var(--color-charcoal)] hover:border-[var(--color-brand-green)]"
  }`;
}

/** Single-choice chip group; clicking the active chip clears it. */
function ChipGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  const { pick } = useLang();
  return (
    <fieldset className="m-0 flex min-w-0 flex-col gap-2.5 border-0 p-0">
      <legend className={`${labelClass} mb-2.5 p-0`}>
        {label} <span className="font-normal tracking-normal normal-case opacity-70">({pick(copy.optional)})</span>
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            aria-pressed={value === o.value}
            onClick={() => onChange(value === o.value ? "" : o.value)}
            className={chipClass(value === o.value)}
          >
            {o.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

/** Shared lead-capture form (Contact, About, News, Projects, project CTA,
 * lead modal). Name + VN phone required; the project's qualifiers (or the
 * generic "Bạn đang tìm gì?" list) are optional single-choice chips.
 * Secondary button opens Zalo (VI) / WhatsApp (EN), same as the sticky
 * "Tư vấn nhanh". `prefillNeed` preselects the need (e.g. from a video
 * story's CTA); `contextNote` shows a small banner saying what prompted it. */
export function LeadFormFull({
  source = "contact",
  prefillNeed,
  contextNote,
  qualifiers,
}: {
  source?: string;
  prefillNeed?: string;
  contextNote?: Localized<string>;
  /** Project-specific fields (region/purpose); when present they
   * replace the generic need list. */
  qualifiers?: ProjectLeadQualifier[];
}) {
  const { pick } = useLang();
  const chat = useQuickChat();
  const { lead, updateField, errors, status, submit, retry } = useLeadForm(source, {
    initial: prefillNeed ? { need: prefillNeed } : undefined,
  });

  const chatButton = chat && (
    <a href={chat.href} target="_blank" rel="noopener noreferrer" onClick={chat.track} className={outlineBtn}>
      {pick(copy.chat)}
    </a>
  );

  if (status === "success") {
    return (
      <div role="status">
        <div className="mb-4 font-ui text-[length:var(--fs-label)] tracking-[var(--ls-label)] text-[var(--project-accent-dark)] uppercase">
          {pick(kicker)}
        </div>
        <p className="m-0 mb-7 font-display text-[length:var(--fs-h3)] leading-[var(--lh-heading)] text-[var(--color-charcoal)]">
          {pick(copy.success)}
        </p>
        {chatButton}
      </div>
    );
  }

  const inputClass = (hasError?: boolean) =>
    `min-h-12 rounded-xs border px-3.5 py-3 text-base bg-[var(--color-warm-white)] text-[var(--color-charcoal)] ${
      hasError ? "border-[var(--color-error)]" : "border-[var(--color-border)]"
    }`;
  const contextualCta = NEED_CTA_MAP[lead.need];

  return (
    <div>
      <div className="mb-4 font-ui text-[length:var(--fs-label)] tracking-[var(--ls-label)] text-[var(--project-accent-dark)] uppercase">
        {pick(kicker)}
      </div>
      <h2 className="m-0 mb-6 font-display text-[length:var(--fs-h2)] leading-[var(--lh-heading)] font-normal text-[var(--color-charcoal)]">
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

      <form onSubmit={submit} noValidate className="flex flex-col gap-5">
        <label className="flex flex-col gap-2">
          <span className={labelClass}>{pick(copy.name)}</span>
          <input
            type="text"
            name="name"
            autoComplete="name"
            required
            value={lead.name}
            onChange={(e) => updateField("name", e.target.value)}
            aria-invalid={errors.name || undefined}
            className={inputClass(errors.name)}
          />
          {errors.name && <span className="font-body text-[13px] text-[var(--color-error)]">{pick(LEAD_COPY.errNameRequired)}</span>}
        </label>

        <label className="flex flex-col gap-2">
          <span className={labelClass}>{pick(copy.phone)}</span>
          <input
            type="tel"
            name="phone"
            inputMode="tel"
            autoComplete="tel"
            required
            placeholder={pick(copy.phonePlaceholder)}
            value={lead.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            aria-invalid={errors.phone || undefined}
            className={inputClass(errors.phone)}
          />
          {errors.phone && <span className="font-body text-[13px] text-[var(--color-error)]">{pick(copy.phoneError)}</span>}
        </label>

        {qualifiers?.length ? (
          qualifiers.map((q) => (
            <ChipGroup
              key={q.key}
              label={pick(q.label)}
              options={q.options.map((o) => ({ value: o.vi, label: pick(o) }))}
              value={lead.qualifiers[q.key] ?? ""}
              onChange={(v) => updateField("qualifiers", { ...lead.qualifiers, [q.key]: v })}
            />
          ))
        ) : (
          <ChipGroup
            label={pick(LEAD_COPY.formNeed)}
            options={NEED_OPTIONS.map((o) => ({ value: o.value, label: pick(o.label) }))}
            value={lead.need}
            onChange={(v) => updateField("need", v)}
          />
        )}

        {contextualCta && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xs border border-[rgba(var(--project-primary-rgb),0.3)] bg-[var(--color-warm-white)] px-4 py-3.5">
            <span className="font-ui text-[13px] font-bold text-[var(--project-primary-text)]">{pick(contextualCta.label)}</span>
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

        <div className="mt-1 flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={status === "loading"}
            className={primaryBtn}
            style={{ background: status === "loading" ? "var(--color-brand-green-dark)" : "var(--color-brand-green)" }}
          >
            {status === "loading" ? pick(LEAD_COPY.submitLoading) : pick(copy.submit)}
          </button>
          {chatButton}
        </div>
        <p className="m-0 font-body text-xs text-[var(--color-text-muted)]">
          <Link href="/privacy" className="text-[var(--color-text-muted)] underline">
            {pick(LEAD_COPY.privacyLinkLabel)}
          </Link>
        </p>
      </form>
    </div>
  );
}
