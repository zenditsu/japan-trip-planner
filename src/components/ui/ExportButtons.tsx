"use client";

import { useState } from "react";
import { Download, Printer, Loader2 } from "lucide-react";
import { exportElementToPdf } from "@/lib/pdfExport";

export default function ExportButtons({
  targetRef,
  filename,
}: {
  targetRef: React.RefObject<HTMLElement | null>;
  filename: string;
}) {
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex items-center gap-2 no-print">
      <button
        onClick={() => window.print()}
        className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] px-3.5 py-2 text-xs font-medium hover:bg-black/5 dark:hover:bg-white/10"
      >
        <Printer size={14} /> Print
      </button>
      <button
        disabled={loading}
        onClick={async () => {
          if (!targetRef.current) return;
          setLoading(true);
          try {
            await exportElementToPdf(targetRef.current, filename);
          } catch (err) {
            console.error("PDF export failed:", err);
            alert("Sorry, the PDF export failed. Please try again.");
          } finally {
            setLoading(false);
          }
        }}
        className="inline-flex items-center gap-1.5 rounded-full bg-accent text-white px-3.5 py-2 text-xs font-medium hover:opacity-90 disabled:opacity-60"
      >
        {loading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
        Export PDF
      </button>
    </div>
  );
}
