import type { LucideIcon } from "lucide-react";
import { BookOpen, Code2, Palette, Sparkles } from "lucide-react";

export const EASE = [0.22, 1, 0.36, 1] as const;

export type FocusItem = {
  id: string;
  category: string;
  label: string;
  title: string;
  description: string;
  accent: string;
  icon: LucideIcon;
  image?: string;
  tech?: string[];
};

export const FOCUS_DATA: FocusItem[] = [
  {
    id: "building",
    category: "Building",
    label: "Main focus",
    title: "AI-Powered Design System Gen",
    description:
      "Architecting a web tool that leverages LLMs to generate accessible design tokens and Tailwind components instantly.",
    accent: "#6ea8fe",
    icon: Code2,
    image:
      "https://images.unsplash.com/photo-1618788372246-79faff060c4a?q=80&w=600&auto=format&fit=crop",
    tech: ["Next.js", "OpenAI", "Prisma"],
  },
  {
    id: "exploring",
    category: "Exploring",
    label: "Creative tech",
    title: "Generative Shaders with WebGL",
    description:
      "Deep diving into GLSL and Three.js to create hypnotic, interactive background visuals and particle systems.",
    accent: "#c084fc",
    icon: Sparkles,
    image:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=600&auto=format&fit=crop",
    tech: ["Three.js", "GLSL", "React-Three-Fiber"],
  },
  {
    id: "learning",
    category: "Learning",
    label: "Skill up",
    title: "Advanced Browser Performance",
    description:
      "Mastering rendering pipelines, Web Workers, and memory management for zero-jank web applications.",
    accent: "#5eead4",
    icon: BookOpen,
    image:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop",
    tech: ["Chrome DevTools", "WASM", "Patterns"],
  },
  {
    id: "designing",
    category: "Designing",
    label: "UI / UX",
    title: "Micro-Interaction Design Language",
    description:
      "Defining a robust motion system that enhances usability through subtle, meaningful animation feedback.",
    accent: "#fda4af",
    icon: Palette,
    image:
      "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=600&auto=format&fit=crop",
    tech: ["Figma", "Motion", "Prototyping"],
  },
];
