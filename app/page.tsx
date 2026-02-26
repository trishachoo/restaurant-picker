"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import ScrollSelector from "@/components/ScrollSelector";
import { CUISINES, AREAS, SHEET_URLS, CUISINE_ANY, AREA_ANY } from "@/lib/constants";
import { fetchFavorites, fetchWantToGo, Restaurant } from "@/lib/sheets";
import { applyFilters, dedupeRestaurants, getLocalRestaurants } from "@/lib/restaurants";
import { Loader2 } from "lucide-react";

const stepVariants = {
  enter: (dir: number) => ({ x: dir * 60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir * -60, opacity: 0 }),
};

export default function FilterPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [direction, setDirection] = useState(1);
  const [cuisines, setCuisines] = useState<string[]>([]);
  const [areas, setAreas] = useState<string[]>([]);
  const [allRestaurants, setAllRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    sessionStorage.removeItem("filters");
    sessionStorage.removeItem("restaurants");
    sessionStorage.removeItem("person1Picks");
    sessionStorage.removeItem("person2Picks");

    const CACHE_KEY = "restaurantCache";
    const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

    async function loadData() {
      try {
        // Serve from cache if fresh
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const { restaurants, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_TTL && restaurants.length > 0) {
            setAllRestaurants(restaurants);
            setLoading(false);
            return;
          }
        }
        const [favs, wtg] = await Promise.all([
          fetchFavorites(SHEET_URLS.favorites),
          fetchWantToGo(SHEET_URLS.wantToGo),
        ]);
        const local = getLocalRestaurants();
        const restaurants = dedupeRestaurants([...favs, ...wtg, ...local]);
        setAllRestaurants(restaurants);
        localStorage.setItem(CACHE_KEY, JSON.stringify({ restaurants, timestamp: Date.now() }));
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  function goToStep2() {
    setDirection(1);
    setStep(2);
  }

  function goToStep1() {
    setDirection(-1);
    setStep(1);
  }

  function handleStart() {
    if (areas.length === 0) return;
    const filtered = applyFilters(allRestaurants, { cuisines, areas });
    if (filtered.length === 0) return;
    sessionStorage.setItem("filters", JSON.stringify({ cuisines, areas }));
    sessionStorage.setItem("restaurants", JSON.stringify(filtered));
    router.push("/swipe?turn=1");
  }

  const filteredCount =
    areas.length > 0 ? applyFilters(allRestaurants, { cuisines, areas }).length : null;

  const cuisineCount = cuisines.filter((c) => c !== "Any").length;
  const areaCount = areas.filter((a) => a !== "Any").length;
  const hasCuisine = cuisines.length > 0;

  return (
    <AnimatePresence mode="wait" custom={direction} initial={false}>
      {step === 1 ? (
        <motion.div
          key="step1"
          custom={direction}
          variants={stepVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
          className="bg-step-1 min-h-screen w-full flex flex-col"
        >
          {/* Floating top bar */}
          <div className="flex items-center justify-between px-6 pt-6 pb-2">
            <span className="font-bold text-xs text-black tracking-tight min-w-0 mr-4">kev and trish&apos;s restaurant picker</span>
            <div className="flex items-center gap-4 flex-shrink-0">
              <Link href="/edit" className="text-xs font-bold uppercase tracking-widest text-black/50 hover:text-black transition-colors">edit</Link>
              <Link href="/add" className="text-xs font-bold uppercase tracking-widest text-black/70 hover:text-black transition-colors">+ add</Link>
            </div>
          </div>

          {/* Centered content */}
          <div className="flex-1 overflow-y-auto px-6 min-h-0 flex flex-col">
            <div className="flex flex-col items-center gap-5 w-full max-w-sm md:max-w-2xl mx-auto my-auto py-8">
              <p className="text-5xl">🍔</p>
              <h1 className="text-4xl md:text-5xl font-bold text-black leading-tight text-center">
                what are you<br />craving today?
              </h1>

              <ScrollSelector
                multiSelect
                maxSelect={3}
                anyValue={CUISINE_ANY}
                options={CUISINES}
                value={cuisines}
                onChange={setCuisines}
              />

              {/* Selection counter */}
              <AnimatePresence>
                {cuisineCount >= 1 && (
                  <motion.p
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    className="text-xs font-bold text-black/60 uppercase tracking-widest"
                  >
                    {cuisineCount} / 3 max
                  </motion.p>
                )}
              </AnimatePresence>

              {loading && (
                <div className="flex items-center gap-2 text-black/50 text-xs">
                  <Loader2 size={12} className="animate-spin" />
                  fetching your list...
                </div>
              )}
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="px-6 pb-8">
            <AnimatePresence>
              {hasCuisine && !loading && (
                <motion.button
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 16 }}
                  onClick={goToStep2}
                  className="w-full max-w-sm mx-auto block bg-black text-[#CAFF00] font-bold text-lg py-4 rounded-2xl text-center"
                >
                  next →
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="step2"
          custom={direction}
          variants={stepVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
          className="bg-step-2 min-h-screen w-full flex flex-col"
        >
          {/* Floating top bar */}
          <div className="flex items-center justify-between px-6 pt-6 pb-2">
            <button
              onClick={goToStep1}
              className="text-xl font-bold text-white hover:text-white/80 transition-colors"
              aria-label="Back"
            >
              ←
            </button>
            <div className="flex items-center gap-4">
              <Link href="/edit" className="text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors">edit</Link>
              <Link href="/add" className="text-xs font-bold uppercase tracking-widest text-white/70 hover:text-white transition-colors">+ add</Link>
            </div>
          </div>

          {/* Centered content */}
          <div className="flex-1 overflow-y-auto px-6 min-h-0 flex flex-col">
            <div className="flex flex-col items-center gap-5 w-full max-w-sm md:max-w-2xl mx-auto my-auto py-8">
              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight text-center">
                where in<br />singapore?
              </h1>

              {/* Filtered count — shown above pills so it's visible without scrolling */}
              <AnimatePresence>
                {filteredCount !== null && (
                  <motion.p
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    className="text-center font-bold"
                  >
                    {filteredCount === 0 ? (
                      <span className="text-white text-sm">no matches — try different filters</span>
                    ) : (
                      <><span className="text-white text-3xl">{filteredCount}</span><span className="text-white/70 text-sm"> places to swipe</span></>
                    )}
                  </motion.p>
                )}
              </AnimatePresence>

              <ScrollSelector
                multiSelect
                maxSelect={2}
                anyValue={AREA_ANY}
                options={AREAS}
                value={areas}
                onChange={setAreas}
              />

              {/* Selection counter */}
              <AnimatePresence>
                {areaCount >= 1 && (
                  <motion.p
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    className="text-xs font-bold text-white/70 uppercase tracking-widest"
                  >
                    {areaCount} / 2 max
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="px-6 pb-8">
            <AnimatePresence>
              {areas.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 16 }}
                  className="w-full max-w-sm mx-auto space-y-3"
                >
                  <button
                    onClick={handleStart}
                    disabled={filteredCount === 0}
                    className="w-full bg-white text-[#FF3CAC] font-bold text-lg py-4 rounded-2xl disabled:opacity-40 disabled:pointer-events-none"
                  >
                    let&apos;s go →
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
