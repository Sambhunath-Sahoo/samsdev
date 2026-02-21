import { ArrowLeft, MapPin, Briefcase, Calendar, Heart, GraduationCap } from "lucide-react";
import { Navbar } from "@/components/navbar";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import { getAbout } from "@/lib/content/about";
import { WorkExperienceSection } from "@/components/work-experience-section";
import { EducationSection } from "@/components/education-section";

export default async function AboutPage() {
  const about = await getAbout();

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

      {/* Work Experience Section */}
      <section className="pb-16 container-padding">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              <Briefcase className="h-6 w-6 text-blue-600" />
              Work Experience
            </h2>
          </div>
          <WorkExperienceSection showHeader={false} />
        </div>
      </section>

      {/* Education Section */}
      <section className="pb-16 container-padding">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              <GraduationCap className="h-6 w-6 text-blue-600" />
              Education
            </h2>
          </div>
          <EducationSection showHeader={false} />
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
