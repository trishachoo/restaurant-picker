"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CUISINES, AREAS, CUISINE_ANY, AREA_ANY } from "@/lib/constants";
import { saveLocalRestaurant } from "@/lib/restaurants";
import ScrollSelector from "@/components/ScrollSelector";
import { motion, AnimatePresence } from "framer-motion";

export default function AddPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [area, setArea] = useState("");
  const [notes, setNotes] = useState("");
  const [addedBy, setAddedBy] = useState("");
  const [sourceType, setSourceType] = useState<"favorites" | "wantToGo">("favorites");
  const [saved, setSaved] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !cuisine || !area) return;
    saveLocalRestaurant({ name, cuisine, area, address: "", notes, addedBy }, sourceType);
    setSaved(true);
    setTimeout(() => router.push("/"), 1500);
  }

  if (saved) {
    return (
      <div className="bg-[#9747FF] min-h-screen w-full flex flex-col items-center justify-center text-center px-6">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
          <p className="text-6xl mb-4">✅</p>
          <h2 className="text-4xl font-bold text-white">saved!</h2>
          <p className="text-white/60 font-bold text-sm mt-2">taking you back...</p>
        </motion.div>
      </div>
    );
  }

  const inputClass =
    "w-full bg-white/15 border-2 border-white/30 rounded-2xl px-4 py-3.5 text-sm font-bold text-white placeholder:text-white/40 focus:outline-none focus:border-white/70 transition-colors";

  return (
    <div className="bg-[#9747FF] min-h-screen w-full flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 pt-6 pb-2">
        <Link href="/" className="text-xl font-bold text-white hover:text-white/80 transition-colors">
          ←
        </Link>
        <span className="font-bold text-sm text-white tracking-tight">kev and trish&apos;s restaurant picker</span>
        <Link href="/edit" className="text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors">edit</Link>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pt-6 pb-10 max-w-sm md:max-w-2xl mx-auto w-full">
        <h1 className="text-5xl font-bold text-white leading-tight mb-8">
          add a<br />spot.
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-white/70">Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Burnt Ends"
              className={inputClass}
            />
          </div>

          {/* Tag */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-white/70">Tag as *</label>
            <div className="flex gap-3">
              {(["favorites", "wantToGo"] as const).map((src) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setSourceType(src)}
                  className={`flex-1 py-3 rounded-2xl font-bold text-sm transition-all ${
                    sourceType === src
                      ? "bg-white text-[#9747FF]"
                      : "bg-white/15 text-white border-2 border-white/30"
                  }`}
                >
                  {src === "favorites" ? "favourite" : "want to go"}
                </button>
              ))}
            </div>
          </div>

          {/* Cuisine */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-white/70">Cuisine *</label>
            <AnimatePresence>
              {cuisine && (
                <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="text-xs font-bold text-white/80">
                  ✓ {cuisine}
                </motion.p>
              )}
            </AnimatePresence>
            <ScrollSelector
              options={CUISINES.filter((c) => c !== CUISINE_ANY)}
              value={cuisine}
              onChange={setCuisine}
            />
          </div>

          {/* Area */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-white/70">Area *</label>
            <AnimatePresence>
              {area && (
                <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="text-xs font-bold text-white/80">
                  ✓ {area}
                </motion.p>
              )}
            </AnimatePresence>
            <ScrollSelector
              options={AREAS.filter((a) => a !== AREA_ANY)}
              value={area}
              onChange={setArea}
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-white/70">Notes</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Book ahead, try the omakase"
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Added by */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-white/70">Added by</label>
            <input
              type="text"
              value={addedBy}
              onChange={(e) => setAddedBy(e.target.value)}
              placeholder="your name"
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            disabled={!name || !cuisine || !area}
            className="w-full bg-white text-[#9747FF] font-bold text-lg py-5 rounded-2xl disabled:opacity-40 disabled:pointer-events-none"
          >
            save spot →
          </button>
        </form>
      </div>
    </div>
  );
}
