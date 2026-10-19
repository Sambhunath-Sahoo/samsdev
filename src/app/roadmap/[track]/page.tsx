import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { auth } from "@/auth";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Rail, SectionBar } from "@/components/section-shell";
import { AuthBar } from "@/components/auth-bar";
import { ProgressProvider } from "@/components/progress-provider";
import { RoadmapTrackSection } from "@/components/roadmap-track-section";
import { ROADMAP_TRACKS, getRoadmapTrack } from "@/data/roadmap";
import { getCompletedPointIds } from "@/lib/roadmap/progress-store";

type RoadmapTrackParams = { params: Promise<{ track: string }> };

export function generateStaticParams() {
  return ROADMAP_TRACKS.map((track) => ({ track: track.id }));
}

export async function generateMetadata({ params }: RoadmapTrackParams): Promise<Metadata> {
  const track = getRoadmapTrack((await params).track);
  if (!track) return {};
  return { title: `${track.title} roadmap`, description: track.description };
}

async function loadCompleted(userId: string | undefined): Promise<{ ids: string[]; failed: boolean }> {
  if (!userId) return { ids: [], failed: false };
  try {
    return { ids: await getCompletedPointIds(userId), failed: false };
  } catch (error) {
    console.error("[roadmap] could not load progress", error);
    return { ids: [], failed: true };
  }
}

export default async function RoadmapTrackPage({ params }: RoadmapTrackParams) {
  const track = getRoadmapTrack((await params).track);
  if (!track) notFound();

  const session = await auth();
  const { ids: completedIds, failed: progressUnavailable } = await loadCompleted(session?.user?.id);

  return (
    <div className={`hue-${track.hue} min-h-screen`}>
      <Navbar />
      <ProgressProvider
        endpoint="/api/roadmap/progress"
        idKey="pointId"
        isSignedIn={Boolean(session?.user?.id) && !progressUnavailable}
        initialCompleted={completedIds}
      >
        <main>
          <section className="relative scanlines">
            <Rail className="relative">
              <SectionBar index="01" label={track.title} aside="Roadmap" />
              <div className="px-6 py-8 md:px-10 md:py-10">
                <Link href="/roadmap" className="hud inline-flex items-center gap-1.5 text-faint hover:text-ink">
                  <ArrowLeft className="h-3 w-3" strokeWidth={2.5} /> Roadmap
                </Link>
                <h1 className="display-md mt-4">
                  <span className="accent-text">{track.title}</span>.
                </h1>
                <p className="mt-3 max-w-xl leading-relaxed text-muted">{track.description}</p>
              </div>
            </Rail>
          </section>

          <AuthBar
            redirectTo={`/roadmap/${track.id}`}
            progressUnavailable={progressUnavailable}
            signedOutMessage="Sign in with Google to tick points and track your own progress."
            signedInMessage="Tick points as you finish them."
          />
          <RoadmapTrackSection track={track} />
        </main>
      </ProgressProvider>
      <Footer />
    </div>
  );
}
