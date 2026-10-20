import { describe, expect, it } from "vitest";
import { findLesson, lessonHeadings, listLessons, neighbours, slugify } from "./lessons";
import { ROADMAP_TRACKS } from "@/data/roadmap";
import type { RoadmapTrack } from "@/types/roadmap";

const lesson = (heading: string) => ({
  summary: "s",
  minutes: 3,
  blocks: [
    { type: "h2", text: heading },
    { type: "p", text: "body" },
  ] as const,
});

const track: RoadmapTrack = {
  id: "t",
  title: "T",
  description: "d",
  hue: "blue",
  sections: [
    {
      title: "One",
      goal: "g",
      subsections: [
        { title: "Outline only" },
        { title: "First lesson", slug: "first", lesson: lesson("Why it matters") },
        { title: "Second lesson", slug: "second", lesson: lesson("Run: it & go!") },
      ],
    },
    { title: "Two", goal: "g", subsections: [{ title: "Third lesson", slug: "third", lesson: lesson("Third") }] },
  ],
};

describe("slugify", () => {
  it("lowercases, strips punctuation and joins words with dashes", () => {
    expect(slugify("Run: it & go!")).toBe("run-it-go");
    expect(slugify("  Dockerfile and build cache ")).toBe("dockerfile-and-build-cache");
  });
});

describe("listLessons", () => {
  it("returns only subsections that have a lesson, in reading order", () => {
    expect(listLessons(track).map((l) => l.slug)).toEqual(["first", "second", "third"]);
  });

  it("numbers lessons within their section", () => {
    const [first, second, third] = listLessons(track);
    expect([first.position, second.position, third.position]).toEqual([1, 2, 1]);
    expect([first.total, third.total]).toEqual([2, 1]);
  });
});

describe("findLesson and neighbours", () => {
  it("finds a lesson by slug", () => {
    expect(findLesson(track, "second")?.subsection.title).toBe("Second lesson");
    expect(findLesson(track, "missing")).toBeUndefined();
  });

  it("gives previous and next across sections", () => {
    expect(neighbours(track, "second")).toEqual({ previous: expect.objectContaining({ slug: "first" }), next: expect.objectContaining({ slug: "third" }) });
    expect(neighbours(track, "first").previous).toBeUndefined();
    expect(neighbours(track, "third").next).toBeUndefined();
  });
});

describe("lessonHeadings", () => {
  it("builds the on-this-page list from h2 blocks", () => {
    expect(lessonHeadings(lesson("Run: it & go!"))).toEqual([{ id: "run-it-go", text: "Run: it & go!" }]);
  });
});

describe("written roadmap lessons", () => {
  const all = ROADMAP_TRACKS.flatMap((t) => listLessons(t).map((ref) => ({ track: t.id, ref })));

  it("has at least one lesson, with a unique slug per track", () => {
    expect(all.length).toBeGreaterThan(0);
    const keys = all.map(({ track, ref }) => `${track}/${ref.slug}`);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it.each(all.map(({ track, ref }) => [`${track}/${ref.slug}`, ref] as const))("%s has headings, key points and a clean slug", (_name, ref) => {
    expect(ref.slug).toBe(slugify(ref.slug));
    expect(lessonHeadings(ref.subsection.lesson).length).toBeGreaterThan(0);
    expect(ref.subsection.points?.length ?? 0).toBeGreaterThan(0);
  });

  it("never lets a real account id, IP or key name into lesson text", () => {
    const text = JSON.stringify(all.map(({ ref }) => ref.subsection));
    expect(text).not.toMatch(/\b\d{12}\b(?<!111122223333)/);
    expect(text).not.toMatch(/\b(?:\d{1,3}\.){3}\d{1,3}\b(?<!203\.0\.113\.25)(?<!198\.51\.100\.7)(?<!127\.0\.0\.1)(?<!0\.0\.0\.0)/);
  });
});
