"use client";

import { useTripStore } from "@/lib/store";
import { EditableText, EditableNumber } from "@/components/ui/Editable";
import { EXPENSE_CATEGORY_COLORS, formatJPY } from "@/lib/utils";
import type { ExpenseCategory } from "@/types";
import { Plus, Trash2 } from "lucide-react";

const CATEGORIES: ExpenseCategory[] = [
  "Hotels",
  "Flights",
  "Food",
  "Shopping",
  "Transportation",
  "Entertainment",
  "Miscellaneous",
];

export default function ExpenseTable() {
  const expenses = useTripStore((s) => s.expenses);
  const addExpense = useTripStore((s) => s.addExpense);
  const updateExpense = useTripStore((s) => s.updateExpense);
  const removeExpense = useTripStore((s) => s.removeExpense);

  return (
    <div className="soft-shadow rounded-3xl bg-card border border-[var(--border)] overflow-hidden">
      <div className="overflow-x-auto custom-scroll">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] text-left text-[11px] uppercase tracking-wide text-foreground/40">
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Description</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium text-right">Amount</th>
              <th className="px-4 py-3 font-medium text-center">Paid</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {expenses.map((e) => (
              <tr key={e.id} className="border-b border-[var(--border)] last:border-0 group">
                <td className="px-4 py-2.5">
                  <select
                    value={e.category}
                    onChange={(ev) =>
                      updateExpense(e.id, { category: ev.target.value as ExpenseCategory })
                    }
                    className="bg-transparent outline-none text-xs rounded-full px-2 py-1"
                    style={{
                      background: `${EXPENSE_CATEGORY_COLORS[e.category]}18`,
                      color: EXPENSE_CATEGORY_COLORS[e.category],
                    }}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-2.5">
                  <EditableText
                    value={e.description}
                    onSave={(v) => updateExpense(e.id, { description: v })}
                  />
                </td>
                <td className="px-4 py-2.5">
                  <input
                    type="date"
                    value={e.date}
                    onChange={(ev) => updateExpense(e.id, { date: ev.target.value })}
                    className="bg-transparent outline-none text-xs"
                  />
                </td>
                <td className="px-4 py-2.5 text-right tabular-nums">
                  <EditableNumber
                    value={e.amountJPY}
                    onSave={(v) => updateExpense(e.id, { amountJPY: v })}
                  />
                </td>
                <td className="px-4 py-2.5 text-center">
                  <input
                    type="checkbox"
                    checked={e.paid}
                    onChange={() => updateExpense(e.id, { paid: !e.paid })}
                    className="accent-accent w-4 h-4"
                  />
                </td>
                <td className="px-4 py-2.5 text-right">
                  <button
                    onClick={() => removeExpense(e.id)}
                    className="opacity-0 group-hover:opacity-100 text-red-500"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="font-medium">
              <td colSpan={3} className="px-4 py-3 text-right text-xs text-foreground/50">
                Total
              </td>
              <td className="px-4 py-3 text-right tabular-nums">
                {formatJPY(expenses.reduce((s, e) => s + e.amountJPY, 0))}
              </td>
              <td colSpan={2} />
            </tr>
          </tfoot>
        </table>
      </div>
      <button
        onClick={() =>
          addExpense({
            category: "Miscellaneous",
            description: "New expense",
            amountJPY: 0,
            date: new Date().toISOString().slice(0, 10),
            paid: false,
          })
        }
        className="flex items-center gap-1.5 text-xs text-accent px-4 py-3 hover:underline"
      >
        <Plus size={14} /> Add expense
      </button>
    </div>
  );
}
