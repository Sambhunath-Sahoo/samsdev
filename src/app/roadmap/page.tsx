import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { RoadmapTrackCard } from "@/components/roadmap-track-card";
import { ROADMAP_TRACKS } from "@/data/roadmap";

export const metadata: Metadata = {
  title: "Roadmap",
  description: "Learning roadmaps for DevOps and system design, each laid out as sections, topics and points.",
};

export default function RoadmapPage() {
  return (
    <div className="theme-app min-h-screen">
      <Navbar />
      <main className="mx-auto w-full max-w-[72rem] px-4 pb-20 pt-6 sm:px-6 lg:px-10">
        <p className="eyebrow">Courses</p>
        <h1 className="display-lg mt-3 max-w-3xl">What I&apos;m learning</h1>
        <p className="mt-3 max-w-[68ch] text-[0.9375rem] leading-relaxed text-muted">
          {ROADMAP_TRACKS.length} roadmaps, each outlined as sections, topics and points. Pick one to open it.
        </p>
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {ROADMAP_TRACKS.map((track, i) => (
            <RoadmapTrackCard key={track.id} track={track} index={String(i + 1).padStart(2, "0")} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
