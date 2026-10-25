import { Band, BandHead, Bullet, CARD, type BandTone } from "@/components/section-shell";
import { getExperience } from "@/lib/content/experience";
import { formatPeriod, periodLabel, yearOf } from "@/lib/dates";
import type { SanityExperienceItem } from "@/types/content";

interface WorkExperienceSectionProps {
  index?: string;
  showIntro?: boolean;
  tone?: BandTone;
}

function asideLabel(items: SanityExperienceItem[]): string {
  const years = items.map((item) => yearOf(item.startDate)).sort();
  const first = years[0];
  const isCurrent = items.some((item) => item.currentlyWorking);
  return isCurrent ? `${first} → present` : `${first} → ${years[years.length - 1]}`;
}

function CompanyName({ item }: { item: SanityExperienceItem }) {
  const className = "mt-1 inline-block font-medium text-accent-ink";
  if (!item.companyUrl) return <p className={className}>{item.companyName}</p>;
  return (
    <a href={item.companyUrl} target="_blank" rel="noopener noreferrer" className={`${className} underline-offset-4 hover:underline`}>
      {item.companyName}
    </a>
  );
}

export async function WorkExperienceSection({ index = "03", showIntro = true, tone = "lav" }: WorkExperienceSectionProps = {}) {
  const items = await getExperience();
  if (items.length === 0) return null;

  return (
    <Band tone={tone} id="experience">
      {showIntro ? (
        <BandHead
          eyebrow={`Chapter ${index} / Experience · ${asideLabel(items)}`}
          title="Experience"
          lead="Four years on one SaaS product, from associate to software engineer."
        />
      ) : (
        <BandHead eyebrow={`Chapter ${index} / Experience · ${asideLabel(items)}`} title="Experience" />
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <article key={item._id} className={CARD}>
            <p className="hud text-muted">{periodLabel(item.startDate, item.endDate, item.currentlyWorking)}</p>
            <h3 className="mt-4 font-display text-xl leading-tight text-ink-strong">{item.title}</h3>
            <CompanyName item={item} />
            <p className="hud mt-2.5 flex flex-wrap gap-x-3.5 gap-y-1.5 text-faint">
              <span>{formatPeriod(item.startDate, item.endDate, item.currentlyWorking)}</span>
              {item.location && <span>{item.location}</span>}
            </p>
            <ul className="mt-3 grid gap-2 text-sm leading-[1.55] text-muted">
              {item.description.map((point) => (
                <li key={point} className="flex gap-2.5">
                  <Bullet className="mt-[7px]" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </Band>
  );
}
