// Server component — async children (WorkSection, WorkExperienceSection) fetch data server-side

import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { WorkSection } from "@/components/work-section";
import { WorkExperienceSection } from "@/components/work-experience-section";
import { ServicesSection } from "@/components/services-section";
import { TechStackSection } from "@/components/tech-stack-section";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <Navbar />
      <HeroSection />
      <WorkSection />
      <WorkExperienceSection />
      <ServicesSection />
      <TechStackSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
