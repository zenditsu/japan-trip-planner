"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { divIcon } from "leaflet";
import { useEffect } from "react";
import { useTripStore } from "@/lib/store";
import { googleMapsSearchUrl } from "@/lib/utils";
import { Star, CheckCircle2, ExternalLink, Clock, Ticket } from "lucide-react";
import type { Attraction } from "@/types";

const CITY_CENTERS: { name: string; lat: number; lng: number }[] = [
  { name: "Tokyo", lat: 35.6762, lng: 139.6503 },
  { name: "Kyoto", lat: 35.0116, lng: 135.7681 },
  { name: "Osaka", lat: 34.6937, lng: 135.5023 },
];

function cityIcon() {
  return divIcon({
    html: `<div style="background:#E60026;color:white;border-radius:9999px;width:34px;height:34px;display:flex;align-items:center;justify-content:center;font-size:16px;box-shadow:0 4px 12px rgba(0,0,0,0.35);border:2px solid white;">🏯</div>`,
    className: "",
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  });
}

function attractionIcon(emoji: string, favorite: boolean) {
  return divIcon({
    html: `<div style="background:${
      favorite ? "#E60026" : "white"
    };color:${favorite ? "white" : "#16130f"};border-radius:9999px;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:14px;box-shadow:0 3px 8px rgba(0,0,0,0.3);border:2px solid ${
      favorite ? "white" : "#E60026"
    };">${emoji}</div>`,
    className: "",
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

function FitBounds({ points }: { points: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length > 0) {
      map.fitBounds(points, { padding: [40, 40] });
    }
  }, [map, points]);
  return null;
}

function AttractionPopup({ attraction }: { attraction: Attraction }) {
  const toggleVisited = useTripStore((s) => s.toggleAttractionVisited);
  const toggleFavorite = useTripStore((s) => s.toggleAttractionFavorite);

  return (
    <div className="w-60">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={attraction.image}
        alt={attraction.name}
        className="w-full h-28 object-cover rounded-lg mb-2"
      />
      <h3 className="font-display text-base leading-tight mb-1">
        {attraction.emoji} {attraction.name}
      </h3>
      <p className="text-xs text-black/60 mb-2">{attraction.description}</p>
      <div className="flex items-center gap-2 text-xs text-black/70 mb-1">
        <Star size={12} className="fill-amber-400 text-amber-400" /> {attraction.rating}
        <span>·</span>
        <Clock size={12} /> {attraction.visitDuration}
      </div>
      <div className="flex items-center gap-1 text-xs text-black/70 mb-1">
        <Clock size={12} /> {attraction.openingHours}
      </div>
      <div className="flex items-center gap-1 text-xs text-black/70 mb-2">
        <Ticket size={12} /> {attraction.cost}
      </div>
      <div className="flex items-center gap-2 mb-2">
        <button
          onClick={() => toggleVisited(attraction.id)}
          className={`text-[11px] px-2 py-1 rounded-full flex items-center gap-1 ${
            attraction.visited ? "bg-emerald-500 text-white" : "bg-black/5"
          }`}
        >
          <CheckCircle2 size={12} /> {attraction.visited ? "Visited" : "Mark visited"}
        </button>
        <button
          onClick={() => toggleFavorite(attraction.id)}
          className={`text-[11px] px-2 py-1 rounded-full flex items-center gap-1 ${
            attraction.favorite ? "bg-accent text-white" : "bg-black/5"
          }`}
        >
          <Star size={12} /> Favorite
        </button>
      </div>
      <a
        href={googleMapsSearchUrl(attraction.name + " " + attraction.city)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-xs text-accent font-medium"
      >
        <ExternalLink size={12} /> Open in Google Maps
      </a>
    </div>
  );
}

export default function JapanMap({ cityFilter }: { cityFilter: string }) {
  const attractions = useTripStore((s) => s.attractions);
  const filtered =
    cityFilter === "All" ? attractions : attractions.filter((a) => a.city === cityFilter);
  const points: [number, number][] =
    cityFilter === "All"
      ? CITY_CENTERS.map((c) => [c.lat, c.lng] as [number, number])
      : filtered.map((a) => [a.lat, a.lng] as [number, number]);

  return (
    <MapContainer
      center={[35.9, 137.5]}
      zoom={6}
      scrollWheelZoom
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds points={points} />
      {(cityFilter === "All") &&
        CITY_CENTERS.map((c) => (
          <Marker key={c.name} position={[c.lat, c.lng]} icon={cityIcon()}>
            <Popup>
              <div className="font-medium">{c.name}</div>
            </Popup>
          </Marker>
        ))}
      {filtered.map((a) => (
        <Marker
          key={a.id}
          position={[a.lat, a.lng]}
          icon={attractionIcon(a.emoji, a.favorite)}
        >
          <Popup>
            <AttractionPopup attraction={a} />
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
