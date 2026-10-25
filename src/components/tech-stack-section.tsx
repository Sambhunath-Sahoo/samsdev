import { Band, BandHead, CARD } from "@/components/section-shell";
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
    <Band tone="lav" id="stack">
      <BandHead
        eyebrow={`Chapter ${index} / Tools I reach for`}
        title="Stack"
        lead="The tools I use day to day, grouped by layer."
      />

      <div className="grid gap-4">
        {categories.map(({ key, label }) => (
          <div key={key} className={`${CARD} md:grid md:grid-cols-[180px_1fr] md:items-start md:gap-6`}>
            <p className="hud mb-3 text-muted md:mb-0 md:pt-2">{label}</p>
            <div className="flex flex-wrap gap-2">
              {skills[key]!.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-line-strong px-3.5 py-1.5 font-mono text-xs tracking-[0.04em] text-ink transition-colors hover:bg-invert-bg hover:text-invert-fg"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Band>
  );
}
