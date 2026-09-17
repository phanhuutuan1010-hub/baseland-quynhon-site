"use client";

import { useState } from "react";
import { useLang } from "@/lib/i18n";

export type LeadFormState = {
  name: string;
  phone: string;
  email: string;
  need: string;
  consent: boolean;
};

const INITIAL: LeadFormState = { name: "", phone: "", email: "", need: "", consent: false };

type Status = "idle" | "loading" | "success" | "error";

/** Shared validation/submit logic behind both the simple (Homepage) and
 * full (Contact) lead-capture forms — both post to /api/lead. `initial`
 * lets a caller prefill fields (e.g. the video-story lead modal
 * preselecting "Interest" from the video that opened it) without changing
 * the validation/submit behavior. */
export function useLeadForm(source: string, { requireConsent = false, initial }: { requireConsent?: boolean; initial?: Partial<LeadFormState> } = {}) {
  const { lang } = useLang();
  const [lead, setLead] = useState<LeadFormState>(() => ({ ...INITIAL, ...initial }));
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<Status>("idle");

  const updateField = <K extends keyof LeadFormState>(field: K, value: LeadFormState[K]) => {
    setLead((s) => ({ ...s, [field]: value }));
  };

  function validate(state: LeadFormState) {
    const errs: Record<string, boolean> = {};
    if (!state.name.trim()) errs.name = true;
    const digits = state.phone.replace(/[^0-9]/g, "");
    if (digits.length < 9 || digits.length > 11) errs.phone = true;
    if (requireConsent && !state.consent) errs.consent = true;
    return errs;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(lead);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      setStatus("idle");
      return;
    }
    setErrors({});
    setStatus("loading");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...lead, source, lang, requireConsent }),
      });
      if (!res.ok) throw new Error("request_failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  function retry() {
    setStatus("idle");
  }

  return { lead, updateField, errors, status, submit, retry };
}
