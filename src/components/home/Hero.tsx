"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTripStore } from "@/lib/store";
import { formatDateLong } from "@/lib/utils";

const IMAGES = [
  "https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?q=80&w=2069&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522383225653-ed111181a951?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2069&auto=format&fit=crop",
];

function useCountdown(target: string) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    // Client-only: seed the real clock post-mount so SSR and first paint agree (both render "--").
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (now === null) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, arrived: false, ready: false };
  }

  const diff = Math.max(0, new Date(target + "T00:00:00").getTime() - now);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return { days, hours, minutes, seconds, arrived: diff <= 0, ready: true };
}

export default function Hero() {
  const settings = useTripStore((s) => s.settings);
  const countdown = useCountdown(settings.departureDate);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const [imgIndex, setImgIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setImgIndex((i) => (i + 1) % IMAGES.length), 6000);
    return () => clearInterval(id);
  }, []);

  return (
    <div ref={ref} className="relative h-[92vh] min-h-[640px] w-full overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-0">
        {IMAGES.map((src, i) => (
          <motion.img
            key={src}
            src={src}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            initial={false}
            animate={{ opacity: i === imgIndex ? 1 : 0 }}
            transition={{ duration: 1.4, ease: "easeInOut" }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/50" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4"
      >
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-white/80 tracking-[0.3em] text-xs sm:text-sm uppercase mb-4"
        >
          {formatDateLong(settings.departureDate)} — {formatDateLong(settings.returnDate)}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15 }}
          className="font-display text-white text-4xl sm:text-6xl md:text-7xl leading-tight drop-shadow-lg"
        >
          🇯🇵 {settings.tripTitle}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="text-white/90 text-lg sm:text-xl mt-4 tracking-wide"
        >
          15 Days • Kyoto • Osaka • Tokyo
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.45 }}
          className="mt-10 glass soft-shadow rounded-3xl px-4 sm:px-8 py-5 flex items-center gap-3 sm:gap-6"
        >
          {countdown.ready && countdown.arrived ? (
            <span className="text-white text-lg px-4">You&rsquo;re in Japan! 🎉</span>
          ) : (
            [
              { label: "Days", value: countdown.days },
              { label: "Hours", value: countdown.hours },
              { label: "Minutes", value: countdown.minutes },
              { label: "Seconds", value: countdown.seconds },
            ].map((unit) => (
              <div key={unit.label} className="flex flex-col items-center min-w-[54px]">
                <span className="text-white font-display text-2xl sm:text-4xl tabular-nums">
                  {countdown.ready ? String(unit.value).padStart(2, "0") : "--"}
                </span>
                <span className="text-white/60 text-[10px] sm:text-xs uppercase tracking-widest mt-1">
                  {unit.label}
                </span>
              </div>
            ))
          )}
        </motion.div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-white/70 text-xs tracking-widest uppercase"
      >
        Scroll ↓
      </motion.div>
    </div>
  );
}
