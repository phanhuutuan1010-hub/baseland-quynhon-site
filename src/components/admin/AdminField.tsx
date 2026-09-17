export function AdminTextField({
  label,
  value,
  onChange,
  error,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-ui text-xs font-semibold tracking-[0.04em] text-[var(--color-text-muted)] uppercase">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`rounded-xs border bg-[var(--color-warm-white)] px-3.5 py-2.5 font-body text-[var(--fs-body)] text-[var(--color-charcoal)] outline-none focus-visible:border-[var(--color-brand-green)] focus-visible:ring-2 focus-visible:ring-[var(--color-brand-green)]/30 ${
          error ? "border-[var(--color-error)]" : "border-[var(--color-border)]"
        }`}
      />
      {error && <span className="font-body text-xs text-[var(--color-error)]">{error}</span>}
    </label>
  );
}

export function AdminTextAreaField({
  label,
  value,
  onChange,
  error,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  rows?: number;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-ui text-xs font-semibold tracking-[0.04em] text-[var(--color-text-muted)] uppercase">
        {label}
      </span>
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`resize-y rounded-xs border bg-[var(--color-warm-white)] px-3.5 py-2.5 font-body text-[var(--fs-body)] text-[var(--color-charcoal)] outline-none focus-visible:border-[var(--color-brand-green)] focus-visible:ring-2 focus-visible:ring-[var(--color-brand-green)]/30 ${
          error ? "border-[var(--color-error)]" : "border-[var(--color-border)]"
        }`}
      />
      {error && <span className="font-body text-xs text-[var(--color-error)]">{error}</span>}
    </label>
  );
}
