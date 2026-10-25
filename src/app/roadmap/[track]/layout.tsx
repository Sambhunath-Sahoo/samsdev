import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CourseNav } from "@/components/lesson/course-nav";
import { ProgressProvider } from "@/components/progress-provider";
import { ROADMAP_TRACKS, getRoadmapTrack } from "@/data/roadmap";
import { loadCompleted } from "@/lib/roadmap/load-progress";
import { toNavSections } from "@/lib/roadmap/nav-sections";

type TrackLayoutProps = { children: React.ReactNode; params: Promise<{ track: string }> };

export function generateStaticParams() {
  return ROADMAP_TRACKS.map((track) => ({ track: track.id }));
}

/** The course frame: contents on the left, the page on the right. Shared by the overview and every lesson. */
export default async function RoadmapTrackLayout({ children, params }: TrackLayoutProps) {
  const track = getRoadmapTrack((await params).track);
  if (!track) notFound();

  const session = await auth();
  const { ids: completedIds, failed: progressUnavailable } = await loadCompleted(session?.user?.id);
  const nav = <CourseNav trackId={track.id} trackTitle={track.title} sections={toNavSections(track)} />;

  return (
    <div className={`theme-app hue-${track.hue} min-h-screen`}>
      <Navbar />
      <ProgressProvider
        endpoint="/api/roadmap/progress"
        idKey="pointId"
        isSignedIn={Boolean(session?.user?.id) && !progressUnavailable}
        initialCompleted={completedIds}
      >
        <div className="lg:grid lg:grid-cols-[272px_minmax(0,1fr)]">
          <details className="border-b border-line bg-bg lg:hidden">
            <summary className="cursor-pointer list-none px-4 py-3.5 text-sm font-semibold text-ink [&::-webkit-details-marker]:hidden sm:px-6">Course contents ▾</summary>
            {nav}
          </details>
          <aside className="hidden border-r border-line bg-bg lg:block">
            <div className="sticky top-[var(--nav-h)] max-h-[calc(100vh-var(--nav-h))] overflow-y-auto">{nav}</div>
          </aside>
          <main className="min-w-0">{children}</main>
        </div>
      </ProgressProvider>
      <Footer />
    </div>
  );
}
