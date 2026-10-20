import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CourseNav, type NavSection } from "@/components/lesson/course-nav";
import { ProgressProvider } from "@/components/progress-provider";
import { ROADMAP_TRACKS, getRoadmapTrack } from "@/data/roadmap";
import { loadCompleted } from "@/lib/roadmap/load-progress";
import { subsectionPointIds } from "@/lib/roadmap/point-ids";
import type { RoadmapTrack } from "@/types/roadmap";

type TrackLayoutProps = { children: React.ReactNode; params: Promise<{ track: string }> };

export function generateStaticParams() {
  return ROADMAP_TRACKS.map((track) => ({ track: track.id }));
}

/** Only titles, slugs and ids go to the browser. Lesson bodies stay on the server. */
function toNavSections(track: RoadmapTrack): NavSection[] {
  return track.sections.map((section) => ({
    title: section.title,
    items: section.subsections.map((sub) => ({
      title: sub.title,
      slug: sub.lesson && sub.slug ? sub.slug : null,
      pointIds: subsectionPointIds(sub),
    })),
  }));
}

/** The course frame: contents on the left, the page on the right. Shared by the overview and every lesson. */
export default async function RoadmapTrackLayout({ children, params }: TrackLayoutProps) {
  const track = getRoadmapTrack((await params).track);
  if (!track) notFound();

  const session = await auth();
  const { ids: completedIds, failed: progressUnavailable } = await loadCompleted(session?.user?.id);
  const nav = <CourseNav trackId={track.id} trackTitle={track.title} sections={toNavSections(track)} />;

  return (
    <div className={`hue-${track.hue} min-h-screen`}>
      <Navbar />
      <ProgressProvider
        endpoint="/api/roadmap/progress"
        idKey="pointId"
        isSignedIn={Boolean(session?.user?.id) && !progressUnavailable}
        initialCompleted={completedIds}
      >
        <div className="lg:grid lg:grid-cols-[320px_minmax(0,1fr)]">
          <details className="border-b border-line bg-bg-raised lg:hidden">
            <summary className="hud cursor-pointer list-none px-6 py-3.5 text-muted [&::-webkit-details-marker]:hidden">Course contents ▾</summary>
            {nav}
          </details>
          <aside className="hidden border-r border-line lg:block">
            <div className="sticky top-[var(--nav-h)] max-h-[calc(100vh-var(--nav-h))] overflow-y-auto">{nav}</div>
          </aside>
          <main className="min-w-0">{children}</main>
        </div>
      </ProgressProvider>
      <Footer />
    </div>
  );
}
