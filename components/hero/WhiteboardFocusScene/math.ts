import type { RefObject } from "react";

/** Smooth acceleration / deceleration used by every handwriting animation. */
export function easeInOutQuad(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

/** Deterministic pseudo-random in [0,1) so each letter's jitter is stable. */
export function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

/** Delay helper that bails out immediately when the loop is cancelled. */
export function sleep(
  ms: number,
  cancelledRef: RefObject<boolean>
): Promise<void> {
  return new Promise<void>((resolve) => {
    const t = setTimeout(resolve, ms);
    if (cancelledRef.current) {
      clearTimeout(t);
      resolve();
    }
  });
}
