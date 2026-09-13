"use client";

import { motion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { GitFork, Layers, Star } from "lucide-react";

/* animated number counter */
function Counter({ target, duration = 1.5 }: { target: number; duration?: number }): ReactNode {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inViewRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting && !inViewRef.current) {
          inViewRef.current = true;
          const start = Date.now();
          const tick = () => {
            const elapsed = (Date.now() - start) / 1000;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{value.toLocaleString()}</span>;
}

const STATS = [
  { icon: <Layers className="h-4 w-4 text-violet-500" />, label: "Projects shipped", value: 6 },
  { icon: <Star className="h-4 w-4 text-amber-500" />, label: "Total GitHub stars", value: 1102 },
  { icon: <GitFork className="h-4 w-4 text-blue-500" />, label: "Total forks", value: 184 },
];

const EASE = [0.22, 1, 0.36, 1] as const;

export function ProjectsPageHero(): ReactNode {
  return (
    <section className="relative w-full overflow-hidden pt-44 pb-16 sm:pt-56 sm:pb-20">
      {/* Subtle dot-grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30 dark:opacity-15"
        style={{
          backgroundImage:
            "radial-gradient(circle, hsl(220 14% 50%) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Fade-out mask at edges */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background via-transparent to-background" />

      <div className="relative mx-auto w-full max-w-6xl px-6 sm:px-10">
        <div className="flex flex-col items-center gap-8 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-4 py-1.5 text-xs font-mono text-muted-foreground"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
            Open to collaboration
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease: EASE }}
            className="flex flex-col items-center gap-3"
          >
            <h1 className="font-serif text-[2.75rem] font-medium leading-[1.05] tracking-tight text-foreground md:text-[3.25rem] lg:text-[4rem]">
              Work I&apos;m{" "}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-blue-500 via-violet-500 to-purple-500 bg-clip-text text-transparent">
                  proud
                </span>
                {/* animated underline */}
                <motion.span
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500/60 via-violet-500/60 to-purple-500/60"
                  initial={{ scaleX: 0, originX: "0%" }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
                />
              </span>{" "}
              to ship
            </h1>

            <p className="max-w-[38ch] text-lg leading-[1.5] tracking-tight text-foreground/60 sm:text-xl">
              Experiments, collaborations, and open-source tools — built with care and shipped with intention.
            </p>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
            className="flex flex-wrap items-center justify-center gap-6 sm:gap-10"
          >
            {STATS.map((stat, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-1.5 text-2xl font-bold tabular-nums text-foreground sm:text-3xl">
                  {stat.icon}
                  <Counter target={stat.value} duration={1.2} />
                  <span className="text-blue-500">+</span>
                </div>
                <span className="text-xs text-muted-foreground">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
