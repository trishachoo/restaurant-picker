import Papa from "papaparse";

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  area: string;
  address: string;
  notes: string;
  rating?: string;
  addedBy?: string;
  source: "favorites" | "wantToGo" | "local";
}

function generateId(name: string, source: string): string {
  return `${source}-${name.toLowerCase().replace(/\s+/g, "-")}`;
}

async function fetchCsv(url: string): Promise<string> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch CSV: ${res.status}`);
  return res.text();
}

export async function fetchFavorites(url: string): Promise<Restaurant[]> {
  if (!url) return [];
  try {
    const csv = await fetchCsv(url);
    const result = Papa.parse<Record<string, string>>(csv, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => h.trim().toLowerCase().replace(/\s+/g, "_"),
    });
    return result.data.map((row) => ({
      id: generateId(row.name ?? "", "fav"),
      name: row.name?.trim() ?? "",
      cuisine: row.cuisine?.trim() ?? "",
      area: row.area?.trim() ?? "",
      address: row.address?.trim() ?? "",
      notes: row.notes?.trim() ?? "",
      rating: row.our_rating?.trim() ?? "",
      source: "favorites" as const,
    })).filter((r) => r.name);
  } catch {
    return [];
  }
}

export async function fetchWantToGo(url: string): Promise<Restaurant[]> {
  if (!url) return [];
  try {
    const csv = await fetchCsv(url);
    const result = Papa.parse<Record<string, string>>(csv, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => h.trim().toLowerCase().replace(/\s+/g, "_"),
    });
    return result.data.map((row) => ({
      id: generateId(row.name ?? "", "wtg"),
      name: row.name?.trim() ?? "",
      cuisine: row.cuisine?.trim() ?? "",
      area: row.area?.trim() ?? "",
      address: row.address?.trim() ?? "",
      notes: row.notes?.trim() ?? "",
      addedBy: row.added_by?.trim() ?? "",
      source: "wantToGo" as const,
    })).filter((r) => r.name);
  } catch {
    return [];
  }
}
