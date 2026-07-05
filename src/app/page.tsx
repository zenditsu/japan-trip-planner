import Hero from "@/components/home/Hero";
import StatsGrid from "@/components/home/StatsGrid";
import ProgressTracker from "@/components/home/ProgressTracker";
import WeatherStrip from "@/components/home/WeatherStrip";
import ExploreGrid from "@/components/home/ExploreGrid";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <StatsGrid />
      <ProgressTracker />
      <WeatherStrip />
      <ExploreGrid />
    </div>
  );
}
