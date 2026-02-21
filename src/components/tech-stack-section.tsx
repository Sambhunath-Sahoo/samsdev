import { getSkills } from "@/lib/content/skills";
import type { SanityAboutSkills } from "@/types/content";

const SKILL_CATEGORIES: { key: keyof SanityAboutSkills; label: string }[] = [
  { key: "frontend",      label: "Frontend" },
  { key: "backend",       label: "Backend" },
  { key: "devopsCloud",   label: "DevOps & Cloud" },
  { key: "ai",            label: "AI" },
  { key: "toolsPractices",label: "Tools & Practices" },
];

const SKILL_COLORS: Record<keyof SanityAboutSkills, string> = {
  frontend:       "bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/50",
  backend:        "bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/50",
  devopsCloud:    "bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/50",
  ai:             "bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/50",
  toolsPractices: "bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/50",
};

export async function TechStackSection() {
  const skills = await getSkills();
  if (!skills) return null;

  return (
    <section id="stack" className="section-padding container-padding">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Technologies</p>
          <h2 className="mt-1 text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            TECH STACK
          </h2>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SKILL_CATEGORIES.map(({ key, label }) => {
            const items = skills?.[key];
            if (!items || items.length === 0) return null;
            
            return (
              <div
                key={key}
                className="group p-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:border-blue-600 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300"
              >
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 group-hover:text-blue-600 transition-colors">
                  {label}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {items.map((skill) => (
                    <span
                      key={skill}
                      className={`px-3 py-1.5 text-sm font-medium rounded-full border ${SKILL_COLORS[key]}`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
