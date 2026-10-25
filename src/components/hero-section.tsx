import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Band, Bullet, CARD } from "@/components/section-shell";
import { getAbout } from "@/lib/content/about";
import { getContacts } from "@/lib/content/contacts";
import socials from "@/data/socials.json";

const CORE_STACK = ["LLMs · RAG", "LangChain", "Python · FastAPI", "Next.js", "React", "Spring Boot", "AWS"] as const;

const DEFAULT_GITHUB = socials.find((s) => s.name === "GitHub")?.href ?? "";
const DEFAULT_LINKEDIN = socials.find((s) => s.name === "LinkedIn")?.href ?? "";

function Arcs() {
  return (
    <svg className="pub-arcs" viewBox="0 0 420 420" fill="none" aria-hidden="true">
      {[60, 110, 160, 210].map((r) => (
        <circle key={r} cx="210" cy="210" r={r} stroke="var(--ink)" strokeWidth="1" />
      ))}
    </svg>
  );
}

export async function HeroSection() {
  const [about, contacts] = await Promise.all([getAbout(), getContacts()]);
  const nickname = about?.nickname ?? "Sams";
  const years = about?.experienceYears ?? 4;
  const year = new Date().getFullYear();
  const location = about?.location ?? "Bangalore, India";

  const STATS = [
    { value: `${years}+`, label: "Years shipping" },
    { value: "2", label: "Roadmaps" },
    { value: "3", label: "Products built" },
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
    <Band tone="lav" id="top" hero>
      <Arcs />
      <div className="grid items-start gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
        <div>
          <p className="hud flex flex-wrap items-center gap-3 text-muted">
            <span className="inline-flex items-center gap-2">
              <Bullet />
              Available for projects
            </span>
            <span className="text-faint">·</span>
            <span>{year}</span>
          </p>

          <h1 className="pub-h1 mt-5">
            Hi, I&apos;m {nickname}.
            <br />
            Full stack
            <span className="pub-serif">AI engineer.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted md:text-lg">
            I build <strong className="font-semibold text-ink">AI-powered web products</strong>: LLM and RAG
            features on top of solid Python, Spring Boot and React backends that perform and{" "}
            <span className="serif-i text-[1.2em] text-ink">don&apos;t break.</span>
          </p>

          <div className="mt-8 flex flex-wrap gap-2.5">
            <Link href="/#work" className="btn btn-primary">
              View my work <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
            </Link>
            <Link href="/#contact" className="btn btn-secondary">
              Get in touch
            </Link>
          </div>

          <p className="hud mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-faint">
            <span>Find me</span>
            <a href={contacts?.github ?? DEFAULT_GITHUB} target="_blank" rel="noopener noreferrer" className="btn btn-ghost rounded-full">
              GitHub
            </a>
            <a href={contacts?.linkedin ?? DEFAULT_LINKEDIN} target="_blank" rel="noopener noreferrer" className="btn btn-ghost rounded-full">
              LinkedIn
            </a>
            <Link href="/#contact" className="btn btn-ghost rounded-full">
              Email
            </Link>
            <span>{years}+ yrs</span>
          </p>

          <nav aria-label="Core stack" className="mt-8 flex flex-wrap gap-2">
            {CORE_STACK.map((label) => (
              <Link
                key={label}
                href="/#stack"
                className="rounded-full border border-line-strong px-3 py-1.5 font-mono text-xs text-ink transition-colors hover:bg-invert-bg hover:text-invert-fg"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex min-w-0 flex-col gap-5">
          <div className="grid grid-cols-3 gap-3">
            {STATS.map(({ value, label }) => (
              <div key={label} className={`${CARD} !p-4`}>
                <p className="font-display text-3xl leading-none text-ink-strong">{value}</p>
                <p className="hud mt-2 text-muted">{label}</p>
              </div>
            ))}
          </div>

          <figure className="overflow-hidden rounded-2xl border border-[#181a1f] bg-[#08080b] shadow-[0_12px_32px_-16px_rgba(16,16,20,0.55)]">
            <figcaption className="flex items-center gap-3 border-b border-[#26242f] bg-[#15141c] px-4 py-2">
              <span aria-hidden className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              </span>
              <span className="font-mono text-[12px] text-[#a8a4b8]">sams.dev: now</span>
            </figcaption>
            <pre className="overflow-x-auto px-4 py-3.5 font-mono text-[13px] leading-[1.8] text-[#f4f1fa]">
              {NOW_LINES.map(([cmd, out]) => (
                <span key={cmd} className="block">
                  <span className="text-[#98c379]">$</span> <span className="font-semibold text-[#c6bff0]">{cmd}</span>
                  {"\n"}
                  <span className="text-[#a8a4b8]">{out}</span>
                </span>
              ))}
              <span className="block">
                <span className="text-[#98c379]">$</span> <span className="animate-pulse text-[#f4f1fa] motion-reduce:animate-none">▍</span>
              </span>
            </pre>
          </figure>

          <dl className="hud flex flex-col">
            {FACTS.map(({ label, value, href }) => (
              <div key={label} className="grid grid-cols-[96px_1fr] items-baseline gap-4 border-b border-line py-2.5 first:border-t sm:grid-cols-[110px_1fr]">
                <dt className="text-muted">{label}</dt>
                <dd className="text-[15px] normal-case tracking-normal text-ink">
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
    </Band>
  );
}
