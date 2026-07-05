"use client";

import { DragDropContext, Draggable, Droppable, DropResult } from "@hello-pangea/dnd";
import Link from "next/link";
import { useTripStore } from "@/lib/store";
import { CITY_COLORS } from "@/lib/utils";
import type { CityName } from "@/types";

const COLUMNS: (CityName | "Travel")[] = ["Tokyo", "Kyoto", "Osaka", "Travel"];

export default function KanbanView() {
  const days = useTripStore((s) => s.days);
  const updateDay = useTripStore((s) => s.updateDay);

  function onDragEnd(result: DropResult) {
    if (!result.destination) return;
    const newCity = result.destination.droppableId as CityName | "Travel";
    updateDay(result.draggableId, { city: newCity });
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {COLUMNS.map((col) => (
          <Droppable droppableId={col} key={col}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`rounded-3xl border border-[var(--border)] p-3 min-h-[200px] transition-colors ${
                  snapshot.isDraggingOver ? "bg-accent-soft" : "bg-background/50"
                }`}
              >
                <div className="flex items-center gap-2 px-2 py-1.5 mb-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ background: CITY_COLORS[col] }}
                  />
                  <h3 className="font-medium text-sm">{col}</h3>
                  <span className="text-xs text-foreground/40 ml-auto">
                    {days.filter((d) => d.city === col).length}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  {days
                    .filter((d) => d.city === col)
                    .map((day, index) => (
                      <Draggable key={day.id} draggableId={day.id} index={index}>
                        {(dragProvided, dragSnapshot) => (
                          <div
                            ref={dragProvided.innerRef}
                            {...dragProvided.draggableProps}
                            {...dragProvided.dragHandleProps}
                            className={`rounded-2xl bg-card border border-[var(--border)] p-3 soft-shadow ${
                              dragSnapshot.isDragging ? "ring-1 ring-accent" : ""
                            }`}
                          >
                            <Link
                              href={`/timeline#day-${day.dayNumber}`}
                              className="text-sm font-medium hover:text-accent"
                            >
                              Day {day.dayNumber}: {day.title}
                            </Link>
                            <div className="text-[11px] text-foreground/40 mt-1">
                              {day.schedule.length} activities · {day.priority} priority
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}
