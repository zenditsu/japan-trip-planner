import Link from "next/link";
import FadeIn from "@/components/ui/FadeIn";

const LINKS = [
  { href: "/timeline", emoji: "🗓️", title: "Timeline", desc: "All 15 days, fully editable" },
  { href: "/map", emoji: "🗺️", title: "Map", desc: "Every attraction pinned" },
  { href: "/calendar", emoji: "📅", title: "Calendar", desc: "Month, week, kanban views" },
  { href: "/budget", emoji: "💴", title: "Budget", desc: "Track every yen" },
  { href: "/packing", emoji: "🎒", title: "Packing", desc: "Never forget the essentials" },
  { href: "/food", emoji: "🍣", title: "Food Bucket List", desc: "10 dishes to try" },
  { href: "/gallery", emoji: "📸", title: "Gallery", desc: "Photos from every day" },
  { href: "/journal", emoji: "📖", title: "Journal", desc: "Your daily diary" },
  { href: "/transport", emoji: "🚄", title: "Transport", desc: "Trains, metro, IC card" },
  { href: "/hotels", emoji: "🏨", title: "Hotels", desc: "Every stay, at a glance" },
  { href: "/wishlist", emoji: "💫", title: "Wishlist", desc: "Places still to add" },
];

export default function ExploreGrid() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-20">
      <FadeIn>
        <h2 className="font-display text-2xl sm:text-3xl mb-8 text-center">
          Explore Your Trip
        </h2>
      </FadeIn>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {LINKS.map((l, i) => (
          <FadeIn key={l.href} delay={i * 0.04}>
            <Link
              href={l.href}
              className="group block soft-shadow rounded-3xl bg-card border border-[var(--border)] p-5 h-full hover:-translate-y-1.5 hover:border-accent/40 transition-all duration-300"
            >
              <span className="text-3xl block mb-3 group-hover:scale-110 transition-transform origin-left">
                {l.emoji}
              </span>
              <div className="font-medium">{l.title}</div>
              <div className="text-xs text-foreground/50 mt-1">{l.desc}</div>
            </Link>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
