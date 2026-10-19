import { Rail, SectionBar } from "@/components/section-shell";
import { EDUCATION_DATA } from "@/data/education";
import { formatPeriod, periodLabel } from "@/lib/dates";

export function EducationSection({ index = "04" }: { index?: string }) {
  if (EDUCATION_DATA.length === 0) return null;

  return (
    <section id="education" className="scroll-mt-12">
      <Rail>
        <SectionBar index={index} label="Education" />

        <div className="cell-grid">
          {EDUCATION_DATA.map((item) => (
            <article key={`${item.institution}-${item.degree}`} className="cell md:grid md:grid-cols-[1fr_2fr] md:gap-8">
              <div>
                <p className="hud text-faint">{periodLabel(item.startDate, item.endDate, item.currentlyStudying ?? false)}</p>
                <p className="hud mt-2 text-faint">{formatPeriod(item.startDate, item.endDate, item.currentlyStudying ?? false)}</p>
                {item.location && <p className="hud mt-2 text-faint">{item.location}</p>}
              </div>
              <div className="mt-4 md:mt-0">
                <h3 className="text-2xl tracking-[-0.02em]">{item.degree}</h3>
                {item.institutionUrl ? (
                  <a href={item.institutionUrl} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block font-medium text-accent-ink hover:underline">
                    {item.institution}
                  </a>
                ) : (
                  <p className="mt-1 font-medium text-accent-ink">{item.institution}</p>
                )}
                {item.description && item.description.length > 0 && (
                  <ul className="mt-4 grid gap-2.5 leading-[1.55] text-muted">
                    {item.description.map((point) => (
                      <li key={point} className="flex gap-2.5">
                        <span aria-hidden="true" className="mt-[9px] h-1.5 w-1.5 flex-none bg-accent" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </article>
          ))}
        </div>
      </Rail>
    </section>
  );
}
