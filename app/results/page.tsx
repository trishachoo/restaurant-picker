"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Restaurant } from "@/lib/sheets";
import { SwipePick, getMutualMatches, pickWinner } from "@/lib/restaurants";
import { Star } from "lucide-react";

const SOURCE_LABELS: Record<string, string> = {
  favorites: "fav",
  wantToGo: "want to go",
  local: "added by you",
};

function MatchRow({ restaurant, index }: { restaurant: Restaurant; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.07 }}
      className="flex items-start gap-4 py-4 border-b border-black/10 last:border-0"
    >
      <span className="text-xl font-bold text-black/20 tabular-nums w-6 shrink-0 pt-0.5">
        {index + 1}
      </span>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-base leading-tight text-black">{restaurant.name}</p>
        <div className="flex flex-wrap items-center gap-2 mt-1.5">
          <span className="text-xs font-bold bg-black text-[#CAFF00] px-2.5 py-1 rounded-full">
            {restaurant.cuisine}
          </span>
          <span className="text-xs font-bold text-black/50">{restaurant.area}</span>
          {restaurant.rating && (
            <span className="text-xs font-bold text-black/50 flex items-center gap-0.5">
              <Star size={11} fill="currentColor" />{restaurant.rating}
            </span>
          )}
          {SOURCE_LABELS[restaurant.source] && (
            <span className="text-xs font-bold text-black/40 uppercase tracking-wider">
              {SOURCE_LABELS[restaurant.source]}
            </span>
          )}
        </div>
        {restaurant.notes && (
          <p className="text-xs text-black/40 italic mt-1">&ldquo;{restaurant.notes}&rdquo;</p>
        )}
      </div>
    </motion.div>
  );
}

export default function ResultsPage() {
  const router = useRouter();
  const [matches, setMatches] = useState<Restaurant[]>([]);
  const [winner, setWinner] = useState<Restaurant | null>(null);
  const [loaded, setLoaded] = useState(false);
  const confettiFired = useRef(false);

  useEffect(() => {
    const restaurantsRaw = sessionStorage.getItem("restaurants");
    const p1Raw = sessionStorage.getItem("person1Picks");
    const p2Raw = sessionStorage.getItem("person2Picks");
    if (!restaurantsRaw || !p1Raw || !p2Raw) { router.replace("/"); return; }

    const restaurants: Restaurant[] = JSON.parse(restaurantsRaw);
    const p1Picks: SwipePick[] = JSON.parse(p1Raw);
    const p2Picks: SwipePick[] = JSON.parse(p2Raw);
    const mutual = getMutualMatches(restaurants, p1Picks, p2Picks);
    setMatches(mutual);
    if (mutual.length > 0) setWinner(pickWinner(mutual));
    setLoaded(true);
  }, [router]);

  useEffect(() => {
    if (matches.length > 0 && !confettiFired.current) {
      confettiFired.current = true;
      setTimeout(() => {
        import("canvas-confetti").then((mod) => {
          mod.default({
            particleCount: 120,
            spread: 70,
            origin: { y: 0.4 },
            colors: ["#CAFF00", "#FF3CAC", "#000000", "#ffffff"],
          });
        });
      }, 300);
    }
  }, [matches.length]);

  function handleTryAgain() {
    sessionStorage.removeItem("person1Picks");
    sessionStorage.removeItem("person2Picks");
    router.push("/swipe?turn=1");
  }

  function handleChangeFilters() {
    sessionStorage.clear();
    router.push("/");
  }

  if (!loaded) {
    return <div className="bg-[#FFD60A] min-h-screen w-full" />;
  }

  // No matches state
  if (matches.length === 0) {
    return (
      <div className="bg-[#FF453A] min-h-screen w-full flex flex-col">
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <span className="font-bold text-sm text-white tracking-tight">kev and trish's restaurant picker</span>
          <Link href="/add" className="text-xs font-bold uppercase tracking-widest text-white/60 hover:text-white">+ Add</Link>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-sm md:max-w-2xl space-y-8"
          >
            <div className="space-y-3">
              <p className="text-7xl">😭</p>
              <h2 className="text-5xl font-bold text-white leading-tight">
                oh neuuu<br />no matches!
              </h2>
              <p className="text-white/80 font-bold text-sm">you guys gotta try to agree on SOMETHING!!</p>
            </div>
            <div className="flex flex-col gap-3">
              <button onClick={handleTryAgain} className="w-full bg-white text-[#FF453A] font-bold text-lg py-5 rounded-2xl">
                swipe again
              </button>
              <button onClick={handleChangeFilters} className="w-full bg-white/20 text-white font-bold text-base py-4 rounded-2xl">
                back to the start
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!winner) return <div className="bg-[#FFD60A] min-h-screen w-full" />;

  const otherMatches = matches.filter((m) => m.id !== winner?.id);

  return (
    <div className="bg-[#FFD60A] min-h-screen w-full flex flex-col">
      {/* Floating top bar */}
      <div className="flex items-center justify-between px-6 pt-6 pb-2">
        <span className="font-bold text-sm text-black tracking-tight">kev and trish's restaurant picker</span>
        <Link href="/add" className="text-xs font-bold uppercase tracking-widest text-black/60 hover:text-black">+ Add</Link>
      </div>

      <div className="flex-1 flex flex-col px-6 pb-10 max-w-sm md:max-w-2xl mx-auto w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-8 pb-6"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-black/50 mb-2 text-center">
            {matches.length} mutual yes{matches.length !== 1 ? "es" : ""}
          </p>
          <h2 className="text-5xl font-bold text-black leading-tight text-center">
            huhu you&apos;re going<br />here tonight! 🥳
          </h2>
        </motion.div>

        {/* Winner card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.93 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 300, damping: 25 }}
          className="bg-black rounded-3xl px-6 py-6 mb-6 space-y-3"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-[#FFD60A]/60">
            tonight&apos;s pick
          </p>
          <h3 className="text-3xl font-bold text-[#FFD60A] leading-tight">
            {winner.name}
          </h3>
          <div className="flex flex-wrap gap-2">
            <span className="text-xs font-bold bg-[#FFD60A] text-black px-3 py-1.5 rounded-full">
              {winner.cuisine}
            </span>
            <span className="text-xs font-bold border-2 border-white/20 text-white px-3 py-1.5 rounded-full">
              {winner.area}
            </span>
          </div>
          {winner.notes && (
            <p className="text-sm italic text-white/60">&ldquo;{winner.notes}&rdquo;</p>
          )}
          {winner.rating && (
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={14} className={i < Number(winner.rating) ? "fill-[#FFD60A] text-[#FFD60A]" : "fill-white/10 text-white/10"} />
              ))}
            </div>
          )}
        </motion.div>

        {/* Other matches */}
        {otherMatches.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-6"
          >
            <p className="text-xs font-bold uppercase tracking-widest text-black/50 mb-2">
              other matches
            </p>
            <div className="bg-white/60 rounded-2xl px-4">
              {otherMatches.map((m, i) => (
                <MatchRow key={m.id} restaurant={m} index={i} />
              ))}
            </div>
          </motion.div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3 mt-auto pt-4 items-center">
          <button
            onClick={handleTryAgain}
            className="w-full bg-black text-[#FFD60A] font-bold text-base py-4 rounded-2xl"
          >
            swipe again
          </button>
          <button
            onClick={handleChangeFilters}
            className="text-sm font-bold text-black/50 text-center"
          >
            back to the start
          </button>
        </div>
      </div>
    </div>
  );
}
