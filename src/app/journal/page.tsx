"use client";

import { useState } from "react";
import { useTripStore } from "@/lib/store";
import PageHeader from "@/components/ui/PageHeader";
import FadeIn from "@/components/ui/FadeIn";
import RichTextEditor from "@/components/journal/RichTextEditor";
import ImageGrid from "@/components/ui/ImageGrid";
import { formatDateLong } from "@/lib/utils";

const MOODS = ["😊", "🥰", "😴", "🤩", "😌", "🥵", "😅", "🥹"];

export default function JournalPage() {
  const days = useTripStore((s) => s.days);
  const journal = useTripStore((s) => s.journal);
  const updateJournalEntry = useTripStore((s) => s.updateJournalEntry);
  const [activeDayId, setActiveDayId] = useState(days[0]?.id);

  const entry = journal.find((j) => j.dayId === activeDayId);
  const day = days.find((d) => d.id === activeDayId);

  if (!entry || !day) return null;

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
      <PageHeader eyebrow="Your story" title="Travel Journal" subtitle="A daily diary for the whole trip." />

      <div className="flex gap-2 overflow-x-auto custom-scroll pb-3 mb-6">
        {days.map((d) => (
          <button
            key={d.id}
            onClick={() => setActiveDayId(d.id)}
            className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs border transition-colors ${
              activeDayId === d.id
                ? "bg-accent text-white border-accent"
                : "border-[var(--border)] text-foreground/60"
            }`}
          >
            Day {d.dayNumber}
          </button>
        ))}
      </div>

      <FadeIn key={entry.id}>
        <div className="soft-shadow rounded-3xl bg-card border border-[var(--border)] p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <div>
              <h2 className="font-display text-2xl">{day.title}</h2>
              <p className="text-xs text-foreground/50 mt-1">{formatDateLong(day.date)}</p>
            </div>
            <div className="flex items-center gap-1.5">
              {MOODS.map((m) => (
                <button
                  key={m}
                  onClick={() => updateJournalEntry(entry.id, { mood: m })}
                  className={`text-xl w-9 h-9 rounded-full flex items-center justify-center transition-transform hover:scale-110 ${
                    entry.mood === m ? "bg-accent-soft ring-1 ring-accent" : ""
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <RichTextEditor
            value={entry.text}
            onSave={(html) => updateJournalEntry(entry.id, { text: html })}
          />

          <div className="mt-5">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-foreground/50 mb-2">
              Photos &amp; Memories
            </h3>
            <ImageGrid
              images={entry.photos}
              onChange={(v) => updateJournalEntry(entry.id, { photos: v })}
            />
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
