"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { getDetailedProjects } from "@/lib/content/projects";

export function WorkSection() {
  const projects = getDetailedProjects();

  return (
    <section id="work" className="section-padding container-padding">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <p className="text-sm font-semibold text-blue-600">Work</p>
          <h2 className="mt-1 text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            RECENT PROJECTS
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.slice(0, 4).map((item, idx) => (
            <Link href={`/projects/${item.slug}`} key={item.slug}>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="group cursor-pointer"
              >
                {/* Image */}
                <div className="relative overflow-hidden rounded-2xl mb-6 bg-slate-100 dark:bg-slate-800">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                      <ArrowUpRight className="h-5 w-5 text-slate-900" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-blue-600">{item.subtitle}</p>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {item.tech.slice(0, 3).map((t) => (
                      <span 
                        key={t}
                        className="px-3 py-1 text-xs font-medium rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors font-semibold"
          >
            View All Projects
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

