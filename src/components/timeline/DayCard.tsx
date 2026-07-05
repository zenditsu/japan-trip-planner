"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTripStore } from "@/lib/store";
import { EditableText, EditableTextArea, EditableNumber } from "@/components/ui/Editable";
import TagList from "@/components/ui/TagList";
import ImageGrid from "@/components/ui/ImageGrid";
import DaySchedule from "@/components/timeline/DaySchedule";
import { CITY_COLORS, formatDateLong, googleMapsSearchUrl } from "@/lib/utils";
import type { CityName, Priority } from "@/types";
import {
  ChevronDown,
  MapPin,
  Hotel,
  EyeOff,
  Eye,
  Navigation,
  Clock,
  Utensils,
  ShoppingBag,
  Plus,
  Trash2,
} from "lucide-react";

const CITIES: (CityName | "Travel")[] = ["Tokyo", "Kyoto", "Osaka", "Travel"];
const PRIORITIES: Priority[] = ["low", "medium", "high"];
const PRIORITY_COLOR: Record<Priority, string> = {
  low: "#16A085",
  medium: "#E67E22",
  high: "#E60026",
};
const WEATHER_ICONS = ["☀️", "⛅", "☁️", "🌧️", "❄️", "🌸", "🍂"];

export default function DayCard({ dayId, defaultOpen = false }: { dayId: string; defaultOpen?: boolean }) {
  const day = useTripStore((s) => s.days.find((d) => d.id === dayId));
  const updateDay = useTripStore((s) => s.updateDay);
  const addChecklistItem = useTripStore((s) => s.addChecklistItem);
  const toggleChecklistItem = useTripStore((s) => s.toggleChecklistItem);
  const removeChecklistItem = useTripStore((s) => s.removeChecklistItem);
  const [open, setOpen] = useState(defaultOpen);
  const [showHidden, setShowHidden] = useState(false);
  const [checklistDraft, setChecklistDraft] = useState("");

  if (!day) return null;
  const cityColor = CITY_COLORS[day.city] ?? "#E60026";
  const doneCount = day.checklist.filter((c) => c.done).length;

  return (
    <div
      id={`day-${day.dayNumber}`}
      className="soft-shadow rounded-3xl bg-card border border-[var(--border)] overflow-hidden scroll-mt-24"
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex flex-wrap items-center gap-3 sm:gap-4 p-5 sm:p-6 text-left"
      >
        <span
          className="font-display text-2xl sm:text-3xl shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-white"
          style={{ background: cityColor }}
        >
          {day.dayNumber}
        </span>
        <div className="flex-1 min-w-[160px]">
          <div onClick={(e) => e.stopPropagation()}>
            <EditableText
              value={day.title}
              onSave={(v) => updateDay(day.id, { title: v })}
              className="font-display text-lg sm:text-xl block"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-foreground/50">
            <span>{formatDateLong(day.date)}</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1">
              <MapPin size={12} /> {day.city}
            </span>
          </div>
        </div>

        <span
          className="text-[11px] px-2.5 py-1 rounded-full font-medium capitalize"
          style={{ background: `${PRIORITY_COLOR[day.priority]}22`, color: PRIORITY_COLOR[day.priority] }}
        >
          {day.priority}
        </span>

        {day.checklist.length > 0 && (
          <span className="text-[11px] text-foreground/50 tabular-nums">
            {doneCount}/{day.checklist.length} ✅
          </span>
        )}

        <motion.span animate={{ rotate: open ? 180 : 0 }} className="text-foreground/40">
          <ChevronDown size={20} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 sm:px-6 pb-6 flex flex-col gap-6 border-t border-[var(--border)] pt-5">
              {/* quick facts grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-background/60 border border-[var(--border)] p-3">
                  <div className="flex items-center gap-1.5 text-[11px] text-foreground/50 mb-1">
                    <MapPin size={12} /> City
                  </div>
                  <select
                    value={day.city}
                    onChange={(e) => updateDay(day.id, { city: e.target.value as CityName | "Travel" })}
                    className="bg-transparent text-sm font-medium outline-none w-full"
                  >
                    {CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="rounded-2xl bg-background/60 border border-[var(--border)] p-3">
                  <div className="flex items-center gap-1.5 text-[11px] text-foreground/50 mb-1">
                    <Hotel size={12} /> Hotel
                  </div>
                  <EditableText
                    value={day.hotel}
                    onSave={(v) => updateDay(day.id, { hotel: v })}
                    className="text-sm font-medium block truncate"
                  />
                </div>
              </div>

              {/* weather + priority + maps */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5 rounded-full bg-background/60 border border-[var(--border)] px-3 py-1.5">
                  {WEATHER_ICONS.map((icon) => (
                    <button
                      key={icon}
                      onClick={() => updateDay(day.id, { weather: { ...day.weather, icon } })}
                      className={`text-sm rounded-full w-6 h-6 flex items-center justify-center ${
                        day.weather.icon === icon ? "bg-accent-soft" : "opacity-50 hover:opacity-100"
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                  <span className="text-xs text-foreground/50 ml-1">
                    <EditableNumber
                      value={day.weather.tempHigh}
                      suffix="°"
                      onSave={(v) => updateDay(day.id, { weather: { ...day.weather, tempHigh: v } })}
                    />
                    {" / "}
                    <EditableNumber
                      value={day.weather.tempLow}
                      suffix="°"
                      onSave={(v) => updateDay(day.id, { weather: { ...day.weather, tempLow: v } })}
                    />
                  </span>
                </div>

                <div className="flex items-center gap-1 rounded-full bg-background/60 border border-[var(--border)] px-2 py-1">
                  {PRIORITIES.map((p) => (
                    <button
                      key={p}
                      onClick={() => updateDay(day.id, { priority: p })}
                      className="text-[11px] px-2 py-1 rounded-full capitalize transition-colors"
                      style={{
                        background: day.priority === p ? `${PRIORITY_COLOR[p]}22` : "transparent",
                        color: day.priority === p ? PRIORITY_COLOR[p] : "var(--foreground)",
                        opacity: day.priority === p ? 1 : 0.5,
                      }}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <a
                  href={googleMapsSearchUrl(day.mapQuery)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-accent text-white px-3 py-1.5 text-xs font-medium hover:opacity-90"
                >
                  <Navigation size={13} /> Open in Google Maps
                </a>
              </div>

              {/* transportation */}
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="rounded-2xl bg-background/60 border border-[var(--border)] p-3">
                  <div className="flex items-center gap-1.5 text-[11px] text-foreground/50 mb-1">
                    <Navigation size={12} /> Transportation
                  </div>
                  <EditableText
                    value={day.transportation}
                    onSave={(v) => updateDay(day.id, { transportation: v })}
                    className="text-sm block"
                  />
                </div>
                <div className="rounded-2xl bg-background/60 border border-[var(--border)] p-3">
                  <div className="flex items-center gap-1.5 text-[11px] text-foreground/50 mb-1">
                    <Clock size={12} /> Estimated Travel Time
                  </div>
                  <EditableText
                    value={day.travelTime}
                    onSave={(v) => updateDay(day.id, { travelTime: v })}
                    className="text-sm block"
                  />
                </div>
              </div>

              {/* schedule */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-widest text-foreground/50 mb-2">
                  Daily Schedule
                </h4>
                <DaySchedule dayId={day.id} />
              </div>

              {/* notes */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-widest text-foreground/50 mb-2">
                  📝 Notes
                </h4>
                <EditableTextArea
                  value={day.notes}
                  onSave={(v) => updateDay(day.id, { notes: v })}
                  className="text-sm bg-background/60 border border-[var(--border)] rounded-2xl"
                />
              </div>

              {/* checklist */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-widest text-foreground/50 mb-2">
                  ✅ Checklist
                </h4>
                <div className="flex flex-col gap-1.5">
                  {day.checklist.map((item) => (
                    <div key={item.id} className="flex items-center gap-2 group">
                      <input
                        type="checkbox"
                        checked={item.done}
                        onChange={() => toggleChecklistItem(day.id, item.id)}
                        className="accent-accent w-4 h-4"
                      />
                      <span className={`text-sm flex-1 ${item.done ? "line-through text-foreground/40" : ""}`}>
                        {item.text}
                      </span>
                      <button
                        onClick={() => removeChecklistItem(day.id, item.id)}
                        className="opacity-0 group-hover:opacity-100 text-red-500"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      value={checklistDraft}
                      onChange={(e) => setChecklistDraft(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && checklistDraft.trim()) {
                          addChecklistItem(day.id, checklistDraft.trim());
                          setChecklistDraft("");
                        }
                      }}
                      placeholder="Add checklist item…"
                      className="flex-1 bg-transparent border-b border-dashed border-[var(--border)] outline-none text-sm py-1"
                    />
                    <button
                      onClick={() => {
                        if (checklistDraft.trim()) {
                          addChecklistItem(day.id, checklistDraft.trim());
                          setChecklistDraft("");
                        }
                      }}
                      className="text-accent"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* restaurants + shopping */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-widest text-foreground/50 mb-2 flex items-center gap-1.5">
                    <Utensils size={12} /> Restaurant Recommendations
                  </h4>
                  <TagList
                    items={day.restaurants}
                    onChange={(v) => updateDay(day.id, { restaurants: v })}
                    placeholder="Add restaurant…"
                  />
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-widest text-foreground/50 mb-2 flex items-center gap-1.5">
                    <ShoppingBag size={12} /> Shopping Recommendations
                  </h4>
                  <TagList
                    items={day.shopping}
                    onChange={(v) => updateDay(day.id, { shopping: v })}
                    placeholder="Add shop…"
                    chipClassName="bg-purple-500/10 text-purple-600 dark:text-purple-300"
                  />
                </div>
              </div>

              {/* images */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-widest text-foreground/50 mb-2">
                  📷 Photos
                </h4>
                <ImageGrid
                  images={day.images}
                  onChange={(v) => updateDay(day.id, { images: v })}
                />
              </div>

              {/* hidden notes */}
              <div>
                <button
                  onClick={() => setShowHidden((v) => !v)}
                  className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-foreground/50 mb-2 hover:text-accent"
                >
                  {showHidden ? <Eye size={12} /> : <EyeOff size={12} />} Hidden Notes{" "}
                  {!showHidden && day.hiddenNotes && "(has content)"}
                </button>
                {showHidden && (
                  <EditableTextArea
                    value={day.hiddenNotes}
                    onSave={(v) => updateDay(day.id, { hiddenNotes: v })}
                    placeholder="Private notes only visible when expanded…"
                    className="text-sm bg-background/60 border border-[var(--border)] rounded-2xl"
                  />
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
