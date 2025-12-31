import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section"
import { WorkExperienceSection } from "@/components/work-experience-section"
import { ProjectsSection } from "@/components/projects-section"
import { ContactSection } from "@/components/contact-section"

export default function Home() {
  return (
    <div className="w-full">
      {/* First View - Hero + About */}
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 min-h-[calc(100vh-4rem)] flex flex-col justify-center py-8 sm:py-12 md:py-16 space-y-12 sm:space-y-16 md:space-y-20">
        <HeroSection />
        <AboutSection />
      </div>
      
      {/* Second View - Work Experience */}
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-12 sm:py-16 md:py-20 lg:py-24">
        <WorkExperienceSection />
      </div>

      {/* Third View - Projects */}
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-12 sm:py-16 md:py-20 lg:py-24">
        <ProjectsSection />
      </div>

      {/* Fourth View - Contact */}
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-12 sm:py-16 md:py-20 lg:py-24">
        <ContactSection />
      </div>
    </div>
  )
}
