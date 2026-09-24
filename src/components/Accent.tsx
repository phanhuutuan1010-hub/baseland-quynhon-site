import { splitAccent } from "@/lib/accent";

/**
 * Renders text with `[[phrase]]` marks as accent-colored spans. `onDark` is
 * for text on dark/photo backgrounds (uses the lighter accent tone). Color
 * comes from `.accent-text` in globals.css — theme tokens, never inline.
 */
export function Accent({ text, onDark = false }: { text: string; onDark?: boolean }) {
  const parts = splitAccent(text);
  if (parts.length === 1 && !parts[0].accent) return <>{text}</>;
  return (
    <>
      {parts.map((p, i) =>
        p.accent ? (
          <span key={i} className={onDark ? "accent-text accent-text--on-dark" : "accent-text"}>
            {p.text}
          </span>
        ) : (
          p.text
        ),
      )}
    </>
  );
}
