"use client";

import { useTripStore } from "@/lib/store";
import PageHeader from "@/components/ui/PageHeader";
import FadeIn from "@/components/ui/FadeIn";
import { EditableText, EditableNumber } from "@/components/ui/Editable";
import { formatJPY } from "@/lib/utils";
import type { TransportType } from "@/types";
import { Plus, Trash2, TrainFront, Bus, Plane, Footprints, TramFront } from "lucide-react";

const TYPE_ICON: Record<TransportType, React.ReactNode> = {
  shinkansen: <TrainFront size={16} />,
  metro: <TramFront size={16} />,
  bus: <Bus size={16} />,
  flight: <Plane size={16} />,
  walk: <Footprints size={16} />,
};

const TYPES: TransportType[] = ["flight", "shinkansen", "metro", "bus", "walk"];

export default function TransportPage() {
  const transport = useTripStore((s) => s.transport);
  const settings = useTripStore((s) => s.settings);
  const updateSettings = useTripStore((s) => s.updateSettings);
  const addTransportLeg = useTripStore((s) => s.addTransportLeg);
  const updateTransportLeg = useTripStore((s) => s.updateTransportLeg);
  const removeTransportLeg = useTripStore((s) => s.removeTransportLeg);

  const sorted = [...transport].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
      <PageHeader
        eyebrow="Getting around"
        title="Transportation Planner"
        subtitle="Shinkansen, metro, IC card balance, and JR Pass usage — all in one place."
      />

      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        <div className="soft-shadow rounded-3xl bg-card border border-[var(--border)] p-5">
          <div className="text-xs text-foreground/50 mb-1">IC Card Balance</div>
          <div className="font-display text-2xl">
            <EditableNumber
              value={settings.icCardBalance}
              onSave={(v) => updateSettings({ icCardBalance: v })}
            />{" "}
            <span className="text-sm text-foreground/40">
              ({formatJPY(settings.icCardBalance)})
            </span>
          </div>
        </div>
        <div className="soft-shadow rounded-3xl bg-card border border-[var(--border)] p-5">
          <div className="text-xs text-foreground/50 mb-1">JR Pass</div>
          <button
            onClick={() => updateSettings({ jrPassActive: !settings.jrPassActive })}
            className={`font-display text-lg px-3 py-1 rounded-full ${
              settings.jrPassActive ? "bg-emerald-500/15 text-emerald-600" : "bg-black/5 text-foreground/40"
            }`}
          >
            {settings.jrPassActive ? "Active" : "Inactive"}
          </button>
        </div>
        <div className="soft-shadow rounded-3xl bg-card border border-[var(--border)] p-5">
          <div className="text-xs text-foreground/50 mb-1">JR Pass Expiry</div>
          <input
            type="date"
            value={settings.jrPassExpiry}
            onChange={(e) => updateSettings({ jrPassExpiry: e.target.value })}
            className="bg-transparent outline-none font-display text-lg"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {sorted.map((leg, i) => (
          <FadeIn key={leg.id} delay={i * 0.03}>
            <div className="soft-shadow rounded-3xl bg-card border border-[var(--border)] p-5 flex flex-col sm:flex-row sm:items-center gap-4">
              <select
                value={leg.type}
                onChange={(e) => updateTransportLeg(leg.id, { type: e.target.value as TransportType })}
                className="bg-accent-soft text-accent text-xs rounded-full px-3 py-1.5 outline-none flex items-center gap-1 shrink-0 w-fit"
              >
                {TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <span className="text-accent shrink-0">{TYPE_ICON[leg.type]}</span>
              <div className="flex-1 min-w-0 flex flex-wrap items-center gap-1.5 text-sm">
                <EditableText value={leg.from} onSave={(v) => updateTransportLeg(leg.id, { from: v })} />
                <span className="text-foreground/30">→</span>
                <EditableText value={leg.to} onSave={(v) => updateTransportLeg(leg.id, { to: v })} />
              </div>
              <input
                type="date"
                value={leg.date}
                onChange={(e) => updateTransportLeg(leg.id, { date: e.target.value })}
                className="bg-transparent outline-none text-xs"
              />
              <input
                type="time"
                value={leg.time}
                onChange={(e) => updateTransportLeg(leg.id, { time: e.target.value })}
                className="bg-transparent outline-none text-xs"
              />
              <EditableText
                value={leg.duration}
                onSave={(v) => updateTransportLeg(leg.id, { duration: v })}
                className="text-xs text-foreground/50 w-16"
              />
              <span className="text-xs tabular-nums w-20 text-right">
                <EditableNumber
                  value={leg.costJPY}
                  onSave={(v) => updateTransportLeg(leg.id, { costJPY: v })}
                />
              </span>
              <button
                onClick={() => removeTransportLeg(leg.id)}
                className="text-red-500/70 hover:text-red-500 shrink-0"
              >
                <Trash2 size={15} />
              </button>
              <div className="w-full">
                <EditableText
                  value={leg.notes}
                  placeholder="Platform notes…"
                  onSave={(v) => updateTransportLeg(leg.id, { notes: v })}
                  className="text-xs text-foreground/50"
                />
              </div>
            </div>
          </FadeIn>
        ))}
      </div>

      <button
        onClick={() =>
          addTransportLeg({
            type: "metro",
            from: "Origin",
            to: "Destination",
            date: new Date().toISOString().slice(0, 10),
            time: "09:00",
            duration: "30m",
            notes: "",
            costJPY: 0,
          })
        }
        className="mt-4 flex items-center gap-1.5 text-sm text-accent hover:underline"
      >
        <Plus size={16} /> Add transport leg
      </button>
    </div>
  );
}
