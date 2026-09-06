"use client";

import type { RefObject } from "react";
import { type FocusItem } from "./data";
import { seededRandom } from "./math";
import { HandPencil } from "./pencils";

type DescriptionBlockProps = {
  item: FocusItem;
  /** Seed keeps every letter's handwriting jitter stable for this item. */
  index: number;
  isTyping: boolean;
  isErasing: boolean;
  revealMaskRef: RefObject<HTMLSpanElement | null>;
  descPenRef: RefObject<HTMLSpanElement | null>;
};

/** Small torn sketch note pinned under items that have a visual attached. */
function SketchNote({ accent }: { accent: string }): React.JSX.Element {
  return (
    <div
      className="mt-4 animate-[wb-pop_450ms_cubic-bezier(0.22,1,0.36,1)_both]"
      style={{ transform: "rotate(-1.5deg)" }}
      aria-hidden="true"
    >
      <div
        className="font-caveat flex h-20 w-36 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed"
        style={{
          borderColor: `${accent}55`,
          backgroundColor: `${accent}12`,
          color: `color-mix(in srgb, ${accent} 80%, #1c1c1c)`,
        }}
      >
        <span className="text-base leading-none">the saas project</span>
        <span className="text-xs opacity-70">sketched while shipping…</span>
      </div>
    </div>
  );
}

/**
 * Handwritten description. Letters carry a slight hand-drawn jitter; the
 * reveal mask + pencil progress are driven imperatively by the cycle hook.
 */
export function DescriptionBlock({
  item,
  index,
  isTyping,
  isErasing,
  revealMaskRef,
  descPenRef,
}: DescriptionBlockProps): React.JSX.Element {
  return (
    <div className="flex min-h-[5.25rem] flex-col items-center sm:min-h-[5.5rem]">
      <p
        className="font-caveat relative inline-block max-w-[34ch] text-center text-[clamp(1.15rem,3.4vw,1.6rem)] leading-snug transition-all duration-500 ease-out [text-shadow:0.5px_0.4px_0_rgba(40,40,40,0.18),-0.3px_0.3px_0_rgba(40,40,40,0.08)]"
        style={{
          color: `color-mix(in srgb, ${item.accent} 78%, #1f1f1f)`,
          opacity: isErasing ? 0 : 1,
          filter: isErasing ? "blur(1.5px)" : "blur(0px)",
          transform: isErasing ? "translateY(2px)" : "translateY(0px)",
        }}
      >
        <span
          ref={revealMaskRef}
          className="inline-block"
          style={{ clipPath: "inset(0 100% 0 0)" }}
        >
          {item.description.split("").map((ch, i) => {
            const seed = index * 1000 + i;
            const rotate = (seededRandom(seed) - 0.5) * 6;
            const riseY = (seededRandom(seed + 0.37) - 0.5) * 3;
            return (
              <span
                key={`${item.id}-${i}`}
                className="inline-block"
                style={{
                  transform: `rotate(${rotate}deg) translateY(${riseY}px)`,
                }}
              >
                {ch === " " ? "\u00A0" : ch}
              </span>
            );
          })}
        </span>

        {isTyping && <HandPencil pencilRef={descPenRef} />}
      </p>

      <span className="sr-only" aria-live="polite">
        {item.description}
      </span>

      {item.hasImage && !isTyping && !isErasing ? (
        <SketchNote accent={item.accent} />
      ) : null}
    </div>
  );
}
