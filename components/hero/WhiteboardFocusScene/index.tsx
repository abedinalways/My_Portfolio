"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { ArrowRight, Terminal as TerminalIcon } from "lucide-react";
import { CONCISE_FOCUS_ITEMS } from "./data";

export default function WhiteboardFocusScene() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [typedCommand, setTypedCommand] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  const currentItem = CONCISE_FOCUS_ITEMS[currentIndex] ?? CONCISE_FOCUS_ITEMS[0]!;
  const targetCommand = `./focus.sh --id ${currentItem.id}`;

  // 1. Typing animation for CLI command
  useEffect(() => {
    setIsTyping(true);
    setTypedCommand("");

    let charIdx = 0;
    const interval = setInterval(() => {
      if (charIdx <= targetCommand.length) {
        setTypedCommand(targetCommand.slice(0, charIdx));
        charIdx++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 35);

    return () => clearInterval(interval);
  }, [currentIndex, targetCommand]);

  // 2. Infinite Auto-Rotation Loop: switch to next item every 4 seconds after typing completes
  useEffect(() => {
    if (isTyping) return;

    const timer = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % CONCISE_FOCUS_ITEMS.length);
    }, 4000);

    return () => clearTimeout(timer);
  }, [isTyping, currentIndex]);

  return (
    <section className="relative flex w-full justify-center overflow-hidden px-4 py-12 sm:px-8 sm:py-20">
      {/* Dynamic ambient background radial glow shifting color per active item */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[85%] max-w-[650px] rounded-full opacity-20 blur-[130px] transition-all duration-1000 ease-out"
        style={{
          background: `radial-gradient(circle, ${currentItem.color} 0%, transparent 80%)`,
        }}
      />

      {/* Subtle grid pattern background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:28px_28px]"
      />

      <div className="relative w-full max-w-4xl">
        {/* Signature Site Heading Section (Matches Projects & Hero Heading Design) */}
        <div className="mb-10 flex flex-col items-center gap-4 text-center sm:mb-12">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2r  px-3.5 py-1 font-mono text-md font-semibold text-red-800 ">
           
            <span>current focus </span>
          </div>

          {/* Main Title with Site Signature Underline Accent */}
          <h2 className="font-serif text-3xl font-medium tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            What I&rsquo;m{" "}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                building &amp; exploring
              </span>
              <span
                className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-purple-400/60 via-pink-400/60 to-cyan-400/60"
                aria-hidden
              />
            </span>{" "}
            right now
          </h2>

          <p className="max-w-md text-base text-muted-foreground sm:text-lg">
            An authentic live CLI terminal streaming my current focus subjects in real time.
          </p>
        </div>

        {/* Compact Authentic CLI Terminal Window Container */}
        <div className="mx-auto max-w-2xl overflow-hidden rounded-xl border border-white/10 bg-neutral-950/95 shadow-2xl backdrop-blur-xl">
          {/* macOS Terminal Title Bar */}
          <div className="flex items-center justify-between border-b border-white/10 bg-neutral-900/90 px-4 py-2.5 text-xs backdrop-blur-md">
            {/* Traffic Light Buttons & Terminal Title */}
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                <div className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
              </div>

              <div className="flex items-center gap-2 font-mono text-xs text-white/60">
                <TerminalIcon size={13} className="text-white/40" />
                <span>abedin@portfolio:~ (zsh) &bull; ./focus.sh</span>
              </div>
            </div>

            {/* Step Counter Indicator */}
            <div className="flex items-center gap-2 font-mono text-[10px] text-white/50">
              <span>0{currentIndex + 1} / 0{CONCISE_FOCUS_ITEMS.length}</span>
              <div className="flex gap-1">
                {CONCISE_FOCUS_ITEMS.map((item, idx) => (
                  <span
                    key={item.id}
                    className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                      idx === currentIndex
                        ? "scale-125 shadow-xs"
                        : "opacity-30"
                    }`}
                    style={{
                      backgroundColor: idx === currentIndex ? item.color : "white",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Terminal Content Box */}
          <div className="p-4 font-mono text-xs sm:p-5 sm:text-sm leading-relaxed text-white/90">
            {/* Command Prompt Line */}
            <div className="flex items-center gap-2 text-emerald-400">
              <span className="text-purple-400 font-bold">abedin@portfolio</span>
              <span className="text-white/40">:</span>
              <span className="text-cyan-400 font-bold">~</span>
              <span className="text-white/60">$</span>
              <span className="font-mono text-white font-bold">{typedCommand}</span>
              {isTyping && (
                <span
                  className="inline-block h-3.5 w-2 animate-pulse align-middle"
                  style={{ backgroundColor: currentItem.color }}
                />
              )}
            </div>

            {/* Rotating CLI Output Stream */}
            {!isTyping && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentItem.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                  className="mt-3 flex flex-col gap-2"
                >
                  {/* Single Streamed Focus Item */}
                  <div className="flex flex-col gap-1 rounded-lg border border-white/5 bg-white/[0.02] p-3 backdrop-blur-xs">
                    <div className="flex items-center justify-between">
                      <span
                        className="font-mono text-xs font-bold uppercase tracking-wide"
                        style={{ color: currentItem.color }}
                      >
                        [{currentItem.tag}]
                      </span>
                      <span className="text-[10px] text-emerald-400 font-mono">● ACTIVE</span>
                    </div>

                    <div className="text-white text-sm font-semibold pt-0.5">
                      {currentItem.title}
                    </div>

                    <div className="text-white/50 text-xs font-mono">
                      Tech: <span className="text-white/80">{currentItem.tech}</span>
                    </div>
                  </div>

                  {/* Clickable Direct Project Page Link */}
                  <div className="mt-1 border-t border-white/10 pt-3">
                    <Link
                      href="/projects"
                      className="group inline-flex items-center gap-2 font-mono text-xs font-semibold text-emerald-400 transition hover:text-emerald-300 hover:underline"
                    >
                      <span>&rarr; Click to explore full projects in /projects</span>
                      <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
