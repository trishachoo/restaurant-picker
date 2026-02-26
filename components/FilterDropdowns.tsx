"use client";

import { CUISINES, AREAS, Cuisine, Area } from "@/lib/constants";
import { ChevronDown } from "lucide-react";

interface FilterDropdownsProps {
  cuisine: Cuisine | "";
  area: Area | "";
  onCuisineChange: (v: Cuisine) => void;
  onAreaChange: (v: Area) => void;
}

export default function FilterDropdowns({
  cuisine,
  area,
  onCuisineChange,
  onAreaChange,
}: FilterDropdownsProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label
          htmlFor="cuisine-select"
          className="text-sm font-semibold text-foreground"
        >
          Cuisine
        </label>
        <div className="relative">
          <select
            id="cuisine-select"
            value={cuisine}
            onChange={(e) => onCuisineChange(e.target.value as Cuisine)}
            className="w-full appearance-none bg-card border border-border rounded-xl px-4 py-3 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
          >
            <option value="" disabled>
              Choose a cuisine...
            </option>
            {CUISINES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="area-select"
          className="text-sm font-semibold text-foreground"
        >
          Area
        </label>
        <div className="relative">
          <select
            id="area-select"
            value={area}
            onChange={(e) => onAreaChange(e.target.value as Area)}
            className="w-full appearance-none bg-card border border-border rounded-xl px-4 py-3 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
          >
            <option value="" disabled>
              Choose an area...
            </option>
            {AREAS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
        </div>
      </div>
    </div>
  );
}
