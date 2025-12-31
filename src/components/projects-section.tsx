"use client"

import Image from "next/image"
import { ExternalLink, Github } from "lucide-react"
import { SectionHeader } from "./section-header"
import projectsData from "@/data/projects.json"

export function ProjectsSection() {
  return (
    <section id="projects" className="space-y-8 sm:space-y-10 md:space-y-12 scroll-mt-20">
      <SectionHeader 
        title="Featured Projects" 
        subtitle="Discover what I've created"
      />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
        {projectsData.map((project) => (
          <div
            key={project.id}
            className="group block"
          >
            <article className="relative h-full overflow-hidden rounded-xl bg-card border border-border transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 flex flex-col">
              {/* Project Image */}
              <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-muted">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

                {/* Tech Stack - Always visible on image */}
                <div className="absolute top-3 left-3 right-3 flex flex-wrap gap-1.5 z-10">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 text-xs font-medium rounded-md bg-background/90 text-foreground border border-border/50 backdrop-blur-sm shadow-sm transition-all duration-200 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Hover Overlay with Buttons */}
                <div className="absolute inset-0 bg-primary/95 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center z-20">
                  <div className="flex flex-col sm:flex-row items-center gap-3 transform scale-90 group-hover:scale-100 transition-transform duration-300">
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary-foreground text-primary font-semibold text-sm hover:bg-primary-foreground/90 transition-colors shadow-lg"
                    >
                      <ExternalLink className="h-4 w-4" />
                      View Demo
                    </a>
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary-foreground/10 text-primary-foreground font-semibold text-sm border-2 border-primary-foreground/30 hover:bg-primary-foreground/20 transition-colors backdrop-blur-sm shadow-lg"
                    >
                      <Github className="h-4 w-4" />
                      GitHub
                    </a>
                  </div>
                </div>
              </div>

              {/* Project Content - Always Visible */}
              <div className="p-4 sm:p-5 space-y-2 flex-1 flex flex-col">
                {/* Title */}
                <h3 className="text-lg sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-200">
                  {project.title}
                </h3>
                
                {/* Description */}
                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                  {project.description}
                </p>
              </div>
            </article>
          </div>
        ))}
      </div>
    </section>
  )
}

