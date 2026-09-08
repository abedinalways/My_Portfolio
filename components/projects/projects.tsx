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
  Filter,
} from "lucide-react";
import type { ReactNode } from "react";
import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { FadeIn } from "@/components/ui/motion-primitives";

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
  demoUrl: string;
  readme: {
    about: string;
    features: string[];
    techStack: string[];
    quickStart?: string;
  };
};

const PROJECTS: Project[] = [
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

export function Projects({
  withHeadline = false,
  viewMoreVisible = false,
}: ProjectsProps): ReactNode {
  const [activeTab, setActiveTab] = useState<"pinned" | "all">("pinned");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("All");
  const [inspectProject, setInspectProject] = useState<Project | null>(null);

  // Extract unique languages for filter
  const languages = useMemo(() => {
    const langs = Array.from(new Set(PROJECTS.map((p) => p.language)));
    return ["All", ...langs];
  }, []);

  // Filter projects based on tab, search query, and selected language
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

  return (
    <section className="relative w-full py-4">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        {withHeadline ? (
          <FadeIn className="flex flex-col items-center gap-3 pt-8 pb-8 text-center sm:pt-14 sm:pb-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3.5 py-1 text-xs font-mono text-blue-600 dark:text-blue-400">
              <BookOpen className="h-3.5 w-3.5" />
              <span>github.com/abedinalways</span>
            </div>
            <h2 className="font-sans text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Projects & Repositories
            </h2>
            <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
              Explore my open-source projects, case studies, and code repositories formatted in authentic GitHub style.
            </p>
          </FadeIn>
        ) : null}

        {/* GitHub Header Navigation Bar */}
        <div className="mb-6 rounded-xl border border-border bg-card/60 p-3 shadow-xs backdrop-blur-md">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Nav Tabs */}
            <div className="flex items-center gap-1 border-b border-border pb-3 md:border-b-0 md:pb-0">
              <button
                type="button"
                onClick={() => setActiveTab("pinned")}
                className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  activeTab === "pinned"
                    ? "bg-blue-500/15 text-blue-600 dark:text-blue-400 font-semibold"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Pin className="h-4 w-4" />
                <span>Pinned Repos</span>
                <span className="ml-1 rounded-full bg-muted px-2 py-0.5 text-xs text-foreground font-mono">
                  {PROJECTS.filter((p) => p.isPinned).length}
                </span>
              </button>

              {!viewMoreVisible && (
                <button
                  type="button"
                  onClick={() => setActiveTab("all")}
                  className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    activeTab === "all"
                      ? "bg-blue-500/15 text-blue-600 dark:text-blue-400 font-semibold"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <BookOpen className="h-4 w-4" />
                  <span>All Repositories</span>
                  <span className="ml-1 rounded-full bg-muted px-2 py-0.5 text-xs text-foreground font-mono">
                    {PROJECTS.length}
                  </span>
                </button>
              )}
            </div>

            {/* Controls: Search and Language Filter */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Search Bar */}
              <div className="relative min-w-[200px] flex-1 md:w-64 md:flex-initial">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Find a repository..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-md border border-border bg-background py-1.5 pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-blue-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
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

              {/* Language Filter */}
              <div className="relative inline-flex items-center">
                <Filter className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="appearance-none rounded-md border border-border bg-background py-1.5 pl-8 pr-7 text-xs font-medium text-foreground hover:bg-muted focus:border-blue-500 focus:outline-hidden"
                >
                  {languages.map((lang) => (
                    <option key={lang} value={lang}>
                      Language: {lang}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Repository Grid */}
        {filteredProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border p-12 text-center">
            <BookOpen className="mb-3 h-10 w-10 text-muted-foreground/60" />
            <h3 className="text-base font-semibold text-foreground">No repositories found</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Try matching your search with a different keyword or language filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedLanguage("All");
              }}
              className="mt-4 text-xs font-medium text-blue-500 hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {filteredProjects.map((project, index) => (
              <GitHubRepoCard
                key={project.id}
                project={project}
                index={index}
                onInspect={() => setInspectProject(project)}
              />
            ))}
          </div>
        )}

        {/* View All Button on Home */}
        {viewMoreVisible ? (
          <div className="mt-10 flex justify-center">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground transition-all hover:border-blue-500/40 hover:bg-muted hover:shadow-md"
            >
              <span>View all repositories on GitHub style</span>
              <ArrowRight className="h-4 w-4 text-blue-500" />
            </Link>
          </div>
        ) : null}
      </div>

      {/* Repository README Inspector Modal */}
      {inspectProject && (
        <ReadmeModal project={inspectProject} onClose={() => setInspectProject(null)} />
      )}
    </section>
  );
}

function GitHubRepoCard({
  project,
  index,
  onInspect,
}: {
  project: Project;
  index: number;
  onInspect: () => void;
}): ReactNode {
  return (
    <FadeIn delay={Math.min(index * 0.05, 0.25)}>
      <article className="group relative flex h-full flex-col justify-between rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/5 dark:bg-[#0d1117]/90 dark:hover:border-blue-400/50">
        <div>
          {/* Header row: Repo Icon, Name, Public tag, Action Links */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap min-w-0">
              <BookOpen className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-blue-500" />
              <button
                type="button"
                onClick={onInspect}
                className="truncate font-mono text-sm font-bold text-blue-600 hover:underline dark:text-[#58a6ff] text-left"
              >
                {project.repoName}
              </button>
              <span className="rounded-full border border-border px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                Public
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-1 shrink-0">
              {project.isPinned && (
                <span title="Pinned Repository" className="text-amber-500">
                  <Pin className="h-3.5 w-3.5" />
                </span>
              )}
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                title="View Code on GitHub"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* Title & Description */}
          <div className="mt-3">
            <h3 className="text-base font-semibold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400">
              {project.title}
            </h3>
            <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed line-clamp-2">
              {project.description}
            </p>
          </div>

          {/* Project Preview Image */}
          <div
            onClick={onInspect}
            className="mt-3.5 relative w-full h-44 overflow-hidden rounded-lg border border-border/80 bg-muted cursor-pointer"
          >
            <Image
              src={project.image}
              alt={project.imageAlt}
              fill
              sizes="(min-width: 768px) 500px, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-end p-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-white bg-black/70 backdrop-blur-xs px-2.5 py-1 rounded-md">
                <Code2 className="h-3.5 w-3.5 text-blue-400" /> Inspect Repository & README
              </span>
            </div>
          </div>

          {/* Topics / Tech Stack Badges */}
          <div className="mt-3.5 flex flex-wrap gap-1.5">
            {project.topics.map((topic) => (
              <span
                key={topic}
                className="rounded-md bg-blue-500/10 px-2 py-0.5 text-[11px] font-mono font-medium text-blue-600 dark:bg-[#121d2f] dark:text-[#58a6ff]"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>

        {/* Footer: Language dot, Stars, Forks, Updated info */}
        <div className="mt-4 pt-3 border-t border-border/70 flex flex-wrap items-center justify-between text-xs text-muted-foreground gap-y-2">
          <div className="flex items-center gap-4">
            {/* Primary Language */}
            <div className="flex items-center gap-1.5">
              <span
                className="h-3 w-3 rounded-full shrink-0"
                style={{ backgroundColor: project.languageColor }}
              />
              <span className="font-medium text-foreground">{project.language}</span>
            </div>

            {/* Stars */}
            <div className="flex items-center gap-1 hover:text-amber-500 transition-colors">
              <Star className="h-3.5 w-3.5 fill-current text-amber-500" />
              <span>{project.stars}</span>
            </div>

            {/* Forks */}
            <div className="flex items-center gap-1 hover:text-foreground">
              <GitFork className="h-3.5 w-3.5" />
              <span>{project.forks}</span>
            </div>
          </div>

          {/* Inspect Button & Last Updated */}
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-muted-foreground">{project.updatedAt}</span>
            <button
              type="button"
              onClick={onInspect}
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline dark:text-[#58a6ff]"
            >
              <span>README</span>
              <FileCode2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </article>
    </FadeIn>
  );
}

function ReadmeModal({
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-xl border border-border bg-background shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-card px-5 py-3.5">
          <div className="flex items-center gap-2 min-w-0">
            <BookOpen className="h-4 w-4 text-blue-500 shrink-0" />
            <span className="font-mono text-sm font-bold text-foreground truncate">
              {project.repoName}
            </span>
            <span className="rounded-md bg-blue-500/10 px-2 py-0.5 text-[10px] font-mono text-blue-600 dark:text-[#58a6ff]">
              README.md
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Main Title & Image */}
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground font-sans">
              {project.title}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              {project.readme.about}
            </p>
          </div>

          <div className="relative w-full h-64 rounded-xl overflow-hidden border border-border bg-muted">
            <Image
              src={project.image}
              alt={project.imageAlt}
              fill
              className="object-cover"
            />
          </div>

          {/* Key Features */}
          <div>
            <h3 className="text-sm font-mono font-semibold text-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-500" /> Key Architectural Features
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
              {project.readme.features.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech Stack */}
          <div>
            <h3 className="text-sm font-mono font-semibold text-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
              <Layers className="h-4 w-4 text-purple-500" /> Tech Stack Breakdown
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.readme.techStack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-lg border border-border bg-card px-3 py-1 text-xs font-mono text-foreground shadow-2xs"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Start Terminal Code Block */}
          {project.readme.quickStart && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-mono font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-emerald-500" /> Quick Start
                </h3>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                      <span className="text-emerald-500">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 rounded-lg bg-black text-emerald-400 font-mono text-xs overflow-x-auto border border-emerald-500/20">
                <code>{project.readme.quickStart}</code>
              </pre>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-border bg-card px-6 py-3.5">
          <span className="text-xs text-muted-foreground font-mono">
            License: MIT • {project.meta}
          </span>
          <div className="flex items-center gap-2">
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
            >
              <ExternalLink className="h-3.5 w-3.5" /> GitHub Code
            </a>
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-blue-700 shadow-xs"
            >
              <Sparkles className="h-3.5 w-3.5" /> Live Preview
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

