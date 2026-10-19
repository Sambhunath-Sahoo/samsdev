import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Rail, SectionBar } from "@/components/section-shell";
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

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <section className="relative scanlines">
          <Rail className="relative">
            <SectionBar index="01" label="About" aside={`${about?.designation ?? "Full Stack Developer"} · ${about?.location ?? ""}`} />
            <div className="section-pad">
              <Link href="/" className="hud inline-flex items-center gap-1.5 text-faint hover:text-ink">
                <ArrowLeft className="h-3 w-3" strokeWidth={2.5} /> Home
              </Link>
              <h1 className="display-xl mt-6 max-w-3xl">
                Hi, I&apos;m <span className="accent-text">{nickname}</span>.
              </h1>
              {about?.shortDescription && (
                <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">{about.shortDescription}</p>
              )}
              <div className="strip hud mt-8">
                {about?.location && <span className="text-muted">{about.location}</span>}
                {about?.designation && <span className="text-muted">{about.designation}</span>}
                {about?.experienceYears && <span className="text-muted">{about.experienceYears}+ years</span>}
              </div>
            </div>
          </Rail>
        </section>

        {hasStory && (
          <section>
            <Rail>
              <SectionBar index="02" label="Story" aside="In my own words" />
              <div className="section-pad prose-craft">
                <PortableText value={about!.longDescription!} components={portableTextComponents} />
              </div>
            </Rail>
          </section>
        )}

        <WorkExperienceSection index="03" showIntro={false} />
        <EducationSection index="04" />
      </main>
      <Footer />
    </div>
  );
}
