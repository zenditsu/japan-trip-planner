"use client";

import { useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { useTripStore } from "@/lib/store";
import PageHeader from "@/components/ui/PageHeader";
import DayCard from "@/components/timeline/DayCard";
import ExportButtons from "@/components/ui/ExportButtons";
import { CITY_COLORS } from "@/lib/utils";

const TimelineScene = dynamic(() => import("@/components/timeline/TimelineScene"), {
  ssr: false,
});

const CITY_FILTERS = ["All", "Tokyo", "Kyoto", "Osaka", "Travel"] as const;

export default function TimelinePage() {
  const days = useTripStore((s) => s.days);
  const reorderScheduleItem = useTripStore((s) => s.reorderScheduleItem);
  const moveScheduleItem = useTripStore((s) => s.moveScheduleItem);
  const [filter, setFilter] = useState<(typeof CITY_FILTERS)[number]>("All");
  const printRef = useRef<HTMLDivElement>(null);

  const visibleDays = useMemo(
    () => (filter === "All" ? days : days.filter((d) => d.city === filter)),
    [days, filter]
  );

  function onDragEnd(result: DropResult) {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId) {
      reorderScheduleItem(source.droppableId, source.index, destination.index);
    } else {
      moveScheduleItem(source.droppableId, destination.droppableId, draggableId, destination.index);
    }
  }

  return (
    <div className="relative">
      <div className="fixed inset-0 -z-10 bg-[#0b0710] no-print">
        <TimelineScene />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-[#0b0710]" />
      </div>

      <div
        className="mx-auto max-w-4xl px-4 sm:px-6 py-12"
        style={
          {
            "--foreground": "#f5f1ea",
            "--border": "rgba(245,241,234,0.16)",
            color: "var(--foreground)",
          } as React.CSSProperties
        }
      >
        <PageHeader
          eyebrow="Day by day"
          title="15-Day Timeline"
          subtitle="Every day of the trip, fully editable. Drag activities between days, duplicate, color-code, or delete freely."
          action={<ExportButtons targetRef={printRef} filename="japan-itinerary.pdf" />}
        />

        <div className="flex flex-wrap gap-2 mb-8 no-print">
          {CITY_FILTERS.map((c) => (
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

        <div
          ref={printRef}
          style={
            {
              "--foreground": "#16130f",
              "--card": "#ffffff",
              "--border": "rgba(22,19,15,0.08)",
              "--background": "#ffffff",
              color: "var(--foreground)",
            } as React.CSSProperties
          }
        >
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="relative flex flex-col gap-5">
              <div
                className="absolute left-7 top-0 bottom-0 w-px bg-[var(--border)] hidden sm:block no-print"
                aria-hidden
              />
              {visibleDays.map((day, i) => (
                <DayCard key={day.id} dayId={day.id} defaultOpen={i === 0} />
              ))}
            </div>
          </DragDropContext>
        </div>
      </div>
    </div>
  );
}
