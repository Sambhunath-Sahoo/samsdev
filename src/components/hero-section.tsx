import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Rail, SectionBar } from "@/components/section-shell";
import { getAbout } from "@/lib/content/about";
import { getContacts } from "@/lib/content/contacts";
import socials from "@/data/socials.json";

const CORE_STACK = ["LLMs · RAG", "LangChain", "Python · FastAPI", "Next.js", "React", "Spring Boot", "AWS"] as const;

const DEFAULT_GITHUB = socials.find((s) => s.name === "GitHub")?.href ?? "";
const DEFAULT_LINKEDIN = socials.find((s) => s.name === "LinkedIn")?.href ?? "";

export async function HeroSection({ index = "01" }: { index?: string }) {
  const [about, contacts] = await Promise.all([getAbout(), getContacts()]);
  const nickname = about?.nickname ?? "Sams";
  const years = about?.experienceYears ?? 4;
  const year = new Date().getFullYear();
  const location = about?.location ?? "Bangalore, India";

  const FACTS: { label: string; value: string; href?: string }[] = [
    { label: "Role", value: `${about?.designation ?? "AI Full Stack Engineer"}, Recruit CRM` },
    { label: "Focus", value: "LLM and RAG features, full stack delivery" },
    { label: "Experience", value: `${years}+ years, promoted in 20 months` },
    { label: "Latest work", value: "AI Ticket Triage, Foodishi, Coursivo", href: "/#work" },
    { label: "Based in", value: location },
  ];

  return (
    <section id="top" className="relative overflow-hidden scanlines">
      <Rail className="relative">
        <SectionBar index={index} label="Hello" aside={`Full stack · AI · ${location}`} />

        <div className="grid lg:grid-cols-[1.15fr_1fr]">
        <div className="section-pad lg:border-r lg:border-line">
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
            I build <strong className="font-medium text-ink">AI-powered web products</strong>: LLM and RAG
            features on top of solid Python, Spring Boot and React backends that perform and{" "}
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

          <nav aria-label="Core stack" className="mt-8 flex flex-wrap gap-2">
            {CORE_STACK.map((label) => (
              <Link key={label} href="/#stack" className="border border-line px-2.5 py-1.5 font-mono text-xs text-muted transition-colors hover:bg-invert-bg hover:text-invert-fg">
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <dl className="hud flex flex-col justify-start px-6 py-10 md:px-10 md:pt-20">
          {FACTS.map(({ label, value, href }) => (
            <div key={label} className="grid grid-cols-[110px_1fr] items-baseline gap-4 border-b border-line py-3.5 first:border-t">
              <dt className="text-faint">{label}</dt>
              <dd className="normal-case tracking-normal text-[15px] text-ink">
                {href ? (
                  <Link href={href} className="border-b border-line-strong hover:text-accent-ink">
                    {value}
                  </Link>
                ) : (
                  value
                )}
              </dd>
            </div>
          ))}
        </dl>
        </div>
      </Rail>
    </section>
  );
}
