"use client";

import { ArrowLeft, ExternalLink, Github, CheckCircle, Zap, Trophy } from "lucide-react";
import { Navbar } from "@/components/navbar";
import Link from "next/link";
import type { DetailedProject } from "@/types/content";

export function ProjectDetailClient({ project }: { project: DetailedProject }) {
  const getEmbedUrl = (url?: string) => {
    if (!url) return null;
    try {
      if (url.includes("youtube.com/watch?v=")) {
        return url.replace("watch?v=", "embed/").split("&")[0];
      }
      if (url.includes("youtu.be/")) {
        return url.replace("youtu.be/", "youtube.com/embed/").split("?")[0];
      }
      if (url.includes("vimeo.com/")) {
        return url.replace("vimeo.com/", "player.vimeo.com/video/");
      }
    } catch (e) {
      return url;
    }
    return url;
  };

  const embedUrl = getEmbedUrl(project.videoUrl);
  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <Navbar />

      {/* Hero — two column: text left, image right */}
      <section className="pt-28 pb-0 container-padding">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            All Projects
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center pb-12">
            {/* Left: Text */}
            <div className="space-y-6">
              <div className="space-y-3">
                <span className="inline-block text-xs font-semibold text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full">
                  {project.subtitle}
                </span>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                  {project.title}
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* Tech pills */}
              <div className="flex flex-wrap gap-2">
                {(project.tech ?? []).map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1.5 text-sm font-medium rounded-full border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Action buttons */}
              {project.links && (
                <div className="flex flex-wrap gap-3 pt-1">
                  {project.links.live && (
                    <a
                      href={project.links.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                    >
                      <ExternalLink className="h-4 w-4" />
                      View Live
                    </a>
                  )}
                  {project.links.github && (
                    <a
                      href={project.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white text-sm font-semibold rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Github className="h-4 w-4" />
                      Source Code
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Right: Media (Video or Image) */}
            <div className="rounded-2xl overflow-hidden shadow-2xl shadow-slate-900/10 dark:shadow-slate-900/50 border border-slate-200 dark:border-slate-800">
              {embedUrl ? (
                <div className="w-full aspect-video bg-slate-100 dark:bg-slate-800">
                  <iframe
                    src={embedUrl}
                    title={project.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                </div>
              ) : project.image ? (
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full aspect-[4/3] object-cover"
                />
              ) : (
                <div className="w-full aspect-[4/3] bg-gradient-to-br from-blue-100 via-slate-100 to-slate-200 dark:from-blue-900/30 dark:via-slate-800 dark:to-slate-700 flex items-center justify-center">
                  <span className="text-6xl font-black text-slate-300 dark:text-slate-600">
                    {project.title.charAt(0)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      {(project.gallery ?? []).length > 0 && (
        <section className="py-8 container-padding">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {project.gallery!.map((imgUrl, idx) => (
                <div key={idx} className="rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800 aspect-[4/3] bg-slate-100 dark:bg-slate-800">
                  <img
                    src={imgUrl}
                    alt={`${project.title} screenshot ${idx + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Divider */}
      <div className="border-t border-slate-200 dark:border-slate-800" />

      {/* Content grid: About + Features + Challenges + Outcome */}
      <section className="py-14 container-padding">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Left column: About + Outcome */}
          <div className="lg:col-span-2 space-y-10">

            {/* About */}
            {project.fullDescription && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">About the Project</h2>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[15px]">
                  {project.fullDescription}
                </p>
              </div>
            )}

            {/* Key Features */}
            {(project.features ?? []).length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Key Features</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(project.features ?? []).map((feature, i) => (
                    <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                      <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-slate-700 dark:text-slate-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}



            {/* Quick stats placeholder — stack info */}
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/30 space-y-4">
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Stack</h3>
              <div className="flex flex-col gap-2">
                {(project.tech ?? []).map((t) => (
                  <div key={t} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 container-padding border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} Sams. All rights reserved.
          </p>
          <Link href="/projects" className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
            ← Back to Projects
          </Link>
        </div>
      </footer>
    </div>
  );
}
