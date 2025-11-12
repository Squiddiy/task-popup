import React, { useEffect, useRef, useMemo } from "react";
import type Quill from "quill";
import { initQuillTextEditor } from "../Quill.module"; // adjust path if needed

type Props = {
  value: string | null | undefined;         // HTML string
  onChange: (html: string) => void;
  readOnly?: boolean;
  placeholder?: string;
  image?: boolean;                           // enable your image pipeline
  className?: string;                        // wrapper styling
};

let qwCounter = 0;

export default function QuillWrapper({
  value,
  onChange,
  readOnly = false,
  placeholder = "",
  image = false,
  className,
}: Props) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const domId = useMemo(() => {
    qwCounter += 1;
    return `quill-wrapper-${qwCounter}`;
  }, []);
  const selector = `#${domId}`;

  const quillRef = useRef<Quill | null>(null);
  const isPastingRef = useRef(false); 

  useEffect(() => {
    if (!hostRef.current) return;

    const q = initQuillTextEditor(selector, image);
    quillRef.current = q;

    const editorEl = hostRef.current.querySelector<HTMLDivElement>(".ql-editor");
    if (editorEl && placeholder) {
      editorEl.setAttribute("data-placeholder", placeholder);
    }
    if (typeof value === "string") {
      isPastingRef.current = true;
      q.clipboard.dangerouslyPasteHTML(value || "", "silent");
      isPastingRef.current = false;
    }
    q.enable(!readOnly);

    const handleChange = () => {
      if (!quillRef.current || isPastingRef.current) return;
      const html = (quillRef.current.root as HTMLElement).innerHTML;
      onChange(html);
    };
    q.on("text-change", handleChange);

    return () => {
      try {
        q.off("text-change", handleChange);
        if (hostRef.current) hostRef.current.innerHTML = "";
      } catch {
        /* errors probably? */
      }
    };
  }, []);

  useEffect(() => {
    const q = quillRef.current;
    if (!q || typeof value !== "string") return;

    const current = (q.root as HTMLElement).innerHTML;
    if (current === value) return;

    isPastingRef.current = true;
    q.clipboard.dangerouslyPasteHTML(value || "", "silent");
    isPastingRef.current = false;
  }, [value]);

  useEffect(() => {
    const q = quillRef.current;
    if (!q) return;
    q.enable(!readOnly);
  }, [readOnly]);

  return (
    <div className={className}>
      <div id={domId} ref={hostRef} />
    </div>
  );
}
