"use client";

import { useCallback, useEffect, useState } from "react";
import { useLang } from "@/lib/i18n";
import { LeadModal } from "@/components/LeadModal";
import { trackEvent } from "@/lib/analytics";
import { markTourReturnShown, shouldShowTourReturn } from "@/lib/tourReturn";
import type { ProjectLeadQualifier, ProjectTourReturnPrompt } from "@/lib/project-detail/types";

/**
 * Small "welcome back" card for visitors returning from the developer's
 * 360° tour tab: "Bạn đã chọn được căn ưng ý? Gửi mã căn để nhận báo giá"
 * → lead form with an optional unit/floor field, source
 * "<slug>-360-return". Appears when this tab becomes visible again after
 * the tour was opened (visibilitychange), once per session; closable.
 */
export function TourReturnPrompt({
  data,
  projectSlug,
  qualifiers,
}: {
  data: ProjectTourReturnPrompt;
  projectSlug: string;
  qualifiers?: ProjectLeadQualifier[];
}) {
  const { pick, lang } = useLang();
  const [visible, setVisible] = useState(false);
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState !== "visible" || !shouldShowTourReturn(projectSlug)) return;
      markTourReturnShown(projectSlug);
      setVisible(true);
      trackEvent("tour_return_prompt_view", { project: projectSlug, language: lang });
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [projectSlug, lang]);

  const closeForm = useCallback(() => setFormOpen(false), []);
  const onSubmitted = useCallback(() => {
    trackEvent("tour_return_submit", { project: projectSlug, language: lang });
  }, [projectSlug, lang]);

  return (
    <>
      {visible && (
        <div
          role="dialog"
          data-tour-return=""
          aria-label={pick(data.title)}
          className="fixed inset-x-3 bottom-[calc(84px+env(safe-area-inset-bottom,0px))] z-[95] animate-[fade-slide-in_400ms_var(--ease-editorial)] rounded-sm border border-[var(--color-border)] bg-[var(--color-warm-white)] p-4 pr-11 shadow-[var(--shadow-lg)] md:right-auto md:bottom-7 md:left-8 md:w-[380px] md:p-5 md:pr-12"
        >
          <button
            type="button"
            onClick={() => setVisible(false)}
            aria-label={pick({ vi: "Đóng", en: "Close" })}
            className="absolute top-2 right-2 flex h-9 w-9 cursor-pointer items-center justify-center border-none bg-transparent text-xl leading-none text-[var(--color-text-muted)] hover:text-[var(--color-charcoal)]"
          >
            ×
          </button>
          <p className="m-0 mb-3.5 font-display text-lg leading-[1.35] text-[var(--color-charcoal)] [text-wrap:balance]">{pick(data.title)}</p>
          <button
            type="button"
            onClick={() => {
              setVisible(false);
              setFormOpen(true);
            }}
            className="inline-flex min-h-11 cursor-pointer items-center rounded-xs border border-[var(--project-primary)] bg-[var(--project-primary)] px-5 py-2.5 font-ui text-xs font-bold tracking-[0.08em] text-[var(--project-primary-foreground)] uppercase hover:bg-[var(--project-primary-dark)]"
          >
            {pick(data.ctaLabel)}
          </button>
        </div>
      )}

      <LeadModal
        open={formOpen}
        onClose={closeForm}
        source={`${projectSlug}-360-return`}
        qualifiers={qualifiers}
        contextNote={data.title}
        unitField={{ label: data.unitLabel, placeholder: data.unitPlaceholder }}
        onSubmitted={onSubmitted}
      />
    </>
  );
}
