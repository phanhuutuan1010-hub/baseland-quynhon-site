import { AdminTextField } from "./AdminField";
import { MediaPickerField } from "./MediaPickerField";

// Generic array-editing UI shared by the homepage section forms — each form
// still declares its own exact field list (no schema interpreter/page
// builder), this only avoids re-implementing add/remove/row-layout each time.
// `type: "image"` renders a MediaPickerField instead of a plain text input —
// still just one declared field, not a schema interpreter.
export function RepeatableObjectList<T extends Record<string, string>>({
  items,
  onChange,
  fields,
  itemLabel,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  fields: { key: keyof T & string; label: string; type?: "text" | "image" }[];
  itemLabel: string;
}) {
  function updateItem(index: number, key: keyof T & string, value: string) {
    const next = [...items];
    next[index] = { ...next[index], [key]: value };
    onChange(next);
  }

  function removeItem(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  function addItem() {
    const blank = fields.reduce((acc, f) => ({ ...acc, [f.key]: "" }), {} as T);
    onChange([...items, blank]);
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map((item, index) => (
        <div key={index} className="rounded-xs border border-[var(--color-border)] p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-ui text-xs font-bold tracking-[0.04em] text-[var(--color-text-muted)] uppercase">
              {itemLabel} {index + 1}
            </span>
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="font-ui text-xs font-bold text-[var(--color-error)] uppercase"
            >
              Xoá
            </button>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {fields.map((f) =>
              f.type === "image" ? (
                <MediaPickerField key={f.key} label={f.label} value={item[f.key] ?? ""} onChange={(v) => updateItem(index, f.key, v)} kindFilter="IMAGE" />
              ) : (
                <AdminTextField key={f.key} label={f.label} value={item[f.key] ?? ""} onChange={(v) => updateItem(index, f.key, v)} />
              ),
            )}
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={addItem}
        className="self-start rounded-xs border border-dashed border-[var(--color-border)] px-4 py-2 font-ui text-xs font-bold tracking-[0.04em] uppercase hover:bg-[var(--color-sand)]"
      >
        + Thêm {itemLabel.toLowerCase()}
      </button>
    </div>
  );
}

export function RepeatableStringList({
  items,
  onChange,
  itemLabel,
}: {
  items: string[];
  onChange: (items: string[]) => void;
  itemLabel: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <input
            value={item}
            onChange={(e) => {
              const next = [...items];
              next[index] = e.target.value;
              onChange(next);
            }}
            className="flex-1 rounded-xs border border-[var(--color-border)] bg-[var(--color-warm-white)] px-3.5 py-2 font-body text-sm text-[var(--color-charcoal)]"
          />
          <button
            type="button"
            onClick={() => onChange(items.filter((_, i) => i !== index))}
            className="font-ui text-xs font-bold text-[var(--color-error)] uppercase"
          >
            Xoá
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, ""])}
        className="self-start rounded-xs border border-dashed border-[var(--color-border)] px-4 py-2 font-ui text-xs font-bold tracking-[0.04em] uppercase hover:bg-[var(--color-sand)]"
      >
        + Thêm {itemLabel.toLowerCase()}
      </button>
    </div>
  );
}
