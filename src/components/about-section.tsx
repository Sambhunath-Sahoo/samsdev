import Link from "next/link";
import { Band, BandHead, CARD, TAG, TAG_ON } from "@/components/section-shell";
import { getAbout } from "@/lib/content/about";
import { EDUCATION_DATA } from "@/data/education";
import { yearOf } from "@/lib/dates";

const FULL_NAME = "Sambhunath Sahoo";

function Fact({ label, value, note }: { label: string; value: React.ReactNode; note?: string }) {
  return (
    <div className="grid gap-1 border-b border-line py-3 last:border-b-0 sm:grid-cols-[110px_1fr] sm:gap-4">
      <span className="hud text-muted">{label}</span>
      <span className="text-[15px] text-ink">
        {value}
        {note && <small className="block text-[13px] text-faint">{note}</small>}
      </span>
    </div>
  );
}

export async function AboutSection({ index = "06" }: { index?: string }) {
  const about = await getAbout();
  const nickname = about?.nickname ?? "Sams";
  const education = EDUCATION_DATA[0];
  const year = new Date().getFullYear();

  return (
    <Band tone="ink" id="about">
      <BandHead eyebrow={`Chapter ${index} / About · ${FULL_NAME}`} title="About" accent={nickname} />

      <div className="grid gap-4 md:grid-cols-[3fr_2fr]">
        <div className={CARD}>
          <h3 className="font-display text-2xl uppercase leading-[1.05] text-ink-strong md:text-3xl">
            Curious about how things <span className="pub-serif">work</span>, then making them work better.
          </h3>
          {about?.shortDescription && (
            <p className="mt-4 max-w-[60ch] text-[15px] leading-[1.7] text-muted">{about.shortDescription}</p>
          )}
          <p className="serif-i mt-5 max-w-[26ch] text-[1.375rem] leading-[1.25] text-ink-strong">
            Outside of work: emerging tech, side projects, and mentoring other developers.
          </p>
          <Link href="/about" className="btn btn-secondary mt-6">
            Full story
          </Link>
        </div>

        <div className={CARD}>
          <p className="hud text-muted">At a glance</p>
          <div className="mt-3">
            <Fact label="Name" value={FULL_NAME} note={`Most people say ${nickname}`} />
            {about?.designation && <Fact label="Role" value={about.designation} />}
            {about?.location && <Fact label="Based" value={about.location} note="Open to remote" />}
            {about?.experienceYears && <Fact label="Experience" value={`${about.experienceYears}+ years`} />}
            {education && (
              <Fact
                label="Education"
                value={education.degree}
                note={[education.institution, education.location, `${yearOf(education.startDate)}–${education.endDate ? yearOf(education.endDate) : "now"}`]
                  .filter(Boolean)
                  .join(" · ")}
              />
            )}
            <Fact label="Status" value={<span className={`${TAG} ${TAG_ON}`}>Available · {year}</span>} />
          </div>
        </div>
      </div>
    </Band>
  );
}
