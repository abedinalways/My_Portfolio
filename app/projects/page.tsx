import { ContactCard } from "@/components/contact/contact-card";
import { Projects } from "@/components/projects/projects";
import { createMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ProjectsPageHero } from "@/components/projects/projects-page-hero";

export const metadata: Metadata = createMetadata({
  title: "Projects",
  description: "Selected work and case studies by Abedin — frontend engineer and AI enthusiast.",
  path: "/projects",
});

export default function ProjectsPage(): ReactNode {
  return (
    <main id="main-content" className="flex flex-1 flex-col">
      <ProjectsPageHero />
      <Projects />
      <ContactCard />
      <div className="h-12 sm:h-16" />
    </main>
  );
}
