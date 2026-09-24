// Content can mark 1–2 key phrases per section as `[[phrase]]` — rendered by
// <Accent> as a span with the `.accent-text` class. Anywhere text leaves the
// page as plain text (metadata, alt, JSON-LD, aria labels), strip the marks.
const ACCENT_RE = /\[\[([^[\]]+)\]\]/g;

export function stripAccent(text: string): string {
  return text.replace(ACCENT_RE, "$1");
}

export type AccentPart = { text: string; accent: boolean };

export function splitAccent(text: string): AccentPart[] {
  const parts: AccentPart[] = [];
  let last = 0;
  for (const m of text.matchAll(ACCENT_RE)) {
    if (m.index > last) parts.push({ text: text.slice(last, m.index), accent: false });
    parts.push({ text: m[1], accent: true });
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push({ text: text.slice(last), accent: false });
  return parts;
}
