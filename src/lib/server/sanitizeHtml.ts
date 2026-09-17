import "server-only";

import sanitizeHtml from "sanitize-html";

// Matches the rich-text feature set the CMS spec asks for (heading/
// paragraph/bold/italic/link/image/quote/list) — nothing else survives,
// regardless of what the Tiptap editor's HTML output or a paste contains.
export function sanitizeArticleHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: ["h2", "h3", "p", "strong", "em", "a", "img", "blockquote", "ul", "ol", "li", "br"],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }),
    },
  });
}
