"use client";

import { useEffect, useRef, useState } from "react";
import {
  createTimeline,
  onScroll,
  stagger,
  type ScrollObserver,
} from "animejs";
import { ArrowUpRight } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";

import { FOCUS_DATA } from "./focus-data";

/**
 * Camera-lens focus section — an anime.js scroll experience.
 *
 * A 420vh runway pins a full-viewport stage. One master timeline is scrubbed
 * by the scroll position (onScroll sync), so the whole story plays forward
 * and backward smoothly with the wheel:
 *
 *   0–14   → the shutter opens, the lens boots up, the headline rises word by word
 *   14–100 → the four focus topics cycle one by one beside the lens; at every
 *            hand-off the lens rotates 45° and the glow + glass tint shift to
 *            the next topic's accent.
 */

// Timeline map (1 unit = 1% of the runway scroll)
const INTRO_END = 14;
const SEGMENT = (100 - INTRO_END) / FOCUS_DATA.length;
const N_ITEMS = FOCUS_DATA.length;

const SEG_START = (i: number): number => INTRO_END + i * SEGMENT;
const SEG_END = (i: number): number => SEG_START(i) + SEGMENT;

// Hand-off windows between topics (lens turn + accent crossfade)
const HANDOFF = (i: number): number => SEG_END(i) - 2;

const clamp = (v: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, v));

const TAU = Math.PI * 2;
const CX = 240;
const CY = 240;

const polarX = (radius: number, angle: number): number =>
  CX + radius * Math.sin(angle);
const polarY = (radius: number, angle: number): number =>
  CY - radius * Math.cos(angle);

/* ---------------------------------- SVG ---------------------------------- */

const TICKS = Array.from({ length: 72 }, (_, i) => i * (360 / 72));
const DOTS = Array.from({ length: 24 }, (_, i) => i * (TAU / 24));
const BLADES = Array.from({ length: 8 }, (_, i) => i * (360 / 8));

const strokeStyle = (opacity: number): CSSProperties => ({
  fill: "none",
  stroke: `color-mix(in srgb, var(--foreground) ${Math.round(opacity * 100)}%, transparent)`,
  transformBox: "view-box",
  transformOrigin: `${CX}px ${CY}px`,
});

// SVG CSS transforms default to the viewBox origin (0,0) — every group the
// timeline rotates/scales must pivot around the optical center instead.
const pivotStyle: CSSProperties = {
  transformBox: "view-box",
  transformOrigin: `${CX}px ${CY}px`,
};

/* --------------------------- Bokeh particles --------------------------- */
const BOKEH = [
  { r: 12, x: 70, y: 80, delay: 0 },
  { r: 8, x: 150, y: 50, delay: 1.2 },
  { r: 15, x: 30, y: 160, delay: 0.6 },
  { r: 6, x: 180, y: 120, delay: 1.8 },
  { r: 10, x: 90, y: 200, delay: 0.3 },
  { r: 7, x: 140, y: 180, delay: 2.1 },
  { r: 13, x: 50, y: 130, delay: 0.9 },
  { r: 9, x: 170, y: 70, delay: 1.5 },
];

function LensSvg({ idPrefix }: { idPrefix: string }): ReactNode {
  const glassId = `${idPrefix}-glass`;
  const sheenId = `${idPrefix}-sheen`;
  const bokehId = `${idPrefix}-bokeh`;
  const flareId = `${idPrefix}-flare`;
  const ringGradId = `${idPrefix}-ring-grad`;
  const innerGlowId = `${idPrefix}-inner-glow`;

  return (
    <svg viewBox="0 0 480 480" className="h-full w-full" aria-hidden="true">
      <defs>
        <radialGradient id={glassId} cx="42%" cy="38%" r="72%">
          <stop offset="0%" stopColor="#3a3a42" />
          <stop offset="25%" stopColor="#1e1e24" />
          <stop offset="60%" stopColor="#0e0e12" />
          <stop offset="100%" stopColor="#020203" />
        </radialGradient>
        <radialGradient id={sheenId} cx="35%" cy="28%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
          <stop offset="40%" stopColor="#ffffff" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <filter id={bokehId} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
        <linearGradient id={flareId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={ringGradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.12" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.03" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.08" />
        </linearGradient>
        <radialGradient id={innerGlowId} cx="50%" cy="50%" r="50%">
          <stop offset="85%" stopColor="transparent" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.06" />
        </radialGradient>
      </defs>

      <circle
        cx={CX}
        cy={CY}
        r={238}
        style={{ ...strokeStyle(0.15), strokeWidth: 8 }}
        fill="color-mix(in srgb, var(--foreground) 3%, transparent)"
      />

      {/* Focus crosshair — shows active focus point */}
      <g className="focus-crosshair" style={pivotStyle}>
        <line x1={CX - 20} y1={CY} x2={CX - 8} y2={CY} style={{ ...strokeStyle(0.4), strokeWidth: 1, strokeLinecap: "round" }} />
        <line x1={CX + 8} y1={CY} x2={CX + 20} y2={CY} style={{ ...strokeStyle(0.4), strokeWidth: 1, strokeLinecap: "round" }} />
        <line x1={CX} y1={CY - 20} x2={CX} y2={CY - 8} style={{ ...strokeStyle(0.4), strokeWidth: 1, strokeLinecap: "round" }} />
        <line x1={CX} y1={CY + 8} x2={CX} y2={CY + 20} style={{ ...strokeStyle(0.4), strokeWidth: 1, strokeLinecap: "round" }} />
        <circle cx={CX} cy={CY} r={4} style={{ fill: "color-mix(in srgb, var(--foreground) 20%, transparent)" }} />
      </g>

      <g className="lens-dash-spin" style={pivotStyle}>
        <circle
          className="lens-dash"
          cx={CX}
          cy={CY}
          r={230}
          style={{ ...strokeStyle(0.35), strokeWidth: 1.5 }}
          strokeDasharray="2 9"
        />
      </g>

      <g className="lens-ticks-spin" style={pivotStyle}>
        {TICKS.map((angle, i) => {
          const major = i % 6 === 0;
          const a = (angle * Math.PI) / 180;
          const r1 = major ? 206 : 214;
          return (
            <line
              key={`tick-${angle}`}
              x1={polarX(r1, a)}
              y1={polarY(r1, a)}
              x2={polarX(224, a)}
              y2={polarY(224, a)}
              style={{
                ...strokeStyle(major ? 0.5 : 0.22),
                strokeWidth: major ? 1.6 : 1,
              }}
            />
          );
        })}
      </g>

      <g className="lens-dots" style={pivotStyle}>
        {DOTS.map((angle) => (
          <circle
            key={`dot-${angle}`}
            cx={polarX(252, angle)}
            cy={polarY(252, angle)}
            r={2}
            style={{
              fill: "color-mix(in srgb, var(--foreground) 30%, transparent)",
            }}
          />
        ))}
      </g>

      <g className="lens-rings" style={pivotStyle}>
        <circle cx={CX} cy={CY} r={200} style={{ ...strokeStyle(0.5), strokeWidth: 1.5 }} />
        <circle cx={CX} cy={CY} r={188} style={{ ...strokeStyle(0.07), strokeWidth: 11 }} />
        <circle cx={CX} cy={CY} r={158} style={{ ...strokeStyle(0.45), strokeWidth: 2 }} />
        <circle cx={CX} cy={CY} r={128} style={{ ...strokeStyle(0.22), strokeWidth: 1, strokeDasharray: "1 6" }} />
        <circle cx={CX} cy={CY} r={102} style={{ ...strokeStyle(0.4), strokeWidth: 1.5 }} />
        <circle cx={CX} cy={CY} r={102} style={{ fill: "none", stroke: `url(#${ringGradId})`, strokeWidth: 3 }} />
      </g>

      {/* Static text - does NOT rotate with the lens */}
      <g>
        <text x={CX} y={64} textAnchor="middle" style={{ fill: "color-mix(in srgb, var(--foreground) 34%, transparent)", fontFamily: "var(--font-mono), monospace", fontSize: 11, letterSpacing: "0.32em" }}>RBP · FOCUS ENGINE</text>
        <text x={CX} y={432} textAnchor="middle" style={{ fill: "color-mix(in srgb, var(--foreground) 26%, transparent)", fontFamily: "var(--font-mono), monospace", fontSize: 10, letterSpacing: "0.28em" }}>50MM · F/1.4</text>
      </g>

      <circle cx={CX} cy={CY} r={96} fill={`url(#${innerGlowId})`} />

      {/* Aperture blades */}
      <g className="lens-blades" style={pivotStyle}>
        {BLADES.map((angle) => {
          const a = (angle * Math.PI) / 180;
          return (
            <line
              key={`blade-${angle}`}
              x1={polarX(108, a)}
              y1={polarY(108, a)}
              x2={polarX(146, a)}
              y2={polarY(146, a)}
              style={{
                ...strokeStyle(0.55),
                strokeWidth: 3,
                strokeLinecap: "round",
              }}
            />
          );
        })}
      </g>

      {/* Glass — dark optical center with per-topic accent tints */}
      <g
        className="lens-glass"
        style={{ transformBox: "view-box", transformOrigin: `${CX}px ${CY}px` }}
      >
        <circle cx={CX} cy={CY} r={86} fill={`url(#${glassId})`} />
        {FOCUS_DATA.map((item) => (
          <circle
            key={`tint-${item.id}`}
            className="lens-tint"
            cx={CX}
            cy={CY}
            r={86}
            fill={item.accent}
            fillOpacity={0.22}
            style={{ opacity: 0, mixBlendMode: "screen" }}
          />
        ))}
        <circle cx={CX} cy={CY} r={86} fill={`url(#${sheenId})`} />

        {/* Bokeh particles floating inside lens */}
        <g className="lens-bokeh" filter={`url(#${bokehId})`}>
          {BOKEH.map((b, i) => (
            <circle
              key={`bokeh-${i}`}
              className="bokeh-particle"
              cx={CX - 100 + b.x}
              cy={CY - 100 + b.y}
              r={b.r}
              fill="none"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth={1.5}
              style={{
                animationDelay: `${b.delay}s`,
              }}
            />
          ))}
        </g>

        {/* Light rays rotating inside lens */}
        <g className="lens-lightrays" style={pivotStyle}>
          {[0, 60, 120, 180, 240, 300].map((angle) => {
            const a = (angle * Math.PI) / 180;
            return (
              <line
                key={`ray-${angle}`}
                x1={CX}
                y1={CY}
                x2={CX + 80 * Math.sin(a)}
                y2={CY - 80 * Math.cos(a)}
                stroke={`url(#${flareId})`}
                strokeWidth={2}
                strokeLinecap="round"
                opacity={0.4}
              />
            );
          })}
        </g>

        <circle
          cx={CX}
          cy={CY}
          r={86}
          style={{ ...strokeStyle(0.28), strokeWidth: 1.5 }}
        />
        <line
          x1={CX}
          y1={CY - 30}
          x2={CX}
          y2={CY - 18}
          style={strokeStyle(0.5)}
          strokeWidth={1.5}
        />
        <line
          x1={CX}
          y1={CY + 18}
          x2={CX}
          y2={CY + 30}
          style={strokeStyle(0.5)}
          strokeWidth={1.5}
        />
        <line
          x1={CX - 30}
          y1={CY}
          x2={CX - 18}
          y2={CY}
          style={strokeStyle(0.5)}
          strokeWidth={1.5}
        />
        <line
          x1={CX + 18}
          y1={CY}
          x2={CX + 30}
          y2={CY}
          style={strokeStyle(0.5)}
          strokeWidth={1.5}
        />
        <circle
          cx={CX}
          cy={CY}
          r={2.5}
          fill="var(--foreground)"
          fillOpacity={0.65}
        />
        <circle
          cx={CX}
          cy={CY}
          r={4}
          fill="var(--foreground)"
          opacity={0.8}
          className="lens-pulse"
        />
      </g>

      {/* Outer lens flare */}
      <circle
        className="lens-outer-flare"
        cx={CX}
        cy={CY}
        r={92}
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth={20}
      />
    </svg>
  );
}

/* --------------------------------- Panels -------------------------------- */

function PanelBody({ index }: { index: number }): ReactNode {
  const item = FOCUS_DATA[index]!;
  const Icon = item.icon;
  return (
    <>
      <div className="flex items-center gap-3">
        <span
          className="grid size-10 place-items-center rounded-xl border shadow-sm"
          style={{
            color: item.accent,
            backgroundColor: `${item.accent}14`,
            borderColor: `${item.accent}40`,
            boxShadow: `0 0 20px ${item.accent}20`,
          }}
        >
          <Icon size={18} strokeWidth={2} />
        </span>
        <span className="text-muted-foreground font-mono text-xs tracking-[0.22em] uppercase">
          {item.category}
        </span>
        <span
          className="ml-auto font-mono text-xs"
          style={{ color: item.accent }}
        >
          0{index + 1} / 0{N_ITEMS}
        </span>
      </div>

      {item.image && (
        <div
          className="relative mt-2 h-36 w-full overflow-hidden rounded-2xl border sm:h-44"
          style={{ borderColor: `${item.accent}25` }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
            style={{ backgroundImage: `url(${item.image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at 30% 40%, ${item.accent}15, transparent 60%)`,
            }}
          />
        </div>
      )}

      <h3 className="text-foreground text-[1.7rem] leading-[1.08] font-medium tracking-tight text-balance sm:text-[2.1rem]">
        {item.title}
      </h3>

      <p className="text-foreground/65 max-w-[52ch] text-[15px] leading-relaxed sm:text-base">
        {item.description}
      </p>

      {item.tech ? (
        <ul className="flex flex-wrap gap-2">
          {item.tech.map((tech) => (
            <li
              key={tech}
              className="border-foreground/12 text-foreground/60 rounded-full border px-2.5 py-1 font-mono text-[11px] transition-all duration-300 hover:border-foreground/30 hover:text-foreground/80"
            >
              {tech}
            </li>
          ))}
        </ul>
      ) : null}

      {item.href ? (
        <a
          href={item.href}
          className="focus-ring group/link mt-1 inline-flex w-fit items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition-all duration-300 hover:shadow-lg"
          style={{
            color: item.accent,
            borderColor: `${item.accent}45`,
            boxShadow: `0 0 0 0 ${item.accent}00`,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 20px ${item.accent}40`;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.boxShadow = `0 0 0 0 ${item.accent}00`;
          }}
        >
          Check it out
          <ArrowUpRight
            size={15}
            className="transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
          />
        </a>
      ) : null}
    </>
  );
}

/* --------------------------- Reduced-motion view --------------------------- */
/* Handled via CSS: the effect sets data-static on the section and the
   data-static rules in globals.css unpin the stage and stack all panels. */

/* ------------------------------ Main section ------------------------------ */

export function FocusLens(): ReactNode {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<HTMLSpanElement | null>(null);
  const zoneRef = useRef(0);
  const [zone, setZone] = useState(0);

  const active = FOCUS_DATA[zone] ?? FOCUS_DATA[0]!;

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      section.setAttribute("data-static", "");
      stage
        .querySelectorAll(".focus-panel")
        .forEach((panel) => panel.removeAttribute("inert"));
      return;
    }

    const $ = (selector: string): Element[] =>
      Array.from(stage.querySelectorAll(selector));

    const must = (selector: string): Element => {
      const el = stage.querySelector(selector);
      if (!el) throw new Error(`FocusLens: missing element "${selector}"`);
      return el;
    };

    const lensRoots = $(".lens-root");
    const glass = must(".lens-glass");
    const rings = must(".lens-rings");
    const blades = must(".lens-blades");
    const dash = must(".lens-dash");
    const dashSpin = must(".lens-dash-spin");
    const crosshair = must(".focus-crosshair");
    const ticksSpin = must(".lens-ticks-spin");
    const dots = must(".lens-dots");
    const tints = $(".lens-tint");
    const words = $(".hl-word");
    const kickers = $(".hl-kicker");
    const panels = $(".focus-panel");
    const glows = $(".focus-glow");
    const lightRays = must(".lens-lightrays");
    const outerFlare = must(".lens-outer-flare");
    const pulse = must(".lens-pulse");

    const scrollObserver = onScroll({
      target: section,
      enter: "top top",
      leave: "bottom bottom",
      repeat: true,
      sync: 0.55,
      onUpdate: (self: ScrollObserver) => {
        const p = clamp(self.progress, 0, 1);
        if (progressRef.current) {
          progressRef.current.style.transform = `scaleX(${p})`;
        }
        const next = clamp(
          Math.floor((p * 100 - INTRO_END) / SEGMENT),
          0,
          N_ITEMS - 1
        );
        if (next !== zoneRef.current) {
          zoneRef.current = next;
          setZone(next);
        }
      },
    });

    const tl = createTimeline({
      defaults: { ease: "linear" },
      autoplay: scrollObserver,
    });

    /* -- 0 → 14 · the shutter opens ------------------------------------ */
    lensRoots.forEach((root) => {
      tl.add(
        root,
        { opacity: [0, 1], scale: [1.28, 1], duration: 10, ease: "outExpo" },
        0
      );
    });
    tl.add(glass, { scale: [0.06, 1], duration: 9, ease: "outExpo" }, 0.5);
    tl.add(rings, { opacity: [0, 1], duration: 7 }, 1.5);
    tl.add(
      dash,
      { opacity: [0, 1], rotate: [-120, 0], duration: 9, ease: "outExpo" },
      2
    );
    tl.add(dots, { opacity: [0, 1], duration: 6 }, 2.5);
    tl.add(
      blades,
      { opacity: [0, 1], rotate: [-48, 0], duration: 8, ease: "outExpo" },
      3
    );
    tl.add(
      lightRays,
      { opacity: [0, 1], duration: 6 },
      4
    );
    tl.add(
      outerFlare,
      { opacity: [0, 1], duration: 8 },
      3
    );
    tl.add(
      pulse,
      { scale: [0, 1], opacity: [0, 1], duration: 5, ease: "outExpo" },
      5
    );
    tl.add(
      words,
      { y: ["115%", "0%"], duration: 6, ease: "outExpo", delay: stagger(1.2) },
      5
    );
    tl.add(kickers, { opacity: [0, 1], y: [14, 0], duration: 5 }, 6.5);

    /* -- scroll-linked micro motion (runs across the whole scrub) ------- */
    tl.add(ticksSpin, { rotate: [0, -60], duration: 100, ease: "linear" }, 0);
    tl.add(lightRays, { rotate: [0, 120], duration: 100, ease: "linear" }, 0);
    tl.add(outerFlare, { rotate: [0, -30], duration: 100, ease: "linear" }, 0);

    /* -- accent crossfades (glow behind the lens + glass tint) ---------- */
    glows.forEach((glow, i) => {
      if (i === 0) {
        tl.add(glow, { opacity: [0, 1], duration: 5 }, 12);
      } else {
        const at = HANDOFF(i - 1);
        tl.add(glows[i - 1]!, { opacity: [1, 0], duration: 5 }, at);
        tl.add(glow, { opacity: [0, 1], duration: 5 }, at);
      }
    });

    tints.forEach((tint, i) => {
      if (i === 0) {
        tl.add(tint, { opacity: [0, 1], duration: 5 }, 12);
      } else {
        const at = HANDOFF(i - 1);
        tl.add(tints[i - 1]!, { opacity: [1, 0], duration: 5 }, at);
        tl.add(tint, { opacity: [0, 1], duration: 5 }, at);
      }
    });

    // Focus mechanism — lens rotates to "focus" on each topic.
    // Realistic feel: quick snap rotation with slight overshoot, then settle.
    for (let i = 0; i < N_ITEMS - 1; i++) {
      const fromAngle = i * 45;
      const toAngle = (i + 1) * 45;
      const overshoot = toAngle + 3; // slight mechanical overshoot
      const at = HANDOFF(i) - 2;

      tl.add(
        blades,
        {
          rotate: [fromAngle, overshoot, toAngle],
          duration: 12,
          ease: "inOutExpo",
        },
        at
      );
    }

    // Fine-focus micro-motion during topic view (subtle hunting)
    for (let i = 0; i < N_ITEMS; i++) {
      const baseAngle = i * 45;
      const segStart = SEG_START(i);
      tl.add(
        dashSpin,
        {
          rotate: [baseAngle - 8, baseAngle + 8, baseAngle],
          duration: SEGMENT * 0.8,
          ease: "inOutSine",
        },
        segStart
      );
    }

    // Crosshair focus animation — fades in during transition, settles when locked
    tl.add(crosshair, { opacity: [0, 1], duration: 4 }, 12);
    for (let i = 0; i < N_ITEMS - 1; i++) {
      const at = HANDOFF(i) - 2;
      tl.add(crosshair, { opacity: [1, 0.3], duration: 3 }, at);
      tl.add(crosshair, { opacity: [0.3, 1], duration: 4, ease: "outExpo" }, at + 3);
    }

    /* -- focus panels: one by one ---------------------------------------- */
    panels.forEach((panel, i) => {
      tl.add(
        panel,
        { opacity: [0, 1], y: [56, 0], duration: 4.5, ease: "outExpo" },
        SEG_START(i)
      );
      if (i < N_ITEMS - 1) {
        tl.add(
          panel,
          { opacity: [1, 0], y: [0, -44], duration: 3.5, ease: "inExpo" },
          SEG_END(i) - 2
        );
      }
    });

    return () => {
      scrollObserver.revert();
      tl.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="lens-section relative h-[420vh]"
      aria-label="Current focus"
    >
      <div
        ref={stageRef}
        className="lens-stage border-foreground/8 sticky top-0 flex h-screen flex-col overflow-hidden border-y"
      >
        {/* Ambience — dot grid + per-topic accent glows */}
        <span
          aria-hidden="true"
          className="focus-grid pointer-events-none absolute inset-0"
        />
        {FOCUS_DATA.map((item) => (
          <span
            key={`glow-${item.id}`}
            className="focus-glow pointer-events-none absolute top-1/2 left-[26%] h-[44rem] w-[44rem] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              opacity: 0,
              background: `radial-gradient(closest-side, ${item.accent}1f, transparent 70%)`,
            }}
          />
        ))}

        {/* Header */}
        <header className="relative z-10 mx-auto w-full max-w-275 px-6 pt-24 sm:px-10 sm:pt-28">
          <div className="flex items-end justify-between gap-6">
            <div className="flex flex-col gap-3">
              <p className="hl-kicker text-muted-foreground flex items-center gap-2 font-mono text-[11px] tracking-[0.3em] uppercase">
                <span
                  className="size-1.5 rounded-full"
                  style={{ backgroundColor: active.accent }}
                />
                What I&apos;m focused on
              </p>
              <h2 className="text-foreground text-[2rem] leading-[1.04] font-medium tracking-tight sm:text-[2.6rem] lg:text-[3rem]">
                <span className="mr-[0.28em] inline-block overflow-hidden pb-[0.08em] align-bottom">
                  <span className="hl-word inline-block">My</span>
                </span>{" "}
                <span className="mr-[0.28em] inline-block overflow-hidden pb-[0.08em] align-bottom">
                  <span className="hl-word inline-block">current</span>
                </span>{" "}
                <span className="mr-[0.28em] inline-block overflow-hidden pb-[0.08em] align-bottom">
                  <span className="hl-word inline-block">focus,</span>
                </span>{" "}
                <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                  <span
                    className="hl-word inline-block"
                    style={{
                      backgroundImage: `linear-gradient(100deg, ${FOCUS_DATA[0]!.accent}, ${FOCUS_DATA[2]!.accent})`,
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      color: "transparent",
                    }}
                  >
                    up close.
                  </span>
                </span>
              </h2>
            </div>
            <p className="hl-kicker text-muted-foreground hidden font-mono text-xs sm:block">
              <span className="text-foreground">
                {String(zone + 1).padStart(2, "0")}
              </span>{" "}
              / {String(N_ITEMS).padStart(2, "0")}
            </p>
          </div>
        </header>

        {/* Stage: lens + panels */}
        <div className="relative z-10 mx-auto grid w-full max-w-275 flex-1 grid-cols-1 items-center gap-4 px-6 sm:px-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-10">
          <div
            className="lens-root relative mx-auto hidden h-[min(58vh,30rem)] w-[min(58vh,30rem)] items-center justify-center sm:flex"
            style={{ opacity: 0 }}
          >
            <LensSvg idPrefix="lens-d" />
          </div>

          <div className="relative h-[64vh] min-h-[27rem] sm:h-auto sm:min-h-[24rem]">
            {/* Mobile lens */}
            <div
              className="lens-root lens-root--mobile absolute inset-x-0 top-0 mx-auto h-52 w-52 sm:hidden"
              style={{ opacity: 0 }}
            >
              <LensSvg idPrefix="lens-m" />
            </div>

            <div className="panel-stack relative sm:absolute sm:inset-0">
              {FOCUS_DATA.map((item, i) => (
                <article
                  key={item.id}
                  className="focus-panel absolute inset-0 flex flex-col justify-center gap-3 pt-48 sm:pt-0"
                  style={{ opacity: 0 }}
                  inert={i !== zone}
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-4 right-0 hidden font-medium tracking-tighter opacity-[0.05] sm:block sm:text-[11rem] lg:text-[13rem]"
                  >
                    0{i + 1}
                  </span>
                  <PanelBody index={i} />
                </article>
              ))}
            </div>
          </div>
        </div>

        {/* Progress rail */}
        <footer className="lens-footer relative z-10 mx-auto w-full max-w-275 px-6 pb-7 sm:px-10">
          <div className="flex items-center gap-4">
            <span className="text-foreground w-8 font-mono text-xs tabular-nums">
              {String(zone + 1).padStart(2, "0")}
            </span>
            <span className="bg-foreground/10 relative h-px flex-1 overflow-hidden">
              <span
                ref={progressRef}
                className="absolute inset-0 origin-left"
                style={{
                  backgroundColor: active.accent,
                  transform: "scaleX(0)",
                }}
              />
            </span>
            <span className="text-muted-foreground w-8 text-right font-mono text-xs tabular-nums">
              {String(N_ITEMS).padStart(2, "0")}
            </span>
          </div>
          <p className="text-muted-foreground/70 mt-3 text-center font-mono text-[10px] tracking-[0.3em] uppercase">
            {active.category} — keep scrolling to refocus
          </p>
        </footer>
      </div>
    </section>
  );
}

export default FocusLens;
