"use client";

import {
  BookOpen,
  ExternalLink,
  GitFork,
  Layers,
  Pin,
  Search,
  Sparkles,
  Star,
  X,
  Code2,
  FileCode2,
  Terminal,
  Check,
  Copy,
  ArrowRight,
  Play,
} from "lucide-react";
import type { ReactNode } from "react";
import { useState, useMemo, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useInView } from "motion/react";

export type Project = {
  id: string;
  repoName: string;
  title: string;
  description: string;
  meta: string;
  language: string;
  languageColor: string;
  stars: number;
  forks: number;
  topics: string[];
  isPinned: boolean;
  updatedAt: string;
  imageRatio: number;
  image: string;
  imageAlt: string;
  githubUrl: string;
  frontendGithubUrl?: string;
  backendGithubUrl?: string;
  demoUrl: string;
  readme: {
    about: string;
    features: string[];
    techStack: string[];
    quickStart?: string;
  };
};

export function openProjectModal(id: string) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("open-project-modal", { detail: { id } }));
  }
}

const PROJECTS: Project[] = [
  {
    id: "bio-identifier",
    repoName: "abedinalways/bio-identifier",
    title: "Bio-Identifier — AI Snake & Insect Recognition",
    description:
      "An intelligent platform powered by computer vision to identify snake and insect species, assess venomous risk, and explore biological taxonomy.",
    meta: "Full-Stack Engineer • 2026",
    language: "TypeScript",
    languageColor: "#3178c6",
    stars: 89,
    forks: 14,
    topics: ["nextjs", "nestjs", "typescript", "ai-vision", "tailwindcss", "prisma"],
    isPinned: true,
    updatedAt: "Active in development",
    imageRatio: 16 / 9,
    image: "/bio-identifier.jpg",
    imageAlt: "Bio-Identifier AI snake and insect classification platform mockup",
    githubUrl: "https://github.com/abedinalways/bio-identifier-frontend",
    frontendGithubUrl: "https://github.com/abedinalways/bio-identifier-frontend",
    backendGithubUrl: "https://github.com/abedinalways/bio-identifier-backend",
    demoUrl: "https://github.com/abedinalways/bio-identifier-frontend",
    readme: {
      about:
        "Bio-Identifier is an AI-driven biodiversity platform built to rapidly identify snake and insect specimens from photos. It classifies biological taxonomy (Kingdom, Phylum, Class, Order, Family, Genus, Species) and alerts users to venom risk levels for safety.",
      features: [
        "Real-time image classification for snakes, arachnids, and insects with high accuracy (98%+ match)",
        "Instant venomous / non-venomous safety alerts with emergency guidance",
        "Complete biological taxonomy tree breakdown (Kingdom down to Species)",
        "Modern, accessible Next.js frontend built with React 19 and Tailwind CSS",
        "High-performance, modular NestJS backend with Prisma ORM and structured REST endpoints",
      ],
      techStack: [
        "Frontend: Next.js, React 19, TypeScript, Tailwind CSS",
        "Backend: NestJS, Node.js, TypeScript, Prisma ORM",
        "AI / Vision: Deep Learning Classifier & Computer Vision APIs",
      ],
      quickStart:
        "# Frontend repository\ngit clone https://github.com/abedinalways/bio-identifier-frontend.git\ncd bio-identifier-frontend && pnpm install && pnpm dev\n\n# Backend repository\ngit clone https://github.com/abedinalways/bio-identifier-backend.git\ncd bio-identifier-backend && pnpm install && pnpm run start:dev",
    },
  },
  {
    id: "loom",
    repoName: "abedinalways/loom-ai-workspace",
    title: "Loom — AI Writing Surface & Thought Companion",
    description:
      "A focused writing surface where ideas, edits, and drafts coexist without chat clutter. Powered by real-time LLM suggestions.",
    meta: "Design Engineer • 2024",
    language: "TypeScript",
    languageColor: "#3178c6",
    stars: 184,
    forks: 32,
    topics: ["nextjs", "typescript", "ai-llm", "tailwindcss", "tiptap"],
    isPinned: true,
    updatedAt: "Updated 2 days ago",
    imageRatio: 752 / 497,
    image:
      "https://cdn.dribbble.com/userupload/46128964/file/b92b9d268dd928642ca94bd49e32923a.jpg?resize=752x497&vertical=center",
    imageAlt: "Loom AI writing companion mockup",
    githubUrl: "https://github.com/abedinalways",
    demoUrl: "https://loom-ai.demo.app",
    readme: {
      about:
        "Loom is a modern distraction-free writing environment that integrates intelligent suggestions directly inline rather than hiding them in a side chat sidebar.",
      features: [
        "Inline real-time AI auto-complete & ghost text",
        "Bi-directional linking between markdown document nodes",
        "Local-first architecture with instantaneous offline sync",
        "Custom rich-text canvas rendering engine",
      ],
      techStack: ["Next.js 15", "TypeScript", "TailwindCSS v4", "OpenAI API", "Zustand"],
      quickStart: "git clone https://github.com/abedinalways/loom-ai-workspace.git\ncd loom-ai-workspace\npnpm install\npnpm dev",
    },
  },
  {
    id: "atlas",
    repoName: "abedinalways/atlas-studio-brand",
    title: "Atlas Studio — Creative Studio Identity & Platform",
    description:
      "End to end identity, marketing site, and product surface designed to feel quietly confident across every digital touchpoint.",
    meta: "Product & Brand Designer • 2025",
    language: "TypeScript",
    languageColor: "#3178c6",
    stars: 129,
    forks: 18,
    topics: ["react", "framer-motion", "threejs", "design-system"],
    isPinned: true,
    updatedAt: "Updated 5 days ago",
    imageRatio: 1024 / 768,
    image:
      "https://cdn.dribbble.com/userupload/24599416/file/original-1ae5075dcd129aebb16bdbca24b41ac7.png?resize=1024x768&vertical=center",
    imageAlt: "Atlas Studio brand and product sprint mockup",
    githubUrl: "https://github.com/abedinalways",
    demoUrl: "https://atlas-studio.demo.app",
    readme: {
      about:
        "Atlas Studio was built as a full brand system and interactive portfolio showcase with WebGL shaders and custom typography.",
      features: [
        "Dynamic 3D WebGL background scenes",
        "Smooth page layout transitions with Framer Motion",
        "Accessibility optimized compliance (WCAG AAA)",
      ],
      techStack: ["React 19", "Three.js", "GSAP", "TailwindCSS"],
      quickStart: "npm install\nnpm run dev",
    },
  },
  {
    id: "rhythm",
    repoName: "abedinalways/rhythm-analytics",
    title: "Rhythm — Calm Analytics for Indie Founders",
    description:
      "A weekly digest that turns raw product data into a simple narrative. Built so founders can consume actionable metrics on Sunday with coffee.",
    meta: "Founder & Developer • 2024",
    language: "Python",
    languageColor: "#3572A5",
    stars: 215,
    forks: 41,
    topics: ["python", "fastapi", "postgresql", "data-viz", "chartjs"],
    isPinned: true,
    updatedAt: "Updated last week",
    imageRatio: 1024 / 768,
    image:
      "https://cdn.dribbble.com/userupload/47357856/file/75841fa59f32f05ca6c5ddf02d08dfe6.png?resize=1024x768&vertical=center",
    imageAlt: "Rhythm calm analytics mockup",
    githubUrl: "https://github.com/abedinalways",
    demoUrl: "https://rhythm-analytics.demo.app",
    readme: {
      about:
        "Rhythm aggregates telemetry from Stripe, Mixpanel, and PostHog into readable human narrative digests instead of overwhelming dashboards.",
      features: [
        "Automated weekly email summaries via Resend API",
        "Cohort retention calculation engine",
        "Privacy-first data hashing and zero third-party cookie trackers",
      ],
      techStack: ["Python 3.12", "FastAPI", "SQLAlchemy", "Next.js", "Chart.js"],
      quickStart: "pip install -r requirements.txt\nuvicorn main:app --reload",
    },
  },
  {
    id: "groove",
    repoName: "abedinalways/groove-booking-flow",
    title: "Groove — Music School Booking & Scheduling Engine",
    description:
      "Reimagined booking flow for music academies, assisting thousands of students in booking instructors seamlessly.",
    meta: "Lead Designer & Frontend • 2023",
    language: "JavaScript",
    languageColor: "#f1e05a",
    stars: 96,
    forks: 14,
    topics: ["javascript", "fullcalendar", "stripe", "react"],
    isPinned: false,
    updatedAt: "Updated 2 weeks ago",
    imageRatio: 1024 / 768,
    image:
      "https://cdn.dribbble.com/userupload/43955214/file/original-d4cde1de803e84b97d8892e3444c04b0.png?resize=1024x768&vertical=center",
    imageAlt: "Groove music school booking flow mockup",
    githubUrl: "https://github.com/abedinalways",
    demoUrl: "https://groove-music.demo.app",
    readme: {
      about:
        "Groove eliminated appointment friction for over 5,000 active music students by introducing instant time-slot reservation and automated SMS reminders.",
      features: [
        "Timezone-aware scheduling calendar algorithm",
        "Stripe split payments integration for freelance music instructors",
        "Interactive lesson preview player",
      ],
      techStack: ["React", "Node.js", "Express", "Stripe API", "MongoDB"],
    },
  },
  {
    id: "fieldnote",
    repoName: "abedinalways/fieldnote-research-tool",
    title: "Fieldnote — Pocket Research Tool for Product Teams",
    description:
      "Capture quotes, tag qualitative patterns, and synthesize research themes into actionable insights in one place.",
    meta: "Design Engineer • 2024",
    language: "TypeScript",
    languageColor: "#3178c6",
    stars: 168,
    forks: 22,
    topics: ["typescript", "indexeddb", "vector-search", "pwa"],
    isPinned: true,
    updatedAt: "Updated 3 weeks ago",
    imageRatio: 1024 / 768,
    image:
      "https://cdn.dribbble.com/userupload/30310902/file/original-621e7fe47be9d11ee14544456c693bec.png?resize=1024x768&vertical=center",
    imageAlt: "Fieldnote pocket sized research tool mockup",
    githubUrl: "https://github.com/abedinalways",
    demoUrl: "https://fieldnote.demo.app",
    readme: {
      about:
        "Fieldnote empowers user researchers to quickly tag interview transcripts, attach audio notes, and cluster observations into affinity diagrams.",
      features: [
        "Offline-capable PWA with IndexedDB storage",
        "Semantic similarity search powered by vector embeddings",
        "Export directly to Notion & Jira tickets",
      ],
      techStack: ["TypeScript", "Next.js", "Vector DB", "TailwindCSS"],
    },
  },
  {
    id: "talkback",
    repoName: "abedinalways/talkback-llm-ui",
    title: "Talkback — Friendly Interface for Language Models",
    description:
      "An exploration of how AI chat could feel less like a terminal and more like a warm, intuitive conversation with a curious friend.",
    meta: "Independent Project • 2025",
    language: "CSS",
    languageColor: "#563d7c",
    stars: 310,
    forks: 57,
    topics: ["css3", "web-speech-api", "llm-ui", "theme-engine"],
    isPinned: true,
    updatedAt: "Updated 1 month ago",
    imageRatio: 1024 / 768,
    image:
      "https://cdn.dribbble.com/userupload/16560717/file/original-c6f745d50302d66609bfe080f99f5396.png?resize=1024x768&vertical=center",
    imageAlt: "Talkback friendlier AI chat interface mockup",
    githubUrl: "https://github.com/abedinalways",
    demoUrl: "https://talkback-ai.demo.app",
    readme: {
      about:
        "Talkback introduces human-centric micro-interactions, custom emotion themes, and hands-free voice synthesis to generative AI conversations.",
      features: [
        "Real-time streaming response animation with fluid typography",
        "Voice input & SpeechSynthesis audio integration",
        "Custom CSS variable theme creator",
      ],
      techStack: ["React", "Web Speech API", "CSS Modules", "OpenAI Stream"],
    },
  },
];

export type ProjectsProps = {
  withHeadline?: boolean;
  viewMoreVisible?: boolean;
};

/* animation variants */
const EASE = [0.22, 1, 0.36, 1] as const;
const cardVariants = {
  hidden: { opacity: 0, y: 32, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, delay: i * 0.08, ease: EASE },
  }),
};

const TABS = [
  { key: "pinned" as const, label: "Pinned", icon: <Pin className="h-3.5 w-3.5" /> },
  { key: "all" as const, label: "All Projects", icon: <BookOpen className="h-3.5 w-3.5" /> },
];

export function Projects({
  withHeadline = false,
  viewMoreVisible = false,
}: ProjectsProps): ReactNode {
  const [activeTab, setActiveTab] = useState<"pinned" | "all">("pinned");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("All");
  const [inspectProject, setInspectProject] = useState<Project | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const languages = useMemo(() => {
    const langs = Array.from(new Set(PROJECTS.map((p) => p.language)));
    return ["All", ...langs];
  }, []);

  const filteredProjects = useMemo(() => {
    let list = PROJECTS;
    if (viewMoreVisible) {
      list = list.slice(0, 4);
    } else if (activeTab === "pinned") {
      list = list.filter((p) => p.isPinned);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.repoName.toLowerCase().includes(q) ||
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.topics.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (selectedLanguage !== "All") {
      list = list.filter((p) => p.language === selectedLanguage);
    }
    return list;
  }, [activeTab, searchQuery, selectedLanguage, viewMoreVisible]);

  /* search open effect */
  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  /* lock body scroll when panel open */
  useEffect(() => {
    if (inspectProject) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [inspectProject]);

  /* listen for open-project-modal custom event */
  useEffect(() => {
    const handleOpenProject = (e: Event) => {
      const customEvent = e as CustomEvent<{ id: string }>;
      const found = PROJECTS.find((p) => p.id === customEvent.detail?.id);
      if (found) {
        setInspectProject(found);
      }
    };
    window.addEventListener("open-project-modal", handleOpenProject);
    return () => {
      window.removeEventListener("open-project-modal", handleOpenProject);
    };
  }, []);

  return (
    <section id="projects" className="relative w-full py-4 scroll-mt-24">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">

        {/* ── Headline ── */}
        {withHeadline ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center gap-4 pt-8 pb-12 text-center sm:pt-14 sm:pb-14"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3.5 py-1 text-xs font-mono text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>github.com/abedinalways</span>
            </div>
            <h2 className="font-serif text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
              Selected{" "}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-blue-500 via-violet-500 to-purple-500 bg-clip-text text-transparent">
                  Projects
                </span>
                <span
                  className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-blue-500/60 via-violet-500/60 to-purple-500/60"
                  aria-hidden
                />
              </span>
            </h2>
            <p className="max-w-md text-base text-muted-foreground sm:text-lg">
              Open-source work, case studies, and code I&apos;m proud to have shipped.
            </p>
          </motion.div>
        ) : null}

        {/* ── Control Bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          {/* Pill tabs */}
          {!viewMoreVisible && (
            <div className="relative flex items-center gap-1 rounded-xl border border-border bg-muted/60 p-1 backdrop-blur-sm">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className="relative flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors"
                >
                  {activeTab === tab.key && (
                    <motion.span
                      layoutId="tab-ink"
                      className="absolute inset-0 rounded-lg bg-background shadow-sm"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                  <span className={`relative z-10 flex items-center gap-1.5 ${activeTab === tab.key ? "text-foreground" : "text-muted-foreground"}`}>
                    {tab.icon}
                    {tab.label}
                    <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
                      {tab.key === "pinned"
                        ? PROJECTS.filter((p) => p.isPinned).length
                        : PROJECTS.length}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Right controls */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Search toggle */}
            <div className="flex items-center gap-2">
              <AnimatePresence>
                {searchOpen && (
                  <motion.div
                    key="search-input"
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 180, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="relative">
                      <input
                        ref={searchRef}
                        type="text"
                        placeholder="Search projects…"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-lg border border-border bg-background py-1.5 pl-3 pr-7 text-xs text-foreground placeholder:text-muted-foreground focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/30"
                      />
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() => setSearchQuery("")}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <button
                type="button"
                onClick={() => {
                  if (searchOpen && searchQuery) setSearchQuery("");
                  setSearchOpen((v) => !v);
                }}
                className={`rounded-lg border border-border p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground ${searchOpen ? "bg-muted text-foreground" : ""}`}
                aria-label="Toggle search"
              >
                {searchOpen && !searchQuery ? <X className="h-3.5 w-3.5" /> : <Search className="h-3.5 w-3.5" />}
              </button>
            </div>

            {/* Language capsule chips */}
            <div className="flex items-center gap-1 overflow-x-auto">
              {languages.map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setSelectedLanguage(lang)}
                  className={`relative shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                    selectedLanguage === lang
                      ? "border-blue-500/40 bg-blue-500/10 text-blue-600 dark:text-blue-400"
                      : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {selectedLanguage === lang && (
                    <motion.span
                      layoutId="lang-ink"
                      className="absolute inset-0 rounded-full bg-blue-500/10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.35 }}
                    />
                  )}
                  <span className="relative z-10">{lang}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Bento Grid ── */}
        <AnimatePresence mode="wait">
          {filteredProjects.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border p-16 text-center"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                <Search className="h-6 w-6 text-muted-foreground/60" />
              </div>
              <h3 className="text-base font-semibold text-foreground">No projects found</h3>
              <p className="mt-1.5 max-w-xs text-xs text-muted-foreground">
                Try adjusting your search or language filter.
              </p>
              <button
                type="button"
                onClick={() => { setSearchQuery(""); setSelectedLanguage("All"); }}
                className="mt-5 rounded-lg bg-foreground px-4 py-1.5 text-xs font-semibold text-background transition-opacity hover:opacity-80"
              >
                Clear filters
              </button>
            </motion.div>
          ) : (
            <motion.div key="grid" className="space-y-4">
              {/* Featured — first project full width */}
              {filteredProjects[0] && (
                <motion.div custom={0} variants={cardVariants} initial="hidden" animate="visible">
                  <ProjectCard
                    project={filteredProjects[0]}
                    featured
                    onInspect={() => setInspectProject(filteredProjects[0] ?? null)}
                  />
                </motion.div>
              )}
              {/* Remaining 2-col */}
              {filteredProjects.length > 1 && (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {filteredProjects.slice(1).map((project, idx) => (
                    <motion.div
                      key={project.id}
                      custom={idx + 1}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <ProjectCard
                        project={project}
                        featured={false}
                        onInspect={() => setInspectProject(project)}
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* View All CTA */}
        {viewMoreVisible ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mt-12 flex justify-center"
          >
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2.5 rounded-xl border border-border bg-card px-6 py-3 text-sm font-medium text-foreground transition-all duration-300 hover:border-blue-500/40 hover:bg-muted hover:shadow-lg hover:shadow-blue-500/5"
            >
              <span>View all projects</span>
              <ArrowRight className="h-4 w-4 text-blue-500 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        ) : null}
      </div>

      {/* ── Side Panel Inspector ── */}
      <AnimatePresence>
        {inspectProject && (
          <ProjectPanel project={inspectProject} onClose={() => setInspectProject(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}

/* ══════════════════════════════════════════════
   PROJECT CARD — bento card with image + content
══════════════════════════════════════════════ */
function ProjectCard({
  project,
  featured,
  onInspect,
}: {
  project: Project;
  featured: boolean;
  onInspect: () => void;
}): ReactNode {
  const ref = useRef<HTMLElement>(null);
  useInView(ref, { once: true, margin: "-80px" });

  return (
    <article
      ref={ref}
      onClick={onInspect}
      className={`project-card group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-500 hover:shadow-2xl dark:bg-[#0d1117]/80 ${
        featured ? "md:flex-row" : ""
      }`}
    >
      {/* Image */}
      <div
        className={`project-card__image relative overflow-hidden ${
          featured ? "h-60 w-full md:h-auto md:w-1/2 md:shrink-0" : "h-48 w-full"
        }`}
      >
        <div className="project-card__image-inner">
          <Image
            src={project.image}
            alt={project.imageAlt}
            fill
            sizes={featured ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 768px) 500px, 100vw"}
            className="object-cover"
          />
        </div>
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        {/* Inspect hint */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-lg bg-black/70 px-2.5 py-1.5 text-xs font-medium text-white backdrop-blur-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <Code2 className="h-3.5 w-3.5 text-blue-400" />
          View Case Study
        </div>
        {/* Pinned badge */}
        {project.isPinned && (
          <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-semibold text-amber-400 backdrop-blur-sm">
            <Pin className="h-3 w-3" />
            Pinned
          </div>
        )}
      </div>

      {/* Content */}
      <div className={`flex flex-1 flex-col justify-between p-5 ${featured ? "md:p-7" : ""}`}>
        <div>
          {/* Repo name */}
          <div className="mb-3 flex items-center gap-1.5">
            <span className="font-mono text-xs text-blue-500 dark:text-[#58a6ff]">
              {project.repoName}
            </span>
            <span className="rounded-full border border-border px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground">
              Public
            </span>
          </div>

          {/* Title */}
          <h3
            className={`font-serif font-medium leading-snug tracking-tight text-foreground transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400 ${
              featured ? "text-2xl md:text-3xl" : "text-lg"
            }`}
          >
            {project.title}
          </h3>

          {/* Description */}
          <p className={`mt-2 leading-relaxed text-muted-foreground ${featured ? "text-sm max-w-prose" : "text-xs line-clamp-2"}`}>
            {project.description}
          </p>

          {/* Topics */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.topics.slice(0, featured ? undefined : 3).map((topic) => (
              <span
                key={topic}
                className="rounded-full bg-blue-500/8 px-2.5 py-0.5 text-[11px] font-mono font-medium text-blue-600 dark:bg-blue-500/10 dark:text-[#58a6ff]"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-border/50 pt-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: project.languageColor }}
              />
              <span className="font-medium text-foreground">{project.language}</span>
            </div>
            <div className="flex items-center gap-1 hover:text-amber-500 transition-colors">
              <Star className="h-3.5 w-3.5 fill-current text-amber-500" />
              <span>{project.stars}</span>
            </div>
            <div className="flex items-center gap-1 hover:text-foreground transition-colors">
              <GitFork className="h-3.5 w-3.5" />
              <span>{project.forks}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px]">{project.updatedAt}</span>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-[#58a6ff]">
              <FileCode2 className="h-3.5 w-3.5" />
              README
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

/* ══════════════════════════════════════════════
   SIDE PANEL INSPECTOR — slides in from right
══════════════════════════════════════════════ */
function ProjectPanel({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}): ReactNode {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (project.readme.quickStart) {
      navigator.clipboard.writeText(project.readme.quickStart);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
      />

      {/* Panel */}
      <motion.aside
        key="panel"
        initial={{ x: "100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: "100%", opacity: 0 }}
        transition={{ type: "spring", damping: 30, stiffness: 280, mass: 0.8 }}
        className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col overflow-hidden bg-background shadow-2xl sm:max-w-lg"
      >
        {/* Panel Header */}
        <div className="flex items-center justify-between border-b border-border bg-card/80 backdrop-blur-md px-5 py-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <BookOpen className="h-4 w-4 shrink-0 text-blue-500" />
            <span className="truncate font-mono text-sm font-bold text-foreground">
              {project.repoName}
            </span>
            <span className="shrink-0 rounded-md bg-blue-500/10 px-2 py-0.5 text-[10px] font-mono text-blue-600 dark:text-[#58a6ff]">
              README.md
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="ml-2 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Close panel"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Panel Body */}
        <div className="flex-1 overflow-y-auto">
          {/* Hero image */}
          <div className="relative h-52 w-full overflow-hidden">
            <Image src={project.image} alt={project.imageAlt} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
            {/* Title overlay */}
            <div className="absolute bottom-4 left-5 right-5">
              <h2 className="font-serif text-xl font-medium leading-snug text-foreground drop-shadow-sm">
                {project.title}
              </h2>
              <p className="mt-1 text-xs font-mono text-muted-foreground">{project.meta}</p>
            </div>
          </div>

          <div className="space-y-7 p-5">
            {/* About */}
            <div>
              <SectionLabel icon={<Sparkles className="h-3.5 w-3.5" />} text="About" />
              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                {project.readme.about}
              </p>
            </div>

            {/* Stats pills */}
            <div className="grid grid-cols-3 gap-3">
              <StatPill label="Stars" value={project.stars.toString()} icon={<Star className="h-3.5 w-3.5 text-amber-500" />} />
              <StatPill label="Forks" value={project.forks.toString()} icon={<GitFork className="h-3.5 w-3.5 text-blue-500" />} />
              <StatPill label="Language" value={project.language} icon={<span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: project.languageColor }} />} />
            </div>

            {/* Features */}
            <div>
              <SectionLabel icon={<Code2 className="h-3.5 w-3.5" />} text="Key Features" />
              <ul className="mt-3 space-y-2.5">
                {project.readme.features.map((feat, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="flex items-start gap-2.5 text-sm text-muted-foreground"
                  >
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-500/10">
                      <Check className="h-2.5 w-2.5 text-blue-500" />
                    </span>
                    {feat}
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Tech Stack */}
            <div>
              <SectionLabel icon={<Layers className="h-3.5 w-3.5" />} text="Tech Stack" />
              <div className="mt-3 flex flex-wrap gap-2">
                {project.readme.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-lg border border-border bg-muted px-3 py-1 text-xs font-mono text-foreground"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Start */}
            {project.readme.quickStart && (
              <div>
                <div className="flex items-center justify-between">
                  <SectionLabel icon={<Terminal className="h-3.5 w-3.5" />} text="Quick Start" />
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <AnimatePresence mode="wait">
                      {copied ? (
                        <motion.span
                          key="copied"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          className="flex items-center gap-1 text-emerald-500"
                        >
                          <Check className="h-3.5 w-3.5" />
                          Copied!
                        </motion.span>
                      ) : (
                        <motion.span
                          key="copy"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          className="flex items-center gap-1"
                        >
                          <Copy className="h-3.5 w-3.5" />
                          Copy
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                </div>
                <pre className="mt-2 overflow-x-auto rounded-xl border border-emerald-500/20 bg-black p-4 font-mono text-xs text-emerald-400">
                  <code>{project.readme.quickStart}</code>
                </pre>
              </div>
            )}

            {/* Topics */}
            <div>
              <SectionLabel icon={<Pin className="h-3.5 w-3.5" />} text="Topics" />
              <div className="mt-3 flex flex-wrap gap-1.5">
                {project.topics.map((topic) => (
                  <span
                    key={topic}
                    className="rounded-full bg-blue-500/8 px-2.5 py-1 text-[11px] font-mono font-medium text-blue-600 dark:bg-blue-500/10 dark:text-[#58a6ff]"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            <div className="h-4" />
          </div>
        </div>

        {/* Panel Footer */}
        <div className="flex items-center justify-between border-t border-border bg-card/80 backdrop-blur-md px-5 py-4">
          <span className="font-mono text-xs text-muted-foreground">MIT License</span>
          <div className="flex flex-wrap items-center gap-2">
            {project.frontendGithubUrl && project.backendGithubUrl ? (
              <>
                <a
                  href={project.frontendGithubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Frontend Repo
                </a>
                <a
                  href={project.backendGithubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Backend Repo
                </a>
              </>
            ) : (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-3.5 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                GitHub
              </a>
            )}
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30"
            >
              <Play className="h-3.5 w-3.5" />
              Live Demo
            </a>
          </div>
        </div>
      </motion.aside>
    </>
  );
}

/* ── helper sub-components ── */
function SectionLabel({ icon, text }: { icon: ReactNode; text: string }): ReactNode {
  return (
    <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
      {icon}
      <span>{text}</span>
    </div>
  );
}

function StatPill({ label, value, icon }: { label: string; value: string; icon: ReactNode }): ReactNode {
  return (
    <div className="flex flex-col gap-1.5 rounded-xl border border-border bg-muted/50 p-3">
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
      <span className="font-mono text-sm font-semibold text-foreground">{value}</span>
    </div>
  );
}
