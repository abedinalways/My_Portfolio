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
  Globe,
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
  isClientProject?: boolean;
  updatedAt: string;
  imageRatio: number;
  image: string;
  secondaryImage?: string;
  secondaryImageRatio?: number;
  secondaryImageTitle?: string;
  galleryImages?: {
    image: string;
    title: string;
    ratio?: number;
  }[];
  imageAlt: string;
  githubUrl?: string;
  frontendGithubUrl?: string;
  backendGithubUrl?: string;
  demoUrl: string;
  liveLinks?: {
    label: string;
    url: string;
  }[];
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
    id: "tablerounds",
    repoName: "tablerounds.ai",
    title: "TableRounds — Medical & Surgical Board Examination Platform",
    description:
      "A clinician-built platform that brings board-style question banks and a vetted community of surgeons, dentists, and trainees into one place.",
    meta: "Frontend Engineer • Client Project • 2026",
    language: "TypeScript",
    languageColor: "#3178c6",
    stars: 142,
    forks: 28,
    topics: [
      "nextjs",
      "react",
      "typescript",
      "tailwind",
      "redux-toolkit",
      "socketio",
      "tiptap",
      "recharts",
    ],
    isPinned: true,
    isClientProject: true,
    updatedAt: "Live in Production",
    imageRatio: 1024 / 484,
    image: "/tablerounds.png",
    secondaryImage: "/tablerounds-dashboard.png",
    secondaryImageRatio: 1024 / 489,
    secondaryImageTitle: "Clinical Examination Dashboard Preview",
    imageAlt: "TableRounds medical education and board preparation platform hero",
    githubUrl: "",
    demoUrl: "https://tablerounds.ai",
    readme: {
      about:
        "TableRounds is a clinician-built platform that brings board-style question banks and a vetted community of surgeons, dentists, and trainees into one place. Create a verified profile, work through speciality-tagged questions with detailed explanations, track your performance by topic, and connect with colleagues invested in high clinical standards.",
      features: [
        "📝 Dynamic Quiz Engine — Create and participate in tests with real-time feedback and rich media",
        "📊 Advanced Analytics — Performance insights using Recharts — score trends, topic breakdowns, and time analytics",
        "🏆 Global Leaderboard — Interactive rankings with Leaflet-powered map visualizations",
        "💬 Real-time Chat — Socket.io messaging with typing indicators, read receipts, and notifications",
        "👤 Professional Profile — Academic/professional profiles with education, experience, and publications",
        "⚡ Test Runner — Timed tests with auto-save, bookmarks, sip-read, and review modes",
      ],
      techStack: [
        "Framework: Next.js 16 (App Router), React 19",
        "Language: TypeScript 5 (Strict Mode)",
        "State Management: Redux Toolkit, RTK Query",
        "Styling: Tailwind CSS 4, shadcn/ui",
        "Animations: GSAP, ScrollTrigger, Lenis",
        "Rich Text: Tiptap Editor",
        "Forms & Validation: React Hook Form, Zod",
        "Charts & Maps: Recharts, Leaflet, React Leaflet",
        "Realtime: Socket.io Client",
        "Email & Messaging: Resend, EmailJS",
        "Auth: JWT (HTTP-only secure cookies)",
      ],
      quickStart:
        "Project Architecture Overview:\n\nsrc/\n├── app/         # App Router (Dashboard, Auth, Client, Tests)\n├── components/  # UI primitives and feature clinical widgets\n├── features/    # Redux slices and feature logic\n├── hooks/       # Shared custom hooks\n├── lib/         # Utilities, API configs, socket setup\n├── redux/       # Global state and RTK Query APIs\n└── types/       # TypeScript interfaces\n\nLive Platform: https://tablerounds.ai\nClient Project — Repository is private & proprietary.",
    },
  },
  {
    id: "itba-expo",
    repoName: "itbaexpo.ie",
    title: "ITBA Expo 2027 — Exhibition Stand Booking & Management Platform",
    description:
      "A modern, full-stack enterprise web application for ITBA Expo 2027 (supported by The Irish Field), featuring an interactive SVG floor map, Stripe stand reservations, and organizer admin dashboard.",
    meta: "Full-Stack Engineer • Client Platform • 2026",
    language: "TypeScript",
    languageColor: "#3178c6",
    stars: 124,
    forks: 19,
    topics: [
      "nextjs",
      "react",
      "typescript",
      "tailwind",
      "redux-toolkit",
      "stripe",
      "socketio",
      "recharts",
    ],
    isPinned: true,
    isClientProject: true,
    updatedAt: "Live in Production",
    imageRatio: 1024 / 490,
    image: "/itba-expo.png",
    secondaryImage: "/itba-expo-map.png",
    secondaryImageRatio: 1024 / 730,
    secondaryImageTitle: "Interactive SVG Floor Map & Stand Booking Preview",
    imageAlt: "ITBA Expo 2027 exhibition stand booking and management platform hero and floor map",
    githubUrl: "https://github.com/backbencherstudio/hanoijane01",
    demoUrl: "https://itbaexpo.ie/",
    readme: {
      about:
        "A modern, full-stack enterprise web application designed for ITBA Expo 2027 (Supported by The Irish Field). The platform enables exhibitors to explore an interactive SVG-based exhibition floor plan, reserve and purchase stands with Stripe, and manage their bookings. It also provides event organizers with a comprehensive admin dashboard for stand inventory, booking workflows, payments, document reviews, and real-time analytics.",
      features: [
        "🗺️ Interactive SVG Floor Plan — Dynamic hall categories with fluid zoom & pan (react-zoom-pan-pinch), live color-coded stand availability, and one-click booking tooltips",
        "💳 Multi-Step Booking & Stripe Elements Checkout — Stand selection, digital agreement, attendee info collection with international phone validation, add-on packages, and instant confirmation receipts",
        "📊 Admin Management Dashboard — Executive analytics via Recharts (occupancy rates, revenue tracking), booking request approval/rejection workflows, and stand inventory management",
        "⚡ Real-Time Socket.io WebSockets — Live notifications for booking approvals, status updates, and broadcast announcements without requiring page refreshes",
        "🔐 Role-Based Access Control (RBAC) & Security — Custom middleware protecting public visitor routes, exhibitor accounts, and admin dashboards with secure cookie sessions",
        "📑 Exhibitor Document Review — Regulatory compliance inspection and document verification system for event organizers",
      ],
      techStack: [
        "Framework: Next.js 16 (App Router, Turbopack), React 19",
        "Language: TypeScript (Strict Mode)",
        "Styling & UI: Tailwind CSS v4, Radix UI Primitives, Lucide React",
        "State Management: Redux Toolkit (RTK) & RTK Query",
        "Payment Gateway: Stripe (@stripe/stripe-js, @stripe/react-stripe-js)",
        "Real-Time: Socket.io Client",
        "Interactive Canvas: react-zoom-pan-pinch, Custom SVG Components",
        "Form Management: react-hook-form, react-international-phone, libphonenumber-js, input-otp",
        "Charts & Data Viz: Recharts",
        "Notifications: Sonner",
      ],
      quickStart:
        "Platform Architecture Overview:\n\napp/\n├── (auth)/       # Sign-in, sign-up, reset-password, verify-email\n├── (root)/       # Public portal, interactive floor map, booking checkout\n└── dashboard/    # Admin portal (analytics, stands, payments, documents)\n\nLive Platform: https://itbaexpo.ie/\nGitHub Repository: https://github.com/backbencherstudio/hanoijane01",
    },
  },
  {
    id: "kreatovate",
    repoName: "kreatovate.com",
    title: "Kreatovate — AI Marketing & Consulting Ecosystem",
    description:
      "A modern enterprise digital ecosystem of three interconnected web platforms for Kreatovate, an AI-powered marketing and business consulting enterprise, powered by Next.js and GSAP.",
    meta: "Frontend Engineer • Client Suite • 2026",
    language: "TypeScript",
    languageColor: "#3178c6",
    stars: 118,
    forks: 16,
    topics: [
      "nextjs",
      "typescript",
      "gsap",
      "tailwind",
      "shadcn-ui",
      "ai-consulting",
      "web3",
      "framer-motion",
    ],
    isPinned: true,
    isClientProject: true,
    updatedAt: "Live in Production",
    imageRatio: 640 / 308,
    image: "/kreatovate.png",
    secondaryImage: "/kreatovate-about.png",
    secondaryImageRatio: 1024 / 485,
    secondaryImageTitle: "Interactive Consulting & 3D Visual Showcase",
    galleryImages: [
      {
        image: "/kreatovate-books.png",
        title: "Publications & Scalable Growth Strategy Suite",
        ratio: 1024 / 447,
      },
    ],
    imageAlt: "Kreatovate AI marketing and consulting suite platform hero",
    githubUrl: "",
    demoUrl: "https://kreatovate.com/",
    liveLinks: [
      { label: "Main Platform (kreatovate.com)", url: "https://kreatovate.com/" },
      { label: "Launchpad / Workforce Platform", url: "https://launchpad.kreatovate.com/" },
      { label: "Projects & Innovation Showcase", url: "https://projects.kreatovate.com/" },
    ],
    readme: {
      about:
        "The Kreatovate Project Suite comprises three interconnected enterprise web applications developed for Kreatovate, an AI-driven marketing and business consulting firm. Each project addresses a core facet of Kreatovate's digital operations — from official brand storytelling and service consulting to workforce experience management and creative motion experimentation.",
      features: [
        "🌐 Kreatovate Main Site — Official corporate portal showcasing AI consulting services, team leadership, strategic frameworks, and consultation lead intake",
        "👥 Workforce Experience Platform — High-impact internal portal built to spotlight company culture, workforce initiatives, and talent onboarding workflows",
        "⚡ Innovation & Bumps Micro-Project — Experimental marketing and visual storytelling canvas with high-performance animations and fluid transitions",
        "✨ Advanced GSAP Motion Design — Smooth scroll-triggered narrative sections, fade-in sequences, and micro-interactions optimized for 60fps rendering",
        "📱 Fully Responsive & Accessible — Built on Next.js App Router and Shadcn/UI primitives with comprehensive SEO meta tags and structured schema",
        "🔗 Unified Brand Ecosystem — Cohesive design system, color palettes, and typography spanning multiple independently deployed Vercel platforms",
      ],
      techStack: [
        "Framework: Next.js 15 / 16 (App Router), React 19",
        "Language: TypeScript 5 (Strict Mode)",
        "Motion & Animation: GSAP, ScrollTrigger, Framer Motion",
        "Styling & Design System: Tailwind CSS, Shadcn/UI, Lucide React",
        "Deployment: Vercel Edge Network with Custom Subdomain Routing",
        "Architecture: Modular Multi-Project Suite",
      ],
      quickStart:
        "Ecosystem Overview & Live Links:\n\n1. Main Platform:  https://kreatovate.com/          (Mirror: https://kreatovate.vercel.app/)\n2. Launchpad:      https://launchpad.kreatovate.com/ (Mirror: https://workforce-kreatovate.vercel.app/)\n3. Projects Hub:   https://projects.kreatovate.com/  (Mirror: https://bumps-kreatovate.vercel.app/)\n\nClient Platform Suite — Enterprise Production Deployment.",
    },
  },
  {
    id: "fleetos-pro",
    repoName: "fleetos.pro",
    title: "Fleetos Pro — Multi-Tenant Freight & Dispatch Management",
    description:
      "A production-oriented, multi-tenant freight & logistics dispatch management platform with isolated workspaces for Dispatchers, Admins, and Super Admins, real-time Socket.io chat, and live tracking.",
    meta: "Full-Stack Engineer • Enterprise Platform • 2026",
    language: "TypeScript",
    languageColor: "#3178c6",
    stars: 136,
    forks: 22,
    topics: [
      "nextjs",
      "react",
      "typescript",
      "redux-toolkit",
      "socketio",
      "tailwind",
      "shadcn-ui",
      "recharts",
    ],
    isPinned: true,
    isClientProject: true,
    updatedAt: "Live in Production",
    imageRatio: 1024 / 489,
    image: "/fleetos.png",
    secondaryImage: "/fleetos-dashboard.png",
    secondaryImageRatio: 666 / 375,
    secondaryImageTitle: "Role-Based Dispatch & Admin Operations Dashboard",
    imageAlt: "Fleetos Pro freight and logistics dispatch management platform",
    githubUrl: "https://github.com/alshohid/reedsexpress",
    demoUrl: "https://fleetos.pro/",
    readme: {
      about:
        "Fleetos Pro is a production-oriented, multi-tenant freight and logistics dispatch management platform built to orchestrate end-to-end supply chain operations: load dispatching, carrier and driver onboarding, active shipment tracking, automated invoicing and financial statements, and multi-tenant organization administration.\n\nThe system features three route-isolated, role-scoped workspaces — Dispatcher, Admin, and Super Admin — backed by a unified Redux Toolkit / RTK Query data layer with automatic silent JWT token refresh and real-time Socket.io dispatch communication.",
      features: [
        "🏢 Role-Based Workspaces — Dedicated route-isolated portals for Dispatcher (/dispatcher/dashboard), Admin (/admin/dashboard), and Super Admin (/super-admin/dashboard)",
        "💬 Real-Time Dispatch Communications — Socket.io powered instant messaging, active operations channels, notifications, and typing indicators",
        "🚛 Carrier & Driver Operations — Streamlined onboarding, compliance document tracking, driver availability schedules, and performance ratings",
        "📦 Load Dispatching & Live Tracking — Interactive load intake, automated rate confirmation, assignment flows, and shipment tracking",
        "💰 Finance & Invoicing Suite — Automated invoice creation, statement generation flows with jsPDF export, QR code verification, and subscription plans",
        "📊 Analytics & Reporting — Multi-metric performance dashboards, revenue trend forecasting, and utilization charts via Chart.js and Recharts",
        "🔐 Enterprise JWT Security — Access & refresh token lifecycle with silent single-flight 401 token renewal and HTTP-only cookie persistence",
        "🎨 Design & Mock API Mode — Built-in offline deterministic mock responder allowing complete UI exploration without active backend",
      ],
      techStack: [
        "Framework: Next.js 16.1 (App Router), React 19",
        "Language: TypeScript 5 (Strict Mode)",
        "State & Cache: Redux Toolkit 2.2, React Redux 9, RTK Query (Custom BaseQuery Auth Refresh)",
        "Real-Time: Socket.io Client",
        "Styling & Primitives: Tailwind CSS v4, shadcn/ui (new-york), Radix UI",
        "Charts & Viz: Recharts, Chart.js, react-chartjs-2",
        "Forms & Validation: React Hook Form, date-fns, react-day-picker",
        "Export & Utility: jsPDF, react-qr-code, js-cookie",
      ],
      quickStart:
        "Architecture Overview:\n\nsrc/\n├── app/\n│   ├── (public)/       # /login, /sign-up, /forgot-password\n│   └── (protected)/    # Isolated workspaces\n│       ├── (dispatcher)/ # Dispatch operations & live tracking\n│       ├── (admin)/      # Carrier & user administration\n│       └── (super-admin)/# Organization & platform analytics\n├── redux/              # RTK Query baseApi + designMode mock responder\n└── components/         # shadcn/ui primitives & workspace widgets\n\nLive Platform: https://fleetos.pro/\nGitHub Repository: https://github.com/alshohid/reedsexpress",
    },
  },
  {
    id: "waffless",
    repoName: "affless-frontend.vercel.app",
    title: "Waffless — Client & Video Editor Marketplace",
    description:
      "A two-sided marketplace platform connecting clients and video editors with route-isolated workspaces for Clients, Editors, and Admins, live proposals, TanStack data tables, and messaging.",
    meta: "Frontend Engineer • Client Platform • 2026",
    language: "TypeScript",
    languageColor: "#3178c6",
    stars: 128,
    forks: 18,
    topics: [
      "nextjs",
      "react",
      "typescript",
      "redux-toolkit",
      "tailwind",
      "shadcn-ui",
      "tanstack-table",
      "apexcharts",
    ],
    isPinned: true,
    isClientProject: true,
    updatedAt: "Live in Production",
    imageRatio: 1024 / 499,
    image: "/waffless.png",
    secondaryImage: "/waffless-browse.png",
    secondaryImageRatio: 1024 / 505,
    secondaryImageTitle: "Editor Job Board & Marketplace Catalog",
    imageAlt: "Waffless video editor marketplace platform hero and job board",
    githubUrl: "",
    demoUrl: "https://affless-frontend.vercel.app/",
    readme: {
      about:
        "Waffless is a modern, two-sided video editor marketplace where clients post video-editing jobs and editors browse, bid on, and deliver them. The frontend is built on Next.js 16 App Router and React 19, serving three distinct experiences from a single unified codebase: Public Visitors, Clients (/client), Editors (/editor), and Platform Admins (/admin).",
      features: [
        "🎬 Two-Sided Marketplace — Streamlined workflows for clients to post jobs and review bids, and for editors to discover projects and deliver video assets",
        "🏢 Route-Group Architecture — Isolated role experiences for Public visitors (/), Clients (/client), Editors (/editor), and Admins (/admin)",
        "⚡ Unified RTK Query Layer — Centralized API transport with automatic single-flight 401 JWT token re-authentication and cookie hydration",
        "📋 TanStack Table Management — High-performance data tables with client/editor proposals, bids, invoices, and payment history",
        "📊 Analytics & Financial Dashboards — Revenue, earnings, and withdrawal metrics powered by ApexCharts",
        "💬 Real-Time Messaging & Delivery — Chat system with thread management, delivery extensions, and milestone approvals",
        "🎨 Accessible UI & Tailwind CSS v4 — Built with shadcn/ui primitives on Radix UI, CSS-first design tokens, and fluid responsiveness",
      ],
      techStack: [
        "Framework: Next.js 16.1 (App Router, Turbopack), React 19.2",
        "Language: TypeScript 5.9 (Strict Mode)",
        "State Management: Redux Toolkit 2.12 + RTK Query (re-auth base query)",
        "Styling & Components: Tailwind CSS v4, shadcn/ui (new-york), Radix UI",
        "Data Tables: @tanstack/react-table",
        "Charts & Data Viz: ApexCharts, react-apexcharts",
        "Rich Media & Forms: react-hook-form, input-otp, jodit-react, react-player",
        "Deployment: Vercel Edge Network",
      ],
      quickStart:
        "Architecture Overview:\n\napp/\n├── (website)/\n│   ├── (main)/        # Public marketing, job board, public profiles\n│   ├── (auth)/        # Login, signup, OTP, verify-email\n│   └── (dashboard)/   # Client & Editor workspaces (/client, /editor)\n└── (admin-dashboard)/ # Admin console (/admin)\n\nLive Platform: https://affless-frontend.vercel.app/\nClient Project — Enterprise production deployment.",
    },
  },
  {
    id: "apsu",
    repoName: "liuentung-front-end.vercel.app",
    title: "Apsu — Digital Health & Clinical Assessment Platform",
    description:
      "A modern healthcare web application supporting personalized medical assessment flows for weight loss, birth control, and sleep, paired with clinical consultations and patient profile management.",
    meta: "Frontend Engineer • Client Platform • 2026",
    language: "TypeScript",
    languageColor: "#3178c6",
    stars: 112,
    forks: 15,
    topics: [
      "nextjs",
      "react",
      "typescript",
      "tailwind",
      "shadcn-ui",
      "zod",
      "react-hook-form",
      "telehealth",
    ],
    isPinned: true,
    isClientProject: true,
    updatedAt: "Live in Production",
    imageRatio: 1024 / 491,
    image: "/apsu.png",
    secondaryImage: "/apsu-profile.png",
    secondaryImageRatio: 1024 / 507,
    secondaryImageTitle: "Patient Profile & Active Treatment Dashboard",
    imageAlt: "Apsu digital health platform care plan and patient dashboard",
    githubUrl: "",
    demoUrl: "https://liuentung-front-end.vercel.app/",
    readme: {
      about:
        "Apsu is a patient-centric telehealth and digital health platform engineered with Next.js App Router and React 19. The application powers guided, multi-step clinical assessment flows across key health domains — including medical weight loss, birth control, and sleep therapy — alongside integrated physician consultations, automated prescription tracking, patient profile management, and health education blogs.",
      features: [
        "🩺 Multi-Domain Clinical Assessment Flows — Specialized multi-step intake journeys for Weight Loss, Birth Control, and Sleep therapy with domain-specific validations",
        "👤 Patient Profile & Active Treatment Management — Dedicated patient dashboard to monitor active treatments (e.g. Semaglutide plans), renewal schedules, order details, and doctor prescriptions",
        "🔒 Dual-Mode Architecture (Demo & API) — Flexible environment switching between deterministic mock data and live REST backend services via lib/Fetch.ts",
        "📝 Comprehensive Form Engine — Complex medical questionnaire handling powered by React Hook Form and Zod schemas with instant field-level validation",
        "📚 Health Resource Hub & Blog — Content engine supporting health articles, clinical guides, and FAQs with static-to-API switching capabilities",
        "📱 Accessible Healthcare Design System — Built on Tailwind CSS and shadcn/ui primitives, engineered for clinical trust, fast loading, and fluid mobile responsiveness",
      ],
      techStack: [
        "Framework: Next.js 15 / 16 (App Router, Turbopack), React 19",
        "Language: TypeScript (Strict Mode)",
        "Forms & Validation: React Hook Form, Zod",
        "Styling & Components: Tailwind CSS, shadcn/ui, Radix UI Primitives, Lucide Icons",
        "State & Architecture: Context API (AuthContext, MessagingContext), Centralized Fetch.ts client with session management",
        "Testing & Quality: Vitest, ESLint (flat config)",
        "Deployment: Vercel Edge Network",
      ],
      quickStart:
        "Architecture Overview:\n\napp/\n├── (Front-End)/    # Public pages (health assessments, blog, pricing, faq)\n├── (auth)/         # Patient onboarding & authentication\n├── (user)/         # Patient profile, active treatments, prescriptions\n└── (admin)/        # Clinical management & user admin\ncomponents/\n└── Assessment/     # WeightLoss, BirthControl, Sleep intake flows\n\nLive Platform: https://liuentung-front-end.vercel.app/\nClient Project — Enterprise production deployment.",
    },
  },
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
      list = list.slice(0, 5);
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
              {project.isClientProject ? "Client Work" : "Public"}
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
              {project.isClientProject ? "OVERVIEW" : "README.md"}
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
              {project.isClientProject ? (
                <>
                  <StatPill
                    label="Status"
                    value="Live Project"
                    icon={<span className="h-2 w-2 rounded-full bg-emerald-500" />}
                  />
                  <StatPill
                    label="Platform"
                    value={project.demoUrl ? project.demoUrl.replace(/^https?:\/\//, "") : "Live Web App"}
                    icon={<Globe className="h-3.5 w-3.5 text-blue-500" />}
                  />
                  <StatPill
                    label="Language"
                    value={project.language}
                    icon={<span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: project.languageColor }} />}
                  />
                </>
              ) : (
                <>
                  <StatPill label="Stars" value={project.stars.toString()} icon={<Star className="h-3.5 w-3.5 text-amber-500" />} />
                  <StatPill label="Forks" value={project.forks.toString()} icon={<GitFork className="h-3.5 w-3.5 text-blue-500" />} />
                  <StatPill label="Language" value={project.language} icon={<span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: project.languageColor }} />} />
                </>
              )}
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

            {/* Secondary screenshot / Dashboard interface */}
            {project.secondaryImage && (
              <div>
                <SectionLabel
                  icon={<Sparkles className="h-3.5 w-3.5" />}
                  text={project.secondaryImageTitle ?? "Application Dashboard Preview"}
                />
                <div
                  className="mt-3 relative w-full overflow-hidden rounded-xl border border-border bg-card shadow-sm"
                  style={{ aspectRatio: project.secondaryImageRatio ?? (1024 / 489) }}
                >
                  <Image
                    src={project.secondaryImage}
                    alt={`${project.title} preview`}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}

            {/* Gallery Screenshots */}
            {project.galleryImages?.map((galleryItem, idx) => (
              <div key={idx}>
                <SectionLabel
                  icon={<Sparkles className="h-3.5 w-3.5" />}
                  text={galleryItem.title}
                />
                <div
                  className="mt-3 relative w-full overflow-hidden rounded-xl border border-border bg-card shadow-sm"
                  style={{ aspectRatio: galleryItem.ratio ?? (1024 / 489) }}
                >
                  <Image
                    src={galleryItem.image}
                    alt={galleryItem.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            ))}

            {/* Live Ecosystem Platforms */}
            {project.liveLinks && project.liveLinks.length > 0 && (
              <div>
                <SectionLabel icon={<Globe className="h-3.5 w-3.5" />} text="Live Ecosystem Platforms" />
                <div className="mt-3 flex flex-col gap-2">
                  {project.liveLinks.map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="group/link flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3 transition-colors hover:border-blue-500/40 hover:bg-muted"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="flex h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                        <span className="truncate text-xs font-medium text-foreground">{link.label}</span>
                      </div>
                      <span className="flex items-center gap-1 text-[11px] font-mono text-muted-foreground group-hover/link:text-blue-500">
                        Visit
                        <ExternalLink className="h-3 w-3 shrink-0 transition-transform group-hover/link:translate-x-0.5" />
                      </span>
                    </a>
                  ))}
                </div>
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
          <span className="font-mono text-xs text-muted-foreground">
            {project.isClientProject ? "Client Project • Production" : "MIT License"}
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {project.githubUrl ? (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-3.5 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                GitHub
              </a>
            ) : project.frontendGithubUrl && project.backendGithubUrl ? (
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
            ) : project.isClientProject ? (
              <span className="rounded-xl border border-border/80 bg-muted/60 px-3 py-2 text-xs font-mono text-muted-foreground">
                Client Project (Private Repo)
              </span>
            ) : null}
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
