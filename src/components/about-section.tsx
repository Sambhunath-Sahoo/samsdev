import { SectionHeader } from "./section-header"
import userData from "@/data/user.json"

export function AboutSection() {
  return (
    <section id="about" className="space-y-6 sm:space-y-8 scroll-mt-20">
      <SectionHeader 
        title="About Me" 
        subtitle="Passionate about building innovative solutions"
      />
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

