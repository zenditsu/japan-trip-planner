export function formatJPY(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDateLong(dateISO: string): string {
  const d = new Date(dateISO + "T00:00:00");
  if (Number.isNaN(d.getTime())) return dateISO;
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateShort(dateISO: string): string {
  const d = new Date(dateISO + "T00:00:00");
  if (Number.isNaN(d.getTime())) return dateISO;
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function addDaysToDate(baseISO: string, offset: number): string {
  const d = new Date(baseISO + "T00:00:00");
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
}

export function googleMapsSearchUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    query
  )}`;
}

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export const CITY_COLORS: Record<string, string> = {
  Tokyo: "#E60026",
  Kyoto: "#B8860B",
  Osaka: "#0F6E5A",
  Travel: "#555555",
};

export const EXPENSE_CATEGORY_COLORS: Record<string, string> = {
  Hotels: "#E60026",
  Flights: "#2C6EAA",
  Food: "#E67E22",
  Shopping: "#8E44AD",
  Transportation: "#16A085",
  Entertainment: "#D4A017",
  Miscellaneous: "#7F8C8D",
};

export const CATEGORY_COLORS: Record<string, string> = {
  food: "#E67E22",
  sight: "#E60026",
  transport: "#2C6EAA",
  shopping: "#8E44AD",
  rest: "#16A085",
  other: "#7F8C8D",
};
