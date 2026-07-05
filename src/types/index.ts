export type CityName = "Tokyo" | "Kyoto" | "Osaka";
export type Priority = "low" | "medium" | "high";
export type ScheduleCategory =
  | "food"
  | "sight"
  | "transport"
  | "shopping"
  | "rest"
  | "other";

export interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

export interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  category: ScheduleCategory;
  duration: string;
  notes: string;
  color: string;
}

export interface WeatherInfo {
  icon: string;
  tempHigh: number;
  tempLow: number;
  condition: string;
}

export interface DayPlan {
  id: string;
  dayNumber: number;
  date: string;
  title: string;
  city: CityName | "Travel";
  hotel: string;
  weather: WeatherInfo;
  walkingDistanceKm: number;
  budgetJPY: number;
  notes: string;
  hiddenNotes: string;
  priority: Priority;
  checklist: ChecklistItem[];
  images: string[];
  transportation: string;
  travelTime: string;
  schedule: ScheduleItem[];
  restaurants: string[];
  shopping: string[];
  mapQuery: string;
}

export interface Attraction {
  id: string;
  name: string;
  city: CityName;
  image: string;
  emoji: string;
  description: string;
  rating: number;
  visitDuration: string;
  openingHours: string;
  cost: string;
  nearbyRestaurants: string[];
  nearbyCafes: string[];
  nearestStation: string;
  website: string;
  notes: string;
  visited: boolean;
  favorite: boolean;
  lat: number;
  lng: number;
}

export type ExpenseCategory =
  | "Hotels"
  | "Flights"
  | "Food"
  | "Shopping"
  | "Transportation"
  | "Entertainment"
  | "Miscellaneous";

export interface ExpenseItem {
  id: string;
  category: ExpenseCategory;
  description: string;
  amountJPY: number;
  date: string;
  paid: boolean;
}

export interface PackingItem {
  id: string;
  text: string;
  packed: boolean;
  category: string;
}

export interface FoodItem {
  id: string;
  name: string;
  emoji: string;
  description: string;
  tried: boolean;
}

export interface JournalEntry {
  id: string;
  dayId: string;
  date: string;
  title: string;
  text: string;
  mood: string;
  photos: string[];
}

export interface WishlistItem {
  id: string;
  name: string;
  city: string;
  priority: Priority;
  favorite: boolean;
  notes: string;
}

export interface HotelBooking {
  id: string;
  city: CityName;
  name: string;
  image: string;
  address: string;
  checkIn: string;
  checkOut: string;
  mapsUrl: string;
  confirmation: string;
  notes: string;
}

export type TransportType = "shinkansen" | "metro" | "bus" | "flight" | "walk";

export interface TransportLeg {
  id: string;
  type: TransportType;
  from: string;
  to: string;
  date: string;
  time: string;
  duration: string;
  notes: string;
  costJPY: number;
}

export interface TripSettings {
  tripTitle: string;
  departureDate: string;
  returnDate: string;
  icCardBalance: number;
  jrPassActive: boolean;
  jrPassExpiry: string;
  walkingOverrideKm: number | null;
}
