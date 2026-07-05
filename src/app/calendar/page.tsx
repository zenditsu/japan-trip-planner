"use client";

import { useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import FadeIn from "@/components/ui/FadeIn";
import MonthView from "@/components/calendar/MonthView";
import WeekView from "@/components/calendar/WeekView";
import TimelineStrip from "@/components/calendar/TimelineStrip";
import KanbanView from "@/components/calendar/KanbanView";

const VIEWS = ["Month", "Week", "Timeline", "Kanban"] as const;

export default function CalendarPage() {
  const [view, setView] = useState<(typeof VIEWS)[number]>("Month");

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
      <PageHeader
        eyebrow="Plan your view"
        title="Calendar"
        subtitle="Switch between month, week, timeline, and kanban views of your trip."
      />

      <div className="flex gap-2 mb-8">
        {VIEWS.map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`text-xs px-3.5 py-1.5 rounded-full border transition-colors ${
              view === v
                ? "bg-accent text-white border-accent"
                : "border-[var(--border)] text-foreground/60"
            }`}
          >
            {v}
          </button>
        ))}
      </div>

      <FadeIn key={view}>
        {view === "Month" && <MonthView />}
        {view === "Week" && <WeekView />}
        {view === "Timeline" && <TimelineStrip />}
        {view === "Kanban" && <KanbanView />}
      </FadeIn>
    </div>
  );
}
