import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Rail, SectionBar } from "@/components/section-shell";
import { getAbout } from "@/lib/content/about";
import { getContacts } from "@/lib/content/contacts";
import socials from "@/data/socials.json";

const CORE_STACK = [
  { label: "Spring Boot", code: "SB", hue: "hue-green" },
  { label: "React", code: "Re", hue: "hue-blue" },
  { label: "Vue.js", code: "Vu", hue: "hue-teal" },
  { label: "Next.js", code: "Nx", hue: "hue-purple" },
  { label: "MySQL", code: "My", hue: "hue-orange" },
  { label: "AWS", code: "AW", hue: "hue-yellow" },
  { label: "LLMs · RAG", code: "AI", hue: "hue-pink" },
] as const;

const DEFAULT_GITHUB = socials.find((s) => s.name === "GitHub")?.href ?? "";
const DEFAULT_LINKEDIN = socials.find((s) => s.name === "LinkedIn")?.href ?? "";

export async function HeroSection({ index = "01" }: { index?: string }) {
  const [about, contacts] = await Promise.all([getAbout(), getContacts()]);
  const nickname = about?.nickname ?? "Sams";
  const years = about?.experienceYears ?? 4;
  const year = new Date().getFullYear();
  const location = about?.location ?? "Bangalore, India";

  return (
    <section id="top" className="relative overflow-hidden scanlines">
      <Rail className="relative">
        <SectionBar index={index} label="Hello" aside={`Full stack · AI · ${location}`} />

        <div className="section-pad">
          <p className="hud flex flex-wrap items-center gap-3 text-muted">
            <span className="inline-flex items-center gap-2">
              <span
                aria-hidden="true"
                className="h-[7px] w-[7px] bg-[var(--c-green)] shadow-[0_0_0_3px_color-mix(in_srgb,var(--c-green)_25%,transparent)]"
              />
              Available for projects
            </span>
            <span className="text-faint">·</span>
            <span>{year}</span>
          </p>

          <h1 className="display-xl mt-5 max-w-3xl">
            Hi, I&apos;m {nickname}.
            <br />
            Full stack <span className="accent-text">AI</span> engineer.
          </h1>

          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
            I build <strong className="font-medium text-ink">scalable web products</strong> with Spring Boot,
            React and Vue.js that perform and{" "}
            <span className="serif-i text-[1.25em] text-ink">don&apos;t break.</span>
          </p>

          <div className="mt-8 flex flex-wrap gap-2.5">
            <Link href="/#work" className="btn btn-primary">
              View my work <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
            </Link>
            <Link href="/#contact" className="btn btn-secondary">
              Get in touch
            </Link>
          </div>

          <div className="strip hud mt-6">
            <span className="text-faint">Find me</span>
            <a href={contacts?.github ?? DEFAULT_GITHUB} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              GitHub
            </a>
            <a href={contacts?.linkedin ?? DEFAULT_LINKEDIN} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              LinkedIn
            </a>
            <Link href="/#contact" className="btn btn-ghost">
              Email
            </Link>
            <span className="text-faint">{years}+ yrs</span>
          </div>

          <nav aria-label="Core stack" className="mt-12 flex flex-wrap gap-x-5 gap-y-6">
            {CORE_STACK.map((item) => (
              <Link key={item.label} href="/#stack" className={`group flex w-20 flex-col items-center gap-2 text-center ${item.hue}`}>
                <span className="grid h-14 w-14 place-items-center border border-line bg-bg-raised font-mono text-[13px] font-bold text-[var(--app-ink)] transition-colors group-hover:border-[var(--app)] group-hover:bg-[var(--app)] group-hover:text-[var(--num-fg)]">
                  {item.code}
                </span>
                <span className="text-xs font-medium text-muted group-hover:text-[var(--app-ink)]">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </Rail>
    </section>
  );
}
