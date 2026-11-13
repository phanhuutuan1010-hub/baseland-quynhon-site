"use client";

import { useEffect, useRef, useState } from "react";
import { useLang } from "@/lib/i18n";
import { markLeadSubmitted } from "@/lib/useLeadForm";
import { getAttribution } from "@/lib/attribution";
import { normalizeVnPhone } from "@/lib/phone";
import { useSiteContact } from "@/components/SiteContact";
import { useZaloHref } from "@/components/QuickChatLink";
import { storageSet, videoCallPopupKeys } from "@/lib/leadPopupStorage";
import type { ProjectVideoCallPopup } from "@/lib/project-detail/types";
import { cleanTelHref } from "./ProjectContact";
import { ChatIcon, PhoneIcon } from "./icons";

type Status = "idle" | "loading" | "success" | "error";
type CloseMethod = "button" | "esc" | "backdrop";

export const VIDEO_CALL_LEAD_SOURCE = "popup_videocall";

const primaryBtn =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-xs border border-[var(--project-primary)] bg-[var(--project-primary)] px-5 py-3 text-center font-ui text-[13px] font-bold tracking-[0.08em] text-[var(--project-primary-foreground)] uppercase no-underline hover:bg-[var(--project-primary-dark)] disabled:opacity-70";
const secondaryBtn =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-xs border border-[var(--project-primary)] bg-transparent px-3 py-2.5 text-center font-ui text-[12px] font-bold tracking-[0.06em] text-[var(--project-primary-text)] uppercase no-underline hover:bg-[rgba(var(--project-primary-rgb),0.08)]";
const fieldLabel = "font-ui text-[11px] font-semibold tracking-[0.05em] text-[var(--color-text-muted)] uppercase";

/** 10-digit VN number starting with 0 (+84 accepted), else null. */
function normalizeZalo(raw: string) {
  const v = normalizeVnPhone(raw);
  return v && v.length === 10 ? v : null;
}

/** Subtitle for the visitor's utm_content (first matching rule wins). */
function pickSubtitle(data: ProjectVideoCallPopup) {
  const content = (getAttribution().utm.utm_content ?? "").toLowerCase();
  const rule = content
    ? data.subtitleRules.find((r) => r.utmContains.trim() && content.includes(r.utmContains.trim().toLowerCase()))
    : undefined;
  return rule ? rule.text : data.subtitle;
}

/** Keyboard height on mobile (iOS keeps fixed elements on the layout
 * viewport, so the sheet must lift itself above the on-screen keyboard). */
function useKeyboardInset() {
  const [inset, setInset] = useState(0);
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const update = () => setInset(Math.max(0, Math.round(window.innerHeight - vv.height - vv.offsetTop)));
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
    };
  }, []);
  return inset;
}

/**
 * The video-call pop-up — loaded on demand by VideoCallPopupTrigger.
 * Mobile (<768px): bottom sheet (max 60vh) sitting ABOVE the fixed call bar,
 * which stays visible and clickable. Desktop: 480px centered modal.
 */
export default function VideoCallPopupDialog({
  data,
  projectSlug,
  onClose,
}: {
  data: ProjectVideoCallPopup;
  projectSlug: string;
  onClose: (method: CloseMethod, submitted: boolean) => void;
}) {
  const { pick, lang } = useLang();
  const contact = useSiteContact();
  const zaloHref = useZaloHref();
  const telHref = cleanTelHref(contact.phoneHref);
  const advisor = contact.advisor ?? { name: data.advisorName, title: data.advisorTitle, avatar: data.advisorAvatar };

  const [subtitle] = useState(() => pickSubtitle(data));
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<{ phone?: boolean; consent?: boolean }>({});
  const [status, setStatus] = useState<Status>("idle");
  const [typing, setTyping] = useState(false);
  const keyboard = useKeyboardInset();
  const panelRef = useRef<HTMLDivElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);
  const submittedRef = useRef(false);
  const submitted = status === "success";

  const close = (method: CloseMethod) => onClose(method, submittedRef.current);

  // Mount: focus the panel (not the input — no surprise keyboard on
  // mobile), scroll lock, Esc + focus trap, restore focus on close.
  useEffect(() => {
    const lastFocus = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    panel?.focus({ preventScroll: true });
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose("esc", submittedRef.current);
        return;
      }
      if (e.key !== "Tab" || !panel) return;
      const items = Array.from(
        panel.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([tabindex="-1"])'),
      ).filter((el) => el.offsetParent !== null);
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (!panel.contains(document.activeElement) || document.activeElement === panel) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
      } else if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      lastFocus?.focus?.({ preventScroll: true });
    };
    // Mount-only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // While typing on mobile the call bar slides away (ProjectCallBar) and
  // the keyboard opens: drop the sheet to the keyboard's top edge and keep
  // the submit button in view.
  const onFieldFocus = () => {
    setTyping(true);
    window.setTimeout(() => submitRef.current?.scrollIntoView({ block: "nearest" }), 350);
  };
  const onFieldBlur = () => window.setTimeout(() => setTyping(!!panelRef.current?.contains(document.activeElement) && document.activeElement?.matches("input:not([type=checkbox])") === true), 0);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const normalized = normalizeZalo(phone);
    const errs = { phone: !normalized, consent: !consent };
    if (errs.phone || errs.consent) {
      setErrors(errs);
      panelRef.current?.querySelector<HTMLElement>(errs.phone ? "input[type=tel]" : "input[type=checkbox]")?.focus();
      return;
    }
    setErrors({});
    setStatus("loading");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || data.fallbackName,
          phone: normalized,
          need: `Video call thực địa (pop-up) | Trang: ${window.location.pathname}`,
          source: VIDEO_CALL_LEAD_SOURCE,
          project: projectSlug,
          page: `${window.location.origin}${window.location.pathname}`,
          consent: true,
          requireConsent: true,
          lang,
          website: honeypot,
          ...getAttribution(),
        }),
      });
      if (!res.ok) throw new Error("request_failed");
      submittedRef.current = true;
      setStatus("success");
      setTyping(false);
      storageSet("local", videoCallPopupKeys(projectSlug).submitted, String(Date.now()));
      markLeadSubmitted({ content_name: projectSlug, source: VIDEO_CALL_LEAD_SOURCE });
    } catch {
      setStatus("error"); // typed values stay for a retry
    }
  }

  // Mobile sheet bottom: above the 56px call bar (+ safe area), or on top
  // of the keyboard while typing (the bar is hidden then).
  const sheetBottom = typing ? `${keyboard}px` : "calc(56px + env(safe-area-inset-bottom, 0px))";

  return (
    <div
      className="fixed inset-x-0 top-0 z-[300] flex items-end justify-center bg-[rgba(38,34,32,0.55)] motion-safe:animate-[fade-in_250ms_ease-out] max-md:bottom-[var(--vc-bottom)] md:bottom-0 md:items-center md:p-6"
      style={{ ["--vc-bottom" as string]: sheetBottom }}
      onClick={() => close("backdrop")}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="videocall-popup-title"
        aria-describedby={submitted ? undefined : "videocall-popup-desc"}
        tabIndex={-1}
        data-track-pos="popup"
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[60vh] w-full overflow-x-hidden overflow-y-auto overscroll-contain rounded-t-lg bg-[var(--color-warm-white)] px-4 pt-5 pb-4 shadow-[var(--shadow-lg)] outline-none motion-safe:animate-[rise-in_350ms_var(--ease-editorial)] min-[380px]:px-5 md:max-h-[90vh] md:max-w-[480px] md:rounded-sm md:px-8 md:pt-8 md:pb-7"
      >
        <button
          type="button"
          onClick={() => close("button")}
          aria-label={pick(data.closeLabel)}
          className="absolute top-1.5 right-1.5 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border-none bg-transparent text-[28px] leading-none text-[var(--color-charcoal)] hover:bg-[rgba(38,34,32,0.08)]"
        >
          ×
        </button>

        {submitted ? (
          <div role="status">
            <h2
              id="videocall-popup-title"
              className="m-0 mb-5 pr-10 font-display text-[length:var(--fs-h3)] leading-[var(--lh-heading)] font-normal text-[var(--color-charcoal)]"
            >
              {pick(data.successMessage)}
            </h2>
            <a href={telHref} data-track="click_call" className={`${primaryBtn} w-full`}>
              <PhoneIcon className="h-4 w-4 flex-none" />
              <span>
                {pick(data.successCallLabel)} {contact.phone}
              </span>
            </a>
          </div>
        ) : (
          <>
            <h2
              id="videocall-popup-title"
              className="m-0 mb-2 pr-10 font-display text-[20px] leading-[1.25] font-normal text-[var(--color-charcoal)] md:text-[length:var(--fs-h3)] md:leading-[var(--lh-heading)]"
            >
              {pick(data.title)}
            </h2>
            <p id="videocall-popup-desc" className="m-0 mb-4 font-body text-[15px] leading-[1.45] font-semibold text-[var(--project-accent-dark)]">
              {pick(subtitle)}
            </p>

            {data.checklist.length > 0 && (
              <div className="mb-4">
                <p className="m-0 mb-2 font-ui text-[12px] font-bold tracking-[0.04em] text-[var(--color-charcoal)]">{pick(data.checklistTitle)}</p>
                <ol className="m-0 flex list-none flex-col gap-1.5 p-0">
                  {data.checklist.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 font-body text-[14px] leading-[1.4] text-[var(--color-charcoal)]">
                      <span
                        aria-hidden
                        className="mt-px flex h-5 w-5 flex-none items-center justify-center rounded-full bg-[var(--project-primary)] font-ui text-[11px] font-bold text-[var(--project-primary-foreground)]"
                      >
                        {i + 1}
                      </span>
                      {pick(item)}
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {advisor.name && (
              <div className="mb-4 flex items-center gap-3 rounded-xs bg-[rgba(var(--project-primary-rgb),0.06)] px-3 py-2.5">
                {advisor.avatar && (
                  // eslint-disable-next-line @next/next/no-img-element -- small avatar from any Media/Blob URL
                  <img src={advisor.avatar} alt="" width={44} height={44} className="h-11 w-11 flex-none rounded-full object-cover" />
                )}
                <div className="min-w-0">
                  <p className="m-0 font-ui text-[14px] font-bold text-[var(--color-charcoal)]">{advisor.name}</p>
                  {advisor.title && <p className="m-0 font-body text-[13px] text-[var(--color-text-muted)]">{advisor.title}</p>}
                </div>
              </div>
            )}

            {status === "error" && (
              <div role="alert" className="mb-3 rounded-xs border border-[rgba(179,38,30,0.35)] bg-[rgba(179,38,30,0.08)] px-3.5 py-3 font-body text-[13px] text-[var(--color-error)]">
                {pick(data.errorMessage)}
              </div>
            )}

            <form onSubmit={submit} noValidate className="flex flex-col gap-3">
              <label className="flex flex-col gap-1.5">
                <span className={fieldLabel}>{pick(data.phoneLabel)} *</span>
                <input
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  required
                  value={phone}
                  placeholder={pick(data.phonePlaceholder)}
                  onChange={(e) => setPhone(e.target.value)}
                  onFocus={onFieldFocus}
                  onBlur={onFieldBlur}
                  aria-invalid={errors.phone || undefined}
                  aria-describedby={errors.phone ? "videocall-phone-err" : undefined}
                  className={`w-full rounded-xs border bg-[var(--color-warm-white)] px-3.5 py-3 text-[16px] text-[var(--color-charcoal)] ${
                    errors.phone ? "border-[var(--color-error)]" : "border-[var(--color-border)]"
                  }`}
                />
                {errors.phone && (
                  <span id="videocall-phone-err" className="font-body text-[13px] text-[var(--color-error)]">
                    {pick(data.phoneError)}
                  </span>
                )}
              </label>

              <label className="flex flex-col gap-1.5">
                <span className={fieldLabel}>{pick(data.nameLabel)}</span>
                <input
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={onFieldFocus}
                  onBlur={onFieldBlur}
                  className="w-full rounded-xs border border-[var(--color-border)] bg-[var(--color-warm-white)] px-3.5 py-3 text-[16px] text-[var(--color-charcoal)]"
                />
              </label>

              <div>
                <label className="flex cursor-pointer items-start gap-2.5 font-body text-[14px] leading-[1.4] text-[var(--color-charcoal)]">
                  <input
                    type="checkbox"
                    required
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    aria-invalid={errors.consent || undefined}
                    aria-describedby={errors.consent ? "videocall-consent-err" : undefined}
                    className="mt-0.5 h-5 w-5 flex-none accent-[var(--project-primary)]"
                  />
                  <span>{pick(data.consentLabel)}</span>
                </label>
                {errors.consent && (
                  <span id="videocall-consent-err" className="mt-1 block font-body text-[13px] text-[var(--color-error)]">
                    {pick(data.consentError)}
                  </span>
                )}
              </div>

              {/* Honeypot — hidden from people and assistive tech */}
              <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
                <label>
                  Website
                  <input type="text" name="website" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
                </label>
              </div>

              <button ref={submitRef} type="submit" disabled={status === "loading"} className={`${primaryBtn} w-full cursor-pointer`}>
                {status === "loading" ? pick(data.submittingLabel) : pick(data.submitLabel)}
              </button>
            </form>

            <div className="mt-2.5 grid grid-cols-2 gap-2">
              <a href={telHref} data-track="click_call" className={secondaryBtn}>
                <PhoneIcon className="h-4 w-4 flex-none" />
                <span>
                  {pick(data.callLabel)} <span className="whitespace-nowrap">{contact.phone}</span>
                </span>
              </a>
              {zaloHref && (
                <a href={zaloHref} target="_blank" rel="noopener noreferrer" data-track="click_zalo" className={secondaryBtn}>
                  <ChatIcon className="h-4 w-4 flex-none" />
                  {pick(data.zaloLabel)}
                </a>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
