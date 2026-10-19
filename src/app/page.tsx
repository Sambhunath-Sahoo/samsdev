// Server component — every section fetches its own Sanity data; Next dedupes identical requests per render.

import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { WorkSection } from "@/components/work-section";
import { WorkExperienceSection } from "@/components/work-experience-section";
import { ServicesSection } from "@/components/services-section";
import { TechStackSection } from "@/components/tech-stack-section";
import { AboutSection } from "@/components/about-section";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";
import { HashScroll } from "@/components/hash-scroll";

export default function Home() {
  return (
    <div className="min-h-screen">
      <HashScroll />
      <Navbar />
      <main>
        <HeroSection index="01" />
        <WorkSection index="02" />
        <WorkExperienceSection index="03" />
        <ServicesSection index="04" />
        <TechStackSection index="05" />
        <AboutSection index="06" />
        <ContactSection index="07" />
      </main>
      <Footer />
    </div>
  );
}
