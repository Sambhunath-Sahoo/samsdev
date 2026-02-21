import { Code2 } from "lucide-react";
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
  frontend:       "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300",
  backend:        "bg-blue-100  dark:bg-blue-900/30  text-blue-700  dark:text-blue-300",
  devopsCloud:    "bg-sky-100   dark:bg-sky-900/30   text-sky-700   dark:text-sky-300",
  ai:             "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300",
  toolsPractices: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300",
};

interface SkillsSectionProps {
  title?: string;
  showHeader?: boolean;
  className?: string;
}

export async function SkillsSection({
  title = "Skills & Technologies",
  showHeader = true,
  className = "",
}: SkillsSectionProps = {}) {
  const skills = await getSkills();
  if (!skills) return null;

  return (
    <section className={`pb-16 container-padding ${className}`}>
      <div className="max-w-4xl mx-auto">
        {showHeader && (
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3 mb-6">
            <Code2 className="h-6 w-6 text-blue-600" />
            {title}
          </h2>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SKILL_CATEGORIES.map(({ key, label }) => {
            const items = skills?.[key];
            if (!items || items.length === 0) return null;
            return (
              <div
                key={key}
                className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
              >
                <h3 className="font-bold text-slate-900 dark:text-white mb-4">{label}</h3>
                <div className="flex flex-wrap gap-2">
                  {items.map((skill) => (
                    <span
                      key={skill}
                      className={`px-3 py-1 text-sm rounded-full font-medium ${SKILL_COLORS[key]}`}
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
