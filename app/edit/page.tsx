"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2 } from "lucide-react";
import { Restaurant } from "@/lib/sheets";
import {
  getLocalRestaurants,
  updateLocalRestaurant,
  deleteLocalRestaurant,
} from "@/lib/restaurants";
import { CUISINES, AREAS, CUISINE_ANY, AREA_ANY } from "@/lib/constants";

const SOURCE_OPTIONS: { value: "favorites" | "wantToGo"; label: string }[] = [
  { value: "favorites", label: "favourite" },
  { value: "wantToGo", label: "want to go" },
];

function EditCard({
  restaurant,
  onUpdate,
  onDelete,
  justSaved,
}: {
  restaurant: Restaurant;
  onUpdate: (id: string, updates: Partial<Omit<Restaurant, "id">>) => void;
  onDelete: (id: string) => void;
  justSaved: boolean;
}) {
  const inputClass =
    "w-full bg-black/5 rounded-xl px-3 py-2.5 text-sm font-bold text-black placeholder:text-black/30 focus:outline-none focus:bg-black/10 transition-colors";

  return (
    <div className="bg-white rounded-2xl p-4 space-y-3 border border-black/[0.06] relative">
      {justSaved && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute top-3.5 right-12 text-[10px] font-bold text-green-600 uppercase tracking-widest pointer-events-none"
        >
          saved ✓
        </motion.span>
      )}

      {/* Name */}
      <input
        type="text"
        value={restaurant.name}
        onChange={(e) => onUpdate(restaurant.id, { name: e.target.value })}
        placeholder="restaurant name"
        className={`${inputClass} text-base`}
      />

      {/* Cuisine + Area */}
      <div className="grid grid-cols-2 gap-2">
        <select
          value={restaurant.cuisine}
          onChange={(e) => onUpdate(restaurant.id, { cuisine: e.target.value })}
          className={`${inputClass} cursor-pointer`}
        >
          <option value="">cuisine</option>
          {CUISINES.filter((c) => c !== CUISINE_ANY).map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          value={restaurant.area}
          onChange={(e) => onUpdate(restaurant.id, { area: e.target.value })}
          className={`${inputClass} cursor-pointer`}
        >
          <option value="">area</option>
          {AREAS.filter((a) => a !== AREA_ANY).map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </div>

      {/* Notes */}
      <textarea
        value={restaurant.notes ?? ""}
        onChange={(e) => onUpdate(restaurant.id, { notes: e.target.value })}
        placeholder="notes..."
        rows={2}
        className={`${inputClass} resize-none`}
      />

      {/* Source tag + delete */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {SOURCE_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => onUpdate(restaurant.id, { source: value })}
              className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all ${
                restaurant.source === value
                  ? "bg-black text-white"
                  : "bg-black/8 text-black/40 hover:bg-black/15"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <button
          onClick={() => onDelete(restaurant.id)}
          className="text-black/25 hover:text-red-500 transition-colors p-1"
          aria-label="delete"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}

export default function EditPage() {
  const [locals, setLocals] = useState<Restaurant[]>([]);
  const [sheets, setSheets] = useState<Restaurant[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);

  useEffect(() => {
    const localList = getLocalRestaurants();
    setLocals(localList);

    try {
      const cached = localStorage.getItem("restaurantCache");
      if (cached) {
        const { restaurants } = JSON.parse(cached) as {
          restaurants: Restaurant[];
          timestamp: number;
        };
        const localNames = new Set(localList.map((r) => r.name.toLowerCase().trim()));
        setSheets(
          restaurants.filter(
            (r) =>
              !r.id.startsWith("local-") &&
              !localNames.has(r.name.toLowerCase().trim())
          )
        );
      }
    } catch {
      // cache not available
    }

    setLoaded(true);
  }, []);

  function handleUpdate(id: string, updates: Partial<Omit<Restaurant, "id">>) {
    setLocals((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates } as Restaurant : r))
    );
    updateLocalRestaurant(id, updates);
    setSavedId(id);
    setTimeout(
      () => setSavedId((cur) => (cur === id ? null : cur)),
      1500
    );
  }

  function handleDelete(id: string) {
    setLocals((prev) => prev.filter((r) => r.id !== id));
    deleteLocalRestaurant(id);
  }

  if (!loaded) return <div className="bg-[#F7F5F0] min-h-screen w-full" />;

  return (
    <div className="bg-[#F7F5F0] min-h-screen w-full flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 pt-6 pb-2">
        <Link
          href="/"
          className="text-xl font-bold text-black hover:text-black/50 transition-colors"
        >
          ←
        </Link>
        <span className="font-bold text-sm text-black tracking-tight">
          kev and trish&apos;s restaurant picker
        </span>
      </div>

      <div className="flex-1 px-6 pt-6 pb-10 max-w-sm md:max-w-2xl mx-auto w-full">
        <h1 className="text-5xl font-bold text-black leading-tight mb-8">
          your spots.
        </h1>

        {/* Locally added — editable */}
        <section className="mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-black/40 mb-3">
            added locally · {locals.length} {locals.length === 1 ? "spot" : "spots"}
          </p>
          {locals.length === 0 ? (
            <p className="text-sm text-black/40 font-bold">
              no spots added yet.{" "}
              <Link href="/add" className="underline hover:text-black transition-colors">
                add one →
              </Link>
            </p>
          ) : (
            <AnimatePresence initial={false}>
              <div className="space-y-3">
                {locals.map((r) => (
                  <motion.div
                    key={r.id}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    <EditCard
                      restaurant={r}
                      onUpdate={handleUpdate}
                      onDelete={handleDelete}
                      justSaved={savedId === r.id}
                    />
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          )}
        </section>

        {/* Google Sheets — read-only */}
        {sheets.length > 0 && (
          <section className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest text-black/40 mb-3">
              from google sheets · {sheets.length} spots
            </p>
            <div className="space-y-2">
              {sheets.map((r) => (
                <div
                  key={r.id}
                  className="bg-white/70 rounded-xl px-4 py-3 flex items-start justify-between gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-black leading-tight">{r.name}</p>
                    <div className="flex gap-2 mt-1 flex-wrap items-center">
                      <span className="text-xs font-bold bg-black text-white px-2 py-0.5 rounded-full">
                        {r.cuisine}
                      </span>
                      <span className="text-xs font-bold text-black/40">{r.area}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-black/30 uppercase tracking-wider shrink-0 pt-0.5">
                    {r.source === "favorites" ? "fav" : "want to go"}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-xs text-black/30 font-bold mt-3">
              edit these in your google sheet
            </p>
          </section>
        )}

        <Link
          href="/add"
          className="w-full bg-black text-white font-bold text-base py-4 rounded-2xl text-center block"
        >
          + add a spot
        </Link>
      </div>
    </div>
  );
}
