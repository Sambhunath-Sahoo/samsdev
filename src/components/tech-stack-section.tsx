import { Fragment } from "react";
import { Rail, SectionBar, SectionHead } from "@/components/section-shell";
import { getSkills } from "@/lib/content/skills";
import type { SanityAboutSkills } from "@/types/content";

const SKILL_CATEGORIES: { key: keyof SanityAboutSkills; label: string }[] = [
  { key: "ai", label: "AI" },
  { key: "frontend", label: "Frontend" },
  { key: "backend", label: "Backend" },
  { key: "toolsPractices", label: "Data · Security" },
  { key: "devopsCloud", label: "Cloud · Messaging" },
];

export async function TechStackSection({ index = "05" }: { index?: string }) {
  const skills = await getSkills();
  if (!skills) return null;

  const categories = SKILL_CATEGORIES.filter(({ key }) => (skills[key]?.length ?? 0) > 0);
  if (categories.length === 0) return null;

  return (
    <section id="stack" className="scroll-mt-12">
      <Rail>
        <SectionBar index={index} label="Stack" aside="Tools I reach for" />
        <SectionHead title="Stack" description="The tools I use day to day, grouped by layer." />

        <div className="cell-grid md:grid-cols-[180px_1fr]">
          {categories.map(({ key, label }) => (
            <Fragment key={key}>
              <div className="cell hud flex items-center text-faint">{label}</div>
              <div className="flex flex-wrap content-start gap-px bg-bg-sunken">
                {skills[key]!.map((skill) => (
                  <span
                    key={skill}
                    className="bg-bg px-3.5 py-2.5 font-mono text-xs tracking-[0.06em] text-ink transition-colors hover:bg-invert-bg hover:text-invert-fg"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </Fragment>
          ))}
        </div>
      </Rail>
    </section>
  );
}
