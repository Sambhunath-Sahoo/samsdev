"use client";

import { ArrowLeft, MapPin, Calendar, Briefcase, GraduationCap, Award, Code2, Heart } from "lucide-react";
import { Navbar } from "@/components/navbar";
import Link from "next/link";
import { getExperience } from "@/lib/content/experience";

export default function AboutPage() {
  const experienceData = getExperience();

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
                HI, I&apos;M SAMS
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
                A passionate Full Stack Engineer with 3+ years of experience building scalable web applications 
                that perform under pressure and deliver exceptional user experiences.
              </p>
            </div>

            {/* Quick Info */}
            <div className="flex flex-wrap gap-6 pt-4">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <MapPin className="h-4 w-4 text-blue-600" />
                <span>India</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <Briefcase className="h-4 w-4 text-blue-600" />
                <span>Full Stack Engineer</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span>3+ Years Experience</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Content */}
      <section className="pb-16 container-padding">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                <Heart className="h-6 w-6 text-blue-600" />
                My Story
              </h2>
              <div className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed space-y-4">
                <p>
                  I&apos;m Sambhunath Sahoo, but most people call me Sams. I&apos;m a Full Stack Engineer who loves building 
                  products that make a real impact. My journey in software development started with a curiosity 
                  about how things work, and it has evolved into a passion for creating elegant solutions to complex problems.
                </p>
                <p>
                  I specialize in building scalable web applications using modern technologies like Spring Boot, React, 
                  and Vue.js. I believe in writing clean, maintainable code and have a strong focus on performance 
                  optimization and user experience.
                </p>
                <p>
                  When I&apos;m not coding, you can find me exploring new technologies, contributing to open-source projects, 
                  or sharing my knowledge with the developer community.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="pb-16 container-padding">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              <Code2 className="h-6 w-6 text-blue-600" />
              Skills & Technologies
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <h3 className="font-bold text-slate-900 dark:text-white mb-4">Backend Development</h3>
                <div className="flex flex-wrap gap-2">
                  {["Java", "Spring Boot", "Node.js", "Python", "PostgreSQL", "MongoDB", "Redis"].map((skill) => (
                    <span key={skill} className="px-3 py-1 text-sm rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <h3 className="font-bold text-slate-900 dark:text-white mb-4">Frontend Development</h3>
                <div className="flex flex-wrap gap-2">
                  {["React", "Vue.js", "TypeScript", "Next.js", "Tailwind CSS", "HTML/CSS"].map((skill) => (
                    <span key={skill} className="px-3 py-1 text-sm rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <h3 className="font-bold text-slate-900 dark:text-white mb-4">DevOps & Cloud</h3>
                <div className="flex flex-wrap gap-2">
                  {["Docker", "Kubernetes", "AWS", "Git", "CI/CD", "Linux"].map((skill) => (
                    <span key={skill} className="px-3 py-1 text-sm rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <h3 className="font-bold text-slate-900 dark:text-white mb-4">Tools & Practices</h3>
                <div className="flex flex-wrap gap-2">
                  {["Agile/Scrum", "TDD", "REST APIs", "GraphQL", "Microservices", "System Design"].map((skill) => (
                    <span key={skill} className="px-3 py-1 text-sm rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
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
                  key={exp.id}
                  className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">{exp.role}</h3>
                      <p className="text-blue-600 font-medium">{exp.company}</p>
                    </div>
                    <span className="text-sm text-slate-500 dark:text-slate-400">{exp.period}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 mb-2 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {exp.location}
                  </p>
                  <ul className="space-y-2 mt-4">
                    {exp.points.map((point, idx) => (
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

      {/* Education Section */}
      <section className="pb-16 container-padding">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              <GraduationCap className="h-6 w-6 text-blue-600" />
              Education
            </h2>
            
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Bachelor of Technology</h3>
              <p className="text-blue-600 font-medium">Computer Science & Engineering</p>
              <p className="text-slate-600 dark:text-slate-400 mt-2">
                Focused on software engineering principles, data structures, algorithms, and web technologies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="pb-20 container-padding">
        <div className="max-w-4xl mx-auto">
          <div className="p-8 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3 mb-6">
              <Award className="h-6 w-6 text-blue-600" />
              Key Achievements
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl font-black text-blue-600 mb-2">200+</div>
                <div className="text-slate-600 dark:text-slate-400">Production Issues Resolved</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-blue-600 mb-2">40%</div>
                <div className="text-slate-600 dark:text-slate-400">Performance Improvement</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-blue-600 mb-2">99.9%</div>
                <div className="text-slate-600 dark:text-slate-400">System Uptime Achieved</div>
              </div>
            </div>
          </div>
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
