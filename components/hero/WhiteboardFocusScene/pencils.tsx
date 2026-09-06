"use client";

import type { Ref } from "react";

/** Bold marker drawn by JS while the icons/zigzag are being drawn. */
export function MarkerPen({ penRef }: { penRef: Ref<SVGGElement> }) {
  return (
    <g
      ref={penRef}
      className="opacity-0 transition-opacity duration-150 ease-out"
    >
      <path d="M0,0 L-10,-4 L-32,-4 L-32,4 L-10,4 Z" fill="#242424" />
      <circle cx={0} cy={0} r={2.4} fill="#e2b33d" />
    </g>
  );
}

/** Tiny pencil that rides under the description while it is being written. */
export function HandPencil({ pencilRef }: { pencilRef: Ref<HTMLSpanElement> }) {
  return (
    <span
      ref={pencilRef}
      className="absolute -bottom-2 left-0 z-10"
      aria-hidden="true"
    >
      <svg
        width={30}
        height={24}
        viewBox="0 0 34 26"
        className="-translate-x-1 translate-y-1"
      >
        <line
          x1="30"
          y1="4"
          x2="7"
          y2="20"
          stroke="#f2c94c"
          strokeWidth={6}
          strokeLinecap="round"
        />
        <polygon points="7,20 2,24.5 4.5,16" fill="#4a3a2c" />
        <polygon points="4.5,16 7,20 8.5,17.5" fill="#1c1c1c" />
        <rect
          x="26"
          y="0"
          width="7"
          height="8"
          rx="1.5"
          fill="#f7b6c2"
          transform="rotate(34 29.5 4)"
        />
      </svg>
    </span>
  );
}
