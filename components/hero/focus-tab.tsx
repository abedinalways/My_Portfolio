"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

import { EASE, type FocusItem } from "./focus-data";

export function FocusTab({
  item,
  index,
  isActive,
  onClick,
}: {
  item: FocusItem;
  index: number;
  isActive: boolean;
  onClick: () => void;
}): ReactNode {
  const Icon = item.icon;
  const ordinal = String(index + 1).padStart(2, "0");

  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.65, delay: index * 0.07, ease: EASE }}
      className={`group relative flex w-full cursor-pointer items-center gap-3.5 rounded-2xl border p-3.5 text-left transition-colors duration-300 sm:p-4 ${
        isActive
          ? "border-foreground/15 bg-foreground/5 shadow-sm"
          : "border-foreground/8 bg-background hover:border-foreground/15 hover:bg-foreground/4"
      }`}
    >
      {isActive && (
        <motion.span
          aria-hidden="true"
          layoutId="focusActiveBar"
          transition={{ type: "spring", stiffness: 340, damping: 32 }}
          className="absolute top-4 bottom-4 left-0 w-[3px] rounded-full"
          style={{ backgroundColor: item.accent }}
        />
      )}

      <span
        className="border-foreground/10 bg-foreground/4 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-colors duration-300"
        style={
          isActive
            ? {
                backgroundColor: `${item.accent}14`,
                borderColor: `${item.accent}40`,
                color: item.accent,
              }
            : { color: undefined }
        }
      >
        <Icon
          className="h-[18px] w-[18px]"
          strokeWidth={1.75}
          aria-hidden="true"
        />
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between gap-2">
          <span className="text-foreground/40 font-mono text-[10px] font-medium tracking-[0.16em] uppercase">
            {item.category}
          </span>
          <span className="text-foreground/25 font-mono text-[11px] tabular-nums">
            {ordinal}
          </span>
        </span>

        <span className="text-foreground mt-1 block text-[15px] font-medium tracking-tight">
          {item.title}
        </span>
      </span>
    </motion.button>
  );
}
