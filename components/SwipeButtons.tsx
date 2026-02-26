"use client";

import { ThumbsUp, ThumbsDown } from "lucide-react";
import { motion } from "framer-motion";

interface SwipeButtonsProps {
  onYes: () => void;
  onNo: () => void;
}

export default function SwipeButtons({ onYes, onNo }: SwipeButtonsProps) {
  return (
    <div className="flex items-center justify-center gap-12">
      <motion.button
        whileTap={{ scale: 0.82 }}
        whileHover={{ scale: 1.08 }}
        onClick={onNo}
        className="w-16 h-16 rounded-full border-2 border-black/15 bg-white text-black/40 flex items-center justify-center shadow-sm"
        aria-label="No"
      >
        <ThumbsDown size={22} strokeWidth={2} />
      </motion.button>

      <motion.button
        whileTap={{ scale: 0.82 }}
        whileHover={{ scale: 1.08 }}
        onClick={onYes}
        className="w-20 h-20 rounded-full bg-black text-[#CAFF00] flex items-center justify-center shadow-lg"
        aria-label="Yes"
      >
        <ThumbsUp size={26} strokeWidth={2} />
      </motion.button>
    </div>
  );
}
