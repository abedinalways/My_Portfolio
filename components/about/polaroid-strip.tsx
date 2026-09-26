"use client";

import {
  Award,
  Briefcase,
  Code2,
  GraduationCap,
  Layers,
  Rocket,
} from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useRef, useSyncExternalStore, type ReactNode } from "react";

type Polaroid = {
  id: string;
  rotate: number;
  year: string;
  title: string;
  sub: string;
  caption: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  iconBg: string;
  iconColor: string;
  yearBg: string;
  gradient: string;
};

const TIMELINE_PHOTOS: Polaroid[] = [
  {
    id: "step-1",
    rotate: -8,
    year: "2012 – 2017",
    title: "B.Sc. Degree",
    sub: "BAU Mymensingh",
    caption: "2012: B.Sc at BAU",
    icon: GraduationCap,
    iconBg: "bg-purple-500/15 border-purple-500/25",
    iconColor: "text-purple-600 dark:text-purple-400",
    yearBg:
      "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20",
    gradient: "from-purple-500/15 via-pink-500/5 to-transparent",
  },
  {
    id: "step-2",
    rotate: 6,
    year: "2017 – 2019",
    title: "M.Sc. Degree",
    sub: "CGPA 3.44 / 4.0",
    caption: "2017: M.Sc at BAU",
    icon: Award,
    iconBg: "bg-indigo-500/15 border-indigo-500/25",
    iconColor: "text-indigo-600 dark:text-indigo-400",
    yearBg:
      "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20",
    gradient: "from-indigo-500/15 via-blue-500/5 to-transparent",
  },
  {
    id: "step-3",
    rotate: -4,
    year: "2021 – 2023",
    title: "Code Transition",
    sub: "React & TypeScript",
    caption: "2021: Tech Shift",
    icon: Code2,
    iconBg: "bg-blue-500/15 border-blue-500/25",
    iconColor: "text-blue-600 dark:text-blue-400",
    yearBg:
      "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20",
    gradient: "from-blue-500/15 via-cyan-500/5 to-transparent",
  },
  {
    id: "step-4",
    rotate: 7,
    year: "2024 – 2025",
    title: "Kryzotech",
    sub: "Frontend Dev (Intern)",
    caption: "2024: Kryzotech",
    icon: Briefcase,
    iconBg: "bg-teal-500/15 border-teal-500/25",
    iconColor: "text-teal-600 dark:text-teal-400",
    yearBg:
      "bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/20",
    gradient: "from-teal-500/15 via-emerald-500/5 to-transparent",
  },
  {
    id: "step-5",
    rotate: -6,
    year: "2025 – Pres.",
    title: "Softvence Delta",
    sub: "Jr. Frontend Eng",
    caption: "2025: Softvence",
    icon: Rocket,
    iconBg: "bg-emerald-500/15 border-emerald-500/25",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    yearBg:
      "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
    gradient: "from-emerald-500/15 via-green-500/5 to-transparent",
  },
  {
    id: "step-6",
    rotate: 5,
    year: "Next Era",
    title: "Full-Stack",
    sub: "NestJS • SQL • Docker",
    caption: "Future: Full-Stack",
    icon: Layers,
    iconBg: "bg-amber-500/15 border-amber-500/25",
    iconColor: "text-amber-600 dark:text-amber-400",
    yearBg:
      "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20",
    gradient: "from-amber-500/15 via-orange-500/5 to-transparent",
  },
];

const EASE = [0.22, 1, 0.36, 1] as const;

function PolaroidCard({
  photo,
  index,
}: {
  photo: Polaroid;
  index: number;
}): ReactNode {
  const ref = useRef<HTMLDivElement | null>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 220, damping: 18, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 220, damping: 18, mass: 0.6 });
  const tx = useTransform(sx, (v) => `${v}px`);
  const ty = useTransform(sy, (v) => `${v}px`);

  const handleMove = (e: React.PointerEvent<HTMLDivElement>): void => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const max = 18;
    const k = 0.25;
    mx.set(Math.max(-max, Math.min(max, dx * k)));
    my.set(Math.max(-max, Math.min(max, dy * k)));
  };

  const handleLeave = (): void => {
    mx.set(0);
    my.set(0);
  };

  const Icon = photo.icon;

  return (
    <motion.div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      initial={{
        opacity: 0,
        y: -120,
        filter: "blur(18px)",
        rotate: photo.rotate,
      }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)", rotate: photo.rotate }}
      transition={{
        duration: 0.9,
        delay: 0.05 + index * 0.08,
        ease: EASE,
      }}
      style={{
        x: tx,
        y: ty,
        rotate: photo.rotate,
      }}
      className="group relative flex flex-col aspect-[3/4] w-[clamp(6.8rem,11.5vw,9.5rem)] shrink-0 overflow-hidden rounded-2xl border-6 border-neutral-300/50 bg-white p-1.5 shadow-md transition-shadow hover:shadow-xl dark:border-white/15 dark:bg-neutral-900 select-none cursor-pointer"
    >
      {/* Upper Timeline Square Canvas */}
      <div
        className={`relative aspect-square w-full overflow-hidden rounded-xl bg-neutral-50/80 dark:bg-neutral-950 flex flex-col items-center justify-between p-2 text-center bg-gradient-to-b ${photo.gradient}`}
      >
        {/* Year Badge */}
        <span
          className={`rounded-full border px-2 py-0.5 text-[9px] font-semibold tracking-tight sm:text-[9.5px] ${photo.yearBg}`}
        >
          {photo.year}
        </span>

        {/* Milestone Icon */}
        <div
          className={`inline-flex h-8 w-8 items-center justify-center rounded-xl border shadow-2xs transition-transform duration-300 group-hover:scale-110 sm:h-9 sm:w-9 ${photo.iconBg}`}
        >
          <Icon className={`h-4 w-4 sm:h-4.5 sm:w-4.5 ${photo.iconColor}`} strokeWidth={2.2} />
        </div>

        {/* Milestone Title & Subtitle */}
        <div className="flex w-full flex-col items-center">
          <span className="w-full truncate text-[11.5px] font-bold tracking-tight text-foreground sm:text-[12.5px]">
            {photo.title}
          </span>
          <span className="w-full truncate text-[9px] font-medium tracking-tight text-foreground/60 sm:text-[9.5px]">
            {photo.sub}
          </span>
        </div>
      </div>

      {/* Classic Polaroid Chin Caption */}
      <div className="flex flex-1 items-center justify-center px-1">
        <span className="truncate text-center text-[10px] font-medium tracking-tight text-neutral-600 dark:text-neutral-300 sm:text-[11px]">
          {photo.caption}
        </span>
      </div>
    </motion.div>
  );
}

export function PolaroidStrip(): ReactNode {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  if (!mounted) {
    return (
      <div aria-hidden="true" className="h-[clamp(8rem,15vw,12rem)] w-full" />
    );
  }

  return (
    <div className="relative w-full">
      {/* Background Ambient Animation */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-y-16 inset-x-0 overflow-hidden"
      >
       
        <motion.div
          animate={{
            x: [0, -35, 25, 0],
            y: [0, 25, -20, 0],
            scale: [1, 0.92, 1.15, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -bottom-10 right-1/4 "
        />
      </div>

      {/* Timeline Eyebrow Badge */}
      <div className="relative z-10 mb-4 text-center sm:mb-6">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-foreground/10 bg-foreground/3 px-3 py-1 text-[11px] font-medium tracking-tight text-foreground/70 backdrop-blur-md dark:border-white/10 dark:bg-white/5 sm:text-[12px]">
         
          Journey &amp; Milestones 
        </span>
      </div>

      {/* Polaroid Timeline Cards Strip */}
      <div className="relative z-10 flex flex-wrap w-full items-start justify-center gap-1 sm:gap-2 px-4 sm:px-8">
        {TIMELINE_PHOTOS.map((photo, i) => (
          <PolaroidCard key={photo.id} photo={photo} index={i} />
        ))}
      </div>
    </div>
  );
}
