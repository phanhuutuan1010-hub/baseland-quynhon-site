// Escapes `<` so a value containing "</script>" (e.g. an admin-entered
// project/article title) can't prematurely close the inline <script> tag
// this gets embedded in — JSON.stringify alone does not do this.
export function toJsonLdString(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
