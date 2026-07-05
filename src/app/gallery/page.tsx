"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTripStore } from "@/lib/store";
import PageHeader from "@/components/ui/PageHeader";
import FadeIn from "@/components/ui/FadeIn";
import ImageGrid from "@/components/ui/ImageGrid";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function GalleryPage() {
  const days = useTripStore((s) => s.days);
  const updateDay = useTripStore((s) => s.updateDay);
  const [lightbox, setLightbox] = useState<{ src: string; index: number } | null>(null);

  const allPhotos = useMemo(
    () => days.flatMap((d) => d.images.map((src) => ({ src, day: d.dayNumber, title: d.title }))),
    [days]
  );

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
      <PageHeader
        eyebrow="Memories"
        title="Photo Gallery"
        subtitle={`${allPhotos.length} photo${allPhotos.length === 1 ? "" : "s"} across the trip. Add photos from any day below.`}
      />

      {allPhotos.length > 0 && (
        <FadeIn>
          <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 mb-14 [column-fill:_balance]">
            {allPhotos.map((p, i) => (
              <button
                key={i}
                onClick={() => setLightbox({ src: p.src, index: i })}
                className="mb-3 block w-full break-inside-avoid rounded-2xl overflow-hidden soft-shadow"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.src} alt={p.title} className="w-full h-auto object-cover hover:scale-[1.03] transition-transform duration-300" />
              </button>
            ))}
          </div>
        </FadeIn>
      )}

      <h2 className="font-display text-2xl mb-6">Add Photos by Day</h2>
      <div className="grid sm:grid-cols-2 gap-5">
        {days.map((d, i) => (
          <FadeIn key={d.id} delay={i * 0.03}>
            <div className="soft-shadow rounded-3xl bg-card border border-[var(--border)] p-5">
              <h3 className="font-display text-base mb-3">
                Day {d.dayNumber} — {d.title}
              </h3>
              <ImageGrid images={d.images} onChange={(v) => updateDay(d.id, { images: v })} />
            </div>
          </FadeIn>
        ))}
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-black/90 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button
              className="absolute top-6 right-6 text-white/70 hover:text-white"
              onClick={() => setLightbox(null)}
            >
              <X size={28} />
            </button>
            <button
              className="absolute left-4 sm:left-8 text-white/70 hover:text-white"
              onClick={(e) => {
                e.stopPropagation();
                const idx = (lightbox.index - 1 + allPhotos.length) % allPhotos.length;
                setLightbox({ src: allPhotos[idx].src, index: idx });
              }}
            >
              <ChevronLeft size={32} />
            </button>
            <motion.img
              key={lightbox.src}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              src={lightbox.src}
              alt=""
              className="max-h-[85vh] max-w-[85vw] rounded-xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              className="absolute right-4 sm:right-8 text-white/70 hover:text-white"
              onClick={(e) => {
                e.stopPropagation();
                const idx = (lightbox.index + 1) % allPhotos.length;
                setLightbox({ src: allPhotos[idx].src, index: idx });
              }}
            >
              <ChevronRight size={32} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
