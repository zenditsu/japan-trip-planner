"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useTripStore } from "@/lib/store";
import PageHeader from "@/components/ui/PageHeader";
import FadeIn from "@/components/ui/FadeIn";
import AttractionCard from "@/components/map/AttractionCard";
import { CITY_COLORS } from "@/lib/utils";

const JapanMap = dynamic(() => import("@/components/map/JapanMap"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center text-sm text-foreground/40">
      Loading map…
    </div>
  ),
});

const FILTERS = ["All", "Tokyo", "Kyoto", "Osaka"] as const;

export default function MapPage() {
  const attractions = useTripStore((s) => s.attractions);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");

  const filtered = filter === "All" ? attractions : attractions.filter((a) => a.city === filter);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
      <PageHeader
        eyebrow="Where to go"
        title="Japan Map"
        subtitle="Kyoto, Osaka, and Tokyo with every attraction pinned. Click a pin for details."
      />

      <div className="flex flex-wrap gap-2 mb-6">
        {FILTERS.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className="text-xs px-3 py-1.5 rounded-full border transition-colors"
            style={{
              borderColor: filter === c ? (CITY_COLORS[c] ?? "var(--accent)") : "var(--border)",
              background: filter === c ? `${CITY_COLORS[c] ?? "#E60026"}18` : "transparent",
              color: filter === c ? CITY_COLORS[c] ?? "var(--accent)" : "var(--foreground)",
            }}
          >
            {c}
          </button>
        ))}
      </div>

      <FadeIn>
        <div className="soft-shadow rounded-3xl overflow-hidden border border-[var(--border)] h-[60vh] min-h-[420px] mb-12">
          <JapanMap cityFilter={filter} />
        </div>
      </FadeIn>

      <h2 className="font-display text-2xl mb-6">Attraction Cards</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((a, i) => (
          <FadeIn key={a.id} delay={i * 0.04}>
            <AttractionCard id={a.id} />
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
