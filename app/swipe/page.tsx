"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import RestaurantCard from "@/components/RestaurantCard";
import { Restaurant } from "@/lib/sheets";
import { SwipePick } from "@/lib/restaurants";
import { PERSON_1_NAME, PERSON_2_NAME } from "@/lib/constants";
import { ArrowRight } from "lucide-react";

function SwipeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const turn = searchParams.get("turn") === "2" ? 2 : 1;
  const personName = turn === 1 ? PERSON_1_NAME : PERSON_2_NAME;

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [picks, setPicks] = useState<SwipePick[]>([]);
  const [showTransition, setShowTransition] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("restaurants");
    if (!stored) { router.replace("/"); return; }
    setRestaurants(JSON.parse(stored));
  }, [router]);

  const handleSwipe = useCallback(
    (liked: boolean) => {
      if (currentIndex >= restaurants.length) return;
      const newPicks = [...picks, { id: restaurants[currentIndex].id, liked }];
      setPicks(newPicks);
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);

      if (nextIndex >= restaurants.length) {
        if (turn === 1) {
          sessionStorage.setItem("person1Picks", JSON.stringify(newPicks));
          setShowTransition(true);
        } else {
          sessionStorage.setItem("person2Picks", JSON.stringify(newPicks));
          router.push("/results");
        }
      }
    },
    [currentIndex, restaurants, picks, turn, router]
  );

  const cardBg = turn === 1 ? "#FF6D00" : "#40C4FF";

  if (showTransition) {
    return (
      <div className="bg-[#00CFFD] min-h-screen w-full flex flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-8 w-full max-w-sm md:max-w-lg"
        >
          <div className="space-y-3">
            <p className="text-xs font-bold tracking-tight text-black/50 mb-2">kev and trish's restaurant picker</p>
            <p className="text-7xl">📱</p>
            <h2 className="text-5xl font-bold text-black leading-tight">
              done,<br />{PERSON_1_NAME.toLowerCase()}!
            </h2>
            <p className="text-black/60 font-bold text-sm uppercase tracking-widest">
              pass to {PERSON_2_NAME}
            </p>
          </div>
          <button
            onClick={() => { window.location.href = "/swipe?turn=2"; }}
            className="w-full bg-black text-[#00CFFD] font-bold text-lg py-5 rounded-2xl flex items-center justify-center gap-2"
          >
            i&apos;m ready <ArrowRight size={18} strokeWidth={3} />
          </button>
        </motion.div>
      </div>
    );
  }

  if (restaurants.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen text-muted-foreground text-sm">
        Loading...
      </div>
    );
  }

  const current = restaurants[currentIndex];
  const next = restaurants[currentIndex + 1];
  const progress = currentIndex / restaurants.length;

  return (
    <div className="min-h-screen w-full bg-background flex flex-col md:items-center md:justify-center">
      <div className="w-full max-w-sm mx-auto px-5 pt-8 pb-8">

        {/* Header */}
        <div className="space-y-3 mb-4">
          <div className="flex items-baseline justify-between">
            <p className="text-2xl font-bold">{personName}</p>
            <p className="text-sm font-bold text-muted-foreground tabular-nums">
              {currentIndex + 1} / {restaurants.length}
            </p>
          </div>
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-black rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress * 100}%` }}
              transition={{ type: "spring", stiffness: 200, damping: 30 }}
            />
          </div>
        </div>

        {/* 9:16 card */}
        <div className="relative w-full aspect-[9/16]">
          <AnimatePresence>
            {next && <RestaurantCard key={next.id} restaurant={next} onSwipe={() => {}} isTop={false} bgColor={cardBg} />}
            {current && (
              <RestaurantCard
                key={current.id + currentIndex}
                restaurant={current}
                onSwipe={handleSwipe}
                isTop={true}
                bgColor={cardBg}
              />
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}

export default function SwipePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-muted-foreground text-sm">Loading...</div>}>
      <SwipeContent />
    </Suspense>
  );
}
