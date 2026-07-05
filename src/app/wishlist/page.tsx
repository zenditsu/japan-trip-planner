"use client";

import { useTripStore } from "@/lib/store";
import PageHeader from "@/components/ui/PageHeader";
import FadeIn from "@/components/ui/FadeIn";
import { EditableText, EditableTextArea } from "@/components/ui/Editable";
import type { Priority } from "@/types";
import { Plus, Star, Trash2 } from "lucide-react";

const PRIORITIES: Priority[] = ["low", "medium", "high"];
const PRIORITY_COLOR: Record<Priority, string> = {
  low: "#16A085",
  medium: "#E67E22",
  high: "#E60026",
};

export default function WishlistPage() {
  const wishlist = useTripStore((s) => s.wishlist);
  const addWishlistItem = useTripStore((s) => s.addWishlistItem);
  const updateWishlistItem = useTripStore((s) => s.updateWishlistItem);
  const removeWishlistItem = useTripStore((s) => s.removeWishlistItem);

  const sorted = [...wishlist].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.priority] - order[b.priority];
  });

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12">
      <PageHeader
        eyebrow="Maybe next time"
        title="Wishlist"
        subtitle="Places you still want to add to the trip, ranked by priority."
        action={
          <button
            onClick={() =>
              addWishlistItem({ name: "New place", city: "Tokyo", priority: "medium", favorite: false, notes: "" })
            }
            className="inline-flex items-center gap-1.5 rounded-full bg-accent text-white px-3.5 py-2 text-xs font-medium hover:opacity-90"
          >
            <Plus size={14} /> Add place
          </button>
        }
      />

      <div className="flex flex-col gap-3">
        {sorted.map((w, i) => (
          <FadeIn key={w.id} delay={i * 0.04}>
            <div className="soft-shadow rounded-3xl bg-card border border-[var(--border)] p-5 flex flex-col sm:flex-row sm:items-center gap-4">
              <button
                onClick={() => updateWishlistItem(w.id, { favorite: !w.favorite })}
                className={w.favorite ? "text-accent" : "text-foreground/30"}
              >
                <Star size={20} className={w.favorite ? "fill-accent" : ""} />
              </button>
              <div className="flex-1 min-w-0">
                <EditableText
                  value={w.name}
                  onSave={(v) => updateWishlistItem(w.id, { name: v })}
                  className="font-display text-lg block"
                />
                <div className="flex items-center gap-2 mt-1">
                  <EditableText
                    value={w.city}
                    onSave={(v) => updateWishlistItem(w.id, { city: v })}
                    className="text-xs text-foreground/50"
                  />
                </div>
                <EditableTextArea
                  value={w.notes}
                  onSave={(v) => updateWishlistItem(w.id, { notes: v })}
                  rows={1}
                  placeholder="Add notes…"
                  className="text-xs text-foreground/50 mt-1"
                />
              </div>
              <div className="flex items-center gap-1 rounded-full bg-background/60 border border-[var(--border)] px-2 py-1 shrink-0">
                {PRIORITIES.map((p) => (
                  <button
                    key={p}
                    onClick={() => updateWishlistItem(w.id, { priority: p })}
                    className="text-[11px] px-2 py-1 rounded-full capitalize"
                    style={{
                      background: w.priority === p ? `${PRIORITY_COLOR[p]}22` : "transparent",
                      color: w.priority === p ? PRIORITY_COLOR[p] : "var(--foreground)",
                      opacity: w.priority === p ? 1 : 0.4,
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <button
                onClick={() => removeWishlistItem(w.id)}
                className="text-red-500/70 hover:text-red-500 shrink-0"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
