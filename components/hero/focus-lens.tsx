"use client";

import { useEffect, useRef, useState } from "react";
import { createTimeline, onScroll, type ScrollObserver } from "animejs";
import {
  Circle,
  Group,
  Layer,
  Line,
  Rect,
  RegularPolygon,
  Stage,
  Path as KPath,
} from "react-konva";
import type { ReactNode } from "react";

import { FOCUS_DATA } from "./focus-data";

const INTRO_END = 14;
const SEG = (100 - INTRO_END) / FOCUS_DATA.length;
const N = FOCUS_DATA.length;
const segStart = (i: number) => INTRO_END + i * SEG;
const segEnd = (i: number) => segStart(i) + SEG;
const handoff = (i: number) => segEnd(i) - 2;
const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));

const W = 1000;
const H = 500;

function Village(): ReactNode {
  return (
    <Stage
      width={W}
      height={H}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    >
      <Layer>
        <Group opacity={0.07}>
          <KPath
            data="M-20,350 Q250,230 500,350 Q750,240 1020,350 L1020,520 L-20,520Z"
            fill="#888"
          />
          <KPath
            data="M-20,390 Q300,310 600,390 Q800,300 1020,390 L1020,520 L-20,520Z"
            fill="#666"
          />
          <Rect x={140} y={280} width={55} height={45} fill="#777" />
          <RegularPolygon
            sides={3}
            x={167}
            y={268}
            radius={35}
            fill="#555"
            rotation={180}
          />
          <Rect x={158} y={300} width={16} height={25} fill="#444" />
          <Rect x={420} y={290} width={48} height={38} fill="#777" />
          <RegularPolygon
            sides={3}
            x={444}
            y={279}
            radius={30}
            fill="#555"
            rotation={180}
          />
          <Rect x={435} y={306} width={14} height={22} fill="#444" />
          <Rect x={700} y={285} width={60} height={50} fill="#777" />
          <RegularPolygon
            sides={3}
            x={730}
            y={272}
            radius={38}
            fill="#555"
            rotation={180}
          />
          <Rect x={720} y={305} width={16} height={30} fill="#444" />
          <Line
            points={[290, 320, 290, 275]}
            stroke="#666"
            strokeWidth={4}
          />
          <Circle x={290} y={260} radius={24} fill="#555" />
          <Line
            points={[570, 315, 570, 273]}
            stroke="#666"
            strokeWidth={4}
          />
          <Circle x={570} y={258} radius={22} fill="#555" />
          <Line
            points={[860, 325, 860, 282]}
            stroke="#666"
            strokeWidth={4}
          />
          <Circle x={860} y={267} radius={26} fill="#555" />
          <KPath
            data="M0,400 Q250,380 500,395 Q750,370 1000,390"
            stroke="#999"
            strokeWidth={2.5}
            fill="none"
          />
          <KPath
            data="M80,55 Q92,43 104,55"
            stroke="#555"
            strokeWidth={1.5}
            fill="none"
          />
          <KPath
            data="M130,40 Q140,30 150,40"
            stroke="#555"
            strokeWidth={1.5}
            fill="none"
          />
          <KPath
            data="M900,65 Q910,55 920,65"
            stroke="#555"
            strokeWidth={1.5}
            fill="none"
          />
        </Group>
      </Layer>
    </Stage>
  );
}

function PencilCursor(): ReactNode {
  return (
    <g className="fc-pencil" opacity={0}>
      <line
        x1={-16}
        y1={16}
        x2={0}
        y2={0}
        stroke="var(--foreground)"
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      <polygon points="-3,-2.5 0,0 -2.5,3" fill="var(--foreground)" />
      <rect x={-18} y={14} width={5} height={4} rx={1} fill="#c9a96e" />
    </g>
  );
}

export function FocusCanvas(): ReactNode {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<HTMLSpanElement | null>(null);
  const titleRefs = useRef<(SVGTextElement | null)[]>([]);
  const lenRef = useRef<number[]>([]);
  const zoneRef = useRef(0);
  const [zone, setZone] = useState(0);

  const active = FOCUS_DATA[zone] ?? FOCUS_DATA[0]!;

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      section.setAttribute("data-static", "");
      return;
    }

    titleRefs.current.forEach((el, i) => {
      if (el) lenRef.current[i] = el.getComputedTextLength();
    });

    const $ = (sel: string) => Array.from(stage.querySelectorAll(sel));
    const must = (sel: string) => {
      const el = stage.querySelector(sel);
      if (!el) throw new Error(`FocusCanvas: "${sel}" not found`);
      return el;
    };

    const titles = $(".fc-title");
    const cats = $(".fc-cat");
    const descs = $(".fc-desc");
    const pencil = must(".fc-pencil");
    const frame = must(".fc-frame");
    const secTitle = must(".fc-sec-title") as unknown as SVGTextElement;
    const secKicker = must(".fc-sec-kicker");
    const sep = must(".fc-sep") as unknown as SVGLineElement;
    const items = $(".fc-item");

    titles.forEach((t, i) => {
      const len = lenRef.current[i] ?? 600;
      (t as SVGTextElement).setAttribute("stroke-dasharray", String(len));
      (t as SVGTextElement).setAttribute("stroke-dashoffset", String(len));
    });

    const secLen = secTitle.getComputedTextLength();
    secTitle.setAttribute("stroke-dasharray", String(secLen));
    secTitle.setAttribute("stroke-dashoffset", String(secLen));

    const scrollObserver = onScroll({
      target: section,
      enter: "top top",
      leave: "bottom bottom",
      repeat: true,
      sync: 0.55,
      onUpdate: (self: ScrollObserver) => {
        const p = clamp(self.progress, 0, 1);
        if (progressRef.current)
          progressRef.current.style.transform = `scaleX(${p})`;

        const next = clamp(
          Math.floor((p * 100 - INTRO_END) / SEG),
          0,
          N - 1,
        );
        if (next !== zoneRef.current) {
          zoneRef.current = next;
          setZone(next);
        }

        if (pencil) {
          const svgEl = pencil as unknown as SVGElement;
          const totalP = p * 100;
          let px: number;
          if (totalP < INTRO_END) {
            px = 70 + secLen * clamp(totalP / (INTRO_END * 0.7), 0, 1);
          } else {
            const segP = (totalP - INTRO_END) / SEG;
            const idx = clamp(Math.floor(segP), 0, N - 1);
            const within = segP - idx;
            const tLen = lenRef.current[idx] ?? 300;
            px = 70 + tLen * clamp(within / 0.35, 0, 1);
          }
          svgEl.style.transform = `translate(${px}px, 235px)`;
        }
      },
    });

    const tl = createTimeline({
      defaults: { ease: "linear" },
      autoplay: scrollObserver,
    });

    tl.add(frame, { opacity: [0, 1], duration: 8 }, 0);
    tl.add(
      secTitle,
      { strokeDashoffset: [secLen, 0], duration: 8, ease: "outExpo" },
      1,
    );
    tl.add(secKicker, { opacity: [0, 1], y: [10, 0], duration: 5 }, 2);
    tl.add(
      sep,
      { opacity: [0, 0.3], duration: 6, ease: "outExpo" },
      3,
    );
    tl.add(pencil, { opacity: [0, 0.85], duration: 4 }, 4);

    tl.add(items[0]!, { opacity: [0, 1], duration: 1 }, 4);
    tl.add(cats[0]!, { opacity: [0, 1], duration: 4 }, 4.5);
    const l0 = lenRef.current[0] ?? 600;
    tl.add(
      titles[0]!,
      { strokeDashoffset: [l0, 0], duration: 7, ease: "outExpo" },
      5,
    );
    tl.add(descs[0]!, { opacity: [0, 1], y: [10, 0], duration: 5 }, 8);
    $(".fc-pill[data-i='0']").forEach((p, j) =>
      tl.add(p, { opacity: [0, 1], duration: 3 }, 9 + j * 0.4),
    );
    $(".fc-cta[data-i='0']").forEach((c) =>
      tl.add(c, { opacity: [0, 1], duration: 3 }, 10),
    );

    for (let i = 0; i < N - 1; i++) {
      const at = handoff(i);
      tl.add(cats[i]!, { opacity: [1, 0], duration: 3 }, at);
      tl.add(titles[i]!, { opacity: [1, 0], duration: 3 }, at);
      tl.add(descs[i]!, { opacity: [1, 0], duration: 3 }, at);
      tl.add(pencil, { opacity: [0.85, 0], duration: 2 }, at);
      $(`.fc-pill[data-i='${i}']`).forEach((p) =>
        tl.add(p, { opacity: [1, 0], duration: 3 }, at),
      );
      $(`.fc-cta[data-i='${i}']`).forEach((c) =>
        tl.add(c, { opacity: [1, 0], duration: 3 }, at),
      );

      const lNext = lenRef.current[i + 1] ?? 600;
      tl.add(pencil, { opacity: [0, 0.85], duration: 2 }, at + 2);
      tl.add(cats[i + 1]!, { opacity: [0, 1], duration: 4 }, at + 2);
      tl.add(
        titles[i + 1]!,
        { strokeDashoffset: [lNext, 0], duration: 7, ease: "outExpo" },
        at + 2,
      );
      tl.add(
        descs[i + 1]!,
        { opacity: [0, 1], y: [10, 0], duration: 5 },
        at + 6,
      );
      $(`.fc-pill[data-i='${i + 1}']`).forEach((p, j) =>
        tl.add(p, { opacity: [0, 1], duration: 3 }, at + 7 + j * 0.4),
      );
      $(`.fc-cta[data-i='${i + 1}']`).forEach((c) =>
        tl.add(c, { opacity: [0, 1], duration: 3 }, at + 8),
      );
    }

    return () => {
      scrollObserver.revert();
      tl.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-[420vh]"
      aria-label="Current focus"
    >
      <div
        ref={stageRef}
        className="fc-stage border-foreground/8 sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden border-y"
      >
        <Village />

        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <rect
            className="fc-frame"
            x={40}
            y={40}
            width={W - 80}
            height={H - 80}
            rx={12}
            fill="none"
            stroke="var(--foreground)"
            strokeWidth={1}
            opacity={0}
          />

          <text
            className="fc-sec-kicker"
            x={70}
            y={85}
            fill="var(--muted-foreground)"
            fontFamily="var(--font-mono), monospace"
            fontSize={11}
            letterSpacing="0.3em"
            opacity={0}
          >
            WHAT I&apos;M FOCUSED ON
          </text>
          <text
            className="fc-sec-title"
            x={70}
            y={130}
            fill="var(--foreground)"
            fontFamily="var(--font-caveat), cursive"
            fontSize={44}
            stroke="var(--foreground)"
            strokeWidth={0.5}
          >
            My current focus, up close.
          </text>
          <line
            className="fc-sep"
            x1={70}
            y1={150}
            x2={100}
            y2={150}
            stroke="var(--foreground)"
            strokeWidth={0.5}
            opacity={0.3}
          />

          {FOCUS_DATA.map((item, i) => (
            <g key={item.id} className="fc-item" opacity={0}>
              <text
                className="fc-cat"
                x={70}
                y={195}
                fill={item.accent}
                fontFamily="var(--font-mono), monospace"
                fontSize={12}
                letterSpacing="0.22em"
              >
                {item.category.toUpperCase()}
              </text>
              <text
                ref={(el) => {
                  titleRefs.current[i] = el;
                }}
                className="fc-title"
                x={70}
                y={250}
                fill="var(--foreground)"
                fontFamily="var(--font-caveat), cursive"
                fontSize={40}
                stroke="var(--foreground)"
                strokeWidth={0.5}
              >
                {item.title}
              </text>
              <text
                className="fc-desc"
                x={70}
                y={290}
                fill="var(--foreground)"
                fillOpacity={0.6}
                fontFamily="var(--font-sans), sans-serif"
                fontSize={14}
                opacity={0}
              >
                {item.description}
              </text>
              {item.tech?.map((tech, j) => (
                <g key={tech} className="fc-pill" data-i={i} opacity={0}>
                  <rect
                    x={70 + j * 105}
                    y={315}
                    width={tech.length * 8 + 24}
                    height={26}
                    rx={13}
                    fill="none"
                    stroke="var(--foreground)"
                    strokeWidth={0.5}
                    opacity={0.3}
                  />
                  <text
                    x={82 + j * 105}
                    y={332}
                    fill="var(--foreground)"
                    fillOpacity={0.55}
                    fontFamily="var(--font-mono), monospace"
                    fontSize={10}
                  >
                    {tech}
                  </text>
                </g>
              ))}
              {item.href && (
                <g className="fc-cta" data-i={i} opacity={0}>
                  <rect
                    x={70}
                    y={360}
                    width={130}
                    height={34}
                    rx={17}
                    fill="none"
                    stroke={item.accent}
                    strokeWidth={1}
                  />
                  <text
                    x={90}
                    y={382}
                    fill={item.accent}
                    fontFamily="var(--font-sans), sans-serif"
                    fontSize={13}
                  >
                    Check it out →
                  </text>
                </g>
              )}
            </g>
          ))}

          <PencilCursor />
        </svg>

        <div className="absolute bottom-7 left-1/2 w-full max-w-275 -translate-x-1/2 px-6 sm:px-10">
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
              {String(N).padStart(2, "0")}
            </span>
          </div>
          <p className="text-muted-foreground/70 mt-3 text-center font-mono text-[10px] tracking-[0.3em] uppercase">
            {active.category} — keep scrolling to refocus
          </p>
        </div>
      </div>
    </section>
  );
}

export default FocusCanvas;
