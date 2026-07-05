"use client";

import FadeIn from "@/components/ui/FadeIn";

const CITY_WEATHER = [
  { city: "Tokyo", icon: "🌤️", high: 23, low: 15, condition: "Partly Cloudy" },
  { city: "Kyoto", icon: "🍂", high: 21, low: 12, condition: "Crisp & Clear" },
  { city: "Osaka", icon: "☀️", high: 24, low: 16, condition: "Sunny" },
];

export default function WeatherStrip() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-16">
      <FadeIn>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {CITY_WEATHER.map((w) => (
            <div
              key={w.city}
              className="soft-shadow rounded-3xl bg-card border border-[var(--border)] p-6 flex items-center justify-between"
            >
              <div>
                <div className="font-display text-lg">{w.city}</div>
                <div className="text-xs text-foreground/50 mt-1">
                  {w.condition} (placeholder)
                </div>
                <div className="text-sm mt-2 tabular-nums">
                  {w.high}° <span className="text-foreground/40">/ {w.low}°</span>
                </div>
              </div>
              <span className="text-4xl">{w.icon}</span>
            </div>
          ))}
        </div>
      </FadeIn>
    </section>
  );
}
