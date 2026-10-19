import type { DetailedProject } from "@/types/content";

/**
 * Coursivo shares its slug with the Sanity entry, so the two are merged:
 * fields set here win, anything left empty (the live link, the cover image)
 * comes from Sanity. See mergeProjects in lib/content/projects.ts.
 */
export const COURSIVO: DetailedProject = {
  slug: "coursivo",
  title: "Coursivo",
  subtitle: "EdTech platform",
  description:
    "An EdTech platform where instructors build and sell courses and students browse, enroll and learn. React 19 frontend, Spring Boot 4 backend, and a LangGraph agent on the way.",
  image: "",
  gallery: ["/projects/coursivo/home.jpg"],
  tech: ["React 19", "TypeScript", "Vite", "Redux Toolkit", "Java 21", "Spring Boot 4", "PostgreSQL", "LangGraph"],
  fullDescription:
    "Coursivo is split into three independently releasable repos: a React 19 + Vite frontend with Redux Toolkit and shadcn/ui, a Java 21 + Spring Boot 4 REST API on PostgreSQL, and a Python LangGraph agent served over FastAPI. Instructors get a drag-and-drop course builder with sections and lessons, a dashboard and course management. Students browse the catalogue, enroll and work through their courses. Every API response is wrapped in one envelope that the frontend unwraps centrally, auth is stateless JWT decoded on both ends, and the backend ships as a multi-stage Docker image through GitHub Actions with semantic-release.",
  features: [
    "Drag-and-drop course builder with sections and lessons",
    "Instructor dashboard and course management",
    "Student catalogue, enrollment and my-courses",
    "Stateless JWT auth decoded on both client and server",
    "Single API response envelope with central error handling",
    "Spring Boot 4 on Java 21 with Spring Data JPA and PostgreSQL",
    "Docker image, GitHub Actions CI and semantic-release",
    "LangGraph course assistant agent in progress",
  ],
  links: {
    github: "https://github.com/Sambhunath-Sahoo/coursivo-frontend-react",
  },
};
