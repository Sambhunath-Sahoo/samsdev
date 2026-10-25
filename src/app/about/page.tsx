import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Band, BandHead } from "@/components/section-shell";
import { WorkExperienceSection } from "@/components/work-experience-section";
import { EducationSection } from "@/components/education-section";
import { getAbout } from "@/lib/content/about";

const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p>{children}</p>,
    h1: ({ children }) => <h2>{children}</h2>,
    h2: ({ children }) => <h2>{children}</h2>,
    h3: ({ children }) => <h3>{children}</h3>,
    blockquote: ({ children }) => <blockquote>{children}</blockquote>,
  },
};

export default async function AboutPage() {
  const about = await getAbout();
  const nickname = about?.nickname ?? "Sams";
  const hasStory = (about?.longDescription?.length ?? 0) > 0;
  const asideParts = [about?.designation ?? "Full Stack Developer", about?.location].filter(Boolean);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Band tone="lav" hero>
          <Link href="/" className="hud inline-flex items-center gap-1.5 text-muted hover:text-ink">
            <ArrowLeft className="h-3 w-3" strokeWidth={2.5} /> Home
          </Link>
          <p className="hud mt-6 text-muted">Chapter 01 / About · {asideParts.join(" · ")}</p>
          <h1 className="pub-h1 mt-4 max-w-3xl">
            Hi, I&apos;m <span className="pub-serif">{nickname}.</span>
          </h1>
          {about?.shortDescription && (
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted md:text-lg">{about.shortDescription}</p>
          )}
          <div className="hud mt-8 flex flex-wrap gap-2">
            {[about?.location, about?.designation, about?.experienceYears ? `${about.experienceYears}+ years` : undefined]
              .filter(Boolean)
              .map((fact) => (
                <span key={fact} className="rounded-full border border-line-strong px-3 py-1.5 text-ink">
                  {fact}
                </span>
              ))}
          </div>
        </Band>

        {hasStory && (
          <Band tone="ink">
            <BandHead eyebrow="Chapter 02 / Story · In my own words" title="Story" />
            <div className="prose-craft">
              <PortableText value={about!.longDescription!} components={portableTextComponents} />
            </div>
          </Band>
        )}

        <WorkExperienceSection index="03" showIntro={false} tone={hasStory ? "lav" : "ink"} />
        <EducationSection index="04" tone={hasStory ? "ink" : "lav"} />
      </main>
      <Footer />
    </div>
  );
}
