export type FocusCategory = "building" | "learning" | "exploring";

export type FocusItem = {
  id: FocusCategory;
  tag: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  technologies: {
    name: string;
    note?: string;
  }[];
  accentColor: string;
  accentBg: string;
  accentBorder: string;
  image?: string;
  imageAlt?: string;
  links?: {
    label: string;
    href: string;
    isExternal?: boolean;
    isProjectModal?: boolean;
    projectId?: string;
    variant?: "primary" | "secondary" | "outline";
  }[];
};

export const FOCUS_ITEMS: FocusItem[] = [
  {
    id: "building",
    tag: "BUILDING",
    badge: "Active Project",
    title: "Bio-Identifier — AI Snake & Insect Recognition",
    subtitle: "Full-Stack Biodiversity & Toxicity Alert Platform",
    description:
      "A specialized web application for real-time identification of snakes, insects, and arachnids using computer vision and deep learning. Features immediate toxicity safety warnings, venomous hazard analysis, and comprehensive biological taxonomy.",
    technologies: [
      { name: "Next.js 16", note: "App Router Frontend" },
      { name: "Nest.js", note: "Modular API Backend" },
      { name: "TypeScript", note: "End-to-End Type Safety" },
      { name: "Tailwind CSS v4", note: "Modern Design Tokens" },
      { name: "Computer Vision", note: "Deep Learning Classifier" },
      { name: "Prisma ORM", note: "Database Modeling" },
    ],
    accentColor: "#10b981", // Emerald
    accentBg: "rgba(16, 185, 129, 0.1)",
    accentBorder: "rgba(16, 185, 129, 0.25)",
    image: "/bio-identifier.jpg",
    imageAlt: "Bio-Identifier AI snake and insect classification platform mockup",
    links: [
      {
        label: "View in Projects",
        href: "#projects",
        isProjectModal: true,
        projectId: "bio-identifier",
        variant: "primary",
      },
      {
        label: "Frontend Repo",
        href: "https://github.com/abedinalways/bio-identifier-frontend",
        isExternal: true,
        variant: "secondary",
      },
      {
        label: "Backend Repo",
        href: "https://github.com/abedinalways/bio-identifier-backend",
        isExternal: true,
        variant: "secondary",
      },
    ],
  },
  {
    id: "learning",
    tag: "LEARNING",
    badge: "Continuous Learning",
    title: "Interactive 3D Graphics & Real-Time Web Systems",
    subtitle: "WebGL Shaders, Real-Time Streams & Systems",
    description:
      "Mastering creative 3D rendering pipelines, custom GPU shaders, interactive 2D canvas physics, bidirectional peer-to-peer data streaming, and production Linux system architecture.",
    technologies: [
      { name: "Three.js", note: "3D Scenes & Meshes" },
      { name: "WebGL", note: "GPU Shaders & GLSL" },
      { name: "WebRTC", note: "Low-Latency P2P Streams" },
      { name: "WebSocket", note: "Bidirectional Real-Time" },
      { name: "Konva.js", note: "High-Performance 2D Canvas" },
      { name: "Linux", note: "Systems & Server Shell" },
    ],
    accentColor: "#3b82f6", // Blue
    accentBg: "rgba(59, 130, 246, 0.1)",
    accentBorder: "rgba(59, 130, 246, 0.25)",
    links: [
      {
        label: "Explore Skills & Experience",
        href: "/about#skills",
        variant: "outline",
      },
    ],
  },
  {
    id: "exploring",
    tag: "EXPLORING",
    badge: "Tech Exploration",
    title: "Enterprise Backend Architectures & Modern Python Services",
    subtitle: "Node.js, NestJS, Prisma ORM, Python & FastAPI",
    description:
      "Architecting scalable, production-grade microservices and RESTful backends with Node.js and NestJS, streamlining type-safe database schemas with Prisma ORM, and building high-throughput asynchronous AI pipelines with Python and FastAPI.",
    technologies: [
      { name: "Node.js", note: "Async Server Runtime" },
      { name: "Nest.js", note: "Enterprise Microservices" },
      { name: "Prisma", note: "Type-Safe Database ORM" },
      { name: "Python", note: "Data & AI Pipeline Scripts" },
      { name: "FastAPI", note: "High-Speed Async APIs" },
    ],
    accentColor: "#f59e0b", // Amber
    accentBg: "rgba(245, 158, 11, 0.1)",
    accentBorder: "rgba(245, 158, 11, 0.25)",
    links: [
      {
        label: "View All Projects",
        href: "/projects",
        variant: "outline",
      },
    ],
  },
];
