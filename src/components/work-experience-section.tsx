import { Rail, SectionBar, SectionIntro } from "@/components/section-shell";
import { getExperience } from "@/lib/content/experience";
import { formatPeriod, periodLabel, yearOf } from "@/lib/dates";
import type { SanityExperienceItem } from "@/types/content";

interface WorkExperienceSectionProps {
  index?: string;
  showIntro?: boolean;
}

function asideLabel(items: SanityExperienceItem[]): string {
  const years = items.map((item) => yearOf(item.startDate)).sort();
  const first = years[0];
  const isCurrent = items.some((item) => item.currentlyWorking);
  return isCurrent ? `${first} → present` : `${first} → ${years[years.length - 1]}`;
}

function CompanyName({ item }: { item: SanityExperienceItem }) {
  const className = "mt-1 font-medium text-accent-ink";
  if (!item.companyUrl) return <p className={className}>{item.companyName}</p>;
  return (
    <a href={item.companyUrl} target="_blank" rel="noopener noreferrer" className={`${className} hover:underline`}>
      {item.companyName}
    </a>
  );
}

export async function WorkExperienceSection({ index = "03", showIntro = true }: WorkExperienceSectionProps = {}) {
  const items = await getExperience();
  if (items.length === 0) return null;

  return (
    <section id="experience" className="scroll-mt-12">
      <Rail>
        <SectionBar index={index} label="Experience" aside={asideLabel(items)} />

        {showIntro && (
          <SectionIntro
            className="pb-0"
            title={
              <>
                Years of <span className="accent-text">shipping</span>, not slides.
              </>
            }
            lead="Roles, dates and the things that actually went to production."
          />
        )}

        <div className={`cell-grid border-t border-line md:grid-cols-2 xl:grid-cols-3 ${showIntro ? "mt-14" : ""}`}>
          {items.map((item) => (
            <article key={item._id} className="cell">
              <p className="hud text-faint">{periodLabel(item.startDate, item.endDate, item.currentlyWorking)}</p>
              <h3 className="mt-6 text-2xl tracking-[-0.02em]">{item.title}</h3>
              <CompanyName item={item} />
              <p className="hud mt-2.5 flex flex-wrap gap-x-3.5 gap-y-1.5 text-faint">
                <span>{formatPeriod(item.startDate, item.endDate, item.currentlyWorking)}</span>
                {item.location && <span>{item.location}</span>}
              </p>
              <ul className="mt-4 grid gap-2.5 leading-[1.55] text-muted">
                {item.description.map((point) => (
                  <li key={point} className="flex gap-2.5">
                    <span aria-hidden="true" className="mt-[9px] h-1.5 w-1.5 flex-none bg-accent" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Rail>
    </section>
  );
}
