"use client";

import type { Ref } from "react";

/**
 * Bold marker drawn by JS while the icons/zigzag are being drawn.
 * Detailed Sharpie-style marker: ink nib, tip cone, brand text, gold grip
 * band, colored cap band + metal pocket clip. Body, cap band + ink nib so it
 * reads like a real whiteboard marker.
 */
export function MarkerPen({ penRef }: { penRef: Ref<SVGGElement> }) {
  return (
    <g
      ref={penRef}
      className="opacity-0 transition-opacity duration-150 ease-out"
      style={{ filter: "drop-shadow(0 2px 1.5px rgba(0,0,0,0.3))" }}
    >
      {/* ink nib */}
      <circle cx={0} cy={0} r={2.5} fill="#e2b33d" />
      {/* nib gleam */}
      <circle cx={-0.9} cy={-0.9} r={0.8} fill="#f6dc9a" opacity={0.75} />
      {/* tip cone */}
      <path d="M0,0 L-10,-4 L-10,4 Z" fill="#343434" />
      {/* barrel */}
      <path d="M-10,-4 L-33,-4 L-33,4 L-10,4 Z" fill="#212121" />
      {/* barrel sheen */}
      <path
        d="M-11,-3.1 L-31.5,-3.3 L-31.5,-2.4 L-11,-2.6 Z"
        fill="#ffffff"
        opacity="0.16"
      />
      {/* brand text */}
      <text
        x={-21.5}
        y={1.5}
        textAnchor="middle"
        fontSize={3.8}
        fontFamily="'Arial Black', 'Helvetica Neue', Arial, sans-serif"
        fontWeight={900}
        fill="#ececec"
        opacity={0.92}
        style={{ letterSpacing: "0.6px" }}
      >
        PRO-MARK
      </text>
      {/* gold grip band near the tip */}
      <rect x={-13.2} y={-3.8} width={3} height={7.6} rx={0.9} fill="#d9a227" />
      <rect
        x={-13.8}
        y={-3.8}
        width={1.1}
        height={7.6}
        rx={0.5}
        fill="#f5cc62"
        opacity={0.65}
      />
      {/* colored cap band — matches the gold ink family */}
      <rect x={-33} y={-4} width={2.7} height={8} fill="#c78706" />
      {/* back cap */}
      <path d="M-35.7,-4 L-40.5,-3 L-40.5,3 L-35.7,4 Z" fill="#333333" />
      <path d="M-40.5,-3 L-41.8,-2.6 L-41.8,2.6 L-40.5,3 Z" fill="#1c1c1c" />
      {/* cap sheen */}
      <path
        d="M-36.3,-3.1 L-39.4,-2.3 L-39.4,-1.4 L-36.3,-2.5 Z"
        fill="#ffffff"
        opacity="0.18"
      />
      {/* metal pocket clip */}
      <path
        d="M-34.4,-3.4 L-46.5,-4 L-46.5,-0.6 L-34.4,-0.9 Z"
        fill="#c4ccd6"
        opacity={0.9}
      />
      <path
        d="M-46.5,-4 L-46.5,-0.6 L-47.8,-1.1 L-47.8,-3.5 Z"
        fill="#5b616b"
      />
    </g>
  );
}

/**
 * Tiny wooden pencil that rides under the description while it is written.
 * The outer span is moved left-to-right by with the description (left %),
 * then every frame the hook layers a finger-bob + dynamic angle on top so the
 * nib genuinely looks like it is tracing each letter. A soft graphite smudge
 * sits at the tip to sell the contact with the board.
 */
export function HandPencil({ pencilRef }: { pencilRef: Ref<HTMLSpanElement> }) {
  return (
    <span
      ref={pencilRef}
      className="absolute -bottom-3 left-0 z-10"
      style={{ transform: "translate(-50%, 0)" }}
      aria-hidden="true"
    >
      {/* graphite dust right under the nib where it meets the board */}
      <span
        className="wb-smudge"
        style={{ left: "50%", top: "88%", transform: "translate(-50%, -50%)" }}
      />
      {/* soft contact shadow on the board; JS spreads it as the hand lifts */}
      <span className="wb-pencil-shadow" style={{ left: "56%", top: "91%" }} />

      {/* Entry: a middle wrapper carries the slide-in animation so it never
          fights the per-frame transforms the hook writes below it. */}
      <span className="wb-pencil-enter">
        <svg
          width={18}
          height={54}
          viewBox="0 0 40 120"
          className="wb-pencil"
          style={{
            filter: "drop-shadow(0 2px 1.5px rgba(70,45,10,0.32))",
          }}
        >
          <defs>
            {/* yellow hexagonal body */}
            <linearGradient id="wb-pencil-body" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#fde68a" />
              <stop offset="35%" stopColor="#facc15" />
              <stop offset="100%" stopColor="#c78706" />
            </linearGradient>
            {/* bare wood cone */}
            <linearGradient id="wb-pencil-wood" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#e2b57a" />
              <stop offset="100%" stopColor="#a86a27" />
            </linearGradient>
            {/* metal ferrule */}
            <linearGradient id="wb-pencil-ferrule" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#c8cdd4" />
              <stop offset="35%" stopColor="#f4f5f7" />
              <stop offset="65%" stopColor="#9ca3af" />
              <stop offset="100%" stopColor="#b5bbc3" />
            </linearGradient>
            {/* pink eraser */}
            <linearGradient id="wb-pencil-eraser" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#fda4af" />
              <stop offset="60%" stopColor="#fb7185" />
              <stop offset="100%" stopColor="#e11d48" />
            </linearGradient>
            {/* graphite lead */}
            <linearGradient id="wb-pencil-lead" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6b7280" />
              <stop offset="100%" stopColor="#111113" />
            </linearGradient>
          </defs>

          {/* eraser */}
          <rect
            x="10.5"
            y="1.5"
            width="19"
            height="13"
            rx="4.5"
            fill="url(#wb-pencil-eraser)"
          />
          {/* eraser gloss */}
          <rect
            x="12.5"
            y="3"
            width="6"
            height="3"
            rx="1.5"
            fill="#fff"
            opacity="0.5"
          />
          {/* eraser top rounding shadow */}
          <path
            d="M12,15.7 Q13,13.2 14.5,12.6"
            stroke="#fff"
            strokeWidth="0.7"
            fill="none"
            opacity="0.4"
          />
          {/* worn eraser seam where it meets the ferrule */}
          <rect
            x="10.6"
            y="13.8"
            width="18.8"
            height="1.1"
            fill="#a21c3f"
            opacity="0.5"
          />
          <rect
            x="11"
            y="14.6"
            width="18"
            height="0.6"
            fill="#7d1630"
            opacity="0.35"
          />

          {/* metal ferrule */}
          <rect
            x="9.5"
            y="15"
            width="21"
            height="9"
            rx="1.5"
            fill="url(#wb-pencil-ferrule)"
          />
          {/* ferrule ridges */}
          <line
            x1="9.5"
            y1="17.8"
            x2="30.5"
            y2="17.8"
            stroke="#6b7280"
            strokeWidth="0.7"
            opacity="0.55"
          />
          <line
            x1="9.5"
            y1="20.6"
            x2="30.5"
            y2="20.6"
            stroke="#6b7280"
            strokeWidth="0.7"
            opacity="0.55"
          />
          <line
            x1="9.5"
            y1="23.2"
            x2="30.5"
            y2="23.2"
            stroke="#6b7280"
            strokeWidth="0.55"
            opacity="0.4"
          />
          {/* ferrule drop seam onto the wood */}
          <rect
            x="9.5"
            y="23.6"
            width="21"
            height="1.1"
            fill="#000"
            opacity="0.28"
          />

          {/* hexagonal body */}
          <rect
            x="9"
            y="24.7"
            width="22"
            height="55.8"
            fill="url(#wb-pencil-body)"
          />
          {/* facet shading */}
          <rect
            x="9"
            y="24.7"
            width="3.4"
            height="55.8"
            fill="#8a6106"
            opacity="0.28"
          />
          <rect
            x="27.6"
            y="24.7"
            width="3.4"
            height="55.8"
            fill="#6b4a04"
            opacity="0.36"
          />
          {/* sheen */}
          <rect
            x="12.6"
            y="24.7"
            width="1.5"
            height="55.8"
            fill="#fff"
            opacity="0.42"
          />
          {/* finger-worn smear near the grip area */}
          <rect
            x="9"
            y="66"
            width="22"
            height="7"
            fill="#3f2d05"
            opacity="0.12"
          />
          <ellipse
            cx="16"
            cy="68.5"
            rx="3.4"
            ry="2.2"
            fill="#3f2d05"
            opacity="0.18"
          />
          <ellipse
            cx="24.5"
            cy="69"
            rx="2.6"
            ry="1.8"
            fill="#3f2d05"
            opacity="0.15"
          />
          {/* paint scuff marks */}
          <path
            d="M11.5,31 L16,31.6"
            stroke="#fff"
            strokeWidth="0.5"
            opacity="0.3"
          />
          <path
            d="M26,42 L29.4,42.6"
            stroke="#6b4a04"
            strokeWidth="0.5"
            opacity="0.5"
          />
          {/* hand-stamped HB mark */}
          <rect
            x="13"
            y="56"
            width="14"
            height="6.5"
            rx="1.2"
            fill="rgba(96,64,16,0.25)"
          />
          <text
            x="20"
            y="60.8"
            textAnchor="middle"
            fontSize="4.6"
            fontFamily="ui-monospace, Menlo, monospace"
            fontWeight="700"
            fill="#4a3513"
            opacity="0.85"
          >
            HB
          </text>

          {/* freshly-sharpened pale ring where body meets the wood cone */}
          <path
            d="M10,80 Q20,83.6 30,80 L30,81.2 Q20,84.8 10,81.2 Z"
            fill="#a86a27"
            opacity="0.3"
          />

          {/* wood cone */}
          <polygon
            points="10,80.5 30,80.5 20,101"
            fill="url(#wb-pencil-wood)"
          />
          <polygon
            points="20,80.5 30,80.5 20,101"
            fill="#6b3f0e"
            opacity="0.16"
          />
          {/* streak of raw darker wood */}
          <polygon
            points="16.5,81 24.5,81 20.5,99"
            fill="#7a4a12"
            opacity="0.2"
          />
          {/* wood grain — fine curls, varying depth */}
          <path
            d="M14,84.5 Q17,91 17.8,98.5"
            stroke="#8a5a1f"
            strokeWidth="0.6"
            fill="none"
            opacity="0.38"
          />
          <path
            d="M26.4,84.5 Q23.2,91 22.6,98.5"
            stroke="#8a5a1f"
            strokeWidth="0.6"
            fill="none"
            opacity="0.34"
          />
          <path
            d="M18.6,85.6 Q20,92.5 19.7,98.8"
            stroke="#9c6a26"
            strokeWidth="0.45"
            fill="none"
            opacity="0.28"
          />
          {/* graphite dust flecks brushed on the wood */}
          <circle cx="15.2" cy="90" r="0.5" fill="#3b3b3b" opacity="0.55" />
          <circle cx="24" cy="92.5" r="0.4" fill="#3b3b3b" opacity="0.45" />
          <circle cx="18.4" cy="94.5" r="0.35" fill="#3b3b3b" opacity="0.4" />

          {/* graphite tip */}
          <polygon
            points="16.6,99.6 20,109 23.4,99.6"
            fill="url(#wb-pencil-lead)"
          />
          {/* lead gleam */}
          <path
            d="M19.4,101.6 L19.9,106.8 L20.9,103.2 Z"
            fill="#c9ced6"
            opacity="0.6"
          />
        </svg>
      </span>
    </span>
  );
}
