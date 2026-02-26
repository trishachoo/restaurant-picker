import { Restaurant } from "./sheets";
import { CUISINE_ANY, AREA_ANY } from "./constants";

export interface Filters {
  cuisines: string[];
  areas: string[];
}

export function applyFilters(restaurants: Restaurant[], filters: Filters): Restaurant[] {
  return restaurants.filter((r) => {
    const cuisineMatch =
      filters.cuisines.length === 0 ||
      filters.cuisines.includes(CUISINE_ANY) ||
      filters.cuisines.some((c) => r.cuisine.toLowerCase() === c.toLowerCase());
    const areaMatch =
      filters.areas.length === 0 ||
      filters.areas.includes(AREA_ANY) ||
      filters.areas.some((a) => r.area.toLowerCase() === a.toLowerCase());
    return cuisineMatch && areaMatch;
  });
}

export function getLocalRestaurants(): Restaurant[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem("wantToGo");
    if (!stored) return [];
    return JSON.parse(stored) as Restaurant[];
  } catch {
    return [];
  }
}

export function saveLocalRestaurant(
  restaurant: Omit<Restaurant, "id" | "source">,
  source: "favorites" | "wantToGo" = "wantToGo"
): void {
  const existing = getLocalRestaurants();
  const newEntry: Restaurant = {
    ...restaurant,
    id: `local-${Date.now()}`,
    source,
  };
  localStorage.setItem("wantToGo", JSON.stringify([...existing, newEntry]));
  localStorage.removeItem("restaurantCache");
}

export function updateLocalRestaurant(id: string, updates: Partial<Omit<Restaurant, "id">>): void {
  const existing = getLocalRestaurants();
  const updated = existing.map((r) => r.id === id ? { ...r, ...updates } as Restaurant : r);
  localStorage.setItem("wantToGo", JSON.stringify(updated));
  localStorage.removeItem("restaurantCache");
}

export function deleteLocalRestaurant(id: string): void {
  const existing = getLocalRestaurants();
  localStorage.setItem("wantToGo", JSON.stringify(existing.filter((r) => r.id !== id)));
  localStorage.removeItem("restaurantCache");
}

export function dedupeRestaurants(restaurants: Restaurant[]): Restaurant[] {
  const seen = new Set<string>();
  return restaurants.filter((r) => {
    const key = r.name.toLowerCase().trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export interface SwipePick {
  id: string;
  liked: boolean;
}

export function getMutualMatches(
  restaurants: Restaurant[],
  person1Picks: SwipePick[],
  person2Picks: SwipePick[]
): Restaurant[] {
  const p1Yes = new Set(person1Picks.filter((p) => p.liked).map((p) => p.id));
  const p2Yes = new Set(person2Picks.filter((p) => p.liked).map((p) => p.id));
  return restaurants.filter((r) => p1Yes.has(r.id) && p2Yes.has(r.id));
}

export function pickWinner(matches: Restaurant[]): Restaurant | null {
  if (matches.length === 0) return null;
  return matches[Math.floor(Math.random() * matches.length)];
}
