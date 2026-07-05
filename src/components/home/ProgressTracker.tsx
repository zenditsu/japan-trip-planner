"use client";

import { useEffect, useMemo, useState } from "react";
import FadeIn from "@/components/ui/FadeIn";
import { useTripStore } from "@/lib/store";
import { formatJPY } from "@/lib/utils";

function Ring({ percent, label, sub }: { percent: number; label: string; sub: string }) {
  const r = 42;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.min(100, Math.max(0, percent)) / 100) * c;
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-28 h-28">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <circle cx="50" cy="50" r={r} fill="none" stroke="var(--border)" strokeWidth="8" />
          <circle
            cx="50"
            cy="50"
            r={r}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center font-display text-xl">
          {Math.round(percent)}%
        </div>
      </div>
      <div className="text-center">
        <div className="text-sm font-medium">{label}</div>
        <div className="text-xs text-foreground/50">{sub}</div>
      </div>
    </div>
  );
}

export default function ProgressTracker() {
  const days = useTripStore((s) => s.days);
  const attractions = useTripStore((s) => s.attractions);
  const packing = useTripStore((s) => s.packing);
  const expenses = useTripStore((s) => s.expenses);
  const settings = useTripStore((s) => s.settings);

  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(id);
  }, []);

  const stats = useMemo(() => {
    const checklistAll = days.flatMap((d) => d.checklist);
    const checklistDone = checklistAll.filter((c) => c.done).length;
    const checklistPct = checklistAll.length
      ? (checklistDone / checklistAll.length) * 100
      : 0;

    const visitedPct = attractions.length
      ? (attractions.filter((a) => a.visited).length / attractions.length) * 100
      : 0;

    const packedPct = packing.length
      ? (packing.filter((p) => p.packed).length / packing.length) * 100
      : 0;

    const overall = (checklistPct + visitedPct + packedPct) / 3;

    const totalBudget = expenses.reduce((s, e) => s + e.amountJPY, 0);
    const spent = expenses.filter((e) => e.paid).reduce((s, e) => s + e.amountJPY, 0);

    const dep = new Date(settings.departureDate + "T00:00:00").getTime();
    const ret = new Date(settings.returnDate + "T00:00:00").getTime();
    let remainingLabel = "";
    if (now < dep) {
      remainingLabel = `${Math.ceil((dep - now) / 86400000)} days until departure`;
    } else if (now <= ret) {
      const dayN = Math.floor((now - dep) / 86400000) + 1;
      remainingLabel = `Day ${dayN} of ${days.length} — enjoy Japan!`;
    } else {
      remainingLabel = "Trip completed 🎉";
    }

    return { overall, visitedPct, packedPct, totalBudget, spent, remainingLabel };
  }, [days, attractions, packing, expenses, settings, now]);

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-16">
      <FadeIn>
        <div className="soft-shadow rounded-3xl bg-card border border-[var(--border)] p-6 sm:p-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <h2 className="font-display text-2xl sm:text-3xl">Trip Progress</h2>
            <span className="text-sm text-foreground/60">{stats.remainingLabel}</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-4 justify-items-center">
            <Ring percent={stats.overall} label="Overall" sub="Planning complete" />
            <Ring percent={stats.visitedPct} label="Attractions" sub="Visited" />
            <Ring percent={stats.packedPct} label="Packing" sub="Packed" />
            <div className="flex flex-col items-center gap-3 justify-center">
              <div className="font-display text-2xl tabular-nums">
                {formatJPY(stats.spent)}
              </div>
              <div className="text-xs text-foreground/50">
                of {formatJPY(stats.totalBudget)} spent
              </div>
              <div className="w-32 h-2 rounded-full bg-[var(--border)] overflow-hidden">
                <div
                  className="h-full bg-accent transition-all duration-700"
                  style={{
                    width: `${
                      stats.totalBudget ? (stats.spent / stats.totalBudget) * 100 : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
