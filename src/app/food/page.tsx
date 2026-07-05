"use client";

import { motion } from "framer-motion";
import { useTripStore } from "@/lib/store";
import PageHeader from "@/components/ui/PageHeader";
import FadeIn from "@/components/ui/FadeIn";
import { EditableText, EditableTextArea } from "@/components/ui/Editable";
import { Plus, Check, X } from "lucide-react";

export default function FoodPage() {
  const food = useTripStore((s) => s.food);
  const toggleFoodTried = useTripStore((s) => s.toggleFoodTried);
  const addFoodItem = useTripStore((s) => s.addFoodItem);
  const updateFoodItem = useTripStore((s) => s.updateFoodItem);
  const removeFoodItem = useTripStore((s) => s.removeFoodItem);

  const triedCount = food.filter((f) => f.tried).length;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
      <PageHeader
        eyebrow="Eat your way through Japan"
        title="Food Bucket List"
        subtitle={`${triedCount} of ${food.length} dishes tried so far.`}
        action={
          <button
            onClick={() =>
              addFoodItem({ name: "New dish", emoji: "🍽️", description: "Describe it…", tried: false })
            }
            className="inline-flex items-center gap-1.5 rounded-full bg-accent text-white px-3.5 py-2 text-xs font-medium hover:opacity-90"
          >
            <Plus size={14} /> Add dish
          </button>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {food.map((f, i) => (
          <FadeIn key={f.id} delay={i * 0.04}>
            <motion.div
              whileHover={{ y: -4 }}
              className={`group relative soft-shadow rounded-3xl border p-5 text-center transition-colors ${
                f.tried ? "bg-accent-soft border-accent/30" : "bg-card border-[var(--border)]"
              }`}
            >
              <button
                onClick={() => removeFoodItem(f.id)}
                className="absolute top-3 left-3 w-6 h-6 rounded-full flex items-center justify-center text-foreground/30 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-opacity"
              >
                <X size={13} />
              </button>
              <button
                onClick={() => toggleFoodTried(f.id)}
                className={`absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center border ${
                  f.tried ? "bg-accent border-accent text-white" : "border-[var(--border)] text-transparent"
                }`}
              >
                <Check size={14} />
              </button>
              <div className="text-4xl mb-2">{f.emoji}</div>
              <EditableText
                value={f.name}
                onSave={(v) => updateFoodItem(f.id, { name: v })}
                className="font-display text-base block text-center justify-center"
              />
              <EditableTextArea
                value={f.description}
                onSave={(v) => updateFoodItem(f.id, { description: v })}
                rows={2}
                className="text-xs text-foreground/50 mt-1 text-center"
              />
            </motion.div>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
