export const CUISINE_ANY = "i dunno, you suggest" as const;
export const AREA_ANY = "Anywhere" as const;

export const CUISINES = [
  CUISINE_ANY,
  "Chinese",
  "Japanese",
  "Korean",
  "Thai",
  "Vietnamese",
  "Indian",
  "Malay",
  "Indonesian",
  "Local",
  "Western",
  "Italian",
  "French",
  "Spanish",
  "Mexican",
  "African",
  "Seafood",
  "Cafe",
  "Dessert",
  "BBQ",
  "Hotpot",
  "Middle Eastern",
  "Pizza",
  "Burgers",
  "Bar",
  "Fusion",
] as const;

export const AREAS = [
  AREA_ANY,
  "CBD",
  "City Hall",
  "Orchard / Great World",
  "Bugis / Arab Street",
  "Jalan Besar",
  "Chinatown / Tanjong Pagar",
  "Clarke Quay / Robertson Quay",
  "Mohd Sultan",
  "Alexandra",
  "Dempsey / Holland Village",
  "East Coast / Katong",
  "Geylang",
  "Tiong Bahru",
  "Novena / Thomson",
  "Thomson",
  "Sentosa",
  "Near Hougang",
  "West",
] as const;

export type Cuisine = (typeof CUISINES)[number];
export type Area = (typeof AREAS)[number];

export const SHEET_URLS = {
  favorites: process.env.NEXT_PUBLIC_SHEET_FAVORITES_URL ?? "",
  wantToGo: process.env.NEXT_PUBLIC_SHEET_WANT_TO_GO_URL ?? "",
};

export const PERSON_1_NAME = process.env.NEXT_PUBLIC_PERSON_1_NAME ?? "Person 1";
export const PERSON_2_NAME = process.env.NEXT_PUBLIC_PERSON_2_NAME ?? "Person 2";
