import { Band, BandHead, Bullet, CARD, type BandTone } from "@/components/section-shell";
import { EDUCATION_DATA } from "@/data/education";
import { formatPeriod, periodLabel } from "@/lib/dates";

export function EducationSection({ index = "04", tone = "ink" }: { index?: string; tone?: BandTone }) {
  if (EDUCATION_DATA.length === 0) return null;

  return (
    <Band tone={tone} id="education">
      <BandHead eyebrow={`Chapter ${index} / Education`} title="Education" />

      <div className="grid gap-4">
        {EDUCATION_DATA.map((item) => (
          <article key={`${item.institution}-${item.degree}`} className={`${CARD} md:grid md:grid-cols-[1fr_2fr] md:gap-8`}>
            <div>
              <p className="hud text-muted">{periodLabel(item.startDate, item.endDate, item.currentlyStudying ?? false)}</p>
              <p className="hud mt-2 text-faint">{formatPeriod(item.startDate, item.endDate, item.currentlyStudying ?? false)}</p>
              {item.location && <p className="hud mt-2 text-faint">{item.location}</p>}
            </div>
            <div className="mt-4 md:mt-0">
              <h3 className="font-display text-2xl leading-tight text-ink-strong">{item.degree}</h3>
              {item.institutionUrl ? (
                <a href={item.institutionUrl} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block font-medium text-accent-ink underline-offset-4 hover:underline">
                  {item.institution}
                </a>
              ) : (
                <p className="mt-1 font-medium text-accent-ink">{item.institution}</p>
              )}
              {item.description && item.description.length > 0 && (
                <ul className="mt-4 grid gap-2.5 leading-[1.55] text-muted">
                  {item.description.map((point) => (
                    <li key={point} className="flex gap-2.5">
                      <Bullet className="mt-[9px]" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </article>
        ))}
      </div>
    </Band>
  );
}
