"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import ImageExtension from "@tiptap/extension-image";

// Feature set intentionally matches the CMS spec exactly: heading/
// paragraph/bold/italic/link/image/quote/list — nothing more. The server
// re-sanitizes to the same allow-list before storing (see
// src/lib/server/sanitizeHtml.ts), so this editor's output is a UX
// convenience, not the security boundary.
export function RichTextEditor({ value, onChange }: { value: string; onChange: (html: string) => void }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Link.configure({ openOnClick: false, autolink: true }),
      ImageExtension,
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          "min-h-50 rounded-b-xs border border-t-0 border-[var(--color-border)] bg-[var(--color-warm-white)] px-4 py-3 font-body text-[var(--fs-body)] text-[var(--color-charcoal)] outline-none [&_h2]:font-bold [&_h2]:text-xl [&_h3]:font-bold [&_h3]:text-lg [&_a]:text-[var(--color-brand-green)] [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-[var(--color-terracotta)] [&_blockquote]:pl-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_img]:max-w-full",
      },
    },
  });

  if (!editor) return null;

  function toolbarBtn(label: string, active: boolean, onClick: () => void) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`rounded-xs border px-2.5 py-1 font-ui text-xs font-bold uppercase ${
          active ? "border-[var(--color-brand-green)] bg-[var(--color-brand-green)] text-[var(--color-warm-white)]" : "border-[var(--color-border)]"
        }`}
      >
        {label}
      </button>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap gap-1.5 rounded-t-xs border border-[var(--color-border)] bg-[var(--color-sand)] p-2">
        {toolbarBtn("H2", editor.isActive("heading", { level: 2 }), () => editor.chain().focus().toggleHeading({ level: 2 }).run())}
        {toolbarBtn("H3", editor.isActive("heading", { level: 3 }), () => editor.chain().focus().toggleHeading({ level: 3 }).run())}
        {toolbarBtn("B", editor.isActive("bold"), () => editor.chain().focus().toggleBold().run())}
        {toolbarBtn("I", editor.isActive("italic"), () => editor.chain().focus().toggleItalic().run())}
        {toolbarBtn("Quote", editor.isActive("blockquote"), () => editor.chain().focus().toggleBlockquote().run())}
        {toolbarBtn("• List", editor.isActive("bulletList"), () => editor.chain().focus().toggleBulletList().run())}
        {toolbarBtn("1. List", editor.isActive("orderedList"), () => editor.chain().focus().toggleOrderedList().run())}
        {toolbarBtn("Link", editor.isActive("link"), () => {
          const url = window.prompt("URL:");
          if (url) editor.chain().focus().setLink({ href: url }).run();
          else editor.chain().focus().unsetLink().run();
        })}
        {toolbarBtn("Image", false, () => {
          const url = window.prompt("URL ảnh:");
          if (url) editor.chain().focus().setImage({ src: url }).run();
        })}
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
