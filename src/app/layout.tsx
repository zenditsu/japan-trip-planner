import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import HydrationProvider from "@/components/providers/HydrationProvider";
import NavBar from "@/components/layout/NavBar";
import SakuraPetals from "@/components/layout/SakuraPetals";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Japan Adventure 2026",
  description: "A 15-day Japan trip planner — Kyoto, Osaka, Tokyo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col relative">
        <HydrationProvider>
          <SakuraPetals />
          <NavBar />
          <main className="flex-1">{children}</main>
          <footer className="no-print border-t border-[var(--border)] py-8 text-center text-xs text-foreground/40">
            Made with 🌸 for a 15-day journey through Kyoto, Osaka &amp; Tokyo.
          </footer>
        </HydrationProvider>
      </body>
    </html>
  );
}
