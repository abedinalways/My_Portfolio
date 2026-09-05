"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { animate } from "animejs";
import type { ReactNode } from "react";

const ITEMS = [
  { id: "building", cat: "Building", title: "AI-Powered Design Tools", desc: "Creating intelligent interfaces that adapt and respond to user behavior.", accent: "#6ea8fe", status: "● LIVE" },
  { id: "learning", cat: "Learning", title: "WebGL & Shaders", desc: "Deep diving into generative art and GPU-accelerated visuals.", accent: "#c084fc", status: "◐ WIP" },
  { id: "exploring", cat: "Exploring", title: "Motion Design Systems", desc: "Crafting meaningful micro-interactions that bring interfaces to life.", accent: "#5eead4", status: "◐ WIP" },
  { id: "curious", cat: "Curious About", title: "Creative Coding", desc: "Experimenting with algorithms and procedural generation.", accent: "#fda4af", status: "◌ IDEAS" },
];

function RealisticLens({ accent, size = 320 }: { accent: string; size?: number }): ReactNode {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2;
  const uid = `lens-${accent.replace('#', '')}`;

  // Aperture blade path generator
  const bladePath = (angle: number, innerR: number, outerR: number) => {
    const a1 = ((angle - 12) * Math.PI) / 180;
    const a2 = ((angle + 12) * Math.PI) / 180;
    const aMid = (angle * Math.PI) / 180;
    const midR = (innerR + outerR) / 2 + 8;
    return `M ${cx + innerR * Math.sin(a1)} ${cy - innerR * Math.cos(a1)} Q ${cx + midR * Math.sin(aMid)} ${cy - midR * Math.cos(aMid)} ${cx + innerR * Math.sin(a2)} ${cy - innerR * Math.cos(a2)} L ${cx + outerR * Math.sin(a2)} ${cy - outerR * Math.cos(a2)} Q ${cx + midR * Math.sin(aMid)} ${cy - midR * Math.cos(aMid)} ${cx + outerR * Math.sin(a1)} ${cy - outerR * Math.cos(a1)} Z`;
  };

  const blades = Array.from({ length: 7 }, (_, i) => bladePath(i * (360 / 7), r * 0.42, r * 0.62));
  const ticks = Array.from({ length: 72 }, (_, i) => {
    const angle = (i * 5 * Math.PI) / 180;
    const isMajor = i % 6 === 0;
    const r1 = r * 0.88;
    const r2 = r1 + (isMajor ? 12 : 6);
    return { x1: cx + r1 * Math.sin(angle), y1: cy - r1 * Math.cos(angle), x2: cx + r2 * Math.sin(angle), y2: cy - r2 * Math.cos(angle), major: isMajor };
  });

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="h-full w-full drop-shadow-2xl">
      <defs>
        {/* Metallic barrel with brushed effect */}
        <linearGradient id={`${uid}-barrel`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4a4a4a" />
          <stop offset="20%" stopColor="#2a2a2a" />
          <stop offset="40%" stopColor="#3a3a3a" />
          <stop offset="60%" stopColor="#1a1a1a" />
          <stop offset="80%" stopColor="#2a2a2a" />
          <stop offset="100%" stopColor="#0a0a0a" />
        </linearGradient>

        {/* Glass element with depth */}
        <radialGradient id={`${uid}-glass`} cx="38%" cy="32%" r="65%">
          <stop offset="0%" stopColor="#1e2a4a" />
          <stop offset="30%" stopColor="#0a1525" />
          <stop offset="60%" stopColor="#050a15" />
          <stop offset="100%" stopColor="#020508" />
        </radialGradient>

        {/* Lens flare - primary */}
        <radialGradient id={`${uid}-flare1`} cx="30%" cy="25%" r="35%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>

        {/* Secondary flare */}
        <radialGradient id={`${uid}-flare2`} cx="70%" cy="75%" r="25%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.15" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>

        {/* Edge highlight */}
        <linearGradient id={`${uid}-edge`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#666" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#333" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#555" stopOpacity="0.7" />
        </linearGradient>

        {/* Chromatic aberration */}
        <filter id={`${uid}-ca`}>
          <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0" />
        </filter>

        {/* Inner shadow */}
        <filter id={`${uid}-shadow`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="4" />
          <feOffset dx="2" dy="4" />
          <feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feFlood floodColor="#000" floodOpacity="0.4" />
          <feComposite in2="SourceGraphic" operator="in" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Outer shadow/depth */}
      <circle cx={cx + 3} cy={cy + 5} r={r * 0.98} fill="#000" opacity={0.3} />

      {/* Main barrel */}
      <circle cx={cx} cy={cy} r={r * 0.95} fill={`url(#${uid}-barrel)`} />

      {/* Barrel ridges */}
      {Array.from({ length: 4 }, (_, i) => (
        <circle key={`ridge-${i}`} cx={cx} cy={cy} r={r * 0.92 - i * 6} fill="none" stroke={`rgba(70,70,70,${0.4 - i * 0.08})`} strokeWidth="1.5" />
      ))}

      {/* Focus ring with ticks */}
      <circle cx={cx} cy={cy} r={r * 0.86} fill="none" stroke={`url(#${uid}-edge)`} strokeWidth="6" />
      {ticks.map((t, i) => (
        <line key={`tick-${i}`} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={t.major ? "#888" : "#555"} strokeWidth={t.major ? 2 : 1} strokeLinecap="round" />
      ))}

      {/* Inner barrel ring */}
      <circle cx={cx} cy={cy} r={r * 0.78} fill="#1a1a1a" stroke="#333" strokeWidth="2" />
      <circle cx={cx} cy={cy} r={r * 0.76} fill="none" stroke="#222" strokeWidth="1" />

      {/* Aperture blades assembly */}
      <g filter={`url(#${uid}-shadow)`}>
        {blades.map((path, i) => (
          <path key={`blade-${i}`} d={path} fill="#0a0a0a" stroke="#1a1a1a" strokeWidth="0.5" />
        ))}
      </g>

      {/* Inner aperture ring */}
      <circle cx={cx} cy={cy} r={r * 0.44} fill="none" stroke="#222" strokeWidth="3" />
      <circle cx={cx} cy={cy} r={r * 0.42} fill="#050505" />

      {/* Glass element with reflections */}
      <circle cx={cx} cy={cy} r={r * 0.40} fill={`url(#${uid}-glass)`} filter={`url(#${uid}-shadow)`} />

      {/* Glass inner elements for depth */}
      <circle cx={cx} cy={cy} r={r * 0.35} fill="none" stroke="#1a2a4a" strokeWidth="1" opacity={0.4} />
      <circle cx={cx} cy={cy} r={r * 0.28} fill="none" stroke="#1a3050" strokeWidth="0.8" opacity={0.3} />
      <circle cx={cx} cy={cy} r={r * 0.20} fill="none" stroke="#1a3a60" strokeWidth="0.5" opacity={0.2} />

      {/* Primary lens flare */}
      <ellipse cx={cx - r * 0.12} cy={cy - r * 0.12} rx={r * 0.28} ry={r * 0.15} fill={`url(#${uid}-flare1)`} transform={`rotate(-25 ${cx} ${cy})`} />

      {/* Secondary accent flare */}
      <ellipse cx={cx + r * 0.1} cy={cy + r * 0.12} rx={r * 0.18} ry={r * 0.10} fill={`url(#${uid}-flare2)`} transform={`rotate(30 ${cx} ${cy})`} />

      {/* Center focus point */}
      <circle cx={cx} cy={cy} r={r * 0.06} fill="#111" />
      <circle cx={cx} cy={cy} r={r * 0.04} fill={accent} opacity={0.7} />
      <circle cx={cx} cy={cy} r={r * 0.02} fill="#fff" opacity={0.9} />

      {/* Outer accent ring (subtle) */}
      <circle cx={cx} cy={cy} r={r * 0.96} fill="none" stroke={accent} strokeWidth="1" opacity={0.3} />
      <circle cx={cx} cy={cy} r={r * 0.08} fill="none" stroke={accent} strokeWidth="0.5" opacity={0.4} />
    </svg>
  );
}

function LightRay({ accent, active }: { accent: string; active: boolean }): ReactNode {
  return (
    <div
      className="pointer-events-none absolute inset-0 transition-all duration-700"
      style={{
        opacity: active ? 0.18 : 0,
        background: `
          radial-gradient(ellipse at 30% 40%, ${accent}30 0%, transparent 50%),
          radial-gradient(ellipse at 70% 60%, ${accent}20 0%, transparent 40%),
          linear-gradient(135deg, ${accent}15 0%, transparent 60%)
        `,
        mixBlendMode: "soft-light",
      }}
    />
  );
}

export function RecentFocus(): ReactNode {
  const sectionRef = useRef<HTMLElement | null>(null);
  const lensRef = useRef<HTMLDivElement | null>(null);
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchRef = useRef<number | null>(null);
  const rotRef = useRef(0);

  const item = ITEMS[idx]!;
  const total = ITEMS.length;

  const next = useCallback(() => {
    setIdx((p) => (p + 1) % total);
    rotRef.current += 90;
    if (lensRef.current) animate(lensRef.current, { rotate: rotRef.current, duration: 1000, ease: "out(4)" });
  }, [total]);

  const goTo = useCallback((i: number) => {
    if (i === idx) return;
    rotRef.current += (i - idx) * 90;
    if (lensRef.current) animate(lensRef.current, { rotate: rotRef.current, duration: 1000, ease: "out(4)" });
    setIdx(i);
  }, [idx]);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, 4500);
    return () => clearInterval(id);
  }, [paused, next]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    let lock = false;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      if (lock) return;
      lock = true;
      setTimeout(() => (lock = false), 1000);
      if (e.deltaY > 0) next();
    };
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, [next]);

  const onTouchStart = (e: React.TouchEvent) => { touchRef.current = e.touches[0]?.clientX ?? null; setPaused(true); };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchRef.current === null) return;
    const diff = touchRef.current - (e.changedTouches[0]?.clientX ?? 0);
    if (Math.abs(diff) > 40) {
      if (diff > 0) next();
      else { setIdx((p) => (p - 1 + total) % total); rotRef.current -= 90; if (lensRef.current) animate(lensRef.current, { rotate: rotRef.current, duration: 1000, ease: "out(4)" }); }
    }
    touchRef.current = null;
    setPaused(false);
  };

  return (
    <section ref={sectionRef} id="recent-focus" className="relative w-full py-16 sm:py-24" aria-label="Recent Focus" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div className="mx-auto w-full max-w-275 px-6 sm:px-10">
        <div className="mb-12 flex items-center gap-4 sm:mb-16">
          <div className="h-px flex-1" style={{ backgroundColor: `${item.accent}30` }} />
          <span className="font-mono text-xs tracking-[0.3em] uppercase" style={{ color: item.accent }}>Recent Focus</span>
          <div className="h-px flex-1" style={{ backgroundColor: `${item.accent}30` }} />
        </div>
        <div className="relative cursor-pointer select-none" onClick={() => setPaused((p) => !p)}>
          <div className="relative mx-auto w-full max-w-[280px] sm:max-w-[340px]">
            <div ref={lensRef} className="relative aspect-square w-full">
              <RealisticLens accent={item.accent} size={340} />
            </div>
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 font-mono text-xs tracking-wider text-foreground/40">
              <span style={{ color: item.accent }}>{String(idx + 1).padStart(2, "0")}</span>
              <span className="mx-1">/</span>
              <span>{String(total).padStart(2, "0")}</span>
            </div>
          </div>
          <div className="absolute right-0 top-0 flex items-center gap-2 font-mono text-[10px] tracking-wider uppercase transition-opacity duration-300" style={{ color: `${item.accent}60`, opacity: paused ? 1 : 0 }}>
            <span className="inline-block h-2 w-2 rounded-sm bg-current" />Paused
          </div>
        </div>
        <div className="relative mt-16 min-h-[300px] sm:mt-20 sm:min-h-[340px]">
          <LightRay accent={item.accent} active={true} />
          {ITEMS.map((it, i) => (
            <div key={it.id} className="absolute inset-0 transition-all duration-500" style={{ opacity: i === idx ? 1 : 0, transform: i === idx ? "translateY(0)" : "translateY(12px)", pointerEvents: i === idx ? "auto" : "none" }}>
              <div className="mb-4 flex items-center gap-3 sm:mb-6">
                <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[10px] tracking-wider uppercase" style={{ borderColor: `${it.accent}40`, color: it.accent }}>
                  <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ backgroundColor: it.accent }} />{it.cat}
                </span>
                <span className="font-mono text-[10px] tracking-wider text-muted-foreground">{it.status}</span>
              </div>
              <h2 className="font-serif text-[2rem] leading-[1.1] font-medium tracking-tight text-foreground sm:text-[2.75rem] lg:text-[3.5rem]">{it.title}</h2>
              <p className="mt-4 max-w-[480px] text-base leading-relaxed text-muted-foreground sm:mt-6 sm:text-lg">{it.desc}</p>
              <div className="mt-8 flex items-center gap-4 sm:mt-10">
                <div className="h-[2px] w-12 sm:w-16" style={{ backgroundColor: it.accent, boxShadow: `0 0 24px ${it.accent}50` }} />
                <div className="h-[2px] flex-1" style={{ background: `linear-gradient(to right, ${it.accent}25, transparent)` }} />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 flex items-center justify-center gap-3 sm:mt-12">
          {ITEMS.map((it, i) => (
            <button key={it.id} type="button" className="h-3 w-3 rounded-full transition-all duration-300 sm:h-4 sm:w-4" style={{ backgroundColor: i === idx ? it.accent : "var(--foreground)", opacity: i === idx ? 1 : 0.2, transform: i === idx ? "scale(1.3)" : "scale(1)", boxShadow: i === idx ? `0 0 16px ${it.accent}70` : "none" }} aria-label={it.title} onClick={(e) => { e.stopPropagation(); goTo(i); setPaused(true); }} />
          ))}
        </div>
        <div className="mt-6 flex flex-col items-center gap-1 font-mono text-[10px] tracking-wider text-foreground/40">
          <span className="hidden sm:inline">SCROLL TO ROTATE LENS</span>
          <span className="sm:hidden">SWIPE OR TAP TO NAVIGATE</span>
          <span className="flex items-center gap-1 transition-opacity duration-300" style={{ opacity: paused ? 0 : 1 }}>
            <span className="inline-block animate-pulse" style={{ color: `${item.accent}60` }}>●</span>AUTO-ROTATING
          </span>
        </div>
        <div className="pointer-events-none absolute top-4 left-6 font-mono text-[10px] tracking-wider sm:top-6" style={{ color: `${item.accent}30` }}>LENS_v3.0</div>
        <div className="pointer-events-none absolute right-6 bottom-4 font-mono text-[10px] tracking-wider" style={{ color: `${item.accent}30` }}>{item.accent}</div>
      </div>
    </section>
  );
}
