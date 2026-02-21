import Image from "next/image"
import { SectionHeader } from "./section-header"
import { getExperience } from "@/lib/content/experience"
import type { SanityExperienceItem } from "@/types/content"

function formatPeriod(item: SanityExperienceItem): string {
  const formatDate = (dateStr: string) => {
    const [year, month] = dateStr.split("-")
    const date = new Date(parseInt(year), parseInt(month) - 1)
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
  }
  const start = formatDate(item.startDate)
  const end = item.currentlyWorking ? "Present" : item.endDate ? formatDate(item.endDate) : ""
  return `${start} – ${end}`
}

export async function WorkExperienceSection() {
  const experienceData = await getExperience()

  return (
    <section
      id="work-experience"
      className="space-y-8 sm:space-y-10 md:space-y-12 scroll-mt-20"
    >
      <div>
        <SectionHeader
          title="Work Experience"
          subtitle="My professional journey and key contributions"
        />
      </div>
      <div className="space-y-0 max-w-5xl mx-auto">
        {experienceData.map((exp, idx) => (
          <div
            key={exp._id}
            className="relative flex gap-3 sm:gap-4 md:gap-6 pb-6 sm:pb-8"
          >
            {/* Timeline Line */}
            {idx < experienceData.length - 1 && (
              <div className="absolute left-7 sm:left-8 md:left-10 top-16 sm:top-18 md:top-20 h-full w-px bg-border" />
            )}

            {/* Company Logo */}
            <div className="relative z-10 flex-shrink-0">
              <div className="relative h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20 overflow-hidden rounded-lg sm:rounded-xl border-2 bg-background shadow-md flex items-center justify-center">
                {exp.companyLogo ? (
                  <Image
                    src={exp.companyLogo}
                    alt={`${exp.companyName} logo`}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <span className="text-xl sm:text-2xl font-bold text-muted-foreground">
                    {exp.companyName.charAt(0)}
                  </span>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 space-y-2 sm:space-y-3 pt-1 sm:pt-2">
              <div className="flex flex-col gap-1 sm:gap-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm sm:text-base font-semibold">
                    {exp.companyUrl ? (
                      <a
                        href={exp.companyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-foreground hover:underline"
                      >
                        {exp.companyName}
                      </a>
                    ) : (
                      <span className="text-foreground">{exp.companyName}</span>
                    )}
                    <span className="hidden sm:inline text-muted-foreground">/</span>
                    <span className="text-muted-foreground font-medium text-xs sm:text-base">{exp.title}</span>
                  </div>
                  <div className="flex flex-col items-start sm:items-end gap-0.5">
                    <div className="text-xs sm:text-sm font-medium text-muted-foreground">
                      {formatPeriod(exp)}
                    </div>
                    {exp.location && (
                      <div className="text-xs text-muted-foreground/70">{exp.location}</div>
                    )}
                  </div>
                </div>
              </div>
              <ul className="list-disc space-y-1.5 sm:space-y-2.5 pl-4 sm:pl-5 text-xs sm:text-sm md:text-base leading-relaxed text-muted-foreground">
                {exp.description.map((point, pointIdx) => (
                  <li key={pointIdx}>{point}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
