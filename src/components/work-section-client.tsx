"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { DetailedProject } from "@/types/content";

export function WorkSectionClient({ projects }: { projects: DetailedProject[] }) {
  return (
    <section id="work" className="section-padding container-padding">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <p className="text-sm font-semibold text-blue-600">Work</p>
          <h2 className="mt-1 text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            RECENT PROJECTS
          </h2>
        </div>

        <div className="flex flex-col divide-y divide-slate-200 dark:divide-slate-800">
          {projects.slice(0, 4).map((item, idx) => (
            <Link href={`/projects/${item.slug}`} key={item.slug}>
              <div className="group flex items-center gap-6 py-5 hover:bg-slate-50 dark:hover:bg-slate-900/40 -mx-4 px-4 rounded-xl transition-colors duration-200 cursor-pointer">
                
                {/* Left: Image thumbnail */}
                <div className="shrink-0 w-28 h-20 sm:w-36 sm:h-24 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 relative">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-slate-200 dark:from-blue-900/30 dark:to-slate-700" />
                  )}
                  <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors duration-200 rounded-xl" />
                </div>

                {/* Right: Text content */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h3>
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-full shrink-0">
                      {item.subtitle}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1">
                    {item.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {(item.tech ?? []).slice(0, 3).map((t) => (
                      <span key={t} className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Arrow */}
                <div className="shrink-0 w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-600 transition-all duration-200">
                  <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-white transition-colors" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="flex justify-end mt-4">
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            View All Projects
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
