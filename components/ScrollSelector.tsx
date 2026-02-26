"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BaseProps {
  options: readonly string[];
}

interface SingleSelectProps extends BaseProps {
  multiSelect?: false;
  value: string;
  onChange: (v: string) => void;
  maxSelect?: never;
}

interface MultiSelectProps extends BaseProps {
  multiSelect: true;
  value: string[];
  onChange: (v: string[]) => void;
  maxSelect?: number;
  anyValue?: string;
}

type ScrollSelectorProps = SingleSelectProps | MultiSelectProps;

export default function ScrollSelector(props: ScrollSelectorProps) {
  const { options } = props;

  function handleClick(option: string) {
    if (!props.multiSelect) {
      props.onChange(option);
      return;
    }

    const current = props.value as string[];
    const max = props.maxSelect ?? Infinity;
    const anyVal = props.anyValue ?? "Any";

    // "any" logic: selecting it clears others; selecting others removes it
    if (option === anyVal) {
      props.onChange([anyVal]);
      return;
    }

    const withoutAny = current.filter((v) => v !== anyVal);

    if (withoutAny.includes(option)) {
      // Deselect
      props.onChange(withoutAny.filter((v) => v !== option));
    } else {
      // Add, with FIFO replacement if at max
      const next = [...withoutAny, option];
      if (next.length > max) {
        next.shift();
      }
      props.onChange(next);
    }
  }

  function isSelected(option: string): boolean {
    if (!props.multiSelect) {
      return props.value === option;
    }
    return (props.value as string[]).includes(option);
  }

  return (
    <div className="flex flex-wrap gap-2.5 justify-center">
      {options.map((option) => {
        const selected = isSelected(option);
        return (
          <motion.button
            key={option}
            whileTap={{ scale: 0.93 }}
            onClick={() => handleClick(option)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-bold border-2 transition-all duration-150 lowercase",
              selected
                ? "bg-black text-white border-black shadow-md"
                : "bg-white text-black border-black hover:bg-black/5"
            )}
          >
            {option}
          </motion.button>
        );
      })}
    </div>
  );
}
