"use client";

import { useEffect, useRef } from "react";
import { Bold, Italic, Underline, List } from "lucide-react";

export default function RichTextEditor({
  value,
  onSave,
  placeholder = "Write about today…",
}: {
  value: string;
  onSave: (html: string) => void;
  placeholder?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) {
      ref.current.innerHTML = value;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function exec(cmd: string) {
    document.execCommand(cmd);
    ref.current?.focus();
  }

  return (
    <div>
      <div className="flex items-center gap-1 mb-2">
        <button
          type="button"
          onClick={() => exec("bold")}
          className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/10"
        >
          <Bold size={14} />
        </button>
        <button
          type="button"
          onClick={() => exec("italic")}
          className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/10"
        >
          <Italic size={14} />
        </button>
        <button
          type="button"
          onClick={() => exec("underline")}
          className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/10"
        >
          <Underline size={14} />
        </button>
        <button
          type="button"
          onClick={() => exec("insertUnorderedList")}
          className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/10"
        >
          <List size={14} />
        </button>
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder}
        onBlur={(e) => onSave(e.currentTarget.innerHTML)}
        className="min-h-[140px] rounded-2xl border border-[var(--border)] bg-background/60 p-4 text-sm outline-none focus:ring-1 focus:ring-accent empty:before:content-[attr(data-placeholder)] empty:before:text-foreground/30"
      />
    </div>
  );
}
