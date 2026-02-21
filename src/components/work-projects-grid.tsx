"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { DetailedProject } from "@/types/content";

export function WorkProjectsGrid({ projects }: { projects: DetailedProject[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {projects.map((item) => (
        <Link href={`/projects/${item.slug}`} key={item.slug}>
          <div className="group h-full p-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:border-blue-600 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 cursor-pointer">
            
            {/* Image */}
            <div className="relative w-full h-48 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 mb-4">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-slate-200 dark:from-blue-900/30 dark:to-slate-700" />
              )}
            </div>

            {/* Content */}
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                  <ArrowUpRight className="h-5 w-5 text-slate-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
                </div>
                <span className="inline-block text-xs font-medium text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2.5 py-1 rounded-full">
                  {item.subtitle}
                </span>
              </div>
              
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
                {item.description}
              </p>
              
              <div className="flex flex-wrap gap-2 pt-1">
                {(item.tech ?? []).slice(0, 4).map((t) => (
                  <span key={t} className="px-3 py-1 text-xs font-medium rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
