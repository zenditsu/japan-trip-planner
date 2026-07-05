"use client";

import { useEffect } from "react";
import { useTripStore } from "@/lib/store";

export default function HydrationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const hydrated = useTripStore((s) => s.hydrated);
  const darkMode = useTripStore((s) => s.darkMode);

  useEffect(() => {
    useTripStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <>
      {!hydrated && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-white dark:bg-black">
          <div className="flex flex-col items-center gap-4">
            <div className="text-4xl animate-bounce">🌸</div>
            <p className="text-sm tracking-widest uppercase text-black/50 dark:text-white/50">
              Preparing your journey…
            </p>
          </div>
        </div>
      )}
      {children}
    </>
  );
}
