"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

import { EASE } from "./focus-data";

export function FocusHeader({
  activeIndex,
  total,
}: {
  activeIndex: number;
  total: number;
}): ReactNode {
  const current = String(activeIndex + 1).padStart(2, "0");

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.8, ease: EASE }}
      className="border-foreground/8 mb-10 flex flex-col gap-7 border-b pb-9 sm:mb-14 sm:flex-row sm:items-end sm:justify-between sm:gap-10"
    >
      <div className="flex flex-col gap-3.5">
        <span className="text-foreground/45 font-mono text-xs tracking-[0.18em] uppercase">
          Focus <span className="text-foreground/25">&mdash; {current}</span>
        </span>

        <h2 className="text-foreground font-serif text-[2rem] leading-[1.05] font-medium tracking-tight sm:text-[2.6rem] lg:text-[3rem]">
          Currently focused
        </h2>

        <p className="text-foreground/60 max-w-[38ch] text-[15px] leading-relaxed tracking-tight sm:text-base">
          A gentle snapshot of the things I&rsquo;m building, exploring, and
          learning right now.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
        className="border-foreground/8 bg-background text-foreground/60 inline-flex shrink-0 items-center gap-2.5 self-start rounded-full border px-4 py-2 font-mono text-xs sm:self-auto"
      >
        <span className="relative flex h-2 w-2" aria-hidden="true">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400/90" />
        </span>
        {current} / {total} live
      </motion.div>
    </motion.div>
  );
}
