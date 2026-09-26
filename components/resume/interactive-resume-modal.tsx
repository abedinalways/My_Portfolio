"use client";

import { useEffect, useState, useRef } from "react";
import {
  Download,
  FileText,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Copy,
  Check,
  Briefcase,
  GraduationCap,
  Code2,
  Printer,
  X,
  Languages,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";

type ResumeListener = (open: boolean) => void;
const resumeListeners = new Set<ResumeListener>();

export function openResumeModal() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("open-resume-modal"));
  }
  resumeListeners.forEach((fn) => fn(true));
}

export function closeResumeModal() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("close-resume-modal"));
  }
  resumeListeners.forEach((fn) => fn(false));
}

export function InteractiveResumeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "experience" | "skills" | "education">("all");
  const scrollRef = useRef<HTMLDivElement>(null);

  const email = "sheikh.minhajul1205045@gmail.com";
  const phone = "01303002784";

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleClose = () => {
    setIsOpen(false);
    if (typeof window !== "undefined" && window.location.hash === "#resume") {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  };

  // Listen for global open/close events and state listeners
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    const listener: ResumeListener = (val) => setIsOpen(val);
    resumeListeners.add(listener);
    window.addEventListener("open-resume-modal", handleOpen);
    window.addEventListener("close-resume-modal", handleClose);

    // Also support hash #resume
    const checkHash = () => {
      if (window.location.hash === "#resume") {
        setIsOpen(true);
      }
    };
    checkHash();
    window.addEventListener("hashchange", checkHash);

    return () => {
      resumeListeners.delete(listener);
      window.removeEventListener("open-resume-modal", handleOpen);
      window.removeEventListener("close-resume-modal", handleClose);
      window.removeEventListener("hashchange", checkHash);
    };
  }, []);

  // Close on Escape key & manage body scroll lock + Lenis smooth scroll pause
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };

    const win = typeof window !== "undefined" ? (window as unknown as { lenis?: { stop: () => void; start: () => void } }) : null;

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
      win?.lenis?.stop();
    } else {
      document.body.style.overflow = "";
      win?.lenis?.start();
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      win?.lenis?.start();
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Interactive Resume"
          onClick={handleClose}
          data-lenis-prevent="true"
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 print:p-0 print:static print:z-auto"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity print:hidden"
            aria-hidden="true"
          />

          {/* Modal Window */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            data-lenis-prevent="true"
            className="relative flex h-full max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-border bg-background shadow-2xl print:max-h-none print:border-none print:shadow-none print:rounded-none"
          >
            {/* Top Bar Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-border bg-card/80 px-6 py-4 backdrop-blur-md print:hidden">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500 dark:text-blue-400">
                  <FileText className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="font-serif text-base font-semibold leading-tight text-foreground">
                    Interactive Resume
                  </h3>
                  <p className="text-[11px] font-mono text-muted-foreground">
                    Sheikh Minhajul Abedin • Updated 2026
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  title="Print CV"
                  className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>Print</span>
                </button>

                <a
                  href="/Sheikh_Minhajul_Abedin_Resume.pdf"
                  download="Sheikh_Minhajul_Abedin_Resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download PDF</span>
                </a>

                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-xl p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

          {/* Tab Filter */}
          <div className="flex shrink-0 items-center gap-1 border-b border-border/60 bg-muted/30 px-6 py-2 overflow-x-auto print:hidden">
            {(
              [
                { id: "all", label: "Full View" },
                { id: "experience", label: "Experience" },
                { id: "skills", label: "Core Skills" },
                { id: "education", label: "Education" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-background text-foreground shadow-sm font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Modal Scrollable Content */}
          <div
            ref={scrollRef}
            data-lenis-prevent="true"
            onWheel={(e) => e.stopPropagation()}
            className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-6 sm:p-10 space-y-8 [scrollbar-width:thin] [scrollbar-color:rgba(156,163,175,0.4)_transparent] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-foreground/20 hover:[&::-webkit-scrollbar-thumb]:bg-foreground/35"
          >
            {/* Header info */}
            <div className="border-b border-border/60 pb-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Open to Full-Time & Contract Roles</span>
                  </div>
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                    Sheikh Minhajul Abedin
                  </h1>
                  <p className="mt-1 text-base font-medium text-blue-600 dark:text-blue-400">
                    Jr. Frontend Engineer
                  </p>
                </div>

                <div className="flex flex-wrap sm:flex-col items-start sm:items-end gap-2 text-xs font-mono text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-foreground/50" />
                    <span>Dhaka, Bangladesh</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-foreground/50" />
                    <a href={`tel:${phone}`} className="hover:text-foreground transition-colors">
                      {phone}
                    </a>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="group flex items-center gap-1.5 hover:text-foreground transition-colors"
                  >
                    <Mail className="h-3.5 w-3.5 text-foreground/50" />
                    <span className="underline underline-offset-2">{email}</span>
                    {copiedEmail ? (
                      <Check className="h-3 w-3 text-emerald-500" />
                    ) : (
                      <Copy className="h-3 w-3 opacity-60 group-hover:opacity-100" />
                    )}
                  </button>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2 pt-2">
                <Link
                  href="https://github.com/abedinalways"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-mono text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <span>github.com/abedinalways</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>
                <Link
                  href="https://www.linkedin.com/in/sheikh-minhajul-abedin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-mono text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <span>linkedin.com/in/sheikh-minhajul-abedin</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>
                <Link
                  href="https://abedin.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-mono text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <span>abedin.vercel.app</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            </div>

            {/* Professional Summary */}
            {(activeTab === "all" || activeTab === "skills") && (
              <div>
                <h2 className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold mb-3 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-blue-500" />
                  Professional Summary
                </h2>
                <p className="text-sm sm:text-[15px] leading-relaxed text-foreground/80 font-sans">
                  Frontend Software Developer with 2.5 years of professional experience designing, building, and maintaining scalable, production-grade web applications using React, Next.js, and TypeScript. Strong problem-solving and analytical mindset, with experience translating complex business requirements into clean, maintainable, and scalable software solutions. Hands-on experience with backend development using NestJS, PostgreSQL, SQL, and Prisma, along with containerized application development using Docker. Experienced in applying solid software engineering principles, modular architecture, reusable design patterns, state management, database design, API development, and performance optimization to build reliable and extensible systems. Passionate about solving complex technical challenges and growing into a well-rounded Full-Stack Software Engineer.
                </p>
              </div>
            )}

            {/* Core Skills */}
            {(activeTab === "all" || activeTab === "skills") && (
              <div className="border-t border-border/50 pt-6">
                <h2 className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold mb-4 flex items-center gap-2">
                  <Code2 className="h-4 w-4 text-purple-500" />
                  Core Skills & Technologies
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-border/70 bg-card/60 p-4">
                    <span className="text-xs font-mono font-semibold text-foreground/70">
                      Frontend Engineering
                    </span>
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {[
                        "React.js",
                        "Next.js",
                        "TypeScript",
                        "JavaScript",
                        "Vue.js",
                        "Nuxt.js",
                        "Tailwind CSS",
                        "GSAP",
                        "TipTap",
                      ].map((skill) => (
                        <span
                          key={skill}
                          className="rounded-md border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-xs font-mono font-medium text-blue-600 dark:text-blue-400"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border border-border/70 bg-card/60 p-4">
                    <span className="text-xs font-mono font-semibold text-foreground/70">
                      Backend, DB & Systems
                    </span>
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {[
                        "Node.js",
                        "Nest.js",
                        "PostgreSQL",
                        "SQL",
                        "Prisma ORM",
                        "MongoDB",
                        "Mongoose",
                        "Redis",
                        "Docker",
                        "Problem Solving",
                      ].map((skill) => (
                        <span
                          key={skill}
                          className="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-xs font-mono font-medium text-emerald-600 dark:text-emerald-400"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Professional Experience */}
            {(activeTab === "all" || activeTab === "experience") && (
              <div className="border-t border-border/50 pt-6">
                <h2 className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold mb-6 flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-blue-500" />
                  Professional Experience
                </h2>

                <div className="space-y-8">
                  {/* Softvence Delta */}
                  <div className="relative pl-6 border-l-2 border-blue-500/40">
                    <span className="absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 border-background bg-blue-500" />
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                      <h3 className="font-serif text-lg font-semibold text-foreground">
                        Jr. Front End Engineer
                      </h3>
                      <span className="text-xs font-mono text-muted-foreground">
                        Oct 2025 — Present
                      </span>
                    </div>
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-3">
                      Softvence Delta
                    </p>

                    <ul className="space-y-3 text-sm text-foreground/85">
                      <li className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-foreground/40 shrink-0" />
                        <div>
                          <strong className="font-semibold text-foreground">
                            ITBA Expo 2027:
                          </strong>{" "}
                          Exhibition Stand Booking Platform built with{" "}
                          <span className="font-mono text-xs text-muted-foreground">
                            Next.js, TypeScript, Tailwind CSS, GSAP
                          </span>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-foreground/40 shrink-0" />
                        <div>
                          <strong className="font-semibold text-foreground">FleetOS:</strong>{" "}
                          Multi-Tenant Logistics Management Platform PWA built with{" "}
                          <span className="font-mono text-xs text-muted-foreground">
                            React, Next.js, TypeScript
                          </span>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-foreground/40 shrink-0" />
                        <div>
                          <strong className="font-semibold text-foreground">TableRounds:</strong>{" "}
                          Full-Stack Quiz Platform built with{" "}
                          <span className="font-mono text-xs text-muted-foreground">
                            TipTap, GSAP, React, Next.js, Nest.js
                          </span>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-foreground/40 shrink-0" />
                        <div>
                          <strong className="font-semibold text-foreground">Kreatovate:</strong>{" "}
                          AI Marketing & Consulting Platform built with{" "}
                          <span className="font-mono text-xs text-muted-foreground">
                            Next.js, TypeScript, Tailwind CSS, GSAP
                          </span>
                        </div>
                      </li>
                    </ul>
                  </div>

                  {/* Kryzotech Solutions */}
                  <div className="relative pl-6 border-l-2 border-border">
                    <span className="absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 border-background bg-muted-foreground/50" />
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                      <h3 className="font-serif text-lg font-semibold text-foreground">
                        Frontend Developer (Intern)
                      </h3>
                      <span className="text-xs font-mono text-muted-foreground">
                        June 2024 — Sept 2025
                      </span>
                    </div>
                    <p className="text-sm font-medium text-foreground/75 mb-3">
                      Kryzotech Solutions
                    </p>

                    <ul className="space-y-2.5 text-sm text-foreground/85">
                      <li className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-foreground/40 shrink-0" />
                        <div>
                          <strong className="font-semibold text-foreground">
                            CYBRS Cybersecurity Platform:
                          </strong>{" "}
                          Developed modular frontend with{" "}
                          <span className="font-mono text-xs text-muted-foreground">
                            Next.js, TypeScript, Tailwind CSS
                          </span>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-foreground/40 shrink-0" />
                        <div>
                          <strong className="font-semibold text-foreground">Waffless:</strong>{" "}
                          Client & Editor Marketplace platform with{" "}
                          <span className="font-mono text-xs text-muted-foreground">
                            Next.js, TypeScript, Tailwind CSS
                          </span>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-foreground/40 shrink-0" />
                        <span>
                          Conducted R&D for new feature implementation and collaborated with team to
                          architect solutions.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-foreground/40 shrink-0" />
                        <span>Handled client communication and production support.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Education */}
            {(activeTab === "all" || activeTab === "education") && (
              <div className="border-t border-border/50 pt-6">
                <h2 className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold mb-4 flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-emerald-500" />
                  Education
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-border/70 bg-card/60 p-4">
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                        GPA: 3.442 / 4.00
                      </span>
                      <span className="text-xs font-mono text-muted-foreground">2017 — 2019</span>
                    </div>
                    <h3 className="mt-2.5 font-serif text-base font-semibold text-foreground">
                      M.Sc. in Farm Structure & Environmental Engineering
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Bangladesh Agricultural University (BAU), Mymensingh
                    </p>
                  </div>

                  <div className="rounded-xl border border-border/70 bg-card/60 p-4">
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                        GPA: 3.223 / 4.00
                      </span>
                      <span className="text-xs font-mono text-muted-foreground">2012 — 2017</span>
                    </div>
                    <h3 className="mt-2.5 font-serif text-base font-semibold text-foreground">
                      B.Sc. in Agricultural Engineering & Technology
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Bangladesh Agricultural University (BAU), Mymensingh
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Languages */}
            {(activeTab === "all" || activeTab === "skills") && (
              <div className="border-t border-border/50 pt-6">
                <h2 className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold mb-3 flex items-center gap-2">
                  <Languages className="h-4 w-4 text-amber-500" />
                  Languages
                </h2>
                <div className="flex items-center gap-4 text-xs font-mono text-foreground/80">
                  <span className="font-semibold text-foreground">English:</span>
                  <span>Reading: High</span>
                  <span className="text-foreground/30">•</span>
                  <span>Writing: High</span>
                  <span className="text-foreground/30">•</span>
                  <span>Speaking: Medium</span>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer CTA */}
          <div className="flex shrink-0 items-center justify-between border-t border-border bg-card/90 px-6 py-4 backdrop-blur-md print:hidden">
            <div className="text-xs text-muted-foreground">
              Interested in working together?{" "}
              <Link
                href="mailto:sheikh.minhajul1205045@gmail.com"
                className="font-medium text-foreground underline underline-offset-2 hover:text-blue-500 transition-colors"
              >
                Send an email
              </Link>
            </div>

            <a
              href="/Sheikh_Minhajul_Abedin_Resume.pdf"
              download="Sheikh_Minhajul_Abedin_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl bg-foreground px-4 py-2 text-xs font-semibold text-background hover:opacity-90 transition-opacity"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download PDF</span>
            </a>
          </div>
        </motion.div>
      </div>
      )}
    </AnimatePresence>
  );
}

export const ResumeModal = InteractiveResumeModal;
