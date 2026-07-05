"use client";

import Link from "next/link";
import { useTripStore } from "@/lib/store";
import { CITY_COLORS, formatDateShort } from "@/lib/utils";

export default function TimelineStrip() {
  const days = useTripStore((s) => s.days);

  return (
    <div className="relative pl-6">
      <div className="absolute left-2 top-2 bottom-2 w-px bg-[var(--border)]" />
      <div className="flex flex-col gap-4">
        {days.map((day) => (
          <Link
            key={day.id}
            href={`/timeline#day-${day.dayNumber}`}
            className="relative flex items-center gap-4 group"
          >
            <span
              className="absolute -left-6 w-3 h-3 rounded-full ring-4 ring-background"
              style={{ background: CITY_COLORS[day.city] ?? "#E60026" }}
            />
            <span className="text-xs text-foreground/40 w-24 shrink-0 tabular-nums">
              {formatDateShort(day.date)}
            </span>
            <span
              className="text-[11px] px-2 py-0.5 rounded-full shrink-0"
              style={{
                background: `${CITY_COLORS[day.city] ?? "#E60026"}18`,
                color: CITY_COLORS[day.city] ?? "#E60026",
              }}
            >
              Day {day.dayNumber}
            </span>
            <span className="text-sm group-hover:text-accent transition-colors truncate">
              {day.title}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
