"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  parseISO,
} from "date-fns";
import { useTripStore } from "@/lib/store";
import { CITY_COLORS } from "@/lib/utils";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function MonthView() {
  const days = useTripStore((s) => s.days);

  const months = useMemo(() => {
    const keys = Array.from(new Set(days.map((d) => d.date.slice(0, 7)))).sort();
    return keys.map((key) => parseISO(`${key}-01`));
  }, [days]);

  const dayMap = useMemo(() => {
    const map = new Map<string, (typeof days)[number]>();
    days.forEach((d) => map.set(d.date, d));
    return map;
  }, [days]);

  return (
    <div className="flex flex-col gap-10">
      {months.map((monthDate) => {
        const start = startOfWeek(startOfMonth(monthDate));
        const end = endOfWeek(endOfMonth(monthDate));
        const grid = eachDayOfInterval({ start, end });

        return (
          <div key={monthDate.toISOString()}>
            <h3 className="font-display text-xl mb-4">{format(monthDate, "MMMM yyyy")}</h3>
            <div className="grid grid-cols-7 gap-1.5 mb-2">
              {WEEKDAYS.map((w) => (
                <div key={w} className="text-center text-[11px] text-foreground/40 uppercase tracking-wide">
                  {w}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1.5">
              {grid.map((date) => {
                const iso = format(date, "yyyy-MM-dd");
                const day = dayMap.get(iso);
                const inMonth = isSameMonth(date, monthDate);
                return (
                  <div
                    key={iso}
                    className={`aspect-square rounded-xl border p-1.5 flex flex-col ${
                      inMonth ? "border-[var(--border)]" : "border-transparent opacity-30"
                    } ${day ? "soft-shadow" : ""}`}
                    style={day ? { background: `${CITY_COLORS[day.city] ?? "#E60026"}12` } : undefined}
                  >
                    <span className="text-[10px] text-foreground/40">{format(date, "d")}</span>
                    {day && (
                      <Link
                        href={`/timeline#day-${day.dayNumber}`}
                        className="mt-auto text-[10px] sm:text-[11px] font-medium leading-tight line-clamp-2"
                        style={{ color: CITY_COLORS[day.city] ?? "#E60026" }}
                      >
                        D{day.dayNumber} {day.title}
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
