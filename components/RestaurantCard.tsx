"use client";

import { useRef } from "react";
import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { ThumbsUp, ThumbsDown, Star } from "lucide-react";
import { Restaurant } from "@/lib/sheets";
import { cn } from "@/lib/utils";

interface RestaurantCardProps {
  restaurant: Restaurant;
  onSwipe: (liked: boolean) => void;
  isTop: boolean;
  bgColor?: string;
}

const SWIPE_THRESHOLD = 100;

const SOURCE_LABELS: Record<string, string> = {
  favorites: "Favourite",
  wantToGo: "Want to go",
  local: "Added by you",
};

export default function RestaurantCard({ restaurant, onSwipe, isTop, bgColor = "#FF6D00" }: RestaurantCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-10, 10]);
  const opacity = useTransform(x, [-220, -100, 0, 100, 220], [0, 1, 1, 1, 0]);
  const likeOpacity = useTransform(x, [0, 70], [0, 1]);
  const nopeOpacity = useTransform(x, [-70, 0], [1, 0]);
  const constraintsRef = useRef(null);

  function handleDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x > SWIPE_THRESHOLD) onSwipe(true);
    else if (info.offset.x < -SWIPE_THRESHOLD) onSwipe(false);
  }

  return (
    <div ref={constraintsRef} className="absolute inset-0">
      <motion.div
        className={cn(
          "swipe-card absolute inset-0 rounded-3xl overflow-hidden flex flex-col",
          isTop ? "z-10 cursor-grab active:cursor-grabbing" : "z-0"
        )}
        style={isTop
          ? { x, rotate, opacity, backgroundColor: bgColor }
          : { backgroundColor: bgColor }
        }
        drag={isTop ? "x" : false}
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={0.75}
        onDragEnd={handleDragEnd}
        whileDrag={{ scale: 1.02 }}
        animate={isTop ? {} : { scale: 0.96, y: 8 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* YES / NOPE drag stamps */}
        {isTop && (
          <>
            <motion.div
              className="absolute top-6 left-5 z-20 font-bold text-lg px-3 py-1 rounded-xl border-[3px] border-black text-black rotate-[-10deg]"
              style={{ opacity: likeOpacity }}
            >
              yes
            </motion.div>
            <motion.div
              className="absolute top-6 right-5 z-20 font-bold text-lg px-3 py-1 rounded-xl border-[3px] border-black text-black rotate-[10deg]"
              style={{ opacity: nopeOpacity }}
            >
              nope
            </motion.div>
          </>
        )}

        {/* Source tag — top right */}
        <div className="absolute top-4 right-4 z-10">
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-black/10 text-black/60">
            {SOURCE_LABELS[restaurant.source] ?? ""}
          </span>
        </div>

        {/* Centered content + buttons as one group */}
        <div className="flex-1 flex flex-col items-center justify-center text-center px-8 gap-4">
          <h2 className="text-4xl font-bold leading-tight tracking-tight text-black">
            {restaurant.name}
          </h2>

          <div className="flex flex-wrap gap-2 justify-center">
            <span className="text-xs font-bold bg-black text-white px-3 py-1.5 rounded-full">
              {restaurant.cuisine}
            </span>
            <span className="text-xs font-bold border border-black/25 text-black/60 px-3 py-1.5 rounded-full">
              {restaurant.area}
            </span>
          </div>

          {restaurant.notes && (
            <p className="text-sm italic text-black/50 leading-relaxed max-w-xs">
              &ldquo;{restaurant.notes}&rdquo;
            </p>
          )}

          {restaurant.rating && (
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={14} className={i < Number(restaurant.rating) ? "fill-black text-black" : "fill-black/15 text-black/15"} />
              ))}
            </div>
          )}

          {/* Thumbs — part of the content group, close to info */}
          {isTop && (
            <div className="mt-4 flex items-center justify-center gap-12">
              <motion.button
                whileTap={{ scale: 0.82 }}
                whileHover={{ scale: 1.08 }}
                onClick={() => onSwipe(false)}
                className="w-16 h-16 rounded-full bg-white/70 text-black/50 flex items-center justify-center border border-black/10"
                aria-label="No"
              >
                <ThumbsDown size={22} strokeWidth={2} />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.82 }}
                whileHover={{ scale: 1.08 }}
                onClick={() => onSwipe(true)}
                className="w-20 h-20 rounded-full bg-black text-white flex items-center justify-center shadow-lg"
                aria-label="Yes"
              >
                <ThumbsUp size={26} strokeWidth={2} />
              </motion.button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
