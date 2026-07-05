"use client";

import { useRef } from "react";
import { Plus, X } from "lucide-react";

export default function ImageGrid({
  images,
  onChange,
  size = 80,
}: {
  images: string[];
  onChange: (images: string[]) => void;
  size?: number;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFiles(files: FileList | null) {
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          onChange([...images, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  }

  return (
    <div className="flex flex-wrap gap-2">
      {images.map((src, i) => (
        <div
          key={i}
          className="relative rounded-xl overflow-hidden border border-[var(--border)] group"
          style={{ width: size, height: size }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="" className="w-full h-full object-cover" />
          <button
            onClick={() => onChange(images.filter((_, idx) => idx !== i))}
            className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X size={12} />
          </button>
        </div>
      ))}
      <button
        onClick={() => inputRef.current?.click()}
        className="flex flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-[var(--border)] text-foreground/40 hover:text-accent hover:border-accent transition-colors"
        style={{ width: size, height: size }}
      >
        <Plus size={18} />
        <span className="text-[10px]">Add photo</span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
