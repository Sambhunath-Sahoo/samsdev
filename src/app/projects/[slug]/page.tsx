"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Github, CheckCircle } from "lucide-react";
import { Navbar } from "@/components/navbar";
import Link from "next/link";
import { notFound  } from "next/navigation";
import { getDetailedProjectBySlug } from "@/lib/content/projects";
import { use } from "react";

export default function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const project = getDetailedProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 container-padding">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Projects
            </Link>
            
            <div className="space-y-4">
              <p className="text-sm font-semibold text-blue-600">{project.subtitle}</p>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
                {project.title}
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
                {project.description}
              </p>
            </div>

            {/* Tech Stack Pills */}
            <div className="flex flex-wrap gap-2 pt-4">
              {project.tech.map((t) => (
                <span 
                  key={t}
                  className="px-4 py-2 text-sm font-medium rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                >
                  {t}
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            {project.links && (
              <div className="flex flex-wrap gap-4 pt-4">
                {project.links.live && (
                  <a 
                    href={project.links.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
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
                    className="inline-flex items-center gap-2 px-6 py-3 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Github className="h-4 w-4" />
                    View Code
                  </a>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Project Image */}
      <section className="pb-16 container-padding">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="rounded-2xl overflow-hidden shadow-2xl"
          >
            <img 
              src={project.image} 
              alt={project.title}
              className="w-full aspect-video object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* About */}
      <section className="pb-16 container-padding">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">About the Project</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              {project.fullDescription}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="pb-16 container-padding">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.features.map((feature, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Challenges */}
      <section className="pb-16 container-padding">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Technical Challenges</h2>
            <ul className="space-y-3">
              {project.challenges.map((challenge, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                  <span className="text-lg text-slate-600 dark:text-slate-400">{challenge}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Outcome */}
      <section className="pb-20 container-padding">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="p-8 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800"
          >
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Outcome & Impact</h2>
            <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
              {project.outcome}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 container-padding border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} Sams. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
