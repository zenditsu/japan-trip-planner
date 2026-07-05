"use client";

import { useMemo, useState } from "react";
import { useTripStore } from "@/lib/store";
import PageHeader from "@/components/ui/PageHeader";
import FadeIn from "@/components/ui/FadeIn";
import ChecklistGroup from "@/components/lists/ChecklistGroup";
import { Plus } from "lucide-react";

export default function PackingPage() {
  const packing = useTripStore((s) => s.packing);
  const togglePackingItem = useTripStore((s) => s.togglePackingItem);
  const removePackingItem = useTripStore((s) => s.removePackingItem);
  const addPackingItem = useTripStore((s) => s.addPackingItem);
  const [newCategory, setNewCategory] = useState("");

  const grouped = useMemo(() => {
    const map = new Map<string, typeof packing>();
    packing.forEach((item) => {
      const arr = map.get(item.category) ?? [];
      arr.push(item);
      map.set(item.category, arr);
    });
    return Array.from(map.entries());
  }, [packing]);

  const totalDone = packing.filter((p) => p.packed).length;

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
      <PageHeader
        eyebrow="Don't forget"
        title="Packing List"
        subtitle={`${totalDone} of ${packing.length} items packed.`}
      />

      <div className="grid sm:grid-cols-2 gap-5 mb-6">
        {grouped.map(([category, items], i) => (
          <FadeIn key={category} delay={i * 0.05}>
            <ChecklistGroup
              category={category}
              items={items}
              onToggle={togglePackingItem}
              onRemove={removePackingItem}
              onAdd={addPackingItem}
            />
          </FadeIn>
        ))}
      </div>

      <FadeIn>
        <div className="flex items-center gap-2">
          <input
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && newCategory.trim()) {
                addPackingItem("New item", newCategory.trim());
                setNewCategory("");
              }
            }}
            placeholder="New category name…"
            className="bg-transparent border-b border-dashed border-[var(--border)] outline-none text-sm py-1"
          />
          <button
            onClick={() => {
              if (newCategory.trim()) {
                addPackingItem("New item", newCategory.trim());
                setNewCategory("");
              }
            }}
            className="inline-flex items-center gap-1 text-xs text-accent"
          >
            <Plus size={14} /> Add category
          </button>
        </div>
      </FadeIn>
    </div>
  );
}
