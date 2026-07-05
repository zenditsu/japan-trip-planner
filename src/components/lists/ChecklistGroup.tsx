"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { PackingItem } from "@/types";

export default function ChecklistGroup({
  category,
  items,
  onToggle,
  onRemove,
  onAdd,
}: {
  category: string;
  items: PackingItem[];
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onAdd: (text: string, category: string) => void;
}) {
  const [draft, setDraft] = useState("");
  const done = items.filter((i) => i.packed).length;

  return (
    <div className="soft-shadow rounded-3xl bg-card border border-[var(--border)] p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display text-base">{category}</h3>
        <span className="text-xs text-foreground/40 tabular-nums">
          {done}/{items.length}
        </span>
      </div>
      <div className="flex flex-col gap-1.5">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-2 group">
            <input
              type="checkbox"
              checked={item.packed}
              onChange={() => onToggle(item.id)}
              className="accent-accent w-4 h-4"
            />
            <span className={`text-sm flex-1 ${item.packed ? "line-through text-foreground/40" : ""}`}>
              {item.text}
            </span>
            <button
              onClick={() => onRemove(item.id)}
              className="opacity-0 group-hover:opacity-100 text-red-500"
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}
        <div className="flex items-center gap-2 mt-1">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && draft.trim()) {
                onAdd(draft.trim(), category);
                setDraft("");
              }
            }}
            placeholder="Add item…"
            className="flex-1 bg-transparent border-b border-dashed border-[var(--border)] outline-none text-sm py-1"
          />
          <button
            onClick={() => {
              if (draft.trim()) {
                onAdd(draft.trim(), category);
                setDraft("");
              }
            }}
            className="text-accent"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
