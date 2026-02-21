import Image from "next/image"
import { SectionHeader } from "./section-header"

interface EducationItem {
  degree: string
  institution: string
  institutionLogo?: string
  institutionUrl?: string
  startDate: string
  endDate?: string
  currentlyStudying?: boolean
  location?: string
  description?: string[]
}

// Static education data - edit this directly in the code
const EDUCATION_DATA: EducationItem[] = [
  {
    degree: "B.Tech in Computer Science Engineering",
    institution: "GIET University",
    startDate: "2018-09",
    endDate: "2022-05",
    location: "Gunupur, Odisha",
  }
]

function formatPeriod(item: EducationItem): string {
  const formatDate = (dateStr: string) => {
    const [year, month] = dateStr.split("-")
    const date = new Date(parseInt(year), parseInt(month) - 1)
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
  }
  const start = formatDate(item.startDate)
  const end = item.currentlyStudying ? "Present" : item.endDate ? formatDate(item.endDate) : ""
  return `${start} – ${end}`
}

interface EducationSectionProps {
  title?: string
  subtitle?: string
  showHeader?: boolean
  className?: string
}

export function EducationSection({
  title = "Education",
  subtitle = "My academic background and achievements",
  showHeader = true,
  className = "",
}: EducationSectionProps = {}) {
  if (!EDUCATION_DATA || EDUCATION_DATA.length === 0) return null

  return (
    <section
      id="education"
      className={`section-padding container-padding scroll-mt-20 ${className}`}
    >
      <div className="max-w-6xl mx-auto">
        {showHeader && (
          <div className="mb-12">
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">Education</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
              EDUCATION
            </h2>
          </div>
        )}
        
        <div className="space-y-6">
          {EDUCATION_DATA.map((edu, idx) => (
            <div
              key={`${edu.institution}-${edu.degree}-${idx}`}
              className="group relative p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300"
            >
              {/* Header with Logo */}
              <div className="flex items-start gap-4 mb-4">
                {edu.institutionLogo && (
                  <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                    <Image
                      src={edu.institutionLogo}
                      alt={`${edu.institution} logo`}
                      fill
                      className="object-contain p-1"
                    />
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-1">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                        {edu.degree}
                      </h3>
                      {edu.institutionUrl ? (
                        <a
                          href={edu.institutionUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-base font-semibold text-blue-600 hover:text-blue-700 dark:hover:text-blue-400 hover:underline"
                        >
                          {edu.institution}
                        </a>
                      ) : (
                        <p className="text-base font-semibold text-blue-600">{edu.institution}</p>
                      )}
                    </div>
                    
                    <div className="flex flex-col items-start sm:items-end gap-1 text-sm text-slate-500 dark:text-slate-400 shrink-0">
                      <span className="font-medium">{formatPeriod(edu)}</span>
                      {edu.location && (
                        <span className="text-xs">{edu.location}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              {edu.description && edu.description.length > 0 && (
                <ul className="space-y-2.5 ml-0">
                  {edu.description.map((point, pointIdx) => (
                    <li key={pointIdx} className="flex items-start gap-3 text-slate-600 dark:text-slate-400 leading-relaxed">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                      <span className="flex-1">{point}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
