"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTripStore } from "@/lib/store";
import { EditableText, EditableTextArea, EditableNumber } from "@/components/ui/Editable";
import TagList from "@/components/ui/TagList";
import { googleMapsSearchUrl } from "@/lib/utils";
import { Star, CheckCircle2, ExternalLink, ChevronDown, MapPinned } from "lucide-react";

export default function AttractionCard({ id }: { id: string }) {
  const attraction = useTripStore((s) => s.attractions.find((a) => a.id === id));
  const updateAttraction = useTripStore((s) => s.updateAttraction);
  const toggleVisited = useTripStore((s) => s.toggleAttractionVisited);
  const toggleFavorite = useTripStore((s) => s.toggleAttractionFavorite);
  const [open, setOpen] = useState(false);

  if (!attraction) return null;

  return (
    <div className="soft-shadow rounded-3xl bg-card border border-[var(--border)] overflow-hidden">
      <div className="relative h-40">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={attraction.image} alt={attraction.name} className="w-full h-full object-cover" />
        <button
          onClick={() => toggleFavorite(attraction.id)}
          className={`absolute top-2 right-2 rounded-full p-1.5 ${
            attraction.favorite ? "bg-accent text-white" : "bg-white/80 text-black"
          }`}
        >
          <Star size={14} className={attraction.favorite ? "fill-white" : ""} />
        </button>
        <span className="absolute bottom-2 left-2 bg-black/60 text-white text-[11px] px-2 py-1 rounded-full">
          {attraction.city}
        </span>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg leading-tight">
            {attraction.emoji} {attraction.name}
          </h3>
          <button onClick={() => setOpen((v) => !v)} className="shrink-0">
            <motion.span animate={{ rotate: open ? 180 : 0 }} className="block text-foreground/40">
              <ChevronDown size={18} />
            </motion.span>
          </button>
        </div>
        <p className="text-xs text-foreground/50 mt-1 line-clamp-2">{attraction.description}</p>
        <div className="flex items-center gap-3 mt-3 text-xs">
          <span className="flex items-center gap-1">
            <Star size={12} className="fill-amber-400 text-amber-400" /> {attraction.rating}
          </span>
          <button
            onClick={() => toggleVisited(attraction.id)}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${
              attraction.visited ? "bg-emerald-500/15 text-emerald-600" : "bg-black/5 dark:bg-white/10"
            }`}
          >
            <CheckCircle2 size={12} /> {attraction.visited ? "Visited" : "Not yet"}
          </button>
        </div>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-4 mt-4 border-t border-[var(--border)] flex flex-col gap-3 text-sm">
                <div>
                  <span className="text-[11px] uppercase tracking-wide text-foreground/40 block mb-1">
                    Description
                  </span>
                  <EditableTextArea
                    value={attraction.description}
                    onSave={(v) => updateAttraction(attraction.id, { description: v })}
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[11px] uppercase tracking-wide text-foreground/40 block mb-1">
                      Rating
                    </span>
                    <EditableNumber
                      value={attraction.rating}
                      onSave={(v) => updateAttraction(attraction.id, { rating: v })}
                    />
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wide text-foreground/40 block mb-1">
                      Visit duration
                    </span>
                    <EditableText
                      value={attraction.visitDuration}
                      onSave={(v) => updateAttraction(attraction.id, { visitDuration: v })}
                    />
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wide text-foreground/40 block mb-1">
                      Opening hours
                    </span>
                    <EditableText
                      value={attraction.openingHours}
                      onSave={(v) => updateAttraction(attraction.id, { openingHours: v })}
                    />
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wide text-foreground/40 block mb-1">
                      Cost
                    </span>
                    <EditableText
                      value={attraction.cost}
                      onSave={(v) => updateAttraction(attraction.id, { cost: v })}
                    />
                  </div>
                </div>
                <div>
                  <span className="text-[11px] uppercase tracking-wide text-foreground/40 block mb-1 flex items-center gap-1">
                    <MapPinned size={11} /> Nearest station
                  </span>
                  <EditableText
                    value={attraction.nearestStation}
                    onSave={(v) => updateAttraction(attraction.id, { nearestStation: v })}
                  />
                </div>
                <div>
                  <span className="text-[11px] uppercase tracking-wide text-foreground/40 block mb-1">
                    Nearby restaurants
                  </span>
                  <TagList
                    items={attraction.nearbyRestaurants}
                    onChange={(v) => updateAttraction(attraction.id, { nearbyRestaurants: v })}
                  />
                </div>
                <div>
                  <span className="text-[11px] uppercase tracking-wide text-foreground/40 block mb-1">
                    Nearby cafés
                  </span>
                  <TagList
                    items={attraction.nearbyCafes}
                    onChange={(v) => updateAttraction(attraction.id, { nearbyCafes: v })}
                  />
                </div>
                <div>
                  <span className="text-[11px] uppercase tracking-wide text-foreground/40 block mb-1">
                    Website
                  </span>
                  <EditableText
                    value={attraction.website}
                    onSave={(v) => updateAttraction(attraction.id, { website: v })}
                    className="text-accent"
                  />
                </div>
                <div>
                  <span className="text-[11px] uppercase tracking-wide text-foreground/40 block mb-1">
                    Personal notes
                  </span>
                  <EditableTextArea
                    value={attraction.notes}
                    placeholder="Add your own notes…"
                    onSave={(v) => updateAttraction(attraction.id, { notes: v })}
                    rows={2}
                  />
                </div>
                <a
                  href={googleMapsSearchUrl(`${attraction.name} ${attraction.city}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-accent text-sm font-medium"
                >
                  <ExternalLink size={14} /> Open in Google Maps
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
