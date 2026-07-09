"use client";

import { useRef } from "react";
import { Download, Upload } from "lucide-react";
import { useTripStore } from "@/lib/store";

export default function BackupControls() {
  const inputRef = useRef<HTMLInputElement>(null);
  const restoreFromBackup = useTripStore((s) => s.restoreFromBackup);

  function handleExport() {
    const s = useTripStore.getState();
    const payload = {
      darkMode: s.darkMode,
      settings: s.settings,
      days: s.days,
      attractions: s.attractions,
      expenses: s.expenses,
      packing: s.packing,
      food: s.food,
      journal: s.journal,
      wishlist: s.wishlist,
      hotels: s.hotels,
      transport: s.transport,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `japan-trip-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string);
        if (!data || typeof data !== "object" || !Array.isArray(data.days)) {
          throw new Error("Missing days array");
        }
        restoreFromBackup(data);
        alert("Backup restored! Your data is now up to date on this site.");
      } catch {
        alert("Couldn't read that file — make sure it's a backup exported from this app.");
      }
    };
    reader.readAsText(file);
  }

  return (
    <>
      <button
        onClick={handleExport}
        title="Download a backup of your trip data"
        className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
      >
        <Download size={18} />
      </button>
      <button
        onClick={() => inputRef.current?.click()}
        title="Restore trip data from a backup file"
        className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
      >
        <Upload size={18} />
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={handleFileChange}
      />
    </>
  );
}
