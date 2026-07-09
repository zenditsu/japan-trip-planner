"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { v4 as uuid } from "uuid";
import { addDaysToDate } from "@/lib/utils";
import type {
  Attraction,
  ChecklistItem,
  DayPlan,
  ExpenseItem,
  FoodItem,
  HotelBooking,
  JournalEntry,
  PackingItem,
  ScheduleItem,
  TransportLeg,
  TripSettings,
  WishlistItem,
} from "@/types";
import {
  buildInitialDays,
  buildInitialJournal,
  DEFAULT_DEPARTURE,
  defaultSettings,
  initialAttractions,
  initialExpenses,
  initialFood,
  initialHotels,
  initialPacking,
  initialTransport,
  initialWishlist,
} from "@/lib/seed";

const CURRENT_STORAGE_KEY = "japan-trip-planner-v2";
const LEGACY_STORAGE_KEYS = ["japan-trip-planner-v1"];

function daysBetweenDates(fromISO: string, toISO: string): number {
  const from = new Date(fromISO + "T00:00:00").getTime();
  const to = new Date(toISO + "T00:00:00").getTime();
  return Math.round((to - from) / 86400000);
}

/**
 * Recovers state from a previous storage key (e.g. after the schema/date
 * baseline changed) and shifts every date field by the same offset so a
 * user's real edits survive instead of being silently orphaned.
 */
function recoverLegacyState(raw: string): string | null {
  let parsed: { state?: Record<string, unknown>; version?: number };
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  const state = parsed.state;
  if (!state || typeof state !== "object") return null;

  const settings = state.settings as Partial<TripSettings> | undefined;
  const oldDeparture = settings?.departureDate;
  const shiftDays =
    typeof oldDeparture === "string" ? daysBetweenDates(oldDeparture, DEFAULT_DEPARTURE) : 0;
  const shift = (d: unknown) =>
    typeof d === "string" && d ? addDaysToDate(d, shiftDays) : d;

  if (settings) {
    state.settings = {
      ...settings,
      departureDate: shift(settings.departureDate),
      returnDate: shift(settings.returnDate),
      jrPassExpiry: shift(settings.jrPassExpiry),
    };
  }
  if (Array.isArray(state.days)) {
    state.days = state.days.map((d: DayPlan) => ({ ...d, date: shift(d.date) }));
  }
  if (Array.isArray(state.hotels)) {
    state.hotels = state.hotels.map((h: HotelBooking) => ({
      ...h,
      checkIn: shift(h.checkIn),
      checkOut: shift(h.checkOut),
    }));
  }
  if (Array.isArray(state.expenses)) {
    state.expenses = state.expenses.map((e: ExpenseItem) => ({ ...e, date: shift(e.date) }));
  }
  if (Array.isArray(state.transport)) {
    state.transport = state.transport.map((t: TransportLeg) => ({ ...t, date: shift(t.date) }));
  }
  if (Array.isArray(state.journal)) {
    state.journal = state.journal.map((j: JournalEntry) => ({ ...j, date: shift(j.date) }));
  }

  return JSON.stringify({ ...parsed, state });
}

const recoveringStorage = {
  getItem: (name: string): string | null => {
    if (typeof window === "undefined") return null;
    const current = window.localStorage.getItem(name);
    if (current) return current;
    for (const legacyKey of LEGACY_STORAGE_KEYS) {
      const legacyRaw = window.localStorage.getItem(legacyKey);
      if (!legacyRaw) continue;
      const recovered = recoverLegacyState(legacyRaw);
      if (recovered) {
        window.localStorage.setItem(name, recovered);
        return recovered;
      }
    }
    return null;
  },
  setItem: (name: string, value: string) => {
    if (typeof window !== "undefined") window.localStorage.setItem(name, value);
  },
  removeItem: (name: string) => {
    if (typeof window !== "undefined") window.localStorage.removeItem(name);
  },
};

interface TripState {
  hydrated: boolean;
  darkMode: boolean;
  settings: TripSettings;
  days: DayPlan[];
  attractions: Attraction[];
  expenses: ExpenseItem[];
  packing: PackingItem[];
  food: FoodItem[];
  journal: JournalEntry[];
  wishlist: WishlistItem[];
  hotels: HotelBooking[];
  transport: TransportLeg[];

  setHydrated: () => void;
  toggleDarkMode: () => void;
  updateSettings: (partial: Partial<TripSettings>) => void;

  updateDay: (id: string, partial: Partial<DayPlan>) => void;
  reorderDays: (fromIndex: number, toIndex: number) => void;
  addChecklistItem: (dayId: string, text: string) => void;
  toggleChecklistItem: (dayId: string, itemId: string) => void;
  removeChecklistItem: (dayId: string, itemId: string) => void;

  addScheduleItem: (dayId: string, item?: Partial<ScheduleItem>) => void;
  updateScheduleItem: (dayId: string, itemId: string, partial: Partial<ScheduleItem>) => void;
  removeScheduleItem: (dayId: string, itemId: string) => void;
  duplicateScheduleItem: (dayId: string, itemId: string) => void;
  moveScheduleItem: (fromDayId: string, toDayId: string, itemId: string, toIndex: number) => void;
  reorderScheduleItem: (dayId: string, fromIndex: number, toIndex: number) => void;

  updateAttraction: (id: string, partial: Partial<Attraction>) => void;
  toggleAttractionVisited: (id: string) => void;
  toggleAttractionFavorite: (id: string) => void;

  addExpense: (expense: Omit<ExpenseItem, "id">) => void;
  updateExpense: (id: string, partial: Partial<ExpenseItem>) => void;
  removeExpense: (id: string) => void;

  addPackingItem: (text: string, category: string) => void;
  togglePackingItem: (id: string) => void;
  removePackingItem: (id: string) => void;

  toggleFoodTried: (id: string) => void;
  addFoodItem: (item: Omit<FoodItem, "id">) => void;
  updateFoodItem: (id: string, partial: Partial<FoodItem>) => void;
  removeFoodItem: (id: string) => void;

  updateJournalEntry: (id: string, partial: Partial<JournalEntry>) => void;

  addWishlistItem: (item: Omit<WishlistItem, "id">) => void;
  updateWishlistItem: (id: string, partial: Partial<WishlistItem>) => void;
  removeWishlistItem: (id: string) => void;

  updateHotel: (id: string, partial: Partial<HotelBooking>) => void;

  addTransportLeg: (leg: Omit<TransportLeg, "id">) => void;
  updateTransportLeg: (id: string, partial: Partial<TransportLeg>) => void;
  removeTransportLeg: (id: string) => void;

  resetTrip: () => void;
}

function freshState() {
  const days = buildInitialDays();
  return {
    settings: defaultSettings,
    days,
    attractions: initialAttractions,
    expenses: initialExpenses,
    packing: initialPacking,
    food: initialFood,
    journal: buildInitialJournal(days),
    wishlist: initialWishlist,
    hotels: initialHotels,
    transport: initialTransport,
  };
}

export const useTripStore = create<TripState>()(
  persist(
    (set) => ({
      hydrated: false,
      darkMode: false,
      ...freshState(),

      setHydrated: () => set({ hydrated: true }),
      toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),
      updateSettings: (partial) =>
        set((s) => ({ settings: { ...s.settings, ...partial } })),

      updateDay: (id, partial) =>
        set((s) => ({
          days: s.days.map((d) => (d.id === id ? { ...d, ...partial } : d)),
        })),

      reorderDays: (fromIndex, toIndex) =>
        set((s) => {
          const days = [...s.days];
          const [moved] = days.splice(fromIndex, 1);
          days.splice(toIndex, 0, moved);
          return {
            days: days.map((d, i) => ({
              ...d,
              dayNumber: i + 1,
              date: addDaysToDate(s.settings.departureDate, i),
            })),
          };
        }),

      addChecklistItem: (dayId, text) =>
        set((s) => ({
          days: s.days.map((d) =>
            d.id === dayId
              ? {
                  ...d,
                  checklist: [
                    ...d.checklist,
                    { id: uuid(), text, done: false } as ChecklistItem,
                  ],
                }
              : d
          ),
        })),
      toggleChecklistItem: (dayId, itemId) =>
        set((s) => ({
          days: s.days.map((d) =>
            d.id === dayId
              ? {
                  ...d,
                  checklist: d.checklist.map((c) =>
                    c.id === itemId ? { ...c, done: !c.done } : c
                  ),
                }
              : d
          ),
        })),
      removeChecklistItem: (dayId, itemId) =>
        set((s) => ({
          days: s.days.map((d) =>
            d.id === dayId
              ? { ...d, checklist: d.checklist.filter((c) => c.id !== itemId) }
              : d
          ),
        })),

      addScheduleItem: (dayId, item) =>
        set((s) => ({
          days: s.days.map((d) =>
            d.id === dayId
              ? {
                  ...d,
                  schedule: [
                    ...d.schedule,
                    {
                      id: uuid(),
                      time: "",
                      title: "New activity",
                      category: "other",
                      duration: "1h",
                      notes: "",
                      color: "#7F8C8D",
                      ...item,
                    },
                  ],
                }
              : d
          ),
        })),
      updateScheduleItem: (dayId, itemId, partial) =>
        set((s) => ({
          days: s.days.map((d) =>
            d.id === dayId
              ? {
                  ...d,
                  schedule: d.schedule.map((it) =>
                    it.id === itemId ? { ...it, ...partial } : it
                  ),
                }
              : d
          ),
        })),
      removeScheduleItem: (dayId, itemId) =>
        set((s) => ({
          days: s.days.map((d) =>
            d.id === dayId
              ? { ...d, schedule: d.schedule.filter((it) => it.id !== itemId) }
              : d
          ),
        })),
      duplicateScheduleItem: (dayId, itemId) =>
        set((s) => ({
          days: s.days.map((d) => {
            if (d.id !== dayId) return d;
            const found = d.schedule.find((it) => it.id === itemId);
            if (!found) return d;
            const idx = d.schedule.findIndex((it) => it.id === itemId);
            const copy = { ...found, id: uuid() };
            const schedule = [...d.schedule];
            schedule.splice(idx + 1, 0, copy);
            return { ...d, schedule };
          }),
        })),
      moveScheduleItem: (fromDayId, toDayId, itemId, toIndex) =>
        set((s) => {
          const fromDay = s.days.find((d) => d.id === fromDayId);
          if (!fromDay) return s;
          const item = fromDay.schedule.find((it) => it.id === itemId);
          if (!item) return s;
          return {
            days: s.days.map((d) => {
              if (d.id === fromDayId && d.id === toDayId) {
                const withoutItem = d.schedule.filter((it) => it.id !== itemId);
                withoutItem.splice(toIndex, 0, item);
                return { ...d, schedule: withoutItem };
              }
              if (d.id === fromDayId) {
                return { ...d, schedule: d.schedule.filter((it) => it.id !== itemId) };
              }
              if (d.id === toDayId) {
                const schedule = [...d.schedule];
                schedule.splice(toIndex, 0, item);
                return { ...d, schedule };
              }
              return d;
            }),
          };
        }),
      reorderScheduleItem: (dayId, fromIndex, toIndex) =>
        set((s) => ({
          days: s.days.map((d) => {
            if (d.id !== dayId) return d;
            const schedule = [...d.schedule];
            const [moved] = schedule.splice(fromIndex, 1);
            schedule.splice(toIndex, 0, moved);
            return { ...d, schedule };
          }),
        })),

      updateAttraction: (id, partial) =>
        set((s) => ({
          attractions: s.attractions.map((a) =>
            a.id === id ? { ...a, ...partial } : a
          ),
        })),
      toggleAttractionVisited: (id) =>
        set((s) => ({
          attractions: s.attractions.map((a) =>
            a.id === id ? { ...a, visited: !a.visited } : a
          ),
        })),
      toggleAttractionFavorite: (id) =>
        set((s) => ({
          attractions: s.attractions.map((a) =>
            a.id === id ? { ...a, favorite: !a.favorite } : a
          ),
        })),

      addExpense: (expense) =>
        set((s) => ({ expenses: [...s.expenses, { ...expense, id: uuid() }] })),
      updateExpense: (id, partial) =>
        set((s) => ({
          expenses: s.expenses.map((e) => (e.id === id ? { ...e, ...partial } : e)),
        })),
      removeExpense: (id) =>
        set((s) => ({ expenses: s.expenses.filter((e) => e.id !== id) })),

      addPackingItem: (text, category) =>
        set((s) => ({
          packing: [...s.packing, { id: uuid(), text, category, packed: false }],
        })),
      togglePackingItem: (id) =>
        set((s) => ({
          packing: s.packing.map((p) =>
            p.id === id ? { ...p, packed: !p.packed } : p
          ),
        })),
      removePackingItem: (id) =>
        set((s) => ({ packing: s.packing.filter((p) => p.id !== id) })),

      toggleFoodTried: (id) =>
        set((s) => ({
          food: s.food.map((f) => (f.id === id ? { ...f, tried: !f.tried } : f)),
        })),
      addFoodItem: (item) =>
        set((s) => ({ food: [...s.food, { ...item, id: uuid() }] })),
      updateFoodItem: (id, partial) =>
        set((s) => ({
          food: s.food.map((f) => (f.id === id ? { ...f, ...partial } : f)),
        })),
      removeFoodItem: (id) =>
        set((s) => ({ food: s.food.filter((f) => f.id !== id) })),

      updateJournalEntry: (id, partial) =>
        set((s) => ({
          journal: s.journal.map((j) => (j.id === id ? { ...j, ...partial } : j)),
        })),

      addWishlistItem: (item) =>
        set((s) => ({ wishlist: [...s.wishlist, { ...item, id: uuid() }] })),
      updateWishlistItem: (id, partial) =>
        set((s) => ({
          wishlist: s.wishlist.map((w) => (w.id === id ? { ...w, ...partial } : w)),
        })),
      removeWishlistItem: (id) =>
        set((s) => ({ wishlist: s.wishlist.filter((w) => w.id !== id) })),

      updateHotel: (id, partial) =>
        set((s) => ({
          hotels: s.hotels.map((h) => (h.id === id ? { ...h, ...partial } : h)),
        })),

      addTransportLeg: (leg) =>
        set((s) => ({ transport: [...s.transport, { ...leg, id: uuid() }] })),
      updateTransportLeg: (id, partial) =>
        set((s) => ({
          transport: s.transport.map((t) => (t.id === id ? { ...t, ...partial } : t)),
        })),
      removeTransportLeg: (id) =>
        set((s) => ({ transport: s.transport.filter((t) => t.id !== id) })),

      resetTrip: () => set({ ...freshState() }),
    }),
    {
      name: CURRENT_STORAGE_KEY,
      storage: createJSONStorage(() => recoveringStorage),
      skipHydration: true,
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);
