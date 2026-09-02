"use client";

import { useMotionValue, useSpring, useTransform } from "motion/react";
import type { MouseEvent } from "react";

const TILT_MAX = 5;

export function useTilt() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 160, damping: 22, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 160, damping: 22, mass: 0.6 });

  const rotateX = useTransform(springY, [-0.5, 0.5], [TILT_MAX, -TILT_MAX]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-TILT_MAX, TILT_MAX]);

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();

    if (!rect.width || !rect.height) {
      return;
    }

    x.set((event.clientX - rect.left) / rect.width - 0.5);
    y.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return {
    x,
    y,
    rotateX,
    rotateY,
    handleMouseMove,
    handleMouseLeave,
  };
}
