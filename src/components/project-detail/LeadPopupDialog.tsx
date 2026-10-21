"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useLang } from "@/lib/i18n";
import { trackEvent } from "@/lib/analytics";
import { markLeadSubmitted } from "@/lib/useLeadForm";
import { popupKeys, storageSet } from "@/lib/leadPopupStorage";
import type { ProjectLeadPopup } from "@/lib/project-detail/types";
import type { PopupTrigger } from "./LeadPopupTrigger";

type Status = "idle" | "loading" | "success" | "error";
type CloseMethod = "button" | "esc" | "backdrop";

export { normalizeVnPhone } from "@/lib/phone";
import { normalizeVnPhone } from "@/lib/phone";

const primaryBtn =
  "inline-flex min-h-12 items-center justify-center rounded-xs border border-[var(--project-primary)] bg-[var(--project-primary)] px-6 py-3.5 font-ui text-[13px] font-bold tracking-[0.08em] text-[var(--project-primary-foreground)] uppercase no-underline hover:bg-[var(--project-primary-dark)] disabled:opacity-70";
const secondaryBtn =
  "inline-flex min-h-12 items-center justify-center rounded-xs border border-[var(--project-primary)] bg-transparent px-5 py-3.5 font-ui text-[13px] font-bold tracking-[0.08em] text-[var(--project-primary-text)] uppercase no-underline hover:bg-[rgba(var(--project-primary-rgb),0.08)]";

/** The lead pop-up dialog itself — loaded on demand by LeadPopupTrigger.
 * Centered modal on desktop, bottom sheet (not full screen) on mobile. */
export default function LeadPopupDialog({
  data,
  projectSlug,
  trigger,
  phone: hotline,
  phoneHref,
  onClose,
}: {
  data: ProjectLeadPopup;
  projectSlug: string;
  trigger: PopupTrigger;
  phone: string;
  phoneHref: string;
  onClose: (method: CloseMethod, submitted: boolean) => void;
}) {
  const { pick, lang } = useLang();
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [phoneInvalid, setPhoneInvalid] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const panelRef = useRef<HTMLDivElement>(null);
  const layoutRef = useRef<"modal" | "sheet">("modal");
  const submitted = status === "success";
  // Read by the Esc handler registered once on mount; set in submit().
  const submittedRef = useRef(false);

  const close = (method: CloseMethod) => onClose(method, submittedRef.current);

  // Mount: analytics, focus, scroll lock, Esc + focus trap, restore focus.
  useEffect(() => {
    layoutRef.current = window.matchMedia("(min-width: 768px)").matches ? "modal" : "sheet";
    trackEvent("popup_view", { project: projectSlug, trigger, layout: layoutRef.current, language: lang });

    const lastFocus = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>("input[type=tel]")?.focus({ preventScroll: true });
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
      if (!panel.contains(document.activeElement)) {
        e.preventDefault();
        first.focus();
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
    // Mount-only: re-running would re-fire popup_view.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const normalized = normalizeVnPhone(phone);
    if (!normalized) {
      setPhoneInvalid(true);
      panelRef.current?.querySelector<HTMLElement>("input[type=tel]")?.focus();
      return;
    }
    setPhoneInvalid(false);
    setStatus("loading");

    const params = new URLSearchParams(window.location.search);
    const utm = [...params.entries()].filter(([k]) => k.startsWith("utm_")).map(([k, v]) => `${k}=${v}`);
    // /api/lead stores `need` as the lead's message — keep the pop-up's
    // context there so it shows in Admin and in the notification email.
    const need = [`Popup (${trigger})`, `Trang: ${window.location.pathname}`, ...utm].join(" | ");

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || data.fallbackName,
          phone: normalized,
          need,
          source: data.leadSource || `${projectSlug}-popup`,
          lang,
          website: honeypot,
        }),
      });
      if (!res.ok) throw new Error("request_failed");
      submittedRef.current = true;
      setStatus("success");
      storageSet("local", popupKeys(projectSlug).submitted, String(Date.now()));
      markLeadSubmitted();
      trackEvent("popup_submit", { project: projectSlug, trigger, layout: layoutRef.current, language: lang });
    } catch {
      setStatus("error"); // typed values stay in state for a retry
    }
  }

  return (
    <div
      className="fixed inset-0 z-[300] flex items-end justify-center bg-[rgba(38,34,32,0.55)] motion-safe:animate-[fade-in_250ms_ease-out] md:items-center md:p-6"
      onClick={() => close("backdrop")}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={submitted ? undefined : "lead-popup-title"}
        aria-label={submitted ? pick(data.successMessage) : undefined}
        aria-describedby={submitted ? undefined : "lead-popup-desc"}
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[85vh] w-full overflow-y-auto rounded-t-lg bg-[var(--color-warm-white)] px-5 pt-7 pb-[calc(24px+env(safe-area-inset-bottom,0px))] shadow-[var(--shadow-lg)] motion-safe:animate-[rise-in_350ms_var(--ease-editorial)] md:max-w-[460px] md:rounded-sm md:px-8 md:pt-9 md:pb-8"
      >
        <button
          type="button"
          onClick={() => close("button")}
          aria-label={pick(data.closeLabel)}
          className="absolute top-2 right-2 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border-none bg-transparent text-[28px] leading-none text-[var(--color-charcoal)] hover:bg-[rgba(38,34,32,0.08)]"
        >
          ×
        </button>

        {submitted ? (
          <div role="status">
            <p className="m-0 mb-6 pr-10 font-display text-[length:var(--fs-h3)] leading-[var(--lh-heading)] text-[var(--color-charcoal)]">
              {pick(data.successMessage)}
            </p>
            <div className="flex flex-wrap gap-2.5">
              <a href={phoneHref} data-track="click_call" className={`${primaryBtn} flex-1`}>
                {pick(data.callLabel)} · {hotline}
              </a>
              {data.zaloUrl && (
                <a href={data.zaloUrl} target="_blank" rel="noopener noreferrer" data-track="click_zalo" className={`${secondaryBtn} flex-1`}>
                  {pick(data.zaloLabel)}
                </a>
              )}
            </div>
          </div>
        ) : (
          <>
            <h2
              id="lead-popup-title"
              className="m-0 mb-2 pr-10 font-display text-[length:var(--fs-h3)] leading-[var(--lh-heading)] font-normal text-[var(--color-charcoal)]"
            >
              {pick(data.title)}
            </h2>
            <p id="lead-popup-desc" className="m-0 mb-5 font-ui text-xs font-bold tracking-[0.08em] text-[var(--project-accent-dark)] uppercase">
              {pick(data.subtitle)}
            </p>

            {data.benefits.length > 0 && (
              <ul className="m-0 mb-6 flex list-none flex-col gap-2.5 p-0">
                {data.benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-2.5 font-body text-[15px] leading-[1.45] text-[var(--color-charcoal)]">
                    <svg aria-hidden viewBox="0 0 20 20" className="mt-0.5 h-4.5 w-4.5 flex-none fill-[var(--project-primary)]">
                      <path d="M8.1 14.2 3.9 10l1.4-1.4 2.8 2.8 6.6-6.6 1.4 1.4z" />
                    </svg>
                    {pick(b)}
                  </li>
                ))}
              </ul>
            )}

            {status === "error" && (
              <div role="alert" className="mb-4 rounded-xs border border-[rgba(179,38,30,0.35)] bg-[rgba(179,38,30,0.08)] px-3.5 py-3 font-body text-[13px] text-[var(--color-error)]">
                {pick(data.errorMessage)}
              </div>
            )}

            <form onSubmit={submit} noValidate className="flex flex-col gap-3.5">
              <label className="flex flex-col gap-1.5">
                <span className="font-ui text-[11px] font-semibold tracking-[0.05em] text-[var(--color-text-muted)] uppercase">
                  {pick(data.phoneLabel)} *
                </span>
                <input
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  required
                  value={phone}
                  placeholder={pick(data.phonePlaceholder)}
                  onChange={(e) => setPhone(e.target.value)}
                  aria-invalid={phoneInvalid || undefined}
                  aria-describedby={phoneInvalid ? "lead-popup-phone-err" : undefined}
                  className={`rounded-xs border bg-[var(--color-warm-white)] px-3.5 py-3 text-[16px] text-[var(--color-charcoal)] ${
                    phoneInvalid ? "border-[var(--color-error)]" : "border-[var(--color-border)]"
                  }`}
                />
                {phoneInvalid && (
                  <span id="lead-popup-phone-err" className="font-body text-[13px] text-[var(--color-error)]">
                    {pick(data.phoneError)}
                  </span>
                )}
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="font-ui text-[11px] font-semibold tracking-[0.05em] text-[var(--color-text-muted)] uppercase">
                  {pick(data.nameLabel)}
                </span>
                <input
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-xs border border-[var(--color-border)] bg-[var(--color-warm-white)] px-3.5 py-3 text-[16px] text-[var(--color-charcoal)]"
                />
              </label>

              {/* Honeypot — hidden from people and assistive tech */}
              <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
                <label>
                  Website
                  <input type="text" name="website" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
                </label>
              </div>

              <button type="submit" disabled={status === "loading"} className={`${primaryBtn} mt-1 w-full cursor-pointer`}>
                {status === "loading" ? pick(data.submittingLabel) : pick(data.submitLabel)}
              </button>

              <p className="m-0 text-center font-body text-[12px] leading-[1.5] text-[var(--color-text-muted)]">
                {pick(data.privacyNote)}{" "}
                <Link href="/privacy" className="text-[var(--project-primary-text)] underline">
                  {pick(data.privacyLinkLabel)}
                </Link>
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
