"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useTripStore } from "@/lib/store";
import GlobalSearch from "@/components/search/GlobalSearch";
import BackupControls from "@/components/layout/BackupControls";
import { Moon, Sun, Search, Menu, X } from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Overview" },
  { href: "/timeline", label: "Timeline" },
  { href: "/map", label: "Map" },
  { href: "/calendar", label: "Calendar" },
  { href: "/budget", label: "Budget" },
  { href: "/packing", label: "Packing" },
  { href: "/food", label: "Food" },
  { href: "/gallery", label: "Gallery" },
  { href: "/journal", label: "Journal" },
  { href: "/transport", label: "Transport" },
  { href: "/hotels", label: "Hotels" },
  { href: "/wishlist", label: "Wishlist" },
];

export default function NavBar() {
  const pathname = usePathname();
  const darkMode = useTripStore((s) => s.darkMode);
  const toggleDarkMode = useTripStore((s) => s.toggleDarkMode);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="no-print sticky top-0 z-50 glass">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <span className="text-xl group-hover:animate-bounce">🌸</span>
            <span className="font-display text-lg tracking-tight hidden sm:block">
              Japan<span className="text-accent">.</span>
            </span>
          </Link>

          <nav className="hidden md:flex flex-1 items-center gap-1 overflow-x-auto custom-scroll">
            {NAV_ITEMS.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative whitespace-nowrap px-3 py-1.5 rounded-full text-sm transition-colors ${
                    active
                      ? "bg-[var(--accent)] text-white"
                      : "hover:bg-black/5 dark:hover:bg-white/10 text-foreground/80"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex-1 md:hidden" />

          <BackupControls />
          <button
            onClick={() => setSearchOpen(true)}
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            aria-label="Search"
          >
            <Search size={18} />
          </button>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors md:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {mobileOpen && (
          <nav className="md:hidden px-4 pb-3 flex flex-wrap gap-2">
            {NAV_ITEMS.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`whitespace-nowrap px-3 py-1.5 rounded-full text-sm transition-colors ${
                    active
                      ? "bg-[var(--accent)] text-white"
                      : "bg-black/5 dark:bg-white/10 text-foreground/80"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        )}
      </header>

      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
