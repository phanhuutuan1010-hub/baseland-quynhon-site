export function LangToggle({ value, onChange }: { value: "vi" | "en"; onChange: (lang: "vi" | "en") => void }) {
  return (
    <div className="inline-flex overflow-hidden rounded-full border border-[var(--color-border)]">
      {(["vi", "en"] as const).map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => onChange(lang)}
          className="px-4 py-1.5 font-ui text-xs font-bold tracking-[0.06em] uppercase"
          style={{
            background: value === lang ? "var(--color-brand-green)" : "transparent",
            color: value === lang ? "var(--color-warm-white)" : "var(--color-charcoal)",
          }}
        >
          {lang}
        </button>
      ))}
    </div>
  );
}
