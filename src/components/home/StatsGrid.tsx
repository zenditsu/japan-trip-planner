"use client";

import { useMemo } from "react";
import FadeIn from "@/components/ui/FadeIn";
import { useTripStore } from "@/lib/store";
import { formatJPY } from "@/lib/utils";
import { EditableNumber } from "@/components/ui/Editable";

export default function StatsGrid() {
  const days = useTripStore((s) => s.days);
  const hotels = useTripStore((s) => s.hotels);
  const transport = useTripStore((s) => s.transport);
  const expenses = useTripStore((s) => s.expenses);
  const attractions = useTripStore((s) => s.attractions);
  const settings = useTripStore((s) => s.settings);
  const updateSettings = useTripStore((s) => s.updateSettings);

  const stats = useMemo(() => {
    const cities = new Set(days.map((d) => d.city).filter((c) => c !== "Travel"));
    const restaurants = new Set(days.flatMap((d) => d.restaurants));
    const totalBudget = expenses.reduce((sum, e) => sum + e.amountJPY, 0);
    const trainRides = transport.filter((t) => t.type !== "flight").length;
    const autoWalk = days.reduce((sum, d) => sum + d.walkingDistanceKm, 0);
    const visited = attractions.filter((a) => a.visited).length;
    return {
      totalDays: days.length,
      hotels: hotels.length,
      trainRides,
      totalBudget,
      cities: cities.size,
      restaurants: restaurants.size,
      visited,
      totalAttractions: attractions.length,
      autoWalk: Math.round(autoWalk * 10) / 10,
    };
  }, [days, hotels, transport, expenses, attractions]);

  const walkValue = settings.walkingOverrideKm ?? stats.autoWalk;

  const cards = [
    { emoji: "✈️", label: "Total Days", value: stats.totalDays },
    { emoji: "🏨", label: "Hotels", value: stats.hotels },
    { emoji: "🚄", label: "Train Rides", value: stats.trainRides },
    { emoji: "💴", label: "Estimated Budget", value: formatJPY(stats.totalBudget) },
    { emoji: "📍", label: "Cities", value: stats.cities },
    { emoji: "🍜", label: "Restaurants Planned", value: stats.restaurants },
    {
      emoji: "⭐",
      label: "Attractions Visited",
      value: `${stats.visited} / ${stats.totalAttractions}`,
    },
    {
      emoji: "🚶",
      label: "Walking Distance",
      value: (
        <EditableNumber
          value={walkValue}
          suffix=" km"
          onSave={(n) => updateSettings({ walkingOverrideKm: n })}
        />
      ),
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
      <FadeIn>
        <p className="text-accent text-xs font-semibold tracking-[0.2em] uppercase mb-2 text-center">
          At a glance
        </p>
        <h2 className="font-display text-3xl sm:text-4xl text-center mb-12">
          Trip Dashboard
        </h2>
      </FadeIn>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
        {cards.map((c, i) => (
          <FadeIn key={c.label} delay={i * 0.05}>
            <div className="soft-shadow rounded-3xl bg-card border border-[var(--border)] p-5 sm:p-6 h-full flex flex-col gap-3 hover:-translate-y-1 transition-transform duration-300">
              <span className="text-3xl">{c.emoji}</span>
              <div>
                <div className="font-display text-xl sm:text-2xl tabular-nums">
                  {c.value}
                </div>
                <div className="text-xs text-foreground/50 mt-1 uppercase tracking-wide">
                  {c.label}
                </div>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
