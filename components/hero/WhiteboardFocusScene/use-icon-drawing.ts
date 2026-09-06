"use client";

import { useEffect, useState, type RefObject } from "react";
import {
  DRAWABLE_SELECTOR,
  FOCUS_ITEMS,
  TIMING,
  type DrawableElement,
  type DrawableGroup,
} from "./data";

type IconDrawingOptions = {
  inView: boolean;
  /** 1st scroll into view plays the draw once; later visits reuse the result. */
  hasPlayedRef: RefObject<boolean>;
  zigzagRef: RefObject<SVGSVGElement | null>;
  iconRefs: RefObject<(SVGSVGElement | null)[]>;
  overlayRef: RefObject<SVGSVGElement | null>;
  penRef: RefObject<SVGGElement | null>;
};

function collectElements(groups: DrawableGroup[]): DrawableElement[] {
  const elements: DrawableElement[] = [];

  groups.forEach((group) => {
    const shapes = Array.from(
      group.svg.querySelectorAll<SVGGeometryElement>(DRAWABLE_SELECTOR)
    );
    shapes.forEach((el, i) => {
      let len = 0;
      try {
        len = el.getTotalLength ? el.getTotalLength() : 0;
      } catch {
        len = 0;
      }
      if (len > 0) {
        el.style.strokeDasharray = String(len);
        el.style.strokeDashoffset = String(len);
        elements.push({
          el,
          len,
          group,
          isLastOfGroup: i === shapes.length - 1,
        });
      }
    });
  });

  return elements;
}

function revealAllShapes(groups: DrawableGroup[]): void {
  groups.forEach((group) => {
    group.svg
      .querySelectorAll<SVGGeometryElement>(DRAWABLE_SELECTOR)
      .forEach((el) => {
        el.style.strokeDasharray = "none";
        el.style.strokeDashoffset = "0";
      });
  });
}

/**
 * Phase 1 — draws the zigzag line + every icon once with a marker pen that
 * tracks the real path geometry frame by frame.
 */
export function useIconDrawing({
  inView,
  hasPlayedRef,
  zigzagRef,
  iconRefs,
  overlayRef,
  penRef,
}: IconDrawingOptions): {
  revealedIcons: boolean[];
  iconsDone: boolean;
} {
  const [revealedIcons, setRevealedIcons] = useState<boolean[]>(() =>
    FOCUS_ITEMS.map(() => false)
  );
  const [iconsDone, setIconsDone] = useState(false);

  useEffect(() => {
    if (!inView || hasPlayedRef.current) return;
    hasPlayedRef.current = true;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const groups: DrawableGroup[] = [];
    if (zigzagRef.current) {
      groups.push({ kind: "zigzag", svg: zigzagRef.current });
    }
    iconRefs.current.forEach((svg, index) => {
      if (svg) groups.push({ kind: "icon", svg, index });
    });

    // Reduced motion: show everything instantly, skip the draw.
    if (prefersReduced) {
      revealAllShapes(groups);
      setRevealedIcons(FOCUS_ITEMS.map(() => true));
      setIconsDone(true);
      return;
    }

    const elements = collectElements(groups);
    if (elements.length === 0) {
      setIconsDone(true);
      return;
    }

    let index = 0;
    let start: number | null = null;
    let rafId = 0;
    let gapTimeoutId: ReturnType<typeof setTimeout> | undefined;

    function positionPen(el: SVGGeometryElement, distance: number): void {
      if (!penRef.current || !overlayRef.current) return;

      const overlayCTM = overlayRef.current.getScreenCTM();
      const elCTM = el.getScreenCTM();
      if (!overlayCTM || !elCTM) return;
      const inverseCTM = overlayCTM.inverse();

      try {
        const tip = el.getPointAtLength(distance).matrixTransform(elCTM);
        const tipLocal = tip.matrixTransform(inverseCTM);
        const behindDist = Math.max(distance - 1.5, 0);
        const behind = el.getPointAtLength(behindDist).matrixTransform(elCTM);
        const behindLocal = behind.matrixTransform(inverseCTM);
        const angle =
          Math.atan2(tipLocal.y - behindLocal.y, tipLocal.x - behindLocal.x) *
          (180 / Math.PI);

        penRef.current.setAttribute(
          "transform",
          `translate(${tipLocal.x}, ${tipLocal.y}) rotate(${angle})`
        );
        penRef.current.style.opacity = "1";
      } catch {
        // geometry not ready this frame — skip
      }
    }

    function step(timestamp: number): void {
      if (start === null) start = timestamp;

      const element = elements[index];
      if (!element) return;

      const { el, len, group, isLastOfGroup } = element;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / TIMING.drawMs, 1);

      el.style.strokeDashoffset = String(len * (1 - progress));
      positionPen(el, len * progress);

      if (progress >= 1) {
        if (isLastOfGroup && group.kind === "icon") {
          setRevealedIcons((prev) => {
            const next = [...prev];
            next[group.index] = true;
            return next;
          });
        }

        index += 1;
        if (index >= elements.length) {
          if (penRef.current) penRef.current.style.opacity = "0";
          setIconsDone(true);
          return;
        }

        const gap = isLastOfGroup ? TIMING.iconDoneGapMs : TIMING.gapMs;
        start = null;
        gapTimeoutId = setTimeout(() => {
          rafId = requestAnimationFrame(step);
        }, gap);
        return;
      }

      rafId = requestAnimationFrame(step);
    }

    rafId = requestAnimationFrame(step);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (gapTimeoutId) clearTimeout(gapTimeoutId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return { revealedIcons, iconsDone };
}
