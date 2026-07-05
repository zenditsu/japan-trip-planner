"use client";

import { useState } from "react";
import { X, Plus } from "lucide-react";

export default function TagList({
  items,
  onChange,
  placeholder = "Add…",
  chipClassName = "bg-accent-soft text-accent",
}: {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  chipClassName?: string;
}) {
  const [draft, setDraft] = useState("");

  function add() {
    const v = draft.trim();
    if (!v) return;
    onChange([...items, v]);
    setDraft("");
  }

  return (
    <div className="flex flex-wrap gap-1.5 items-center">
      {items.map((item, i) => (
        <span
          key={`${item}-${i}`}
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs ${chipClassName}`}
        >
          {item}
          <button
            onClick={() => onChange(items.filter((_, idx) => idx !== i))}
            className="opacity-60 hover:opacity-100"
          >
            <X size={11} />
          </button>
        </span>
      ))}
      <span className="inline-flex items-center rounded-full border border-dashed border-[var(--border)] pl-2 pr-1 py-0.5">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") add();
          }}
          placeholder={placeholder}
          className="bg-transparent outline-none text-xs w-20 placeholder:text-foreground/30"
        />
        <button onClick={add} className="p-0.5 opacity-60 hover:opacity-100">
          <Plus size={12} />
        </button>
      </span>
    </div>
  );
}
