"use client"

import { SectionHeader } from "./section-header"
import { getUser } from "@/lib/content/user"

export function AboutSection() {
  const userData = getUser()

  return (
    <section 
      id="about" 
      className="space-y-6 sm:space-y-8 scroll-mt-20"
    >
      <div>
        <SectionHeader 
          title="About Me" 
          subtitle="Passionate about building innovative solutions"
        />
      </div>
      <div className="max-w-3xl mx-auto px-2 sm:px-4">
        <p className="text-sm sm:text-base md:text-lg leading-relaxed text-muted-foreground text-center">
          {userData.title} with 3+ years of experience specializing in full-stack development. 
          Strong backend focus on Spring Boot and MySQL, with frontend expertise in Vue.js and React. 
          Passionate about building scalable, high-performance applications and mentoring developers.
        </p>
      </div>
    </section>
  )
}
