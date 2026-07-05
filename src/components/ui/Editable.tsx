"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface EditableTextProps {
  value: string;
  onSave: (value: string) => void;
  className?: string;
  placeholder?: string;
  as?: "span" | "div";
}

export function EditableText({
  value,
  onSave,
  className,
  placeholder = "Click to edit…",
  as = "span",
}: EditableTextProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const ref = useRef<HTMLInputElement>(null);
  const Tag = as;

  // eslint-disable-next-line react-hooks/set-state-in-effect -- sync local draft when external value changes
  useEffect(() => setDraft(value), [value]);
  useEffect(() => {
    if (editing) ref.current?.focus();
  }, [editing]);

  if (editing) {
    return (
      <input
        ref={ref}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => {
          setEditing(false);
          if (draft !== value) onSave(draft);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.currentTarget.blur();
          if (e.key === "Escape") {
            setDraft(value);
            setEditing(false);
          }
        }}
        className={cn(
          "bg-transparent border-b border-dashed border-accent outline-none",
          className
        )}
      />
    );
  }

  return (
    <Tag
      onClick={() => setEditing(true)}
      className={cn(
        "cursor-text rounded px-0.5 -mx-0.5 hover:bg-accent-soft transition-colors",
        !value && "text-foreground/40 italic",
        className
      )}
      title="Click to edit"
    >
      {value || placeholder}
    </Tag>
  );
}

interface EditableTextAreaProps {
  value: string;
  onSave: (value: string) => void;
  className?: string;
  placeholder?: string;
  rows?: number;
}

export function EditableTextArea({
  value,
  onSave,
  className,
  placeholder = "Click to add notes…",
  rows = 3,
}: EditableTextAreaProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const ref = useRef<HTMLTextAreaElement>(null);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- sync local draft when external value changes
  useEffect(() => setDraft(value), [value]);
  useEffect(() => {
    if (editing) ref.current?.focus();
  }, [editing]);

  if (editing) {
    return (
      <textarea
        ref={ref}
        rows={rows}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => {
          setEditing(false);
          if (draft !== value) onSave(draft);
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            setDraft(value);
            setEditing(false);
          }
        }}
        className={cn(
          "w-full bg-transparent border border-dashed border-accent rounded-lg p-2 outline-none resize-none",
          className
        )}
      />
    );
  }

  return (
    <div
      onClick={() => setEditing(true)}
      className={cn(
        "cursor-text rounded-lg p-2 -m-2 hover:bg-accent-soft transition-colors whitespace-pre-wrap",
        !value && "text-foreground/40 italic",
        className
      )}
      title="Click to edit"
    >
      {value || placeholder}
    </div>
  );
}

interface EditableNumberProps {
  value: number;
  onSave: (value: number) => void;
  className?: string;
  suffix?: string;
  prefix?: string;
}

export function EditableNumber({
  value,
  onSave,
  className,
  suffix = "",
  prefix = "",
}: EditableNumberProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value));
  const ref = useRef<HTMLInputElement>(null);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- sync local draft when external value changes
  useEffect(() => setDraft(String(value)), [value]);
  useEffect(() => {
    if (editing) ref.current?.focus();
  }, [editing]);

  if (editing) {
    return (
      <input
        ref={ref}
        type="number"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => {
          setEditing(false);
          const n = parseFloat(draft);
          if (!Number.isNaN(n) && n !== value) onSave(n);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.currentTarget.blur();
        }}
        className={cn(
          "bg-transparent border-b border-dashed border-accent outline-none w-24",
          className
        )}
      />
    );
  }

  return (
    <span
      onClick={() => setEditing(true)}
      className={cn(
        "cursor-text rounded px-0.5 -mx-0.5 hover:bg-accent-soft transition-colors",
        className
      )}
      title="Click to edit"
    >
      {prefix}
      {value}
      {suffix}
    </span>
  );
}
