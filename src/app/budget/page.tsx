"use client";

import { useMemo } from "react";
import { useTripStore } from "@/lib/store";
import PageHeader from "@/components/ui/PageHeader";
import FadeIn from "@/components/ui/FadeIn";
import ExpenseCharts from "@/components/budget/ExpenseCharts";
import ExpenseTable from "@/components/budget/ExpenseTable";
import { EXPENSE_CATEGORY_COLORS, formatJPY } from "@/lib/utils";
import type { ExpenseCategory } from "@/types";

const CATEGORIES: ExpenseCategory[] = [
  "Hotels",
  "Flights",
  "Food",
  "Shopping",
  "Transportation",
  "Entertainment",
  "Miscellaneous",
];

export default function BudgetPage() {
  const expenses = useTripStore((s) => s.expenses);

  const totals = useMemo(() => {
    const map = new Map<ExpenseCategory, number>();
    CATEGORIES.forEach((c) => map.set(c, 0));
    expenses.forEach((e) => map.set(e.category, (map.get(e.category) ?? 0) + e.amountJPY));
    return map;
  }, [expenses]);

  const grandTotal = expenses.reduce((s, e) => s + e.amountJPY, 0);
  const paid = expenses.filter((e) => e.paid).reduce((s, e) => s + e.amountJPY, 0);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
      <PageHeader
        eyebrow="Money matters"
        title="Budget Tracker"
        subtitle={`${formatJPY(paid)} paid of an estimated ${formatJPY(grandTotal)} total.`}
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {CATEGORIES.map((c, i) => (
          <FadeIn key={c} delay={i * 0.03}>
            <div className="soft-shadow rounded-2xl bg-card border border-[var(--border)] p-4">
              <div
                className="w-2 h-2 rounded-full mb-2"
                style={{ background: EXPENSE_CATEGORY_COLORS[c] }}
              />
              <div className="text-xs text-foreground/50">{c}</div>
              <div className="font-display text-lg mt-0.5 tabular-nums">
                {formatJPY(totals.get(c) ?? 0)}
              </div>
            </div>
          </FadeIn>
        ))}
      </div>

      <FadeIn>
        <div className="mb-8">
          <ExpenseCharts />
        </div>
      </FadeIn>

      <FadeIn>
        <ExpenseTable />
      </FadeIn>
    </div>
  );
}
