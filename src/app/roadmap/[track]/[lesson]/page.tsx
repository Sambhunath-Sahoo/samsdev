import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Clock, ListChecks } from "lucide-react";
import { LessonBlocks } from "@/components/lesson/lesson-blocks";
import { LessonPager } from "@/components/lesson/lesson-pager";
import { LessonTabs } from "@/components/lesson/lesson-tabs";
import { LessonToc } from "@/components/lesson/lesson-toc";
import { PointItem } from "@/components/roadmap-section";
import { ROADMAP_TRACKS, getRoadmapTrack } from "@/data/roadmap";
import { findLesson, lessonHeadings, listLessons, neighbours, type LessonRef } from "@/lib/roadmap/lessons";
import { subsectionPointIds } from "@/lib/roadmap/point-ids";

type LessonParams = { params: Promise<{ track: string; lesson: string }> };

export function generateStaticParams() {
  return ROADMAP_TRACKS.flatMap((track) => listLessons(track).map((ref) => ({ track: track.id, lesson: ref.slug })));
}

export async function generateMetadata({ params }: LessonParams): Promise<Metadata> {
  const { track: trackId, lesson: slug } = await params;
  const track = getRoadmapTrack(trackId);
  const ref = track && findLesson(track, slug);
  if (!ref) return {};
  return { title: `${ref.subsection.title} · ${track.title}`, description: ref.subsection.lesson.summary };
}

const toLink = (trackId: string, ref: LessonRef | undefined) =>
  ref ? { href: `/roadmap/${trackId}/${ref.slug}`, title: ref.subsection.title } : undefined;

export default async function LessonPage({ params }: LessonParams) {
  const { track: trackId, lesson: slug } = await params;
  const track = getRoadmapTrack(trackId);
  const ref = track && findLesson(track, slug);
  if (!track || !ref) notFound();

  const { lesson } = ref.subsection;
  const points = ref.subsection.points ?? [];
  const { previous, next } = neighbours(track, slug);

  return (
    <>
      <div className="px-6 pb-32 pt-8 md:px-10 lg:pb-24 xl:grid xl:grid-cols-[minmax(0,1fr)_260px] xl:gap-16 lg:px-14">
        <article className="mx-auto w-full min-w-0 max-w-[60rem]">
          <p className="hud text-faint">
            {ref.sectionTitle} <span className="mx-1">·</span> Lesson {ref.position} of {ref.total}
          </p>
          <h1 className="display-lg mt-3 max-w-3xl">{ref.subsection.title}</h1>
          <div aria-hidden className="mt-5 h-0.5 w-16 bg-[var(--app)]" />
          <p className="mt-5 max-w-[60ch] text-lg leading-relaxed text-muted">{lesson.summary}</p>
          <p className="hud mt-4 flex flex-wrap gap-x-5 gap-y-1 text-faint">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3 w-3" aria-hidden /> {lesson.minutes} min read
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ListChecks className="h-3 w-3" aria-hidden /> {points.length} key points
            </span>
          </p>

          <div className="mt-8">
            <LessonTabs
              learn={<LessonBlocks lesson={lesson} />}
              review={
                <div>
                  <p className="max-w-[60ch] text-muted">Tick each point once you could explain it without looking. Open one for the detail and a question to test yourself.</p>
                  <ul className="mt-4 divide-y divide-line border-y border-line">
                    {points.map((point) => (
                      <PointItem key={point.id} point={point} />
                    ))}
                  </ul>
                </div>
              }
            />
          </div>

          {next && (
            <Link href={`/roadmap/${track.id}/${next.slug}`} className="invert-block group mt-14 flex items-center justify-between gap-4 border border-line p-5">
              <span>
                <span className="hud block opacity-60">Next lesson</span>
                <span className="mt-1 block text-lg font-semibold">{next.subsection.title}</span>
              </span>
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden />
            </Link>
          )}
        </article>

        <aside className="hidden xl:block">
          <div className="sticky top-[calc(var(--nav-h)+2rem)]">
            <LessonToc headings={lessonHeadings(lesson)} />
          </div>
        </aside>
      </div>

      <LessonPager pointIds={subsectionPointIds(ref.subsection)} previous={toLink(track.id, previous)} next={toLink(track.id, next)} />
    </>
  );
}
