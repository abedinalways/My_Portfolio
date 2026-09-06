"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { FOCUS_ITEMS, TIMING } from "./data";
import { easeInOutQuad, sleep } from "./math";

type DescriptionCycleOptions = {
  iconsDone: boolean;
  inView: boolean;
  revealMaskRef: RefObject<HTMLSpanElement | null>;
  descPenRef: RefObject<HTMLSpanElement | null>;
};

/**
 * Phase 2 — once the icons are drawn, type out each description with the
 * little pencil following along, hold it, erase it, then write the next one.
 * The loop only runs while the section is on screen.
 */
export function useDescriptionCycle({
  iconsDone,
  inView,
  revealMaskRef,
  descPenRef,
}: DescriptionCycleOptions): {
  activeIndex: number;
  isTyping: boolean;
  isErasing: boolean;
} {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [isErasing, setIsErasing] = useState(false);
  const loopCancelledRef = useRef(false);

  useEffect(() => {
    if (!iconsDone || !inView) return;
    loopCancelledRef.current = false;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    function revealDescription(index: number): Promise<void> {
      return new Promise((resolve) => {
        const item = FOCUS_ITEMS[index];
        if (!item) {
          resolve();
          return;
        }

        // Reduced motion: show the full line immediately, no typing.
        if (prefersReduced) {
          if (revealMaskRef.current) {
            revealMaskRef.current.style.clipPath = "inset(0 0% 0 0)";
          }
          resolve();
          return;
        }

        const totalMs = Math.min(
          Math.max(
            item.description.length * TIMING.msPerChar,
            TIMING.minWriteMs
          ),
          TIMING.maxWriteMs
        );
        let start: number | null = null;

        function frame(ts: number): void {
          if (loopCancelledRef.current) {
            resolve();
            return;
          }
          if (start === null) start = ts;

          const linear = Math.min((ts - start) / totalMs, 1);
          const eased = easeInOutQuad(linear);

          if (revealMaskRef.current) {
            revealMaskRef.current.style.clipPath = `inset(0 ${(1 - eased) * 100}% 0 0)`;
          }
          if (descPenRef.current) {
            descPenRef.current.style.left = `${eased * 100}%`;
          }

          if (linear >= 1) {
            resolve();
            return;
          }
          requestAnimationFrame(frame);
        }

        requestAnimationFrame(frame);
      });
    }

    async function runLoop(): Promise<void> {
      while (!loopCancelledRef.current) {
        for (let i = 0; i < FOCUS_ITEMS.length; i++) {
          if (loopCancelledRef.current) return;

          setIsErasing(false);
          setActiveIndex(i);
          setIsTyping(true);
          if (revealMaskRef.current) {
            revealMaskRef.current.style.clipPath = "inset(0 100% 0 0)";
          }
          if (descPenRef.current) {
            descPenRef.current.style.left = "0%";
          }

          await revealDescription(i);
          if (loopCancelledRef.current) return;
          setIsTyping(false);

          await sleep(TIMING.holdMs, loopCancelledRef);
          if (loopCancelledRef.current) return;

          setIsErasing(true);
          await sleep(TIMING.eraseMs, loopCancelledRef);
          if (loopCancelledRef.current) return;

          await sleep(TIMING.descGapMs, loopCancelledRef);
        }
      }
    }

    runLoop();
    return () => {
      loopCancelledRef.current = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [iconsDone, inView]);

  return { activeIndex, isTyping, isErasing };
}
