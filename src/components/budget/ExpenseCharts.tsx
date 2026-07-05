"use client";

import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { useTripStore } from "@/lib/store";
import { EXPENSE_CATEGORY_COLORS, formatJPY } from "@/lib/utils";
import type { ExpenseCategory } from "@/types";

export default function ExpenseCharts() {
  const expenses = useTripStore((s) => s.expenses);

  const byCategory = useMemo(() => {
    const map = new Map<ExpenseCategory, number>();
    expenses.forEach((e) => map.set(e.category, (map.get(e.category) ?? 0) + e.amountJPY));
    return Array.from(map.entries()).map(([category, value]) => ({ category, value }));
  }, [expenses]);

  const byCity = useMemo(() => {
    return [
      { name: "Planned", amount: expenses.filter((e) => !e.paid).reduce((s, e) => s + e.amountJPY, 0) },
      { name: "Paid", amount: expenses.filter((e) => e.paid).reduce((s, e) => s + e.amountJPY, 0) },
    ];
  }, [expenses]);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="soft-shadow rounded-3xl bg-card border border-[var(--border)] p-6">
        <h3 className="font-display text-lg mb-4">Spending by Category</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={byCategory}
                dataKey="value"
                nameKey="category"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={2}
              >
                {byCategory.map((entry) => (
                  <Cell key={entry.category} fill={EXPENSE_CATEGORY_COLORS[entry.category]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => formatJPY(Number(v))} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap gap-3 mt-2 justify-center">
          {byCategory.map((c) => (
            <span key={c.category} className="flex items-center gap-1.5 text-xs">
              <span
                className="w-2.5 h-2.5 rounded-full inline-block"
                style={{ background: EXPENSE_CATEGORY_COLORS[c.category] }}
              />
              {c.category}
            </span>
          ))}
        </div>
      </div>

      <div className="soft-shadow rounded-3xl bg-card border border-[var(--border)] p-6">
        <h3 className="font-display text-lg mb-4">Paid vs Planned</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={byCity}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" stroke="var(--foreground)" fontSize={12} />
              <YAxis
                stroke="var(--foreground)"
                fontSize={11}
                tickFormatter={(v) => `¥${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip formatter={(v) => formatJPY(Number(v))} />
              <Bar dataKey="amount" radius={[8, 8, 0, 0]} fill="#E60026" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
