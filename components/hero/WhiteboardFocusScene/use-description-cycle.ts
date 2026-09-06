"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { FOCUS_ITEMS, TIMING } from "./data";
import { easeInOutQuad, seededRandom, sleep } from "./math";

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
        // Hoisted closures lose the `item` narrowing, so snapshot the parts
        // we need as plain values (non-optional) for the frame loop.
        const text = item.description;
        const itemSeed = index * 1000;
        let start: number | null = null;
        let prevEased = 0;

        // Smoothed hand values — we ease the bob/angle toward targets so the
        // pencil never "snaps", it just quietly steers like a real hand.
        let bob = 0;
        let tilt = -36;

        function frame(ts: number): void {
          if (loopCancelledRef.current) {
            resolve();
            return;
          }
          if (start === null) start = ts;

          const linear = Math.min((ts - start) / totalMs, 1);
          const eased = easeInOutQuad(linear);
          // How fast the nib is gliding this frame — a real hand steadies
          // itself on fast strokes and leans into the direction of travel.
          const velocity = Math.max(eased - prevEased, 0);
          prevEased = eased;

          if (revealMaskRef.current) {
            revealMaskRef.current.style.clipPath = `inset(0 ${(1 - eased) * 100}% 0 0)`;
          }

          const pencil = descPenRef.current;
          if (pencil) {
            // The letter currently under the nib drives this frame's bob/angle
            // so the pencil hops from letter to letter the way graphite does.
            const letterIndex = Math.min(
              Math.floor(eased * text.length),
              text.length - 1
            );
            // Real handwriting skips word gaps — the nib lifts a touch and the
            // graphite stops marking until the next word starts.
            const atSpace = /\s/.test(text[letterIndex] ?? "x");
            const seed = itemSeed + letterIndex;

            // Low-pass the targets so movement stays fluid (never jittery).
            const steadiness = 1 - Math.min(velocity * 18, 0.55);
            const bobTarget =
              (seededRandom(seed + 0.37) - 0.5) * 4.4 * steadiness +
              Math.sin(linear * 30) * 0.6 +
              (atSpace ? 2.6 : 0);
            bob += (bobTarget - bob) * 0.16;

            const tiltTarget =
              -36 +
              (seededRandom(seed + 0.51) - 0.5) * 14 +
              Math.min(velocity * 140, 4.5);
            tilt += (tiltTarget - tilt) * 0.1;

            // Advance along the line + layer finger-bob on the wrapper.
            pencil.style.left = `${eased * 100}%`;
            pencil.style.transform = `translate(-50%, ${bob.toFixed(2)}px)`;

            // The shaft pivots around its graphite tip (transform-origin set
            // on .wb-pencil) so the nib never leaves the writing line.
            const svg = pencil.querySelector("svg");
            if (svg) svg.style.transform = `rotate(${tilt.toFixed(2)}deg)`;

            // Contact with the board: pressing harder darkens + widens the
            // graphite smear; over spaces it dries up until the next word.
            const pressure = Math.max(0, Math.min(1, 1 - (bob + 2.2) / 5));
            const smudge = pencil.querySelector<HTMLElement>(".wb-smudge");
            if (smudge) {
              smudge.style.opacity = String(
                atSpace ? 0.22 : 0.55 + pressure * 0.45
              );
              smudge.style.transform = `translate(-50%, -50%) scale(${(
                0.75 +
                pressure * 0.35
              ).toFixed(2)})`;
            }
            // The pencil's own shadow on the board spreads + fades as the
            // hand rises, then tightens as it presses back down.
            const shadow =
              pencil.querySelector<HTMLElement>(".wb-pencil-shadow");
            if (shadow) {
              shadow.style.opacity = String(Math.max(0, 0.32 - bob * 0.06));
              shadow.style.transform = `translateX(-50%) scale(${(
                1 +
                bob * 0.06
              ).toFixed(2)})`;
            }
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

    /** The hand finishes the line — the pencil rises off the board, then the
     *  component unmounts it, so every new line gets a fresh approach. */
    function liftPencil(): Promise<void> {
      return new Promise((resolve) => {
        const pencil = descPenRef.current;
        if (!pencil) {
          resolve();
          return;
        }
        // Contact effects die first — the nib has already left the board.
        const smudge = pencil.querySelector<HTMLElement>(".wb-smudge");
        const shadow = pencil.querySelector<HTMLElement>(".wb-pencil-shadow");
        if (smudge) smudge.style.opacity = "0";
        if (shadow) shadow.style.opacity = "0";
        requestAnimationFrame(() => {
          if (loopCancelledRef.current) {
            resolve();
            return;
          }
          pencil.style.transition =
            "transform 420ms cubic-bezier(0.33,1,0.68,1), opacity 360ms ease-in";
          pencil.style.transform = "translate(-50%, -26px) rotate(3deg)";
          pencil.style.opacity = "0";
          window.setTimeout(resolve, TIMING.pencilLiftMs);
        });
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
            // Fresh nib — no smudge, resting at the very start.
            descPenRef.current.style.left = "0%";
            descPenRef.current.style.transform = "translate(-50%, 0px)";
            descPenRef.current.style.opacity = "1";
            const freshSmudge =
              descPenRef.current.querySelector<HTMLElement>(".wb-smudge");
            if (freshSmudge) freshSmudge.style.opacity = "0";
          }

          // The hand carries the pencil down to the board before writing.
          if (!prefersReduced) {
            await sleep(TIMING.pencilEntryMs, loopCancelledRef);
            if (loopCancelledRef.current) return;
          }

          await revealDescription(i);
          if (loopCancelledRef.current) return;
          if (!prefersReduced) await liftPencil();
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
