import { ArrowLeft, MapPin, Briefcase, Calendar, Code2, Heart } from "lucide-react";
import { Navbar } from "@/components/navbar";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import { getAbout } from "@/lib/content/about";
import { getExperience } from "@/lib/content/experience";
import type { SanityExperienceItem, SanityAboutSkills } from "@/types/content";

function formatPeriod(item: SanityExperienceItem): string {
  const formatDate = (dateStr: string) => {
    const [year, month] = dateStr.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };
  const start = formatDate(item.startDate);
  const end = item.currentlyWorking ? "Present" : item.endDate ? formatDate(item.endDate) : "";
  return `${start} – ${end}`;
}

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

export default async function AboutPage() {
  const [about, experienceData] = await Promise.all([getAbout(), getExperience()]);

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 container-padding">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>

            <div className="space-y-4">
              <p className="text-sm font-semibold text-blue-600">About</p>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
                HI, I&apos;M {about?.nickname?.toUpperCase() ?? "SAMS"}
              </h1>
              {about?.shortDescription && (
                <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
                  {about.shortDescription}
                </p>
              )}
            </div>

            {/* Quick Info */}
            <div className="flex flex-wrap gap-6 pt-2">
              {about?.location && (
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  <span>{about.location}</span>
                </div>
              )}
              {about?.designation && (
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <Briefcase className="h-4 w-4 text-blue-600" />
                  <span>{about.designation}</span>
                </div>
              )}
              {about?.experienceYears && (
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span>{about.experienceYears}+ Years Experience</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Long Description (rich text) */}
      {about?.longDescription && about.longDescription.length > 0 && (
        <section className="pb-16 container-padding">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3 mb-6">
              <Heart className="h-6 w-6 text-blue-600" />
              My Story
            </h2>
            <div className="max-w-none text-lg leading-relaxed text-slate-600 dark:text-slate-400">
              <PortableText 
                value={about.longDescription} 
                components={{
                  block: {
                    normal: ({ children }) => <p className="mb-6">{children}</p>,
                    h1: ({ children }) => <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4 mt-8">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 mt-8">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 mt-8">{children}</h3>,
                    blockquote: ({ children }) => <blockquote className="border-l-4 border-blue-500 pl-4 italic my-6">{children}</blockquote>,
                  },
                  list: {
                    bullet: ({ children }) => <ul className="list-disc pl-6 mb-6 space-y-2">{children}</ul>,
                    number: ({ children }) => <ol className="list-decimal pl-6 mb-6 space-y-2">{children}</ol>,
                  },
                  marks: {
                    strong: ({ children }) => <strong className="font-semibold text-slate-900 dark:text-white">{children}</strong>,
                  }
                }}
              />
            </div>
          </div>
        </section>
      )}

      {/* Skills Section */}
      {about?.skills && (
        <section className="pb-16 container-padding">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3 mb-6">
              <Code2 className="h-6 w-6 text-blue-600" />
              Skills &amp; Technologies
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {SKILL_CATEGORIES.map(({ key, label }) => {
                const items = about.skills?.[key];
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
      )}

      {/* Work Experience Section */}
      <section className="pb-16 container-padding">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              <Briefcase className="h-6 w-6 text-blue-600" />
              Work Experience
            </h2>

            <div className="space-y-6">
              {experienceData.map((exp) => (
                <div
                  key={exp._id}
                  className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">{exp.title}</h3>
                      {exp.companyUrl ? (
                        <a
                          href={exp.companyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 font-medium hover:underline"
                        >
                          {exp.companyName}
                        </a>
                      ) : (
                        <p className="text-blue-600 font-medium">{exp.companyName}</p>
                      )}
                    </div>
                    <span className="text-sm text-slate-500 dark:text-slate-400 shrink-0 ml-4">
                      {formatPeriod(exp)}
                    </span>
                  </div>
                  {exp.location && (
                    <p className="text-slate-600 dark:text-slate-400 mb-2 flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4" />
                      {exp.location}
                    </p>
                  )}
                  <ul className="space-y-2 mt-4">
                    {exp.description.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                        <span className="text-slate-600 dark:text-slate-400">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 container-padding border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} {about?.nickname ?? "Sams"}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
