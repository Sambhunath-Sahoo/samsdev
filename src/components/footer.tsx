import Link from "next/link";
import { Brand } from "@/components/brand";
import { getAbout } from "@/lib/content/about";
import { getContacts } from "@/lib/content/contacts";
import { getDetailedProjects } from "@/lib/content/projects";
import socials from "@/data/socials.json";

const DEFAULT_EMAIL = "sambhu05357@gmail.com";
const FOOTER_PROJECT_LIMIT = 4;

const SITE_LINKS = [
  { label: "Work", href: "/#work" },
  { label: "Experience", href: "/#experience" },
  { label: "Services", href: "/#services" },
  { label: "Stack", href: "/#stack" },
  { label: "About", href: "/about" },
];

type FooterLink = { label: string; href: string; external?: boolean };

function FooterColumn({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <nav aria-label={title} className="cell flex flex-col gap-2.5">
      <p className="hud mb-1.5 text-faint">{title}</p>
      {links.map((link) =>
        link.external ? (
          <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-ink">
            {link.label}
          </a>
        ) : (
          <Link key={link.href} href={link.href} className="text-muted hover:text-ink">
            {link.label}
          </Link>
        ),
      )}
    </nav>
  );
}

export async function Footer() {
  const [about, contacts, projects] = await Promise.all([getAbout(), getContacts(), getDetailedProjects()]);
  const email = contacts?.email ?? DEFAULT_EMAIL;
  const github = contacts?.github ?? socials.find((s) => s.name === "GitHub")?.href ?? "";
  const linkedin = contacts?.linkedin ?? socials.find((s) => s.name === "LinkedIn")?.href ?? "";
  const year = new Date().getFullYear();

  const workLinks: FooterLink[] = [
    ...projects.slice(0, FOOTER_PROJECT_LIMIT).map((p) => ({ label: p.title, href: `/projects/${p.slug}` })),
    { label: "All projects", href: "/projects" },
  ];

  const connectLinks: FooterLink[] = [
    { label: "GitHub", href: github, external: true },
    { label: "LinkedIn", href: linkedin, external: true },
    { label: "Email", href: `mailto:${email}`, external: true },
  ];

  return (
    <footer className="border-t border-line">
      <div className="rail">
        <div className="cell-grid sm:grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr]">
          <div className="cell">
            <Brand />
            <p className="mt-4 max-w-xs leading-relaxed text-muted">
              Full stack AI engineer. Spring Boot, React and Vue.js products that perform and don&apos;t break.
            </p>
            <a href={`mailto:${email}`} className="hud mt-6 inline-block text-faint hover:text-ink">
              {email}
            </a>
          </div>
          <FooterColumn title="Site" links={SITE_LINKS} />
          <FooterColumn title="Work" links={workLinks} />
          <FooterColumn title="Connect" links={connectLinks} />
        </div>

        <div className="flex flex-col gap-2 border-t border-line px-6 py-4 md:flex-row md:items-center md:justify-between md:px-10">
          <p className="hud text-faint">
            © {year} {about?.nickname ?? "Sams"}. All rights reserved.
          </p>
          <p className="hud text-faint">Built in {about?.location ?? "Bangalore, India"}</p>
        </div>
      </div>
    </footer>
  );
}
