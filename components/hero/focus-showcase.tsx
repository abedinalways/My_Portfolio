"use client";

import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useTransform,
} from "motion/react";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";

import { EASE, type FocusItem } from "./focus-data";
import { useTilt } from "./use-tilt";

export function FocusShowcase({
  item,
  index,
}: {
  item: FocusItem;
  index: number;
}): ReactNode {
  const tilt = useTilt();
  const Icon = item.icon;
  const ordinal = String(index + 1).padStart(2, "0");

  const shineX = useTransform(tilt.x, [-0.5, 0.5], ["0%", "100%"]);
  const shineY = useTransform(tilt.y, [-0.5, 0.5], ["0%", "100%"]);
  const shine = useMotionTemplate`
    radial-gradient(
      circle at ${shineX} ${shineY},
      rgba(255,255,255,0.05) 0%,
      rgba(255,255,255,0) 55%
    )
  `;

  return (
    <div className="grow" style={{ perspective: 1200 }}>
      <motion.div
        style={{ rotateX: tilt.rotateX, rotateY: tilt.rotateY }}
        onMouseMove={tilt.handleMouseMove}
        onMouseLeave={tilt.handleMouseLeave}
        className="group border-foreground/8 bg-background relative overflow-hidden rounded-3xl border p-7 shadow-sm will-change-transform sm:p-9 lg:p-10"
      >
        {/* Ambient glow */}
        <AnimatePresence mode="wait">
          <motion.span
            key={`${item.id}-glow`}
            aria-hidden="true"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 0.12, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.9, ease: EASE }}
            className="pointer-events-none absolute -top-28 -right-28 h-[24rem] w-[24rem] rounded-full blur-[100px]"
            style={{ backgroundColor: item.accent }}
          />
        </AnimatePresence>

        {/* Ghost ordinal */}
        <span
          aria-hidden="true"
          className="text-foreground/[0.04] pointer-events-none absolute -top-4 right-5 font-serif text-[6.5rem] leading-none font-medium tracking-tight select-none sm:text-[8rem]"
        >
          {ordinal}
        </span>

        {/* Hover shine */}
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: shine }}
        />

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 16, scale: 0.99, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -12, scale: 0.99, filter: "blur(5px)" }}
            transition={{ duration: 0.55, ease: EASE }}
            className="relative z-20 flex min-h-[320px] flex-col sm:min-h-[360px]"
          >
            <header className="border-foreground/10 mb-9 flex flex-wrap items-center justify-between gap-4 border-b pb-6">
              <span className="border-foreground/10 bg-foreground/[0.03] text-foreground/70 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-medium tracking-tight">
                <Icon
                  className="h-3.5 w-3.5"
                  strokeWidth={2}
                  aria-hidden="true"
                  style={{ color: item.accent }}
                />
                {item.label}
              </span>

              {item.tech?.length ? (
                <div className="flex flex-wrap gap-2">
                  {item.tech.map((tech) => (
                    <span
                      key={tech}
                      className="border-foreground/10 text-foreground/50 rounded-full border px-2.5 py-1 font-mono text-[11px]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              ) : null}
            </header>

            <div className="flex grow flex-col justify-center gap-5">
              <h3 className="text-foreground font-serif text-[1.9rem] leading-[1.08] font-medium tracking-tight sm:text-[2.4rem] lg:text-[2.75rem]">
                {item.title}
              </h3>

              <p className="text-foreground/65 max-w-xl text-[15px] leading-relaxed tracking-tight sm:text-base">
                {item.description}
              </p>
            </div>

            <footer className="border-foreground/10 mt-9 flex flex-wrap items-end justify-between gap-6 border-t pt-6">
              {item.image ? (
                <motion.div
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15, duration: 0.6, ease: EASE }}
                  className="border-foreground/10 relative h-16 w-32 shrink-0 overflow-hidden rounded-xl border shadow-sm sm:h-20 sm:w-40"
                >
                  <Image
                    src={item.image}
                    alt={`${item.title} visual`}
                    fill
                    sizes="(max-width: 640px) 128px, 160px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  <span
                    aria-hidden="true"
                    className="bg-foreground/10 absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  />
                </motion.div>
              ) : (
                <span className="text-foreground/40 font-mono text-xs">
                  Idea in motion
                </span>
              )}

              <motion.button
                type="button"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 24 }}
                className="focus-ring group/cta border-foreground/10 bg-background text-foreground hover:border-foreground/20 hover:bg-foreground/5 inline-flex cursor-pointer items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-medium transition-colors duration-300"
              >
                Check it out
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-300 group-hover/cta:translate-x-0.5"
                  aria-hidden="true"
                />
              </motion.button>
            </footer>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
