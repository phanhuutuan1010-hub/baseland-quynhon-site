"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { QTERRA_LAUNCH } from "@/lib/content/qterraLaunch";
import { trackEvent } from "@/lib/analytics";
import { LEAD_SUBMITTED_EVENT, LEAD_SUBMITTED_KEY } from "@/lib/useLeadForm";

const c = QTERRA_LAUNCH;
const p = c.popup;
const DAY = 86_400_000;
const SESSION_KEY = "qterra_popup_shown";
const SUPPRESS_KEY = "qterra_popup_suppress_until";
const PHONE_RE = /^(0|\+84)\d{9}$/;

type Mode = "slide" | "modal" | "sheet";
type Status = "idle" | "loading" | "success" | "error";

function storageGet(store: "local" | "session", key: string): string | null {
  try {
    return (store === "local" ? localStorage : sessionStorage).getItem(key);
  } catch {
    return null;
  }
}
function storageSet(store: "local" | "session", key: string, value: string) {
  try {
    (store === "local" ? localStorage : sessionStorage).setItem(key, value);
  } catch {}
}
function suppressFor(days: number) {
  storageSet("local", SUPPRESS_KEY, String(Date.now() + days * DAY));
}

function normalizePhone(raw: string): string | null {
  const v = raw.replace(/[\s.\-()]/g, "");
  if (!PHONE_RE.test(v)) return null;
  return v.startsWith("+84") ? `0${v.slice(3)}` : v;
}

function scrollRatio() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  return max > 0 ? window.scrollY / max : 0;
}

/**
 * Pop-up thu SĐT cho /projects/qterra (cấu hình: src/lib/content/qterraLaunch.ts).
 * Desktop: slide-in góc dưới trái sau 30s / cuộn 40%, hoặc modal giữa màn hình
 * khi chuột rời mép trên. Mobile: thanh Gọi ngay | Zalo cố định + bottom sheet
 * khi cuộn 50%. Tối đa 1 cửa sổ/phiên; đóng → ẩn 5 ngày, gửi xong → 30 ngày;
 * không tự mở khi #lead đang trong khung nhìn hoặc form chính đã gửi.
 */
export function QterraLeadPopup() {
  const [mode, setMode] = useState<Mode | null>(null);
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("");
  const [floor, setFloor] = useState("");
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<{ phone?: boolean; consent?: boolean }>({});
  const [status, setStatus] = useState<Status>("idle");

  const dialogRef = useRef<HTMLDivElement>(null);
  const leadInView = useRef(false);
  const lastFocus = useRef<HTMLElement | null>(null);

  const canAutoShow = useCallback(() => {
    if (storageGet("session", SESSION_KEY)) return false;
    if (Number(storageGet("local", SUPPRESS_KEY) || 0) > Date.now()) return false;
    const submittedAt = Number(storageGet("local", LEAD_SUBMITTED_KEY) || 0);
    if (submittedAt && Date.now() - submittedAt < c.submittedDays * DAY) return false;
    if (leadInView.current) return false;
    return true;
  }, []);

  const show = useCallback(
    (next: Mode) => {
      if (!canAutoShow()) return;
      storageSet("session", SESSION_KEY, "1");
      lastFocus.current = document.activeElement as HTMLElement | null;
      setMode(next);
      trackEvent("popup_view", { project: c.slug, mode: next });
    },
    [canAutoShow],
  );

  const close = useCallback(() => {
    setMode(null);
    if (status !== "success") suppressFor(c.dismissDays);
    lastFocus.current?.focus?.();
  }, [status]);

  // Triggers
  useEffect(() => {
    const isDesktop = () => window.matchMedia("(min-width: 768px)").matches;
    let fired = false;
    const fire = (m: Mode) => {
      if (fired || !canAutoShow()) return;
      fired = true;
      show(m);
    };

    const timer = window.setTimeout(() => {
      if (isDesktop()) fire("slide");
    }, c.desktopDelayMs);

    const onScroll = () => {
      const r = scrollRatio();
      if (isDesktop()) {
        if (r >= c.desktopScrollRatio) fire("slide");
      } else if (r >= c.mobileScrollRatio) {
        fire("sheet");
      }
    };
    const onMouseOut = (e: MouseEvent) => {
      if (!e.relatedTarget && e.clientY <= 0 && isDesktop()) fire("modal");
    };
    const onLeadSubmitted = () => {
      fired = true;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("mouseout", onMouseOut);
    window.addEventListener(LEAD_SUBMITTED_EVENT, onLeadSubmitted);

    const lead = document.getElementById("lead");
    const io = lead
      ? new IntersectionObserver(([entry]) => {
          leadInView.current = entry.isIntersecting;
        })
      : null;
    if (lead && io) io.observe(lead);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mouseout", onMouseOut);
      window.removeEventListener(LEAD_SUBMITTED_EVENT, onLeadSubmitted);
      io?.disconnect();
    };
  }, [canAutoShow, show]);

  // Click tracking for every [data-track] link on this page (incl. the
  // server-rendered "Giai đoạn mở bán" block)
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-track]");
      if (el?.dataset.track) trackEvent(el.dataset.track, { project: c.slug });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  // Esc + focus trap (modal/sheet) + initial focus
  useEffect(() => {
    if (!mode) return;
    const dialog = dialogRef.current;
    const isModal = mode !== "slide";
    if (isModal) dialog?.querySelector<HTMLElement>("input[type=tel]")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        return;
      }
      if (e.key !== "Tab" || !isModal || !dialog) return;
      const items = Array.from(
        dialog.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([tabindex="-1"])'),
      ).filter((el) => el.offsetParent !== null);
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mode, close]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const normalized = normalizePhone(phone);
    const errs = { phone: !normalized, consent: !consent };
    if (errs.phone || errs.consent) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setStatus("loading");

    const params = new URLSearchParams(window.location.search);
    const utm: Record<string, string> = {};
    params.forEach((v, k) => {
      if (k.startsWith("utm_")) utm[k] = v;
    });
    const page = window.location.pathname;
    // /api/lead stores `need` as the lead's message — pack the popup's extra
    // context there so it shows in the admin and the notification email.
    const need = [
      "Popup Q'Terra",
      unit && `Loại căn: ${unit}`,
      floor && `${p.floorLabel}: ${floor}`,
      `Trang: ${page}`,
      ...Object.entries(utm).map(([k, v]) => `${k}=${v}`),
    ]
      .filter(Boolean)
      .join(" | ");

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || p.fallbackName,
          phone: normalized,
          need,
          consent,
          requireConsent: true,
          source: c.source,
          lang: "vi",
          website: honeypot,
          page,
          utm,
          unitType: unit || undefined,
          floor: floor || undefined,
        }),
      });
      if (!res.ok) throw new Error("request_failed");
      setStatus("success");
      suppressFor(c.submittedDays);
      trackEvent("popup_submit", { project: c.slug, mode: mode ?? "unknown" });
    } catch {
      setStatus("error"); // form data is kept in state
    }
  }

  const isModal = mode === "modal" || mode === "sheet";

  const chip = (value: string, selected: string, set: (v: string) => void) => (
    <button
      key={value}
      type="button"
      aria-pressed={selected === value}
      onClick={() => set(selected === value ? "" : value)}
      className={`min-h-10 rounded-full border px-3.5 py-2 font-ui text-xs font-semibold transition-colors ${
        selected === value
          ? "border-[var(--project-primary)] bg-[var(--project-primary)] text-[var(--project-primary-foreground)]"
          : "border-[var(--color-border)] bg-[var(--color-warm-white)] text-[var(--color-charcoal)] hover:border-[var(--project-primary)]"
      }`}
    >
      {value}
    </button>
  );

  const panelBody =
    status === "success" ? (
      <div className="py-2">
        <p className="m-0 mb-5 pr-10 font-display text-[length:var(--fs-h3)] leading-[var(--lh-heading)] text-[var(--color-charcoal)]">
          {p.success}
        </p>
        <a
          href={c.hotlineHref}
          data-track="click_call"
          className="inline-flex min-h-11 items-center rounded-xs border border-[var(--project-primary)] px-5 py-3 font-ui text-xs font-bold tracking-[0.06em] text-[var(--project-primary-text)] uppercase no-underline"
        >
          {p.call} · {c.hotlineDisplay}
        </a>
      </div>
    ) : (
      <>
        <h2
          id="qterra-popup-title"
          className="m-0 mb-2 pr-10 font-display text-[length:var(--fs-h3)] leading-[var(--lh-heading)] font-normal text-[var(--color-charcoal)]"
        >
          {p.title}
        </h2>
        <p id="qterra-popup-desc" className="m-0 mb-5 font-body text-sm leading-[var(--lh-body)] text-[var(--color-text-muted)]">
          {p.subtitle}
        </p>

        {status === "error" && (
          <div role="alert" className="mb-4 rounded-xs border border-[rgba(179,38,30,0.35)] bg-[rgba(179,38,30,0.08)] px-3.5 py-3 font-body text-[13px] text-[var(--color-error)]">
            {p.error}
          </div>
        )}

        <form onSubmit={submit} noValidate className="flex flex-col gap-3.5">
          <label className="flex flex-col gap-1.5">
            <span className="font-ui text-[11px] font-semibold tracking-[0.05em] text-[var(--color-text-muted)] uppercase">
              {p.phoneLabel} *
            </span>
            <input
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              required
              value={phone}
              placeholder={p.phonePlaceholder}
              onChange={(e) => setPhone(e.target.value)}
              aria-invalid={errors.phone || undefined}
              aria-describedby={errors.phone ? "qterra-popup-phone-err" : undefined}
              className={`rounded-xs border bg-[var(--color-warm-white)] px-3.5 py-3 text-[16px] text-[var(--color-charcoal)] ${
                errors.phone ? "border-[var(--color-error)]" : "border-[var(--color-border)]"
              }`}
            />
            {errors.phone && (
              <span id="qterra-popup-phone-err" className="font-body text-[13px] text-[var(--color-error)]">
                {p.phoneError}
              </span>
            )}
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="font-ui text-[11px] font-semibold tracking-[0.05em] text-[var(--color-text-muted)] uppercase">
              {p.nameLabel}
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

          <div role="group" aria-label={p.unitLabel} className="flex flex-wrap gap-2">
            {p.unitOptions.map((v) => chip(v, unit, setUnit))}
          </div>
          <div role="group" aria-label={p.floorLabel} className="flex flex-wrap gap-2">
            {p.floorOptions.map((v) => chip(v, floor, setFloor))}
          </div>

          <label className="flex items-start gap-2.5">
            <input
              type="checkbox"
              required
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              aria-invalid={errors.consent || undefined}
              className="mt-0.5 h-4 w-4 flex-none accent-[var(--project-primary)]"
            />
            <span className="font-body text-[12px] leading-[1.5] text-[var(--color-text-muted)]">
              {p.consentPre}{" "}
              <Link href="/privacy" className="text-[var(--project-primary-text)] underline">
                {p.consentLink}
              </Link>
              {p.consentPost}
            </span>
          </label>
          {errors.consent && (
            <span className="-mt-2 font-body text-[13px] text-[var(--color-error)]">{p.consentError}</span>
          )}

          <div className="mt-1 flex flex-wrap gap-2.5">
            <button
              type="submit"
              disabled={status === "loading"}
              className="min-h-11 flex-1 rounded-xs border border-[var(--project-primary)] bg-[var(--project-primary)] px-5 py-3 font-ui text-xs font-bold tracking-[0.06em] whitespace-nowrap text-[var(--project-primary-foreground)] uppercase disabled:opacity-70"
            >
              {status === "loading" ? p.submitting : p.submit}
            </button>
            <a
              href={c.hotlineHref}
              data-track="click_call"
              className="inline-flex min-h-11 items-center justify-center rounded-xs border border-[var(--project-primary)] px-5 py-3 font-ui text-xs font-bold tracking-[0.06em] whitespace-nowrap text-[var(--project-primary-text)] uppercase no-underline"
            >
              {p.call}
            </a>
          </div>
        </form>
      </>
    );

  const closeButton = (
    <button
      type="button"
      onClick={close}
      aria-label={p.close}
      className="absolute top-2 right-2 flex h-11 w-11 items-center justify-center rounded-full border-none bg-transparent text-2xl leading-none text-[var(--color-text-muted)] hover:bg-[rgba(38,34,32,0.06)]"
    >
      ×
    </button>
  );

  const dialogProps = {
    ref: dialogRef,
    role: "dialog" as const,
    "aria-modal": isModal,
    "aria-labelledby": status === "success" ? undefined : "qterra-popup-title",
    "aria-label": status === "success" ? p.success : undefined,
    "aria-describedby": status === "success" ? undefined : "qterra-popup-desc",
  };

  const barLinks = [
    { key: "call", href: c.hotlineHref, label: p.call, track: "click_call", primary: false },
    ...(c.ZALO_URL ? [{ key: "zalo", href: c.ZALO_URL, label: p.zalo, track: "click_zalo", primary: false }] : []),
    { key: "lead", href: "#lead", label: p.consult, track: "", primary: true },
  ];

  return (
    <>
      {/* Mobile bottom bar — always visible. Body already reserves 72px +
          safe-area padding on mobile (see (site)/layout.tsx), so this ~52px
          bar never covers the page's last content or buttons. */}
      <nav
        aria-label="Liên hệ nhanh"
        className="fixed inset-x-0 bottom-0 z-[90] flex border-t border-[rgba(250,245,238,0.18)] bg-[var(--color-deep-earth)] pb-[env(safe-area-inset-bottom,0px)] md:hidden"
      >
        {barLinks.map((l, i) => (
          <a
            key={l.key}
            href={l.href}
            data-track={l.track || undefined}
            {...(l.key === "zalo" ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className={`flex min-h-[52px] flex-1 items-center justify-center px-3 font-ui text-[13px] font-bold tracking-[0.07em] text-[var(--color-warm-white)] uppercase no-underline ${
              i > 0 ? "border-l border-[rgba(250,245,238,0.2)]" : ""
            } ${l.primary ? "bg-[var(--color-brand-green)]" : ""}`}
          >
            {l.label}
          </a>
        ))}
      </nav>

      {mode === "slide" && (
        <div
          {...dialogProps}
          className="fixed bottom-7 left-5 z-[95] hidden max-h-[calc(100vh-56px)] w-[380px] overflow-y-auto rounded-sm border border-[var(--color-border)] bg-[var(--color-warm-white)] p-6 shadow-[var(--shadow-md)] motion-safe:animate-[fade-slide-in_400ms_var(--ease-editorial)] md:block"
        >
          {closeButton}
          {panelBody}
        </div>
      )}

      {mode === "modal" && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(38,34,32,0.55)] p-4" onClick={close}>
          <div
            {...dialogProps}
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[calc(100vh-32px)] w-full max-w-[440px] overflow-y-auto rounded-sm bg-[var(--color-warm-white)] p-7 shadow-[var(--shadow-md)] motion-safe:animate-[fade-slide-in_300ms_var(--ease-editorial)]"
          >
            {closeButton}
            {panelBody}
          </div>
        </div>
      )}

      {mode === "sheet" && (
        <div className="fixed inset-0 z-[100] flex items-end bg-[rgba(38,34,32,0.45)] md:hidden" onClick={close}>
          <div
            {...dialogProps}
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[85vh] w-full overflow-y-auto rounded-t-lg bg-[var(--color-warm-white)] px-5 pt-6 pb-[calc(20px+env(safe-area-inset-bottom,0px))] shadow-[var(--shadow-md)] motion-safe:animate-[fade-slide-in_300ms_var(--ease-editorial)]"
          >
            {closeButton}
            {panelBody}
          </div>
        </div>
      )}
    </>
  );
}
