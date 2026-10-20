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

  const STATS = [
    { value: `${years}+`, label: "Years shipping", hue: "hue-blue" },
    { value: "2", label: "Roadmaps", hue: "hue-orange" },
    { value: "3", label: "Products built", hue: "hue-purple" },
  ];
  const NOW_LINES: [string, string][] = [
    ["whoami", `${nickname.toLowerCase()}, ai full stack engineer`],
    ["now --building", "Foodishi, shipping it to AWS in 5 steps"],
    ["now --learning", "DevOps and MLOps, notes at /roadmap"],
  ];

  const FACTS: { label: string; value: string; href?: string }[] = [
    { label: "Role", value: `${about?.designation ?? "AI Full Stack Engineer"}, Recruit CRM` },
    { label: "Focus", value: "LLM and RAG features, full stack delivery" },
    { label: "Experience", value: `${years}+ years` },
    { label: "Latest work", value: "AI Ticket Triage, Foodishi, Coursivo", href: "/#work" },
    { label: "Based in", value: location },
  ];

  return (
    <section id="top" className="relative overflow-clip scanlines">
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

          <p className="mt-4 max-w-xl leading-relaxed text-muted">
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

        <div className="flex flex-col gap-5 px-6 py-8 md:px-10">
          <div className="grid grid-cols-3 gap-px border border-line bg-line">
            {STATS.map(({ value, label, hue }) => (
              <div key={label} className={`bg-bg-raised p-4 ${hue}`}>
                <p className="text-3xl font-semibold leading-none tracking-[-0.03em] text-[var(--app-ink)]">{value}</p>
                <p className="hud mt-2 text-faint">{label}</p>
              </div>
            ))}
          </div>

          <figure className="overflow-hidden rounded-lg border border-[#181a1f] bg-[#282c34] shadow-[0_12px_32px_-16px_rgba(16,16,20,0.45)]">
            <figcaption className="flex items-center gap-3 border-b border-[#181a1f] bg-[#21252b] px-3 py-1.5">
              <span aria-hidden className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              </span>
              <span className="font-mono text-[12px] text-[#7f848e]">sams.dev: now</span>
            </figcaption>
            <pre className="overflow-x-auto px-4 py-3.5 font-mono text-[13.5px] leading-[1.8] text-[#abb2bf]">
              {NOW_LINES.map(([cmd, out]) => (
                <span key={cmd} className="block">
                  <span className="text-[#98c379]">$</span> <span className="font-semibold text-[#c678dd]">{cmd}</span>
                  {"\n"}
                  <span className="text-[#61afef]">{out}</span>
                </span>
              ))}
              <span className="block">
                <span className="text-[#98c379]">$</span> <span className="animate-pulse text-[#abb2bf]">▍</span>
              </span>
            </pre>
          </figure>

          <dl className="hud flex flex-col">
            {FACTS.map(({ label, value, href }) => (
              <div key={label} className="grid grid-cols-[110px_1fr] items-baseline gap-4 border-b border-line py-2.5 first:border-t">
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
        </div>
      </Rail>
    </section>
  );
}
