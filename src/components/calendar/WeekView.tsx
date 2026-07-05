"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
} from "date-fns";
import { useTripStore } from "@/lib/store";
import { CITY_COLORS } from "@/lib/utils";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function WeekView() {
  const days = useTripStore((s) => s.days);

  const dayMap = useMemo(() => {
    const map = new Map<string, (typeof days)[number]>();
    days.forEach((d) => map.set(d.date, d));
    return map;
  }, [days]);

  const weeks = useMemo(() => {
    if (days.length === 0) return [];
    const weekStarts = new Set<string>();
    days.forEach((d) => {
      const ws = startOfWeek(new Date(d.date + "T00:00:00"));
      weekStarts.add(ws.toISOString());
    });
    return Array.from(weekStarts)
      .sort()
      .map((iso) => {
        const start = new Date(iso);
        const end = endOfWeek(start);
        return eachDayOfInterval({ start, end });
      });
  }, [days]);

  return (
    <div className="flex flex-col gap-8">
      {weeks.map((week, wi) => (
        <div key={wi}>
          <h3 className="font-display text-lg mb-3">
            Week of {format(week[0], "MMM d, yyyy")}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-7 gap-2">
            {week.map((date) => {
              const iso = format(date, "yyyy-MM-dd");
              const day = dayMap.get(iso);
              return (
                <div
                  key={iso}
                  className={`rounded-2xl border border-[var(--border)] p-3 min-h-[120px] flex flex-col ${
                    day ? "soft-shadow bg-card" : "opacity-40"
                  }`}
                >
                  <span className="text-[10px] text-foreground/40 uppercase">
                    {WEEKDAYS[date.getDay()]} {format(date, "MMM d")}
                  </span>
                  {day ? (
                    <>
                      <Link
                        href={`/timeline#day-${day.dayNumber}`}
                        className="text-sm font-medium mt-1 line-clamp-2"
                      >
                        Day {day.dayNumber}: {day.title}
                      </Link>
                      <span
                        className="text-[11px] mt-1 px-1.5 py-0.5 rounded-full w-fit"
                        style={{
                          background: `${CITY_COLORS[day.city] ?? "#E60026"}18`,
                          color: CITY_COLORS[day.city] ?? "#E60026",
                        }}
                      >
                        {day.city}
                      </span>
                      <div className="mt-auto text-[10px] text-foreground/40">
                        {day.schedule.length} activities
                      </div>
                    </>
                  ) : (
                    <span className="text-[11px] text-foreground/30 mt-2">—</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
