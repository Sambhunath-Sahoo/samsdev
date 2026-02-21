import { SectionHeader } from "./section-header"
import { getAbout } from "@/lib/content/about"

export async function AboutSection() {
  const about = await getAbout()

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
          {about?.shortDescription ?? "Full Stack Developer specializing in scalable, high-performance applications."}
        </p>
      </div>
    </section>
  )
}
