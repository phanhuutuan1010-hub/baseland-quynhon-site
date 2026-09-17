"use client";

import { useLang } from "@/lib/i18n";
import { LEAD_COPY, NEED_OPTIONS } from "@/lib/content/lead";
import { useLeadForm } from "@/lib/useLeadForm";

/** Compact lead-capture form (no consent checkbox, no contextual CTA) used
 * inline on the Homepage's closing CTA section. */
export function LeadFormSimple() {
  const { pick } = useLang();
  const { lead, updateField, status, submit } = useLeadForm("home");

  if (status === "success") {
    return (
      <p className="m-0 font-body text-[17px] text-[var(--color-charcoal)]">{pick(LEAD_COPY.successBody)}</p>
    );
  }

  const inputClass =
    "rounded-xs border border-[var(--color-border)] px-3.5 py-3 text-[15px] bg-[var(--color-warm-white)] text-[var(--color-charcoal)]";

  return (
    <form onSubmit={submit} className="flex flex-col gap-4.5">
      <label className="flex flex-col gap-2">
        <span className="font-ui text-xs font-semibold tracking-[0.05em] text-[var(--color-text-muted)] uppercase">
          {pick(LEAD_COPY.formName)}
        </span>
        <input
          type="text"
          required
          value={lead.name}
          onChange={(e) => updateField("name", e.target.value)}
          className={inputClass}
        />
      </label>
      <label className="flex flex-col gap-2">
        <span className="font-ui text-xs font-semibold tracking-[0.05em] text-[var(--color-text-muted)] uppercase">
          {pick(LEAD_COPY.formPhone)}
        </span>
        <input
          type="tel"
          required
          value={lead.phone}
          onChange={(e) => updateField("phone", e.target.value)}
          className={inputClass}
        />
      </label>
      <label className="flex flex-col gap-2">
        <span className="font-ui text-xs font-semibold tracking-[0.05em] text-[var(--color-text-muted)] uppercase">
          {pick(LEAD_COPY.formEmail)}
        </span>
        <input
          type="email"
          value={lead.email}
          onChange={(e) => updateField("email", e.target.value)}
          className={inputClass}
        />
      </label>
      <label className="flex flex-col gap-2">
        <span className="font-ui text-xs font-semibold tracking-[0.05em] text-[var(--color-text-muted)] uppercase">
          {pick(LEAD_COPY.formNeed)}
        </span>
        <select value={lead.need} onChange={(e) => updateField("need", e.target.value)} className={inputClass}>
          <option value="">{pick(LEAD_COPY.needPlaceholder)}</option>
          {NEED_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {pick(opt.label)}
            </option>
          ))}
        </select>
      </label>
      <button
        type="submit"
        disabled={status === "loading"}
        className="mt-2 cursor-pointer rounded-xs border-none bg-[var(--color-brand-green)] px-6 py-[15px] font-ui text-[13px] font-bold tracking-[0.08em] text-[var(--color-warm-white)] uppercase hover:bg-[var(--color-brand-green-dark)]"
      >
        {status === "loading" ? pick(LEAD_COPY.submitLoading) : pick(LEAD_COPY.submitIdle)}
      </button>
      {status === "error" && (
        <span className="font-body text-[13px] text-[var(--color-error)]">{pick(LEAD_COPY.errorMsg)}</span>
      )}
    </form>
  );
}
