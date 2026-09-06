"use client";

import { useRef } from "react";
import { FOCUS_ITEMS, ZIGZAG_PATH } from "./data";
import { useInView } from "./use-in-view";
import { useIconDrawing } from "./use-icon-drawing";
import { useDescriptionCycle } from "./use-description-cycle";
import { FocusGrid } from "./focus-grid";
import { DescriptionBlock } from "./description-block";
import { MarkerTray } from "./marker-tray";
import { BoardHeader } from "./board-header";
import { MarkerPen } from "./pencils";



const IN_VIEW_THRESHOLD = 0.25;

export default function WhiteboardFocusScene() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const zigzagRef = useRef<SVGSVGElement>(null);
  const iconRefs = useRef<(SVGSVGElement | null)[]>([]);
  const overlayRef = useRef<SVGSVGElement>(null);
  const penRef = useRef<SVGGElement>(null);
  const revealMaskRef = useRef<HTMLSpanElement>(null);
  const descPenRef = useRef<HTMLSpanElement>(null);

  const inView = useInView(sceneRef, { threshold: IN_VIEW_THRESHOLD });
  const hasPlayedRef = useRef(false);

  const { revealedIcons, iconsDone } = useIconDrawing({
    inView,
    hasPlayedRef,
    zigzagRef,
    iconRefs,
    overlayRef,
    penRef,
  });

  const { activeIndex, isTyping, isErasing } = useDescriptionCycle({
    iconsDone,
    inView,
    revealMaskRef,
    descPenRef,
  });

  const activeItem = FOCUS_ITEMS[activeIndex] ?? FOCUS_ITEMS[0]!;

  return (
    <section
      ref={sceneRef}
      aria-label="Focus areas"
      className="bg-background relative flex w-full justify-center overflow-hidden px-6 py-16 sm:px-10 sm:py-24"
    >
      {/* CSS-only aurora — dim focus-accent glows drifting behind the board
            (compositor-only transform animation, costs almost nothing) */}
      {/* <AuroraBackground className="pointer-events-none absolute inset-0 overflow-hidden" /> */}

      {/* soft dotted wall behind the board */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.045)_1px,transparent_1px)] [background-size:22px_22px]"
      />

      <div className="relative w-full max-w-2xl">
        <BoardHeader />

        {/* The board */}
        <div className="relative rounded-[1.75rem] bg-[#fdfdfb] bg-[radial-gradient(circle,rgba(0,0,0,0.05)_1px,transparent_1px)] [background-size:18px_18px] p-6 shadow-[0_30px_70px_-30px_rgba(0,0,0,0.7)] ring-1 ring-black/5 sm:p-10">
          {/* washi tape holding the board in place */}
          <span
            aria-hidden="true"
            className="absolute -top-3 left-10 h-6 w-24 -rotate-6 rounded-[3px] bg-purple-300/45 shadow-sm"
          />
          <span
            aria-hidden="true"
            className="absolute -top-3 right-10 h-6 w-24 rotate-3 rounded-[3px] bg-amber-300/45 shadow-sm"
          />

          <div className="relative">
            {/* red scribble that draws once on entry */}
            <svg
              ref={zigzagRef}
              viewBox="0 0 220 65"
              fill="none"
              className="mx-auto mb-2 block w-[55%] max-w-[220px]"
            >
              <path
                d={ZIGZAG_PATH}
                stroke="#d64545"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <FocusGrid
              revealed={revealedIcons}
              activeIndex={activeIndex}
              highlight={iconsDone && !isErasing}
              registerIcon={(index, node) => {
                iconRefs.current[index] = node;
              }}
            />

            <DescriptionBlock
              item={activeItem}
              index={activeIndex}
              isTyping={isTyping}
              isErasing={isErasing}
              revealMaskRef={revealMaskRef}
              descPenRef={descPenRef}
            />

            {/* marker tray, resting inside the board */}
            <div className="mt-8 border-t border-dashed border-black/10 pt-5">
              <MarkerTray />
            </div>

            {/* overlay the marker pen travels on during icon drawing */}
            <svg
              ref={overlayRef}
              className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
            >
              <MarkerPen penRef={penRef} />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
