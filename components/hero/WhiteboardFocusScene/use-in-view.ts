"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * Returns true while `ref` is intersecting the viewport.
 * Used to start the drawing once and pause the description loop off-screen.
 */
export function useInView<T extends HTMLElement>(
  ref: RefObject<T | null>,
  options?: IntersectionObserverInit
): boolean {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver((entries) => {
      setInView(entries.some((entry) => entry.isIntersecting));
    }, options);
    observer.observe(node);

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);

  return inView;
}
