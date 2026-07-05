"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useTripStore } from "@/lib/store";
import { Search, X, MapPin, Utensils, Calendar, Heart } from "lucide-react";

interface Result {
  id: string;
  type: "Day" | "Attraction" | "Restaurant" | "Note" | "Wishlist" | "City";
  title: string;
  subtitle: string;
  href: string;
}

export default function GlobalSearch({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const days = useTripStore((s) => s.days);
  const attractions = useTripStore((s) => s.attractions);
  const wishlist = useTripStore((s) => s.wishlist);
  const router = useRouter();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!open) setQuery("");
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const results = useMemo<Result[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const out: Result[] = [];

    days.forEach((d) => {
      const hay = `${d.title} ${d.notes} ${d.city} ${d.hotel}`.toLowerCase();
      if (hay.includes(q)) {
        out.push({
          id: d.id,
          type: "Day",
          title: `Day ${d.dayNumber}: ${d.title}`,
          subtitle: d.city,
          href: `/timeline#day-${d.dayNumber}`,
        });
      }
      d.restaurants.forEach((r) => {
        if (r.toLowerCase().includes(q)) {
          out.push({
            id: `${d.id}-${r}`,
            type: "Restaurant",
            title: r,
            subtitle: `Day ${d.dayNumber} · ${d.city}`,
            href: `/timeline#day-${d.dayNumber}`,
          });
        }
      });
    });

    attractions.forEach((a) => {
      const hay = `${a.name} ${a.description} ${a.city}`.toLowerCase();
      if (hay.includes(q)) {
        out.push({
          id: a.id,
          type: "Attraction",
          title: a.name,
          subtitle: a.city,
          href: `/map`,
        });
      }
    });

    wishlist.forEach((w) => {
      if (`${w.name} ${w.city} ${w.notes}`.toLowerCase().includes(q)) {
        out.push({
          id: w.id,
          type: "Wishlist",
          title: w.name,
          subtitle: w.city,
          href: `/wishlist`,
        });
      }
    });

    ["Tokyo", "Kyoto", "Osaka"].forEach((city) => {
      if (city.toLowerCase().includes(q)) {
        out.push({
          id: city,
          type: "City",
          title: city,
          subtitle: "City",
          href: `/timeline`,
        });
      }
    });

    return out.slice(0, 20);
  }, [query, days, attractions, wishlist]);

  const icon = (t: Result["type"]) => {
    switch (t) {
      case "Attraction":
        return <MapPin size={14} />;
      case "Restaurant":
        return <Utensils size={14} />;
      case "Wishlist":
        return <Heart size={14} />;
      default:
        return <Calendar size={14} />;
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-start justify-center pt-24 px-4 bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ type: "spring", damping: 24, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl glass soft-shadow rounded-3xl overflow-hidden"
          >
            <div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--border)]">
              <Search size={18} className="opacity-50" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search days, attractions, restaurants, cities…"
                className="flex-1 bg-transparent outline-none text-base placeholder:text-foreground/40"
              />
              <button onClick={onClose} className="p-1 opacity-60 hover:opacity-100">
                <X size={18} />
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto custom-scroll">
              {query && results.length === 0 && (
                <p className="px-5 py-8 text-center text-sm text-foreground/50">
                  No results for &ldquo;{query}&rdquo;
                </p>
              )}
              {results.map((r) => (
                <button
                  key={`${r.type}-${r.id}`}
                  onClick={() => {
                    router.push(r.href);
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 px-5 py-3 hover:bg-black/5 dark:hover:bg-white/10 text-left transition-colors"
                >
                  <span className="text-accent">{icon(r.type)}</span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm font-medium truncate">
                      {r.title}
                    </span>
                    <span className="block text-xs text-foreground/50">
                      {r.type} · {r.subtitle}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
