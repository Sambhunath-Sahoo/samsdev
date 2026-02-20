"use client";

import { getTechStack } from "@/lib/content/tech-stack";

export function TechStackSection() {
  const techStack = getTechStack();

  return (
    <section id="stack" className="section-padding container-padding">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Technologies</p>
          <h2 className="mt-1 text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            TECH STACK
          </h2>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {techStack.map((tech) => (
            <div
              key={tech.name}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full border transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${
                tech.featured 
                  ? "bg-blue-600 text-white border-blue-600" 
                  : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white hover:border-blue-600"
              }`}
            >
              <img src={tech.icon} alt={tech.name} className="w-5 h-5" />
              <span className="text-sm font-medium">{tech.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
