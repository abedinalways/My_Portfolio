"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Code2, Eye, BookOpen, Palette } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

type FocusItem = {
  label: string;
  text: string;
  accent: string;
  Icon: React.ComponentType<{ className?: string }>;
  emoji: string;
  image?: string;
};

const FOCUS_ITEMS: FocusItem[] = [
  {
    label: "Currently building",
    text: "an AI-powered design tool.",
    accent: "#3b82f6",
    Icon: Code2,
    emoji: "🚀",
    image: "/abedin.jpeg",
  },
  {
    label: "Exploring",
    text: "WebGL interactions and shaders.",
    accent: "#a855f7",
    Icon: Eye,
    emoji: "✨",
  },
  {
    label: "Learning",
    text: "on-device ML with TensorFlow.js.",
    accent: "#10b981",
    Icon: BookOpen,
    emoji: "📚",
  },
  {
    label: "Designing",
    text: "minimal interfaces that feel alive.",
    accent: "#f43f5e",
    Icon: Palette,
    emoji: "🎨",
    image: "/abedin_wave.jpeg",
  },
];

const CYCLE_MS = 5000;
const TRANSITION_MS = 0.75;

export function FocusStrip(): ReactNode {
  const [index, setIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % FOCUS_ITEMS.length);
    }, CYCLE_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const item = FOCUS_ITEMS[index];

  if (!item) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: EASE }}
      className="mx-auto w-full max-w-275 px-6 sm:px-10"
    >
      <div className="relative overflow-hidden rounded-2xl border border-foreground/8 bg-[#0a0a0a] p-6 sm:p-8">
        <motion.div
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 5, ease: "easeInOut", repeat: Infinity }}
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 80% 60% at 50% -10%, ${item.accent}22 0%, transparent 70%)`,
          }}
          aria-hidden="true"
        />

        <motion.div
          animate={{ opacity: [0.08, 0.18, 0.08] }}
          transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }}
          className="pointer-events-none absolute -inset-0.5 rounded-2xl"
          style={{
            background: `linear-gradient(135deg, ${item.accent}40 0%, transparent 50%, ${item.accent}20 100%)`,
            filter: "blur(8px)",
            zIndex: -1,
          }}
          aria-hidden="true"
        />

        <div className="relative flex flex-col items-center gap-6">
          <div className="flex items-center gap-5">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4.5, ease: "easeInOut", repeat: Infinity }}
              className="text-5xl leading-none filter"
              style={{ filter: `drop-shadow(0 0 16px ${item.accent}50)` }}
              aria-hidden="true"
            >
              {item.emoji}
            </motion.div>

            {item.image && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
                className="h-14 w-14 overflow-hidden rounded-xl border border-foreground/10 sm:h-16 sm:w-16"
              >
                <Image
                  src={item.image}
                  alt=""
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                  aria-hidden="true"
                />
              </motion.div>
            )}

            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 5, ease: "easeInOut", repeat: Infinity }}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-foreground/10"
              style={{ backgroundColor: `${item.accent}18`, color: item.accent }}
            >
              <item.Icon className="h-5 w-5" aria-hidden="true" />
            </motion.div>
          </div>

          <div className="flex flex-col items-center gap-4">
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-foreground/35">
              What I&rsquo;m up to
            </span>

            <div className="flex h-[1.6em] w-full max-w-[26rem] items-center justify-center">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={item.label + item.text}
                  initial={{ opacity: 0, y: 20, filter: "blur(10px)", scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
                  exit={{ opacity: 0, y: -20, filter: "blur(10px)", scale: 0.96 }}
                  transition={{ duration: TRANSITION_MS, ease: EASE }}
                  className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-center text-[16px] leading-snug tracking-tight text-foreground/70 sm:text-[18px]"
                >
                  <motion.span
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.5, ease: EASE }}
                    className="font-semibold"
                    style={{ color: item.accent }}
                  >
                    {item.label}
                  </motion.span>
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.18, duration: 0.45, ease: EASE }}
                    className="text-foreground/20"
                    aria-hidden="true"
                  >
                    ·
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.14, duration: 0.5, ease: EASE }}
                    className="text-foreground/60"
                  >
                    {item.text}
                  </motion.span>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {FOCUS_ITEMS.map((focusItem, i) => (
              <motion.button
                key={focusItem.label}
                onClick={() => setIndex(i)}
                whileHover={{ scale: 1.3 }}
                whileTap={{ scale: 0.8 }}
                className="cursor-pointer rounded-full focus-ring"
                aria-label={`Show: ${focusItem.label}`}
              >
                <motion.div
                  animate={{
                    backgroundColor: i === index ? focusItem.accent : "currentColor",
                    opacity: i === index ? 1 : 0.2,
                    scale: i === index ? 1.2 : 1,
                  }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="h-1.5 w-1.5 rounded-full bg-foreground"
                />
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
