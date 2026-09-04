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
    if (lensRef.current) animate(lensRef.current, { rotate: rotRef.current, duration: 600, ease: "out(3)" });
  }, [total]);

  const goTo = useCallback((i: number) => {
    if (i === idx) return;
    rotRef.current += (i - idx) * 90;
    if (lensRef.current) animate(lensRef.current, { rotate: rotRef.current, duration: 600, ease: "out(3)" });
    setIdx(i);
  }, [idx]);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, 4000);
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
      setTimeout(() => (lock = false), 800);
      if (e.deltaY > 0) next();
    };
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, [next]);

  const onTouchStart = (e: React.TouchEvent) => { touchRef.current = e.touches[0]?.clientX ?? null; setPaused(true); };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchRef.current === null) return;
    const diff = touchRef.current - (e.changedTouches[0]?.clientX ?? 0);
    if (Math.abs(diff) > 50) {
      if (diff > 0) next();
      else { setIdx((p) => (p - 1 + total) % total); rotRef.current -= 90; if (lensRef.current) animate(lensRef.current, { rotate: rotRef.current, duration: 600, ease: "out(3)" }); }
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
          <div className="relative mx-auto w-full max-w-[280px] sm:max-w-[320px]">
            <div ref={lensRef} className="relative aspect-square w-full">
              <div className="absolute inset-0 rounded-full border-4 border-foreground/10 bg-gradient-to-br from-foreground/5 to-foreground/10 shadow-2xl">
                <div className="absolute inset-4 rounded-full bg-gradient-to-br from-background via-foreground/5 to-background">
                  <div className="absolute inset-4 rounded-full border border-foreground/10" />
                  <div className="absolute inset-8 rounded-full border border-foreground/5" />
                  <div className="absolute inset-12 overflow-hidden rounded-full">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="absolute left-1/2 top-1/2 h-full w-[40%] origin-bottom-center transition-all duration-700" style={{ transform: `translate(-50%, -100%) rotate(${i * 45 + idx * 15}deg)`, opacity: 0.3 + (idx === i % total ? 0.4 : 0) }}>
                        <div className="h-full w-full rounded-t-full transition-colors duration-500" style={{ backgroundColor: idx === i % total ? item.accent : "var(--foreground)", clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)" }} />
                      </div>
                    ))}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-16 w-16 rounded-full sm:h-20 sm:w-20" style={{ background: `radial-gradient(circle, ${item.accent}20 0%, transparent 70%)`, boxShadow: `0 0 40px ${item.accent}30` }}>
                      <div className="h-full w-full rounded-full border-2" style={{ borderColor: `${item.accent}60`, background: `radial-gradient(circle, ${item.accent}40 0%, transparent 60%)` }} />
                    </div>
                  </div>
                </div>
              </div>
              {ITEMS.map((it, i) => (
                <div key={it.id} className="absolute left-1/2 top-1/2 transition-all duration-500" style={{ transform: `translate(-50%, -50%) rotate(${(i * 360) / total}deg) translateY(-48%)` }}>
                  <div className="h-3 w-3 rounded-full border sm:h-4 sm:w-4" style={{ backgroundColor: i === idx ? it.accent : "transparent", borderColor: i === idx ? it.accent : "var(--foreground)", opacity: i === idx ? 1 : 0.3, boxShadow: i === idx ? `0 0 12px ${it.accent}60` : "none" }} />
                </div>
              ))}
            </div>
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 font-mono text-xs tracking-wider text-foreground/40">
              <span style={{ color: item.accent }}>{String(idx + 1).padStart(2, "0")}</span>
              <span className="mx-1">/</span>
              <span>{String(total).padStart(2, "0")}</span>
            </div>
          </div>
          <div className="absolute right-0 top-0 flex items-center gap-2 font-mono text-[10px] tracking-wider uppercase transition-opacity duration-300" style={{ color: `${item.accent}60`, opacity: paused ? 1 : 0 }}>
            <span className="inline-block h-2 w-2 rounded-sm bg-current" />Paused
          </div>
        </div>
        <div className="relative mt-16 min-h-[280px] sm:mt-20 sm:min-h-[320px]">
          {ITEMS.map((it, i) => (
            <div key={it.id} className="absolute inset-0 transition-all duration-500" style={{ opacity: i === idx ? 1 : 0, transform: i === idx ? "translateY(0)" : "translateY(10px)", pointerEvents: i === idx ? "auto" : "none" }}>
              <div className="mb-4 flex items-center gap-3 sm:mb-6">
                <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[10px] tracking-wider uppercase" style={{ borderColor: `${it.accent}40`, color: it.accent }}>
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: it.accent }} />{it.cat}
                </span>
                <span className="font-mono text-[10px] tracking-wider text-muted-foreground">{it.status}</span>
              </div>
              <h2 className="font-serif text-[2rem] leading-[1.1] font-medium tracking-tight text-foreground sm:text-[2.75rem] lg:text-[3.25rem]">{it.title}</h2>
              <p className="mt-4 max-w-[450px] text-base leading-relaxed text-muted-foreground sm:mt-6 sm:text-lg">{it.desc}</p>
              <div className="mt-8 flex items-center gap-4 sm:mt-10">
                <div className="h-[2px] w-12 sm:w-16" style={{ backgroundColor: it.accent, boxShadow: `0 0 20px ${it.accent}40` }} />
                <div className="h-[2px] flex-1" style={{ background: `linear-gradient(to right, ${it.accent}20, transparent)` }} />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 flex items-center justify-center gap-3 sm:mt-12">
          {ITEMS.map((it, i) => (
            <button key={it.id} type="button" className="h-3 w-3 rounded-full sm:h-4 sm:w-4" style={{ backgroundColor: i === idx ? it.accent : "var(--foreground)", opacity: i === idx ? 1 : 0.2, transform: i === idx ? "scale(1.2)" : "scale(1)", boxShadow: i === idx ? `0 0 12px ${it.accent}60` : "none" }} aria-label={it.title} onClick={(e) => { e.stopPropagation(); goTo(i); setPaused(true); }} />
          ))}
        </div>
        <div className="mt-6 flex flex-col items-center gap-1 font-mono text-[10px] tracking-wider text-foreground/40">
          <span className="hidden sm:inline">SCROLL TO ROTATE LENS</span>
          <span className="sm:hidden">SWIPE OR TAP TO NAVIGATE</span>
          <span className="flex items-center gap-1 transition-opacity duration-300" style={{ opacity: paused ? 0 : 1 }}>
            <span className="inline-block animate-pulse" style={{ color: `${item.accent}60` }}>●</span>AUTO-ROTATING
          </span>
        </div>
        <div className="pointer-events-none absolute top-4 left-6 font-mono text-[10px] tracking-wider sm:top-6" style={{ color: `${item.accent}30` }}>LENS_v2.0</div>
        <div className="pointer-events-none absolute right-6 bottom-4 font-mono text-[10px] tracking-wider" style={{ color: `${item.accent}30` }}>{item.accent}</div>
      </div>
    </section>
  );
}

