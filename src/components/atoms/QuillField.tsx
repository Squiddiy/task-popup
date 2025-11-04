// QuillField.tsx
import React, { useEffect, useRef } from "react";

// Vite will inline the compiled CSS as a string for Shadow DOM injection:
import snowCss from "quill/dist/quill.snow.css?inline";

type Props = {
  value: string | null | undefined; // HTML string
  onChange: (html: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  className?: string; // wrapper styling
  toolbar?: any; // optional custom toolbar config
};

export default function QuillField({
  value,
  onChange,
  placeholder = "",
  readOnly = false,
  className,
  toolbar,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<any>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { default: Quill } = await import("quill"); // lazy-load
      if (!mounted || !containerRef.current) return;

      // TS now knows .current is HTMLDivElement
      const node: Document | ShadowRoot = containerRef.current.getRootNode() as
        | Document
        | ShadowRoot;

      if (node instanceof ShadowRoot) {
        // ✅ node is a ShadowRoot here
        if ("adoptedStyleSheets" in node) {
          const sheet = new CSSStyleSheet();
          sheet.replaceSync(snowCss);
          (node as any).adoptedStyleSheets = [
            ...((node as any).adoptedStyleSheets || []),
            sheet,
          ];
        } else {
          const style = document.createElement("style");
          style.textContent = snowCss;
          (node as any).appendChild(style);
        }
      } else {
        // ✅ node is a Document here
        if (!document.getElementById("quill-snow-style")) {
          const style = document.createElement("style");
          style.id = "quill-snow-style";
          style.textContent = snowCss;
          document.head.appendChild(style);
        }
      }

      // Create the editable element Quill expects
      editorRef.current = document.createElement("div");
      containerRef.current.appendChild(editorRef.current);

      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        readOnly,
        placeholder,
        modules: {
          toolbar: toolbar ?? [
            ["bold", "italic", "underline"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link"],
            ["clean"],
          ],
        },
      });

      // Set initial value (HTML). Quill recommends dangerouslyPasteHTML for HTML input
      if (value) quillRef.current.clipboard.dangerouslyPasteHTML(value);

      // Change handler (HTML out). You can switch to Deltas with getContents()
      quillRef.current.on("text-change", () => {
        const html = editorRef.current!.querySelector(".ql-editor")!.innerHTML;
        onChange(html);
      });
    })();

    return () => {
      mounted = false;
      // Cleanup: remove editor DOM
      if (containerRef.current && editorRef.current) {
        containerRef.current.removeChild(editorRef.current);
      }
      quillRef.current = null;
    };
  }, []); // init once

  // Keep readOnly and external value in sync
  useEffect(() => {
    const q = quillRef.current;
    if (!q) return;
    q.enable(!readOnly);
  }, [readOnly]);

  useEffect(() => {
    const q = quillRef.current;
    if (!q || value == null) return;
    const html = editorRef.current!.querySelector(".ql-editor")!.innerHTML;
    if (html !== value) {
      q.clipboard.dangerouslyPasteHTML(value);
    }
  }, [value]);

  return (
    <div
      ref={containerRef}
      className={
        className ??
        "tw:rounded-lg tw:border tw:border-gray-200 tw:overflow-hidden"
      }
    />
  );
}
