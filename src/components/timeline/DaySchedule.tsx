"use client";

import { Draggable, Droppable } from "@hello-pangea/dnd";
import { useTripStore } from "@/lib/store";
import { EditableText } from "@/components/ui/Editable";
import { Copy, Trash2, Plus, GripVertical, Clock, X } from "lucide-react";
import type { ScheduleCategory } from "@/types";

const CATEGORY_OPTIONS: { value: ScheduleCategory; label: string; color: string }[] = [
  { value: "food", label: "Food", color: "#E67E22" },
  { value: "sight", label: "Sight", color: "#E60026" },
  { value: "transport", label: "Transport", color: "#2C6EAA" },
  { value: "shopping", label: "Shopping", color: "#8E44AD" },
  { value: "rest", label: "Rest", color: "#16A085" },
  { value: "other", label: "Other", color: "#7F8C8D" },
];

export default function DaySchedule({ dayId }: { dayId: string }) {
  const day = useTripStore((s) => s.days.find((d) => d.id === dayId));
  const updateScheduleItem = useTripStore((s) => s.updateScheduleItem);
  const removeScheduleItem = useTripStore((s) => s.removeScheduleItem);
  const duplicateScheduleItem = useTripStore((s) => s.duplicateScheduleItem);
  const addScheduleItem = useTripStore((s) => s.addScheduleItem);

  if (!day) return null;

  return (
    <div>
      <Droppable droppableId={dayId}>
          {(provided, dropSnapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`flex flex-col gap-2 min-h-[12px] rounded-2xl transition-colors ${
                dropSnapshot.isDraggingOver ? "bg-accent-soft" : ""
              }`}
            >
              {day.schedule.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(dragProvided, snapshot) => (
                    <div
                      ref={dragProvided.innerRef}
                      {...dragProvided.draggableProps}
                      className={`flex items-start gap-2 sm:gap-3 rounded-2xl border border-[var(--border)] bg-background/60 p-3 group ${
                        snapshot.isDragging ? "soft-shadow ring-1 ring-accent" : ""
                      }`}
                      style={{
                        ...dragProvided.draggableProps.style,
                        borderLeft: `4px solid ${item.color}`,
                      }}
                    >
                      <span
                        {...dragProvided.dragHandleProps}
                        className="mt-1 opacity-30 group-hover:opacity-70 cursor-grab active:cursor-grabbing"
                      >
                        <GripVertical size={16} />
                      </span>
                      {item.time && item.time !== "—" ? (
                        <span className="flex items-center gap-1 shrink-0 group/time">
                          <input
                            type="time"
                            value={item.time}
                            onChange={(e) =>
                              updateScheduleItem(dayId, item.id, { time: e.target.value })
                            }
                            className="bg-transparent text-sm tabular-nums w-[70px] outline-none"
                          />
                          <button
                            onClick={() => updateScheduleItem(dayId, item.id, { time: "" })}
                            className="opacity-0 group-hover/time:opacity-60 hover:!opacity-100 transition-opacity"
                            title="Remove time"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ) : (
                        <button
                          onClick={() => updateScheduleItem(dayId, item.id, { time: "09:00" })}
                          className="flex items-center gap-1 shrink-0 text-xs text-foreground/40 hover:text-accent transition-colors w-[70px]"
                          title="Add a time"
                        >
                          <Clock size={12} /> Add time
                        </button>
                      )}
                      <div className="flex-1 min-w-0">
                        <EditableText
                          value={item.title}
                          onSave={(v) => updateScheduleItem(dayId, item.id, { title: v })}
                          className="text-sm font-medium block"
                        />
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <select
                            value={item.category}
                            onChange={(e) =>
                              updateScheduleItem(dayId, item.id, {
                                category: e.target.value as ScheduleCategory,
                                color:
                                  CATEGORY_OPTIONS.find((c) => c.value === e.target.value)
                                    ?.color ?? item.color,
                              })
                            }
                            className="text-[11px] bg-accent-soft rounded-full px-2 py-0.5 outline-none"
                            style={{ color: item.color }}
                          >
                            {CATEGORY_OPTIONS.map((c) => (
                              <option key={c.value} value={c.value}>
                                {c.label}
                              </option>
                            ))}
                          </select>
                          <EditableText
                            value={item.duration}
                            onSave={(v) => updateScheduleItem(dayId, item.id, { duration: v })}
                            className="text-[11px] text-foreground/50"
                          />
                        </div>
                        {(!snapshot.isDragging || item.notes) && (
                          <EditableText
                            value={item.notes}
                            placeholder="add a note…"
                            onSave={(v) => updateScheduleItem(dayId, item.id, { notes: v })}
                            className="text-xs text-foreground/50 block mt-1"
                          />
                        )}
                      </div>
                      <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => duplicateScheduleItem(dayId, item.id)}
                          className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/10"
                          title="Duplicate"
                        >
                          <Copy size={13} />
                        </button>
                        <button
                          onClick={() => removeScheduleItem(dayId, item.id)}
                          className="p-1 rounded hover:bg-red-500/10 text-red-500"
                          title="Delete"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      <button
        onClick={() => addScheduleItem(dayId)}
        className="mt-3 flex items-center gap-1.5 text-xs text-accent hover:underline"
      >
        <Plus size={14} /> Add activity
      </button>
    </div>
  );
}
