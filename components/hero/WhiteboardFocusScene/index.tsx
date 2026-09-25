"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import {
  Hammer,
  Sparkles,
  Compass,
  ArrowRight,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Github,
  Layers,
  Cpu,
  Globe,
  Radio,
  Boxes,
  Database,
  Terminal,
  Server,
  Zap,
} from "lucide-react";
import { FOCUS_ITEMS, type FocusCategory } from "./data";
import { openProjectModal } from "@/components/projects/projects";

const AUTOPLAY_DURATION = 5500; // 5.5 seconds per slide
const EASE = [0.22, 1, 0.36, 1] as const;

export default function WhiteboardFocusScene() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  const activeItem = FOCUS_ITEMS[currentIndex] ?? FOCUS_ITEMS[0]!;

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % FOCUS_ITEMS.length);
    setProgress(0);
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + FOCUS_ITEMS.length) % FOCUS_ITEMS.length);
    setProgress(0);
  }, []);

  const handleSelect = (idx: number) => {
    setCurrentIndex(idx);
    setProgress(0);
  };

  // Auto-cycle timer with progress bar
  useEffect(() => {
    if (isPaused) return;

    const intervalTime = 50; // update every 50ms
    const step = (intervalTime / AUTOPLAY_DURATION) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPaused, handleNext]);

  const handleOpenBioProject = () => {
    openProjectModal("bio-identifier");
    const projEl = document.getElementById("projects");
    if (projEl) {
      projEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  const getCategoryIcon = (id: FocusCategory) => {
    switch (id) {
      case "building":
        return <Hammer className="h-3.5 w-3.5" />;
      case "learning":
        return <Sparkles className="h-3.5 w-3.5" />;
      case "exploring":
        return <Compass className="h-3.5 w-3.5" />;
    }
  };

  return (
    <section
      id="focus"
      className="relative mx-auto w-full max-w-275 px-6 sm:px-10"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Outer frame styling matching Hero & ContactCard */}
      <div className="relative w-full overflow-hidden rounded-4xl border border-foreground/8 bg-background p-1.5 shadow-sm">
        <div className="relative w-full overflow-hidden rounded-[1.6rem] border border-foreground/5 bg-foreground/[0.015] p-6 sm:p-8 md:p-10 dark:bg-foreground/[0.03]">
          
          {/* Section Header */}
          <div className="flex flex-col gap-4 border-b border-foreground/6 pb-7 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-2.5">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-foreground/8 bg-background px-3 py-1 text-xs font-mono font-medium text-foreground/75 shadow-xs">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <span>Current Focus &amp; Roadmap</span>
              </div>

              <h2 className="font-serif text-[1.85rem] font-medium leading-[1.15] tracking-tight text-foreground sm:text-[2.25rem] md:text-[2.65rem]">
                What I&rsquo;m{" "}
                <span className="relative inline-block">
                  <span className="border-b border-foreground/25 pb-0.5">
                    building &amp; exploring
                  </span>
                </span>
              </h2>

              <p className="max-w-[42ch] text-[15px] leading-[1.5] text-foreground/65 sm:text-[17px]">
                An active snapshot of what I&rsquo;m currently engineering, learning in depth, and architectural tools I&rsquo;m exploring.
              </p>
            </div>

            {/* Segmented Controls & Pagination */}
            <div className="flex flex-col items-start gap-2.5 sm:items-end">
              <div
                role="tablist"
                aria-label="Focus categories"
                className="inline-flex items-center gap-1 rounded-2xl border border-foreground/8 bg-background p-1 shadow-xs"
              >
                {FOCUS_ITEMS.map((item, idx) => {
                  const isActive = idx === currentIndex;
                  return (
                    <button
                      key={item.id}
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => handleSelect(idx)}
                      className="focus-ring relative flex cursor-pointer items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition-colors duration-200"
                    >
                      {isActive && (
                        <motion.span
                          layoutId="activeFocusTab"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                          className="absolute inset-0 rounded-xl bg-foreground/8 ring-1 ring-foreground/10"
                        />
                      )}
                      <span
                        className={`relative z-10 flex items-center gap-1.5 ${
                          isActive ? "text-foreground font-semibold" : "text-foreground/60 hover:text-foreground"
                        }`}
                      >
                        {getCategoryIcon(item.id)}
                        <span className="capitalize">{item.id}</span>
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Step indicator and Next/Prev buttons */}
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] text-foreground/45">
                  0{currentIndex + 1} / 0{FOCUS_ITEMS.length}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handlePrev}
                    aria-label="Previous focus item"
                    className="focus-ring flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg border border-foreground/8 bg-background text-foreground/60 transition-colors hover:bg-foreground/5 hover:text-foreground"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label="Next focus item"
                    className="focus-ring flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg border border-foreground/8 bg-background text-foreground/60 transition-colors hover:bg-foreground/5 hover:text-foreground"
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Subtle auto-play progress bar */}
          <div className="relative mt-2 h-0.5 w-full overflow-hidden rounded-full bg-foreground/5">
            <motion.div
              className="h-full rounded-full transition-all"
              style={{
                width: `${progress}%`,
                backgroundColor: activeItem.accentColor,
              }}
            />
          </div>

          {/* Active Card Body */}
          <div className="mt-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeItem.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12"
              >
                {/* Left details column */}
                <div className={activeItem.image ? "flex flex-col gap-5 lg:col-span-7" : "flex flex-col gap-5 lg:col-span-6"}>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-0.5 text-xs font-mono font-semibold"
                      style={{
                        backgroundColor: activeItem.accentBg,
                        color: activeItem.accentColor,
                        border: `1px solid ${activeItem.accentBorder}`,
                      }}
                    >
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: activeItem.accentColor }}
                      />
                      {activeItem.tag}
                    </span>

                    <span className="text-xs font-mono text-foreground/45">
                      {activeItem.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-serif text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
                      {activeItem.title}
                    </h3>
                    <p className="mt-1 text-xs font-mono font-medium text-foreground/60">
                      {activeItem.subtitle}
                    </p>
                  </div>

                  <p className="text-[15px] leading-relaxed text-foreground/75 sm:text-[16px]">
                    {activeItem.description}
                  </p>

                  {/* Tech stack pill tags */}
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-foreground/50">
                      Primary Technologies:
                    </span>
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {activeItem.technologies.map((t) => (
                        <div
                          key={t.name}
                          className="group relative inline-flex items-center gap-1.5 rounded-lg border border-foreground/8 bg-background px-2.5 py-1 text-xs font-mono text-foreground/85 transition-colors hover:border-foreground/20 hover:bg-foreground/3"
                        >
                          <span
                            className="h-1.5 w-1.5 rounded-full"
                            style={{ backgroundColor: activeItem.accentColor }}
                          />
                          <span className="font-medium">{t.name}</span>
                          {t.note && (
                            <span className="text-[10px] text-foreground/40 hidden sm:inline">
                              &bull; {t.note}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions & Links */}
                  <div className="mt-2 flex flex-wrap items-center gap-3 pt-2">
                    {activeItem.id === "building" && (
                      <button
                        type="button"
                        onClick={handleOpenBioProject}
                        className="focus-ring group inline-flex cursor-pointer items-center gap-2 rounded-xl bg-foreground px-4 py-2.5 text-xs font-semibold text-background shadow-xs transition-opacity hover:opacity-90"
                      >
                        <span>View Project Details</span>
                        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                      </button>
                    )}

                    {activeItem.links?.map((link) => {
                      if (link.isProjectModal) return null; // already handled above

                      const isPrimary = link.variant === "primary";
                      const isSecondary = link.variant === "secondary";

                      return (
                        <a
                          key={link.label}
                          href={link.href}
                          target={link.isExternal ? "_blank" : undefined}
                          rel={link.isExternal ? "noopener noreferrer" : undefined}
                          className={`focus-ring inline-flex cursor-pointer items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-colors ${
                            isPrimary
                              ? "bg-foreground text-background hover:opacity-90"
                              : isSecondary
                              ? "border border-foreground/10 bg-background text-foreground hover:bg-foreground/5"
                              : "border border-foreground/10 bg-background text-foreground/80 hover:text-foreground hover:bg-foreground/5"
                          }`}
                        >
                          {link.isExternal && <Github className="h-3.5 w-3.5" />}
                          <span>{link.label}</span>
                          {link.isExternal ? (
                            <ExternalLink className="h-3 w-3 text-foreground/50" />
                          ) : (
                            <ArrowRight className="h-3.5 w-3.5" />
                          )}
                        </a>
                      );
                    })}
                  </div>
                </div>

                {/* Right visual / tech showcase column */}
                {activeItem.id === "building" && activeItem.image && (
                  <div className="flex flex-col items-center justify-center lg:col-span-5">
                    <button
                      type="button"
                      onClick={handleOpenBioProject}
                      className="group relative block w-full cursor-pointer overflow-hidden rounded-2xl border border-foreground/10 bg-background p-1.5 shadow-sm transition-all duration-300 hover:border-foreground/25 hover:shadow-md"
                      title="Click to view Bio-Identifier in Projects"
                    >
                      <div className="relative aspect-video w-full overflow-hidden rounded-[1rem] bg-foreground/5">
                        <Image
                          src={activeItem.image}
                          alt={activeItem.imageAlt ?? activeItem.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          priority
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center">
                          <span className="rounded-xl bg-background/90 px-3.5 py-1.5 text-xs font-medium text-foreground backdrop-blur-md shadow-md flex items-center gap-1.5">
                            <span>Open In Projects</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center justify-between px-2 py-1 text-left">
                        <span className="font-mono text-[11px] text-foreground/60">
                          bio-identifier (Frontend + Backend)
                        </span>
                        <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                          ● Active Build
                        </span>
                      </div>
                    </button>
                  </div>
                )}

                {/* Learning Interactive Tech Grid */}
                {activeItem.id === "learning" && (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:col-span-6">
                    {[
                      { name: "Three.js", category: "3D Engine", desc: "3D scene graphs, lighting & cameras", icon: <Boxes className="h-4 w-4 text-blue-500" /> },
                      { name: "WebGL", category: "Shaders", desc: "GLSL vertex & fragment shaders", icon: <Cpu className="h-4 w-4 text-cyan-500" /> },
                      { name: "WebRTC", category: "P2P Streams", desc: "Peer-to-peer audio & video data", icon: <Radio className="h-4 w-4 text-indigo-500" /> },
                      { name: "WebSocket", category: "Real-Time", desc: "Full-duplex low-latency events", icon: <Zap className="h-4 w-4 text-amber-500" /> },
                      { name: "Konva.js", category: "Canvas 2D", desc: "High-perf canvas animations & shapes", icon: <Layers className="h-4 w-4 text-purple-500" /> },
                      { name: "Linux", category: "Operating System", desc: "Shell scripting & server environments", icon: <Terminal className="h-4 w-4 text-emerald-500" /> },
                    ].map((tech) => (
                      <div
                        key={tech.name}
                        className="group flex flex-col justify-between rounded-2xl border border-foreground/8 bg-background p-4 shadow-xs transition-all duration-300 hover:border-foreground/20 hover:bg-foreground/[0.02]"
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-foreground/4">
                              {tech.icon}
                            </span>
                            <span className="rounded-md bg-foreground/4 px-1.5 py-0.5 text-[9px] font-mono text-foreground/50">
                              {tech.category}
                            </span>
                          </div>
                          <h4 className="mt-3 font-mono text-sm font-semibold text-foreground">
                            {tech.name}
                          </h4>
                          <p className="mt-1 text-[11px] leading-tight text-foreground/60">
                            {tech.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Exploring Interactive Tech Grid */}
                {activeItem.id === "exploring" && (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:col-span-6">
                    {[
                      { name: "Node.js", category: "Runtime", desc: "Non-blocking asynchronous server engine", icon: <Server className="h-4 w-4 text-emerald-500" /> },
                      { name: "Nest.js", category: "Framework", desc: "Enterprise TypeScript architecture", icon: <Cpu className="h-4 w-4 text-rose-500" /> },
                      { name: "Prisma", category: "Database ORM", desc: "Type-safe schemas & migrations", icon: <Database className="h-4 w-4 text-cyan-500" /> },
                      { name: "Python", category: "Language", desc: "AI pipelines & automation scripts", icon: <Globe className="h-4 w-4 text-amber-500" /> },
                      { name: "FastAPI", category: "API Framework", desc: "High-speed asynchronous Python REST", icon: <Zap className="h-4 w-4 text-teal-500" /> },
                    ].map((tech) => (
                      <div
                        key={tech.name}
                        className="group flex flex-col justify-between rounded-2xl border border-foreground/8 bg-background p-4 shadow-xs transition-all duration-300 hover:border-foreground/20 hover:bg-foreground/[0.02]"
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-foreground/4">
                              {tech.icon}
                            </span>
                            <span className="rounded-md bg-foreground/4 px-1.5 py-0.5 text-[9px] font-mono text-foreground/50">
                              {tech.category}
                            </span>
                          </div>
                          <h4 className="mt-3 font-mono text-sm font-semibold text-foreground">
                            {tech.name}
                          </h4>
                          <p className="mt-1 text-[11px] leading-tight text-foreground/60">
                            {tech.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
