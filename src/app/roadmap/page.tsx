import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Rail, SectionBar } from "@/components/section-shell";
import { RoadmapTrackCard } from "@/components/roadmap-track-card";
import { ROADMAP_TRACKS } from "@/data/roadmap";

export const metadata: Metadata = {
  title: "Roadmap",
  description: "Learning roadmaps for DevOps and system design, each laid out as sections, subsections and points.",
};

export default function RoadmapPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <section className="relative scanlines">
          <Rail className="relative">
            <SectionBar index="01" label="Roadmap" aside="Learning in public" />
            <div className="section-pad">
              <Link href="/" className="hud inline-flex items-center gap-1.5 text-faint hover:text-ink">
                <ArrowLeft className="h-3 w-3" strokeWidth={2.5} /> Home
              </Link>
              <h1 className="display-xl mt-6 max-w-3xl">
                What I&apos;m <span className="accent-text">learning</span>.
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
                Two roadmaps, each outlined as sections, subsections and points. Pick one to open it.
              </p>
            </div>
          </Rail>
        </section>

        <section>
          <Rail>
            <SectionBar index="02" label="Tracks" aside={`${ROADMAP_TRACKS.length} roadmaps`} />
            <div className="cell-grid md:grid-cols-2">
              {ROADMAP_TRACKS.map((track, i) => (
                <RoadmapTrackCard key={track.id} track={track} index={String(i + 1).padStart(2, "0")} />
              ))}
            </div>
          </Rail>
        </section>
      </main>
      <Footer />
    </div>
  );
}
