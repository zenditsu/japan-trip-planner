"use client";

import { useTripStore } from "@/lib/store";
import PageHeader from "@/components/ui/PageHeader";
import FadeIn from "@/components/ui/FadeIn";
import { EditableText, EditableTextArea } from "@/components/ui/Editable";
import { formatDateLong } from "@/lib/utils";
import { ExternalLink } from "lucide-react";

export default function HotelsPage() {
  const hotels = useTripStore((s) => s.hotels);
  const updateHotel = useTripStore((s) => s.updateHotel);

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
      <PageHeader
        eyebrow="Where you'll sleep"
        title="Accommodation"
        subtitle="Every hotel stay across the trip — tap any field to edit."
      />

      <div className="grid sm:grid-cols-2 gap-6">
        {hotels.map((h, i) => (
          <FadeIn key={h.id} delay={i * 0.05}>
            <div className="soft-shadow rounded-3xl bg-card border border-[var(--border)] overflow-hidden">
              <div className="relative h-44">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={h.image} alt={h.name} className="w-full h-full object-cover" />
                <span className="absolute bottom-2 left-2 bg-black/60 text-white text-[11px] px-2 py-1 rounded-full">
                  {h.city}
                </span>
              </div>
              <div className="p-5 flex flex-col gap-3">
                <EditableText
                  value={h.name}
                  onSave={(v) => updateHotel(h.id, { name: v })}
                  className="font-display text-lg block"
                />
                <EditableText
                  value={h.address}
                  onSave={(v) => updateHotel(h.id, { address: v })}
                  className="text-xs text-foreground/50 block"
                />
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-[11px] uppercase tracking-wide text-foreground/40 block mb-0.5">
                      Check-in
                    </span>
                    <input
                      type="date"
                      value={h.checkIn}
                      onChange={(e) => updateHotel(h.id, { checkIn: e.target.value })}
                      className="bg-transparent outline-none text-sm"
                    />
                    <div className="text-[11px] text-foreground/40">{formatDateLong(h.checkIn)}</div>
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wide text-foreground/40 block mb-0.5">
                      Check-out
                    </span>
                    <input
                      type="date"
                      value={h.checkOut}
                      onChange={(e) => updateHotel(h.id, { checkOut: e.target.value })}
                      className="bg-transparent outline-none text-sm"
                    />
                    <div className="text-[11px] text-foreground/40">{formatDateLong(h.checkOut)}</div>
                  </div>
                </div>
                <div>
                  <span className="text-[11px] uppercase tracking-wide text-foreground/40 block mb-0.5">
                    Booking confirmation
                  </span>
                  <EditableText
                    value={h.confirmation}
                    onSave={(v) => updateHotel(h.id, { confirmation: v })}
                    className="text-sm font-mono"
                  />
                </div>
                <div>
                  <span className="text-[11px] uppercase tracking-wide text-foreground/40 block mb-0.5">
                    Notes
                  </span>
                  <EditableTextArea
                    value={h.notes}
                    onSave={(v) => updateHotel(h.id, { notes: v })}
                    rows={2}
                    className="text-sm"
                  />
                </div>
                <a
                  href={h.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-accent text-sm font-medium w-fit"
                >
                  <ExternalLink size={14} /> Open in Google Maps
                </a>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
