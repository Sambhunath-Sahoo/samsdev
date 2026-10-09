import Link from "next/link";
import { Rail, SectionBar } from "@/components/section-shell";
import { getAbout } from "@/lib/content/about";
import { EDUCATION_DATA } from "@/data/education";
import { yearOf } from "@/lib/dates";

const FULL_NAME = "Sambhunath Sahoo";

function Fact({ label, value, note }: { label: string; value: React.ReactNode; note?: string }) {
  return (
    <div>
      <span className="hud text-faint">{label}</span>
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
    <section id="about" className="scroll-mt-12">
      <Rail>
        <SectionBar index={index} label="About" aside={`${FULL_NAME} · ${nickname}`} />

        <div className="cell-grid md:grid-cols-[3fr_2fr]">
          <div className="cell">
            <h2 className="display-md max-w-2xl">
              Curious about how things <span className="accent-text">work</span>, then making them work better.
            </h2>
            {about?.shortDescription && (
              <p className="mt-6 max-w-[60ch] leading-[1.7] text-muted">{about.shortDescription}</p>
            )}
            <p className="serif-i mt-7 max-w-[24ch] text-[1.75rem] leading-[1.2] text-ink-strong">
              Outside of work: emerging tech, side projects, and mentoring other developers.
            </p>
            <Link href="/about" className="btn btn-secondary mt-8">
              Full story
            </Link>
          </div>

          <div className="cell">
            <p className="hud text-faint">At a glance</p>
            <div className="facts mt-4">
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
              <Fact label="Status" value={<span className="chip chip-on hue-green">Available · {year}</span>} />
            </div>
          </div>
        </div>
      </Rail>
    </section>
  );
}
